from flask import Blueprint, request, jsonify
from services.kafka_service import kafka_service
from services.qdrant_service import qdrant_service
from services.rag_service import rag_service

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/feedback', methods=['POST'])
def submit_feedback():
    """Endpoint pour soumettre un feedback"""
    try:
        data = request.get_json()
        
        # Envoyer vers Kafka
        success, result = kafka_service.send_feedback(data)
        
        if not success:
            return jsonify({'error': str(result)}), 500
        
        # Indexer dans Qdrant
        qdrant_service.index_feedback(result)
        
        return jsonify({
            'message': 'Feedback reçu avec succès',
            'event_id': result.get('event_id')
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/rag/search', methods=['POST'])
def rag_search():
    """Endpoint pour recherche RAG"""
    try:
        data = request.get_json()
        query = data.get('query', '')
        
        if not query:
            return jsonify({'error': 'Query requise'}), 400
        
        result = rag_service.search(query)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/analytics', methods=['GET'])
def get_analytics():
    """Endpoint pour les statistiques"""
    try:
        stats = qdrant_service.get_stats()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200