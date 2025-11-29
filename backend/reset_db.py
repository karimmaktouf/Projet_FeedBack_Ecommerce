# reset_db.py
from services.qdrant_service import qdrant_service

if __name__ == "__main__":
    print("🔄 Réinitialisation de la collection Qdrant...")
    success = qdrant_service.reset_collection()
    
    if success:
        print("✅ Collection réinitialisée avec succès!")
        print("📝 Vous pouvez maintenant relancer votre application.")
    else:
        print("❌ Erreur lors de la réinitialisation.")