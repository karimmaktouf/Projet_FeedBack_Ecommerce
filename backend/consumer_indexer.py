# consumer_indexer.py
"""
Consomme les messages Kafka et les indexe dans Qdrant.

Usage: Utilisé uniquement pour indexer les données générées par data_generator.py
Les soumissions web (source='web_app') sont automatiquement ignorées car déjà indexées
directement par l'API pour un retour instantané à l'utilisateur.
"""
import json
import time
from confluent_kafka import Consumer
from services.qdrant_service import qdrant_service
from config import config

def consume_and_index(max_messages=100, timeout=30):
    """Consomme les messages Kafka et les indexe dans Qdrant"""

    consumer_conf = {
        'bootstrap.servers': config.KAFKA_BOOTSTRAP,
        'security.protocol': 'SASL_SSL',
        'sasl.mechanisms': 'PLAIN',
        'sasl.username': config.KAFKA_KEY,
        'sasl.password': config.KAFKA_SECRET,
        'group.id': f'feedback-indexer-{config.QDRANT_COLLECTION}',
        'auto.offset.reset': 'earliest',  # Lire depuis le début
        'enable.auto.commit': True
    }

    consumer = Consumer(consumer_conf)
    consumer.subscribe([config.KAFKA_TOPIC])
    
    print(f"🔄 Consommation de messages depuis Kafka...")
    print(f"📊 Max messages: {max_messages} | Timeout: {timeout}s\n")
    
    indexed_count = 0
    error_count = 0
    
    try:
        start_time = time.time()
        
        while indexed_count < max_messages and (time.time() - start_time) < timeout:
            msg = consumer.poll(1.0)
            
            if msg is None:
                continue
            
            if msg.error():
                print(f"❌ Erreur Kafka: {msg.error()}")
                continue
            
            try:
                # Décoder le message
                data = json.loads(msg.value().decode('utf-8'))

                # Ignorer les messages déjà indexés directement par l'API web
                if data.get('source') == 'web_app':
                    continue

                # Transformer au format attendu par qdrant_service
                feedback_data = {
                    'comment': data.get('text', ''),
                    'product': data.get('product', 'Unknown'),
                    'rating': float(data.get('rating', 3)),  # ← FLOAT important
                    'sentiment': data.get('sentiment', 'neutre'),
                    'category': data.get('category', 'Unknown'),
                    'name': data.get('user_id', 'Anonymous'),
                    'email': f"{data.get('user_id', 'user')}@example.com",
                    'timestamp': data.get('timestamp', ''),
                    'source': data.get('source', 'kafka'),
                    'event_id': data.get('event_id', '')
                }

                # Indexer dans Qdrant
                success = qdrant_service.index_feedback(feedback_data)
                
                if success:
                    indexed_count += 1
                    if indexed_count % 50 == 0:
                        elapsed = time.time() - start_time
                        rate = indexed_count / elapsed
                        print(f"✅ {indexed_count}/{max_messages} feedbacks indexés ({rate:.1f} msg/s)")
                else:
                    error_count += 1
                    
            except Exception as e:
                error_count += 1
                if error_count <= 5:  # Afficher les 5 premières erreurs seulement
                    print(f"❌ Erreur traitement message: {e}")
        
        total_time = time.time() - start_time
        
        print("\n" + "=" * 70)
        print(f"✅ Indexation terminée!")
        print("=" * 70)
        print(f"📊 Statistiques:")
        print(f"   - Feedbacks indexés: {indexed_count}")
        print(f"   - Erreurs: {error_count}")
        print(f"   - Temps total: {int(total_time)}s")
        if total_time > 0:
            print(f"   - Vitesse: {indexed_count/total_time:.1f} feedbacks/s")
        
    except KeyboardInterrupt:
        print("\n⚠️ Interruption par l'utilisateur")
    finally:
        consumer.close()
        print("\n🔒 Consumer fermé")
    
    return indexed_count, error_count

if __name__ == "__main__":
    print("=" * 70)
    print("🚀 INDEXATION DES FEEDBACKS KAFKA → QDRANT")
    print("=" * 70)
    
    # Demander combien de messages indexer
    try:
        max_msg = input("\n📥 Combien de messages voulez-vous indexer ? (défaut: 500): ")
        max_msg = int(max_msg) if max_msg else 500
        
        timeout = input("⏱️  Timeout en secondes ? (défaut: 120): ")
        timeout = int(timeout) if timeout else 120
    except:
        max_msg = 500
        timeout = 120
    
    print(f"\n🚀 Lancement de l'indexation...")
    indexed, errors = consume_and_index(max_messages=max_msg, timeout=timeout)
    
    print(f"\n💡 Total dans Qdrant maintenant: {indexed + 2} feedbacks (2 anciens + {indexed} nouveaux)")
    print(f"   Pour indexer plus de messages, relancez: python consumer_indexer.py")