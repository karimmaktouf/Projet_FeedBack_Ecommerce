# Projet FeedBack E-commerce

Plateforme full-stack d'analyse de feedback clients pour e-commerce avec IA, utilisant Kafka pour le streaming de données, Qdrant pour la recherche vectorielle, et un système RAG (Retrieval-Augmented Generation) pour l'analyse intelligente.

## 🏗️ Architecture

```
┌─────────────┐         ┌──────────┐         ┌─────────────┐
│   React     │────────▶│  Flask   │────────▶│    Kafka    │
│  Frontend   │         │   API    │         │   Stream    │
│  (Client +  │         │  + JWT   │         └─────────────┘
│   Admin)    │         │  Auth    │                 │
└─────────────┘         └──────────┘                 ▼
                             │              ┌──────────────┐
                             ▼              │  Consumer    │
                        ┌─────────┐         │  Indexer     │
                        │ Qdrant  │◀────────└──────────────┘
                        │ Vector  │
                        │   DB    │
                        └─────────┘
                             │
                             ▼
                        ┌─────────┐
                        │  Groq   │
                        │   LLM   │
                        └─────────┘
```

## 🚀 Fonctionnalités

### Interface Client
- **Soumission de feedback** : Formulaire moderne et intuitif
- **Sélection de produits** : Dropdown avec liste complète de produits
- **Évaluation** : Système de notation interactif (1-5 étoiles)
- **Commentaires** : Zone de texte pour retours détaillés
- **Validation en temps réel** : Champs obligatoires avec messages d'erreur
- **Design moderne** : Interface épurée avec gradients et animations

### Interface Administrateur (🔐 Protégée par JWT)
- **Authentification sécurisée** : Login avec email/mot de passe
- **Dashboard Analytics** : Métriques en temps réel
  - Total d'avis
  - Note moyenne
  - Pourcentage positifs/négatifs
  - Bouton actualiser
- **Chatbot IA latéral escamotable** 💬
  - Panel coulissant depuis la droite
  - Questions suggérées pré-définies
  - Réponses générées par IA avec sources
  - Interface compacte et moderne
- **Analyse de sentiment** : Classification automatique (positif/neutre/négatif)
- **Recherche RAG** : Questions en langage naturel avec réponses contextuelles
- **Visualisations interactives** :
  - Distribution des sentiments (barres de progression)
  - Notes par produit (top 10)
  - Distribution des étoiles
  - Timeline des avis
  - Top 8 produits
- **Session persistante** : Token JWT stocké localement

### Système Backend
- **Authentification JWT** : Routes admin protégées
- **Indexation vectorielle** : Recherche sémantique avec Qdrant
- **Streaming de données** : Pipeline Kafka pour scalabilité
- **IA générative** : Analyse intelligente avec Groq LLM
- **Architecture modulaire** : Services découplés (Kafka, Qdrant, RAG, Auth)

## 📋 Prérequis

- Python 3.9+
- Node.js 16+
- Compte Confluent Cloud (Kafka)
- Compte Qdrant Cloud
- Clé API Groq

## ⚙️ Installation

### 1. Backend (Python/Flask)

```bash
cd backend

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos credentials
```

### 2. Frontend (React)

```bash
cd feedback-ecommerce

# Installer les dépendances
npm install
```

## 🔐 Configuration (.env)

Créez un fichier `backend/.env` avec :

```env
# Kafka Configuration
KAFKA_BOOTSTRAP=votre-cluster.confluent.cloud:9092
KAFKA_KEY=votre_api_key
KAFKA_SECRET=votre_api_secret
KAFKA_TOPIC=customer_feedback

# Qdrant Configuration
QDRANT_URL=https://votre-instance.qdrant.io
QDRANT_API_KEY=votre_qdrant_key
QDRANT_COLLECTION=feedback-db

# Groq API
GROQ_API_KEY=gsk_votre_clé_groq

# Flask
FLASK_ENV=development
FLASK_PORT=5000

# Admin Authentication (JWT)
ADMIN_EMAIL=admin@feedbackpro.com
ADMIN_PASSWORD=votre_mot_de_passe_securise
JWT_SECRET=votre_secret_jwt_unique_et_long
```

