# Projet FeedBack E-commerce

Plateforme full-stack d'analyse de feedback clients pour e-commerce avec IA, utilisant Kafka pour le streaming de données, Qdrant pour la recherche vectorielle, et un système RAG (Retrieval-Augmented Generation) pour l'analyse intelligente.

## 🏗️ Architecture

```
┌─────────────┐         ┌──────────┐         ┌─────────────┐
│   React     │────────▶│  Flask   │────────▶│    Kafka    │
│  Frontend   │         │   API    │         │   Stream    │
│  (Client +  │         └──────────┘         └─────────────┘
│   Admin)    │              │                       │
└─────────────┘              ▼                       ▼
                        ┌─────────┐         ┌──────────────┐
                        │ Qdrant  │◀────────│  Consumer    │
                        │ Vector  │         │  Indexer     │
                        │   DB    │         └──────────────┘
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
- **Soumission de feedback** : Formulaire intuitif pour soumettre des avis produits
- **Sélection de produits** : Choix parmi une liste de produits disponibles
- **Évaluation** : Système de notation (1-5 étoiles)
- **Commentaires** : Zone de texte pour des retours détaillés

### Interface Administrateur
- **Dashboard Analytics** : Vue d'ensemble des métriques en temps réel
- **Analyse de sentiment** : Classification automatique (positif/neutre/négatif)
- **Recherche RAG** : Questions en langage naturel avec réponses générées par IA
- **Visualisations** : Graphiques interactifs (distribution des sentiments, tendances temporelles, top produits)
- **Statistiques avancées** : Nombre total d'avis, scores moyens, insights détaillés

### Système Backend
- **Indexation vectorielle** : Recherche sémantique avec Qdrant
- **Streaming de données** : Pipeline Kafka pour scalabilité
- **IA générative** : Analyse intelligente avec Groq LLM

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
```

⚠️ **IMPORTANT** : Ne commitez JAMAIS le fichier `.env` !

## 🎯 Démarrage

### 1. Lancer le backend

```bash
cd backend
source venv/bin/activate
python app.py
```

Le backend démarre sur `http://localhost:5000`

### 2. Lancer le frontend

```bash
cd feedback-ecommerce
npm start
```

Le frontend démarre sur `http://localhost:3000`

### 3. Accéder aux interfaces

- **Interface Client** : `http://localhost:3000/` (par défaut)
- **Interface Admin** : `http://localhost:3000/admin`

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
Client → Formulaire React → Flask API → Kafka + Qdrant (direct)
                                          │
                                          └─→ Confirmation immédiate
```

### Consultation via interface admin
```
Admin → Dashboard React → Flask API → Qdrant + RAG → Analyses et insights
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
│   │   └── routes.py           # Endpoints REST
│   ├── services/
│   │   ├── kafka_service.py    # Gestion Kafka
│   │   ├── qdrant_service.py   # Indexation vectorielle
│   │   └── rag_service.py      # Système RAG avec Groq
│   ├── products.py             # Liste centralisée des produits
│   ├── config.py               # Configuration
│   ├── app.py                  # Application Flask
│   ├── data_generator.py       # Générateur de données test
│   ├── consumer_indexer.py     # Indexation batch Kafka→Qdrant
│   └── requirements.txt        # Dépendances Python
│
└── feedback-ecommerce/
    ├── src/
    │   ├── components/
    │   │   ├── ClientFeedbackForm.jsx    # Interface client
    │   │   ├── AdminDashboard.jsx        # Interface admin
    │   │   ├── ModernCharts.jsx          # Graphiques (admin)
    │   │   └── MetricCard.jsx            # Cartes métriques (admin)
    │   └── App.js                        # Routage principal
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

| Méthode | Endpoint | Description | Utilisé par |
|---------|----------|-------------|-------------|
| POST | `/api/feedback` | Soumettre un nouveau feedback | Interface Client |
| POST | `/api/rag/search` | Recherche RAG avec question | Interface Admin |
| GET | `/api/analytics` | Statistiques globales | Interface Admin |
| GET | `/api/analytics/charts` | Données pour graphiques | Interface Admin |
| GET | `/api/health` | Vérification de santé | Monitoring |

## 🎨 Technologies utilisées

### Backend
- **Flask** : Framework web Python
- **Kafka (Confluent)** : Streaming de données
- **Qdrant** : Base de données vectorielle
- **LangChain** : Framework RAG
- **Groq** : LLM (Llama 3.3 70B)
- **HuggingFace** : Embeddings (all-MiniLM-L6-v2)

### Frontend
- **React 19** : Framework UI
- **React Router** : Routage (Client/Admin)
- **Tailwind CSS** : Styling
- **Recharts** : Visualisations (Admin)
- **Axios** : HTTP client
- **Lucide React** : Icônes

## 🎭 Interfaces utilisateur

### Interface Client
- Design épuré et intuitif
- Formulaire de soumission simplifié
- Sélection de produits avec dropdown
- Système d'étoiles pour la notation
- Validation en temps réel
- Confirmation de soumission

### Interface Administrateur
- Dashboard complet avec métriques clés
- Graphiques interactifs (Recharts)
- Système RAG pour questions intelligentes
- Distribution des sentiments
- Analyse temporelle des feedbacks
- Top produits les mieux notés
- Vue d'ensemble statistique

## 🐛 Résolution de problèmes

### Le backend ne démarre pas
- Vérifiez que le fichier `.env` existe et contient toutes les variables
- Vérifiez que l'environnement virtuel est activé
- Installez toutes les dépendances : `pip install -r requirements.txt`

### Erreur de connexion Kafka
- Vérifiez vos credentials dans `.env`
- Assurez-vous que le topic `customer_feedback` existe dans Confluent Cloud

### Qdrant ne répond pas
- Vérifiez l'URL et la clé API dans `.env`
- Assurez-vous que la collection est créée (se crée automatiquement au premier démarrage)

### Double indexation des données
- C'est résolu ! `consumer_indexer.py` ignore les messages avec `source='web_app'`

### L'interface admin ne s'affiche pas
- Vérifiez que le routage est bien configuré dans `App.js`
- Accédez directement à `http://localhost:3000/admin`
- Vérifiez la console navigateur pour les erreurs

## 📄 Licence

Ce projet est à usage éducatif.

## 👥 Contributeurs

- **Khalfallah Marwa** (Khalfallah2023)
- **Karim Maktouf** (karimmaktouf)

## 📧 Contact

Pour toute question, ouvrez une issue sur GitHub.
