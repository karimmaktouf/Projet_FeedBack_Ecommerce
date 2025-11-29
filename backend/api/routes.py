from flask import Blueprint, request, jsonify
from services.kafka_service import kafka_service
from services.qdrant_service import qdrant_service
from services.rag_service import rag_service
from config import config  # ✅ AJOUT DE L'IMPORT

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/feedback', methods=['POST'])
def submit_feedback():
    """Soumettre un nouveau feedback"""
    try:
        data = request.get_json()
        
        # Validation basique
        required_fields = ['name', 'email', 'product', 'rating', 'comment']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Champs manquants'}), 400
        
        # Ajouter catégorie
        PRODUCT_CATEGORIES = {
            "Smartphone Galaxy X": "Electronics",
            "Laptop Pro 15": "Electronics",
            "Casque NoiseCancel": "Electronics",
            "Montre Connectée": "Electronics",
            "Télévision 4K": "Electronics",
            "Console de Jeux": "Electronics",
            "Chaussures Running": "Fashion",
            "Jean Vintage": "Fashion",
            "Machine Espresso": "Home",
            "Robot Cuisine": "Home"
        }
        data['category'] = PRODUCT_CATEGORIES.get(data['product'], 'Other')
        
        # Envoyer vers Kafka
        success, result = kafka_service.send_feedback(data)
        
        if not success:
            return jsonify({'error': result}), 500
        
        # Indexer immédiatement dans Qdrant
        qdrant_service.index_feedback(result)
        
        return jsonify({
            'message': 'Feedback envoyé avec succès',
            'data': result
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api_bp.route('/rag/search', methods=['POST'])
def rag_search():
    """Recherche RAG"""
    try:
        data = request.get_json()
        query = data.get('query', '')
        
        if not query:
            return jsonify({'error': 'Query manquante'}), 400
        
        result = rag_service.search(query)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api_bp.route('/analytics', methods=['GET'])
def get_analytics():
    """Récupérer les statistiques"""
    try:
        stats = qdrant_service.get_stats()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api_bp.route('/analytics/charts', methods=['GET'])
def get_chart_data():
    """Récupère les données pour les graphiques"""
    try:
        # Récupérer tous les points de Qdrant
        result = qdrant_service.client.scroll(
            collection_name=config.QDRANT_COLLECTION,
            limit=10000,
            with_payload=True,
            with_vectors=False
        )
        
        points, _ = result
        
        # Si aucune donnée, retourner structure vide
        if len(points) == 0:
            return jsonify({
                'sentiment_distribution': [
                    {'name': 'Positif', 'value': 0, 'color': '#10b981'},
                    {'name': 'Neutre', 'value': 0, 'color': '#6b7280'},
                    {'name': 'Négatif', 'value': 0, 'color': '#ef4444'}
                ],
                'ratings_by_product': [],
                'all_feedbacks': []
            })
        
        # 1. Distribution des sentiments
        sentiments = {}
        for p in points:
            sentiment = p.payload['metadata'].get('sentiment', 'unknown')
            sentiments[sentiment] = sentiments.get(sentiment, 0) + 1
        
        sentiment_data = [
            {'name': 'Positif', 'value': sentiments.get('positif', 0), 'color': '#10b981'},
            {'name': 'Neutre', 'value': sentiments.get('neutre', 0), 'color': '#6b7280'},
            {'name': 'Négatif', 'value': sentiments.get('negatif', 0), 'color': '#ef4444'}
        ]
        
        # 2. Notes moyennes par produit
        products = {}
        for p in points:
            product = p.payload['metadata'].get('product', 'Unknown')
            rating = p.payload['metadata'].get('rating', 0)
            
            if product not in products:
                products[product] = {'total': 0, 'count': 0}
            
            products[product]['total'] += rating
            products[product]['count'] += 1
        
        product_ratings = []
        for product, data in products.items():
            avg = data['total'] / data['count'] if data['count'] > 0 else 0
            product_ratings.append({
                'product': product[:25],  # Limiter la longueur du nom
                'rating': round(avg, 2),
                'count': data['count']
            })
        
        # Trier par nombre d'avis (descendant)
        product_ratings.sort(key=lambda x: x['count'], reverse=True)
        
        # 3. Tous les feedbacks (pour timeline et distribution)
        all_feedbacks = []
        for p in points:
            all_feedbacks.append({
                'rating': p.payload['metadata'].get('rating', 0),
                'timestamp': p.payload['metadata'].get('timestamp', ''),
                'sentiment': p.payload['metadata'].get('sentiment', 'unknown')
            })
        
        return jsonify({
            'sentiment_distribution': sentiment_data,
            'ratings_by_product': product_ratings[:15],  # Top 15 produits
            'all_feedbacks': all_feedbacks
        }), 200
        
    except Exception as e:
        print(f"❌ Erreur dans /analytics/charts: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': str(e),
            'sentiment_distribution': [
                {'name': 'Positif', 'value': 0, 'color': '#10b981'},
                {'name': 'Neutre', 'value': 0, 'color': '#6b7280'},
                {'name': 'Négatif', 'value': 0, 'color': '#ef4444'}
            ],
            'ratings_by_product': [],
            'all_feedbacks': []
        }), 200  # Retourner 200 avec données vides au lieu de 500


@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check"""
    return jsonify({'status': 'ok'}), 200