⚠️ **IMPORTANT** : Ne commitez JAMAIS le fichier `.env` !

## 🎯 Démarrage

### 1. Lancer le backend

```bash
cd backend
source venv/bin/activate
python app.py
```

Le backend démarre sur **http://localhost:5000**

### 2. Lancer le frontend

```bash
cd feedback-ecommerce
npm start
```

Le frontend démarre sur **http://localhost:3000**

### 3. Accéder aux interfaces

- **Interface Client** : http://localhost:3000/ (public)
- **Interface Admin** : http://localhost:3000/ puis cliquer sur "Administration" (protégé)
- **Login Admin** : Utiliser les credentials du `.env`

## 📊 Génération de données de test

Pour générer des données de test (2000 avis synthétiques) :

```bash
cd backend
python data_generator.py
```

Puis indexez-les dans Qdrant :

```bash
python consumer_indexer.py
```

Vous serez invité à spécifier :
- Nombre de messages à indexer (ex: 500)
- Timeout en secondes (ex: 120)

## 🔄 Flux de données

### Soumission via interface client
```
Client → React Form → Flask API → Kafka + Qdrant (direct)
                                    │
                                    └─→ Confirmation immédiate
```

### Consultation via interface admin
```
Admin Login → JWT Token → Dashboard React → Flask API (protected)
                                              │
                                              ▼
                                          Qdrant + RAG → Analyses et insights
```

### Données générées (batch)
```
data_generator.py → Kafka → consumer_indexer.py → Qdrant
```

**Note** : `consumer_indexer.py` ignore automatiquement les soumissions web (déjà indexées) pour éviter les doublons.

## 📁 Structure du projet

```
Projet_FeedBack-ecommerce/
├── backend/
│   ├── api/
│   │   ├── routes.py           # Endpoints REST (public + protected)
│   │   └── auth.py             # JWT Authentication & middleware
│   ├── services/
│   │   ├── kafka_service.py    # Gestion Kafka
│   │   ├── qdrant_service.py   # Indexation vectorielle
│   │   └── rag_service.py      # Système RAG avec Groq
│   ├── products.py             # Liste centralisée des produits
│   ├── config.py               # Configuration
│   ├── app.py                  # Application Flask + CORS
│   ├── data_generator.py       # Générateur de données test
│   ├── consumer_indexer.py     # Indexation batch Kafka→Qdrant
│   └── requirements.txt        # Dépendances Python
│
└── feedback-ecommerce/
    ├── src/
    │   ├── components/
    │   │   ├── ClientFeedbackForm.jsx    # Interface client
    │   │   ├── AdminDashboard.jsx        # Dashboard + Chatbot IA
    │   │   ├── AdminLogin.jsx            # Écran de connexion admin
    │   │   ├── ModernCharts.jsx          # Graphiques simplifiés
    │   │   └── MetricCard.jsx            # Cartes métriques
    │   ├── utils/
    │   │   ├── api.js                    # API service avec JWT interceptor
    │   │   └── constants.js              # Constantes (produits, URL API)
    │   └── App.js                        # Routage avec auth state
    └── package.json
```

## 🛠️ Scripts utiles

### Backend

```bash
# Réinitialiser la collection Qdrant
python reset_db.py

# Migrer des données existantes
python migrate_data.py

# Générer 2000 avis clients
python data_generator.py

# Indexer les messages Kafka dans Qdrant
python consumer_indexer.py
```

### Frontend

```bash
# Démarrer en mode développement
npm start

# Build de production
npm run build

# Lancer les tests
npm test
```

## 📝 API Endpoints

| Méthode | Endpoint | Protection | Description |
|---------|----------|------------|-------------|
| **POST** | `/api/feedback` | ❌ Public | Soumettre un feedback |
| **GET** | `/api/health` | ❌ Public | Health check |
| **POST** | `/api/admin/login` | ❌ Public | Connexion admin |
| **GET** | `/api/admin/verify` | ✅ JWT | Vérifier token |
| **POST** | `/api/rag/search` | ✅ JWT | Recherche RAG |
| **GET** | `/api/analytics` | ✅ JWT | Statistiques globales |
| **GET** | `/api/analytics/charts` | ✅ JWT | Données graphiques |

### Authentification JWT

