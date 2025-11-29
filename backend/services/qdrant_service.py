import uuid
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from langchain_community.embeddings import HuggingFaceEmbeddings  # ← Changé ici
from config import config

class QdrantService:
    def __init__(self):
        self.client = QdrantClient(
            url=config.QDRANT_URL,
            api_key=config.QDRANT_API_KEY,
            prefer_grpc=False
        )
        
        self.embeddings = HuggingFaceEmbeddings(
            model_name=config.EMBEDDINGS_MODEL,
            show_progress=False
        )
        
        self._init_collection()
        
    def reset_collection(self):
        """Supprime et recrée la collection avec les bons index"""
        try:
            # Supprimer l'ancienne collection
            self.client.delete_collection(config.QDRANT_COLLECTION)
            print(f"🗑️  Collection {config.QDRANT_COLLECTION} supprimée")
            
            # Recréer la collection
            self._init_collection()
            print(f"✅ Collection {config.QDRANT_COLLECTION} recréée")
            
            return True
        except Exception as e:
            print(f"❌ Erreur reset: {e}")
            return False
    
    def _init_collection(self):
        """Initialise la collection Qdrant"""
        try:
            collections = self.client.get_collections()
            collection_names = [col.name for col in collections.collections]
            
            if config.QDRANT_COLLECTION not in collection_names:
                self.client.create_collection(
                    collection_name=config.QDRANT_COLLECTION,
                    vectors_config=VectorParams(
                        size=config.VECTOR_SIZE,
                        distance=Distance.COSINE
                    )
                )
                
                # Créer les index
                self._create_indexes()
        except Exception as e:
            print(f"Erreur init collection: {e}")
    def _create_indexes(self):
        """Crée les index pour les filtres"""
        try:
            from qdrant_client.models import PayloadSchemaType
            
            # ✅ Utiliser FLOAT au lieu de INTEGER
            self.client.create_payload_index(
                collection_name=config.QDRANT_COLLECTION,
                field_name="metadata.rating",
                field_schema=PayloadSchemaType.FLOAT  # Changé ici
            )
            self.client.create_payload_index(
                collection_name=config.QDRANT_COLLECTION,
                field_name="metadata.sentiment",
                field_schema=PayloadSchemaType.KEYWORD
            )
            self.client.create_payload_index(
                collection_name=config.QDRANT_COLLECTION,
                field_name="metadata.product",
                field_schema=PayloadSchemaType.KEYWORD
            )
        except Exception as e:
            print(f"Erreur création index: {e}")  # Mieux logger les erreurs
            
        
    def index_feedback(self, feedback_data):
            """Indexe un feedback dans Qdrant"""
            try:
                text_content = feedback_data.get('comment', '')
                
                # Générer embedding
                vector = self.embeddings.embed_query(text_content)
                
                # Créer point
                point = PointStruct(
                    id=str(uuid.uuid4()),
                    vector=vector,
                    payload={
                        'text': text_content,
                        'metadata': {
                            'text': text_content,
                            'product': feedback_data.get('product', 'Unknown'),
                            'rating': feedback_data.get('rating', 0),
                            'sentiment': feedback_data.get('sentiment', 'unknown'),
                            'category': feedback_data.get('category', 'Unknown'),
                            'user_name': feedback_data.get('name', 'Anonymous'),
                            'user_email': feedback_data.get('email', ''),
                            'timestamp': feedback_data.get('timestamp', ''),
                            'source': feedback_data.get('source', 'web_app'),
                            'event_id': feedback_data.get('event_id', '')
                        }
                    }
                )
                
                # Insérer dans Qdrant
                self.client.upsert(
                    collection_name=config.QDRANT_COLLECTION,
                    points=[point]
                )
                
                return True
            except Exception as e:
                print(f"Erreur indexation: {e}")
                return False
        
    def search(self, query, limit=10, filter_dict=None):
        """Recherche sémantique dans Qdrant"""
        try:
            # Générer embedding de la query
            query_vector = self.embeddings.embed_query(query)
            
            # Appliquer filtres si fournis
            search_filter = None
            if filter_dict:
                search_filter = self._build_filter(filter_dict)
            
            # Recherche
            results = self.client.search(
                collection_name=config.QDRANT_COLLECTION,
                query_vector=query_vector,
                limit=limit,
                query_filter=search_filter
            )
            
            return results
        except Exception as e:
            print(f"Erreur recherche: {e}")
            return []
    
    def _build_filter(self, filter_dict):
        """Construit un filtre Qdrant"""
        conditions = []
        
        if 'rating_min' in filter_dict:
            conditions.append(
                FieldCondition(
                    key="metadata.rating",
                    range=Range(gte=filter_dict['rating_min'])
                )
            )
        
        if 'rating_max' in filter_dict:
            conditions.append(
                FieldCondition(
                    key="metadata.rating",
                    range=Range(lte=filter_dict['rating_max'])
                )
            )
        
        if 'sentiment' in filter_dict:
            conditions.append(
                FieldCondition(
                    key="metadata.sentiment",
                    match=MatchValue(value=filter_dict['sentiment'])
                )
            )
        
        if 'product' in filter_dict:
            conditions.append(
                FieldCondition(
                    key="metadata.product",
                    match=MatchValue(value=filter_dict['product'])
                )
            )
        
        if conditions:
            return Filter(must=conditions)
        return None
    
    def get_stats(self):
        """Récupère les statistiques de la collection"""
        try:
            info = self.client.get_collection(config.QDRANT_COLLECTION)
            
            # Récupérer tous les points pour stats
            result = self.client.scroll(
                collection_name=config.QDRANT_COLLECTION,
                limit=10000,
                with_payload=True,
                with_vectors=False
            )
            
            points, _ = result
            
            total = len(points)
            if total == 0:
                return {
                    'total': 0,
                    'avg_rating': 0,
                    'positive_percent': 0,
                    'negative_percent': 0
                }
            
            ratings = [p.payload['metadata']['rating'] for p in points]
            sentiments = [p.payload['metadata']['sentiment'] for p in points]
            
            avg_rating = sum(ratings) / total
            positive_count = sentiments.count('positif')
            negative_count = sentiments.count('negatif')
            
            return {
                'total': total,
                'avg_rating': round(avg_rating, 2),
                'positive_percent': round((positive_count / total) * 100, 1),
                'negative_percent': round((negative_count / total) * 100, 1)
            }
        except Exception as e:
            print(f"Erreur stats: {e}")
            return {
                'total': 0,
                'avg_rating': 0,
                'positive_percent': 0,
                'negative_percent': 0
            }

# Instance globale
qdrant_service = QdrantService()