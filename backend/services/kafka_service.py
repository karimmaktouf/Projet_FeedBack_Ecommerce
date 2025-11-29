import json
import uuid
from datetime import datetime
from confluent_kafka import Producer, Consumer
from config import config

class KafkaService:
    def __init__(self):
        self.producer_conf = {
            'bootstrap.servers': config.KAFKA_BOOTSTRAP,
            'security.protocol': 'SASL_SSL',
            'sasl.mechanisms': 'PLAIN',
            'sasl.username': config.KAFKA_KEY,
            'sasl.password': config.KAFKA_SECRET,
            'client.id': 'flask-feedback-producer'
        }
        
        self.consumer_conf = {
            'bootstrap.servers': config.KAFKA_BOOTSTRAP,
            'security.protocol': 'SASL_SSL',
            'sasl.mechanisms': 'PLAIN',
            'sasl.username': config.KAFKA_KEY,
            'sasl.password': config.KAFKA_SECRET,
            'group.id': f'feedback-consumer-{uuid.uuid4()}',
            'auto.offset.reset': 'earliest'
        }
        
        self.producer = Producer(self.producer_conf)
    
    def send_feedback(self, feedback_data):
        """Envoie un feedback vers Kafka"""
        try:
            # Ajouter métadonnées
            feedback_data['event_id'] = str(uuid.uuid4())
            feedback_data['timestamp'] = datetime.now().isoformat()
            feedback_data['source'] = 'web_app'
            
            # Calculer sentiment
            rating = feedback_data.get('rating', 3)
            feedback_data['sentiment'] = (
                'positif' if rating >= 4 else 
                'neutre' if rating == 3 else 
                'negatif'
            )
            
            # Envoyer vers Kafka
            self.producer.produce(
                config.KAFKA_TOPIC,
                key=feedback_data.get('email', ''),
                value=json.dumps(feedback_data)
            )
            self.producer.flush()
            
            return True, feedback_data
        except Exception as e:
            return False, str(e)
    
    def consume_messages(self, max_messages=100):
        """Consomme des messages depuis Kafka"""
        consumer = Consumer(self.consumer_conf)
        consumer.subscribe([config.KAFKA_TOPIC])
        
        messages = []
        try:
            for _ in range(max_messages):
                msg = consumer.poll(1.0)
                if msg is None:
                    continue
                if msg.error():
                    continue
                
                data = json.loads(msg.value().decode('utf-8'))
                messages.append(data)
            
            return messages
        except Exception as e:
            print(f"Erreur consumer: {e}")
            return []
        finally:
            consumer.close()

# Instance globale
kafka_service = KafkaService()