Les routes protégées nécessitent un header :
```
Authorization: Bearer <votre_token_jwt>
```

## 🎨 Technologies utilisées

### Backend
- **Flask** : Framework web Python
- **Flask-CORS** : Gestion CORS
- **PyJWT** : Authentification JWT
- **Kafka (Confluent)** : Streaming de données
- **Qdrant** : Base de données vectorielle
- **LangChain** : Framework RAG
- **Groq** : LLM (Llama 3.3 70B)
- **HuggingFace** : Embeddings (all-MiniLM-L6-v2)

### Frontend
- **React 19** : Framework UI
- **React Router** : Routage
- **Tailwind CSS** : Styling moderne
- **Axios** : HTTP client avec interceptors
- **Lucide React** : Icônes
- **LocalStorage** : Persistance du token JWT

## 🎭 Interfaces utilisateur

### Interface Client
- Design épuré et moderne
- Formulaire responsive
- Validation en temps réel
- Animations fluides
- Confirmation de soumission

### Interface Administrateur
- **Authentification sécurisée** avec JWT
- **Dashboard complet** avec métriques clés :
  - Total d'avis
  - Note moyenne (camelCase fix)
  - % Positifs/Négatifs
  - Bouton actualiser
- **Chatbot IA latéral escamotable** :
  - S'ouvre depuis la droite (450px)
  - Questions suggérées
  - Réponses avec sources
  - Animation fluide
  - Overlay semi-transparent
- **Graphiques simplifiés** :
  - Barres de progression (au lieu de pie charts complexes)
  - Design minimaliste
  - Pas d'icônes artificielles
- **Session persistante** : Reconnexion automatique

## 🐛 Résolution de problèmes

### Le backend ne démarre pas
- Vérifiez que le fichier `.env` existe et contient toutes les variables
- Vérifiez que l'environnement virtuel est activé
- Installez toutes les dépendances : `pip install -r requirements.txt`

### Erreur "undefined" dans les stats
✅ **Corrigé** : Les clés sont maintenant en camelCase (`avgRating`, `positivePercent`)

### Erreur 401 sur `/analytics/charts`
✅ **Corrigé** : Le token JWT est maintenant envoyé dans tous les appels protégés

### Erreur d'import circulaire
✅ **Corrigé** : La méthode `get_stats()` est dans `qdrant_service.py`, pas dans `routes.py`

### Le chatbot ne s'affiche pas
- Cliquez sur le bouton flottant violet en bas à droite
- Le panel s'ouvre depuis la droite avec animation

### Problèmes Git (rebase)
```bash
# Annuler le rebase
git rebase --abort

# Ajouter les modifications
git add .
git commit -m "feat: Add JWT auth and collapsible chatbot"

# Pusher
git push origin main --force
```

## 🔒 Sécurité

- ✅ **JWT Authentication** : Routes admin protégées
- ✅ **Token expiration** : 24h par défaut
- ✅ **CORS configuré** : Uniquement localhost:3000/3001
- ✅ **Variables sensibles** : Dans `.env` (non commité)
- ✅ **Validation des inputs** : Champs requis vérifiés
- ⚠️ **Production** : Changez `JWT_SECRET` et utilisez HTTPS

## 📄 Changelog

### Version 2.0 (Dernière)
- ✅ Ajout authentification JWT pour admin
- ✅ Chatbot IA latéral escamotable
- ✅ Correction des clés stats (camelCase)
- ✅ Design épuré et professionnel
- ✅ Graphiques simplifiés (barres de progression)
- ✅ Session persistante avec localStorage
- ✅ Correction token JWT dans fetchChartData
- ✅ Suppression du champ "Numéro de commande"

### Version 1.0
- Interface client/admin de base
- Intégration Kafka + Qdrant + Groq
- Système RAG fonctionnel

## 📄 Licence

Ce projet est à usage éducatif.

## 👥 Contributeurs

- **Khalfallah Marwa** (Khalfallah2023)
- **Karim Maktouf** (karimmaktouf)

## 📧 Contact

Pour toute question, ouvrez une issue sur GitHub."# Projet_FeedBack_Ecommerce" 
#   P r o j e t _ F e e d B a c k _ E c o m m e r c e  
 