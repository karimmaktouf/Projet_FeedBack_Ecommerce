from flask import Flask
from flask_cors import CORS
from api.routes import api_bp
from config import config

def create_app():
    app = Flask(__name__)
    
    # Configuration CORS - IMPORTANT
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3001", "http://localhost:3000"],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"]
        }
    })
    
    # Enregistrer blueprints
    app.register_blueprint(api_bp)
    
    @app.route('/')
    def index():
        return {
            'message': 'Feedback E-Commerce API',
            'version': '1.0.0',
            'endpoints': [
                '/api/feedback (POST)',
                '/api/rag/search (POST)',
                '/api/analytics (GET)',
                '/api/health (GET)'
            ]
        }
    
    return app

if __name__ == '__main__':
    app = create_app()
    print(f"🚀 Server started on http://localhost:{config.FLASK_PORT}")
    app.run(
        host='0.0.0.0',
        port=config.FLASK_PORT,
        debug=config.DEBUG
    )
