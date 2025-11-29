import requests
from langchain_qdrant import QdrantVectorStore
from services.qdrant_service import qdrant_service
from config import config

class RAGService:
    def __init__(self):
        self.groq_api_url = "https://api.groq.com/openai/v1/chat/completions"
        self.groq_api_key = config.GROQ_API_KEY
        self.model = "llama-3.3-70b-versatile"
        
        self.vector_store = QdrantVectorStore.from_existing_collection(
            embedding=qdrant_service.embeddings,
            collection_name=config.QDRANT_COLLECTION,
            url=config.QDRANT_URL,
            api_key=config.QDRANT_API_KEY,
            force_disable_check_same_thread=True,
            prefer_grpc=False,
            content_payload_key="text",
            metadata_payload_key="metadata"
        )
        
        self.prompt_template = """Tu es un expert en analyse de satisfaction client pour un site e-commerce.
Utilise les avis clients suivants pour répondre à la question.
Cite les produits concernés et donne des statistiques si possible.

CONTEXTE (Avis clients) :
{context}

QUESTION : {question}

ANALYSE DÉTAILLÉE :"""
    
    def _call_groq_api(self, prompt):
        """Appelle l'API Groq directement"""
        try:
            headers = {
                "Authorization": f"Bearer {self.groq_api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": self.model,
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.1
            }
            
            response = requests.post(
                self.groq_api_url,
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json()["choices"][0]["message"]["content"]
            else:
                return f"Erreur API Groq: {response.status_code}"
        except Exception as e:
            return f"Erreur lors de l'appel à Groq: {str(e)}"
    
    def search(self, query, k=10):
        """Effectue une recherche RAG"""
        try:
            # Détection d'intention pour filtres
            search_filter = self._detect_intent(query)
            
            # Recherche
            if search_filter:
                retriever = self.vector_store.as_retriever(
                    search_kwargs={
                        "k": k,
                        "filter": search_filter
                    }
                )
            else:
                retriever = self.vector_store.as_retriever(search_kwargs={"k": k})
            
            docs = retriever.invoke(query)
            
            if not docs:
                return {
                    'response': "Aucun avis pertinent trouvé pour votre question.",
                    'sources': []
                }
            
            # Générer contexte
            context = "\n".join([f"- {doc.page_content}" for doc in docs])
            
            # Générer réponse avec template simple
            prompt = self.prompt_template.format(context=context, question=query)
            response = self._call_groq_api(prompt)
            
            # Préparer sources
            sources = [
                {
                    'product': doc.metadata.get('product', 'N/A'),
                    'rating': doc.metadata.get('rating', 0),
                    'sentiment': doc.metadata.get('sentiment', 'N/A'),
                    'text': doc.page_content,
                    'category': doc.metadata.get('category', 'N/A')
                }
                for doc in docs[:5]  # Max 5 sources
            ]
            
            return {
                'response': response,
                'sources': sources
            }
        except Exception as e:
            return {
                'response': f"Erreur lors de l'analyse: {str(e)}",
                'sources': []
            }
    
    def _detect_intent(self, query):
        """Détecte l'intention pour appliquer des filtres"""
        from qdrant_client.models import Filter, FieldCondition, MatchValue, Range
        
        query_lower = query.lower()
        
        negative_keywords = ['problématique', 'problème', 'mauvais', 'négatif', 'défaut']
        positive_keywords = ['meilleur', 'top', 'excellent', 'parfait', 'recommand']
        
        if any(kw in query_lower for kw in negative_keywords):
            return Filter(
                should=[
                    FieldCondition(
                        key="metadata.rating",
                        range=Range(lte=2)
                    ),
                    FieldCondition(
                        key="metadata.sentiment",
                        match=MatchValue(value="negatif")
                    )
                ]
            )
        elif any(kw in query_lower for kw in positive_keywords):
            return Filter(
                should=[
                    FieldCondition(
                        key="metadata.rating",
                        range=Range(gte=4)
                    ),
                    FieldCondition(
                        key="metadata.sentiment",
                        match=MatchValue(value="positif")
                    )
                ]
            )
        
        return None

# Instance globale
rag_service = RAGService()