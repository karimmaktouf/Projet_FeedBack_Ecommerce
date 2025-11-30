from flask import Blueprint, request, jsonify
import jwt
import os
from datetime import datetime, timedelta
from functools import wraps
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

auth_bp = Blueprint('auth', __name__, url_prefix='/api')

# Récupérer les credentials depuis .env
ADMIN_EMAIL = os.getenv('ADMIN_EMAIL')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')
JWT_SECRET = os.getenv('JWT_SECRET', 'default_secret_key_change_me_urgently')

# Middleware pour vérifier le token JWT
def token_required(f):
    """
    Décorateur pour protéger les routes admin
    Usage: @token_required au-dessus de la fonction de route
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token manquant', 'code': 'NO_TOKEN'}), 401
        
        try:
            # Enlever le préfixe "Bearer " si présent
            if token.startswith('Bearer '):
                token = token[7:]
            
            # Décoder et vérifier le token
            data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            
            # Vérifier si le token a expiré
            if datetime.fromtimestamp(data['exp']) < datetime.now():
                return jsonify({'error': 'Token expiré', 'code': 'TOKEN_EXPIRED'}), 401
            
            # Vérifier le rôle admin
            if data.get('role') != 'admin':
                return jsonify({'error': 'Accès non autorisé', 'code': 'NOT_ADMIN'}), 403
                
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expiré', 'code': 'TOKEN_EXPIRED'}), 401
        except jwt.InvalidTokenError as e:
            return jsonify({'error': 'Token invalide', 'code': 'INVALID_TOKEN', 'details': str(e)}), 401
        
        return f(*args, **kwargs)
    
    return decorated

@auth_bp.route('/admin/login', methods=['POST'])
def admin_login():
    """
    Route de connexion pour l'administrateur unique
    
    Body JSON:
    {
        "email": "admin@example.com",
        "password": "password123"
    }
    
    Response:
    {
        "success": true,
        "token": "jwt_token_here",
        "message": "Connexion réussie"
    }
    """
    try:
        data = request.json
        email = data.get('email', '').strip()
        password = data.get('password', '')
        
        # Validation des champs
        if not email or not password:
            return jsonify({'error': 'Email et mot de passe requis'}), 400
        
        # Vérifier si les credentials sont configurés
        if not ADMIN_EMAIL or not ADMIN_PASSWORD:
            return jsonify({'error': 'Configuration admin manquante'}), 500
        
        # Vérifier les credentials
        if email == ADMIN_EMAIL and password == ADMIN_PASSWORD:
            # Créer un token JWT valide 24h
            token = jwt.encode({
                'email': email,
                'role': 'admin',
                'iat': datetime.utcnow(),
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, JWT_SECRET, algorithm='HS256')
            
            return jsonify({
                'success': True,
                'token': token,
                'message': 'Connexion réussie',
                'expiresIn': '24h'
            }), 200
        else:
            # Éviter de révéler si c'est l'email ou le mot de passe qui est incorrect
            return jsonify({'error': 'Identifiants incorrects'}), 401
            
    except Exception as e:
        print(f"❌ Erreur login: {str(e)}")
        return jsonify({'error': 'Erreur serveur', 'details': str(e)}), 500

@auth_bp.route('/admin/verify', methods=['GET'])
@token_required
def verify_token():
    """
    Route pour vérifier si le token est toujours valide
    
    Headers:
    Authorization: Bearer jwt_token_here
    
    Response:
    {
        "valid": true,
        "message": "Token valide"
    }
    """
    return jsonify({
        'valid': True,
        'message': 'Token valide'
    }), 200

@auth_bp.route('/admin/logout', methods=['POST'])
@token_required
def admin_logout():
    """
    Route de déconnexion (optionnelle)
    Le token sera supprimé côté client
    """
    return jsonify({
        'success': True,
        'message': 'Déconnexion réussie'
    }), 200