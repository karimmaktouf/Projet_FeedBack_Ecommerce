# migrate_data.py
from services.qdrant_service import qdrant_service
from config import config
import uuid

def migrate_old_data():
    """Migre les anciennes données vers la nouvelle collection"""
    try:
        print("🔄 Migration des données...")
        
        # 1. Récupérer toutes les anciennes données
        old_collection = config.QDRANT_COLLECTION
        result = qdrant_service.client.scroll(
            collection_name=old_collection,
            limit=10000,
            with_payload=True,
            with_vectors=True
        )
        
        old_points, _ = result
        print(f"📦 {len(old_points)} feedbacks trouvés")
        
        if len(old_points) == 0:
            print("⚠️ Aucune donnée à migrer")
            return
        
        # 2. Sauvegarder les données
        migrated_data = []
        for point in old_points:
            migrated_data.append({
                'id': point.id,
                'vector': point.vector,
                'payload': point.payload
            })
        
        print(f"💾 {len(migrated_data)} feedbacks sauvegardés")
        
        # 3. Supprimer l'ancienne collection
        print(f"🗑️  Suppression de l'ancienne collection...")
        qdrant_service.client.delete_collection(old_collection)
        
        # 4. Recréer la collection avec les bons index
        print(f"✅ Recréation de la collection avec les nouveaux index...")
        qdrant_service._init_collection()
        
        # 5. Réinsérer les données avec le bon format
        from qdrant_client.models import PointStruct
        
        new_points = []
        for data in migrated_data:
            payload = data['payload']
            
            # Convertir rating en FLOAT si c'est un INT
            if 'metadata' in payload and 'rating' in payload['metadata']:
                payload['metadata']['rating'] = float(payload['metadata']['rating'])
            
            new_point = PointStruct(
                id=data['id'],
                vector=data['vector'],
                payload=payload
            )
            new_points.append(new_point)
        
        # Insérer par lots de 100
        batch_size = 100
        for i in range(0, len(new_points), batch_size):
            batch = new_points[i:i+batch_size]
            qdrant_service.client.upsert(
                collection_name=config.QDRANT_COLLECTION,
                points=batch
            )
            print(f"📥 Batch {i//batch_size + 1} inséré ({len(batch)} points)")
        
        print(f"✅ Migration terminée : {len(new_points)} feedbacks migrés!")
        
        # 6. Vérification
        result_check = qdrant_service.client.scroll(
            collection_name=config.QDRANT_COLLECTION,
            limit=10,
            with_payload=True,
            with_vectors=False
        )
        points_check, _ = result_check
        
        print(f"\n📊 Vérification finale:")
        print(f"   - Total feedbacks: {len(points_check)}")
        for p in points_check:
            product = p.payload.get('metadata', {}).get('product', 'Unknown')
            rating = p.payload.get('metadata', {}).get('rating', 0)
            print(f"   - {product}: {rating}⭐")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur migration: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = migrate_old_data()
    if success:
        print("\n🎉 Migration réussie! Vous pouvez relancer l'application.")
    else:
        print("\n❌ Migration échouée. Vérifiez les erreurs ci-dessus.")