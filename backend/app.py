from flask import Flask
from flask_cors import CORS
from api.routes import api_bp
from api.auth import auth_bp  # ← NOUVEAU : Import du blueprint auth
from config import config

def create_app():
    app = Flask(__name__)
    
    # Configuration CORS - MODIFIÉ pour inclure Authorization header
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3001", "http://localhost:3000"],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]  # ← AJOUTÉ
        }
    })
    
    # Enregistrer blueprints
    app.register_blueprint(api_bp)
    app.register_blueprint(auth_bp)  # ← NOUVEAU : Enregistrer le blueprint auth
    
    @app.route('/')
    def index():
        return {
            'message': 'Feedback E-Commerce API',
            'version': '1.0.0',
            'endpoints': [
                '/api/feedback (POST) - Public',
                '/api/health (GET) - Public',
                '/api/admin/login (POST) - Public',
                '/api/admin/verify (GET) - Protected',
                '/api/rag/search (POST) - Protected',
                '/api/analytics (GET) - Protected',
                '/api/analytics/charts (GET) - Protected'
            ]
        }
    
    return app

if __name__ == '__main__':
    app = create_app()
    print(f"🚀 Server started on http://localhost:{config.FLASK_PORT}")
    print(f"🔐 Admin authentication enabled")
    app.run(
        host='0.0.0.0',
        port=config.FLASK_PORT,
        debug=config.DEBUG
    )