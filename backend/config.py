import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    FLASK_PORT = 5000
    DEBUG = True
    
    # Groq API
    GROQ_API_KEY = os.getenv('GROQ_API_KEY', 'votre_clé_ici')
    
    # Qdrant
    QDRANT_URL = os.getenv('QDRANT_URL', 'http://localhost:6333')
    QDRANT_API_KEY = os.getenv('QDRANT_API_KEY', None)
    QDRANT_COLLECTION = os.getenv('QDRANT_COLLECTION', 'feedback_collection')
    
    # Embeddings
    EMBEDDINGS_MODEL = 'sentence-transformers/all-MiniLM-L6-v2'
    VECTOR_SIZE = 384
    
    # Kafka (mettez vos vraies credentials ici)
    KAFKA_BOOTSTRAP = os.getenv('KAFKA_BOOTSTRAP', 'localhost:9092')
    KAFKA_KEY = os.getenv('KAFKA_KEY', '')
    KAFKA_SECRET = os.getenv('KAFKA_SECRET', '')
    KAFKA_TOPIC = os.getenv('KAFKA_TOPIC', 'feedback-topic')

config = Config()