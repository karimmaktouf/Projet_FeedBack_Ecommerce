# Projet FeedBack E-commerce

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/karimmaktouf/Projet_FeedBack_Ecommerce)](https://github.com/karimmaktouf/Projet_FeedBack_Ecommerce/commits/main)
[![Stars](https://img.shields.io/github/stars/karimmaktouf/Projet_FeedBack_Ecommerce?style=social)](https://github.com/karimmaktouf/Projet_FeedBack_Ecommerce)
[![Forks](https://img.shields.io/github/forks/karimmaktouf/Projet_FeedBack_Ecommerce?style=social)](https://github.com/karimmaktouf/Projet_FeedBack_Ecommerce/fork)

Full-stack e-commerce feedback analysis platform with AI, using Kafka for data streaming, Qdrant for vector search, and RAG (Retrieval-Augmented Generation) for intelligent insights. Built with React, Flask, and modern AI tools.

Plateforme full-stack d'analyse de feedback clients pour e-commerce avec IA, utilisant Kafka pour le streaming de données, Qdrant pour la recherche vectorielle, et un système RAG (Retrieval-Augmented Generation) pour des insights intelligents. Développée avec React, Flask, et des outils IA modernes.

## Table of Contents
- [🚀 Features](#-features)
- [📸 Screenshots](#-screenshots)
- [🏗️ Architecture](#️-architecture)
- [📋 Prerequisites](#-prerequisites)
- [⚙️ Installation](#️-installation)
- [🔐 Configuration](#-configuration)
- [🎯 Getting Started](#-getting-started)
- [📊 Data Flow](#-data-flow)
- [📁 Project Structure](#-project-structure)
- [🛠️ Useful Scripts](#️-useful-scripts)
- [📝 API Endpoints](#-api-endpoints)
- [🎨 Technologies](#-technologies)
- [🎭 User Interfaces](#-user-interfaces)
- [🐛 Troubleshooting](#-troubleshooting)
- [🔒 Security](#-security)
- [📄 Changelog](#-changelog)
- [🚀 Roadmap](#-roadmap)
- [📄 License](#-license)
- [👥 Contributors](#-contributors)
- [📧 Contact](#-contact)
- [🤝 Contributing](#-contributing)

## 🚀 Features

### Client Interface
- **Feedback Submission**: Modern and intuitive form
- **Product Selection**: Dropdown with full product list
- **Rating**: Interactive star rating (1-5 stars)
- **Comments**: Text area for detailed feedback
- **Real-time Validation**: Required fields with error messages
- **Modern Design**: Clean interface with gradients and animations

### Admin Interface (🔐 JWT Protected)
- **Secure Authentication**: Login with email/password
- **Analytics Dashboard**: Real-time metrics
  - Total reviews
  - Average rating
  - Positive/negative percentage
  - Refresh button
- **Collapsible AI Chatbot** 💬
  - Sliding panel from the right
  - Pre-defined suggested questions
  - AI-generated responses with sources
  - Compact and modern interface
- **Sentiment Analysis**: Automatic classification (positive/neutral/negative)
- **RAG Search**: Natural language questions with contextual answers
- **Interactive Visualizations**:
  - Sentiment distribution (progress bars)
  - Ratings by product (top 10)
  - Star distribution
  - Reviews timeline
  - Top 8 products
- **Persistent Session**: JWT token stored locally

### Backend System
- **JWT Authentication**: Protected admin routes
- **Vector Indexing**: Semantic search with Qdrant
- **Data Streaming**: Kafka pipeline for scalability
- **Generative AI**: Intelligent analysis with Groq LLM
- **Modular Architecture**: Decoupled services (Kafka, Qdrant, RAG, Auth)

## 📸 Screenshots

### Client Feedback Form
![Client Interface](https://via.placeholder.com/800x400?text=Client+Feedback+Form)  
*Modern form for submitting e-commerce feedback.*

### Admin Dashboard with AI Chatbot
![Admin Dashboard](https://via.placeholder.com/800x400?text=Admin+Dashboard+with+Chatbot)  
*Analytics dashboard featuring real-time metrics and AI-powered chatbot.*

### Sentiment Analysis Visualization
![Charts](https://via.placeholder.com/800x400?text=Sentiment+Analysis+Charts)  
*Interactive charts showing feedback distribution.*

*(Replace placeholders with actual screenshots/GIFs from your app for better engagement.)*

## 🏗️ Architecture

The platform leverages AI and modern data tools for scalable feedback analysis:
- **Frontend**: React for responsive UI.
- **Backend**: Flask with JWT for secure admin access.
- **Streaming**: Kafka for real-time data ingestion.
- **Vector DB**: Qdrant for semantic search.
- **AI**: Groq LLM with RAG for contextual responses.

## 📋 Prerequisites

- Python 3.9+
- Node.js 16+
- Confluent Cloud account (Kafka)
- Qdrant Cloud account
- Groq API key

## ⚙️ Installation

### 1. Backend (Python/Flask)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your credentials
```

### 2. Frontend (React)

```bash
cd feedback-ecommerce

# Install dependencies
npm install
```

## 🔐 Configuration (.env)

Create a `backend/.env` file with:

```env
# Kafka Configuration
KAFKA_BOOTSTRAP=your-cluster.confluent.cloud:9092
KAFKA_KEY=your_api_key
KAFKA_SECRET=your_api_secret
KAFKA_TOPIC=customer_feedback

# Qdrant Configuration
QDRANT_URL=https://your-instance.qdrant.io
QDRANT_API_KEY=your_qdrant_key
QDRANT_COLLECTION=feedback-db

# Groq API
GROQ_API_KEY=gsk_your_groq_key

# Flask
FLASK_ENV=development
FLASK_PORT=5000

# Admin Authentication (JWT)
ADMIN_EMAIL=admin@feedbackpro.com
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_unique_and_long_jwt_secret
```

⚠️ **IMPORTANT**: Never commit the `.env` file!

## 🎯 Getting Started

### 1. Start Backend

```bash
cd backend
source venv/bin/activate
python app.py
```

Backend runs on **http://localhost:5000**

### 2. Start Frontend

```bash
cd feedback-ecommerce
npm start
```

Frontend runs on **http://localhost:3000**

### 3. Access Interfaces

- **Client Interface**: http://localhost:3000/ (public)
- **Admin Interface**: http://localhost:3000/ then click "Administration" (protected)
- **Admin Login**: Use credentials from `.env`

## 📊 Data Flow

### Submission via Client Interface
```
Client → React Form → Flask API → Kafka + Qdrant (direct)
                                    │
                                    └─→ Immediate Confirmation
```

### Consultation via Admin Interface
```
Admin Login → JWT Token → Dashboard React → Flask API (protected)
                                              │
                                              ▼
                                          Qdrant + RAG → Analyses and Insights
```

### Generated Data (Batch)
```
data_generator.py → Kafka → consumer_indexer.py → Qdrant
```

**Note**: `consumer_indexer.py` automatically ignores web submissions (already indexed) to avoid duplicates.

## 📁 Project Structure

```
Projet_FeedBack-ecommerce/
├── backend/
│   ├── api/
│   │   ├── routes.py           # REST Endpoints (public + protected)
│   │   └── auth.py             # JWT Authentication & middleware
│   ├── services/
│   │   ├── kafka_service.py    # Kafka Management
│   │   ├── qdrant_service.py   # Vector Indexing
│   │   └── rag_service.py      # RAG System with Groq
│   ├── products.py             # Centralized Product List
│   ├── config.py               # Configuration
│   ├── app.py                  # Flask App + CORS
│   ├── data_generator.py       # Test Data Generator
│   ├── consumer_indexer.py     # Batch Indexing Kafka→Qdrant
│   └── requirements.txt        # Python Dependencies
│
└── feedback-ecommerce/
    ├── src/
    │   ├── components/
    │   │   ├── ClientFeedbackForm.jsx    # Client Interface
    │   │   ├── AdminDashboard.jsx        # Dashboard + AI Chatbot
    │   │   ├── AdminLogin.jsx            # Admin Login Screen
    │   │   ├── ModernCharts.jsx          # Simplified Charts
    │   │   └── MetricCard.jsx            # Metric Cards
    │   ├── utils/
    │   │   ├── api.js                    # API Service with JWT Interceptor
    │   │   └── constants.js              # Constants (products, API URLs)
    │   └── App.js                        # Routing with Auth State
    └── package.json
```

## 🛠️ Useful Scripts

### Backend

```bash
# Reset Qdrant collection
python reset_db.py

# Migrate existing data
python migrate_data.py

# Generate 2000 customer reviews
python data_generator.py

# Index Kafka messages into Qdrant
python consumer_indexer.py
```

### Frontend

```bash
# Start in development mode
npm start

# Production build
npm run build

# Run tests
npm test
```

## 📝 API Endpoints

| Method | Endpoint | Protection | Description |
|--------|----------|------------|-------------|
| **POST** | `/api/feedback` | ❌ Public | Submit feedback |
| **GET** | `/api/health` | ❌ Public | Health check |
| **POST** | `/api/admin/login` | ❌ Public | Admin login |
| **GET** | `/api/admin/verify` | ✅ JWT | Verify token |
| **POST** | `/api/rag/search` | ✅ JWT | RAG Search |
| **GET** | `/api/analytics` | ✅ JWT | Global Statistics |
| **GET** | `/api/analytics/charts` | ✅ JWT | Chart Data |

### JWT Authentication

Protected routes require a header:
```
Authorization: Bearer <your_jwt_token>
```

## 🎨 Technologies

### Backend
- **Flask**: Python web framework
- **Flask-CORS**: CORS handling
- **PyJWT**: JWT Authentication
- **Kafka (Confluent)**: Data streaming
- **Qdrant**: Vector database
- **LangChain**: RAG framework
- **Groq**: LLM (Llama 3.3 70B)
- **HuggingFace**: Embeddings (all-MiniLM-L6-v2)

### Frontend
- **React 19**: UI framework
- **React Router**: Routing
- **Tailwind CSS**: Modern styling
- **Axios**: HTTP client with interceptors
- **Lucide React**: Icons
- **LocalStorage**: JWT token persistence

## 🎭 User Interfaces

### Client Interface
- Clean and modern design
- Responsive form
- Real-time validation
- Smooth animations
- Submission confirmation

### Admin Interface
- **Secure Authentication** with JWT
- **Complete Dashboard** with key metrics:
  - Total reviews
  - Average rating (camelCase fix)
  - Positive/Negative %
  - Refresh button
- **Collapsible AI Chatbot**:
  - Opens from the right (450px)
  - Suggested questions
  - Responses with sources
  - Smooth animation
  - Semi-transparent overlay
- **Simplified Charts**:
  - Progress bars (instead of complex pie charts)
  - Minimalist design
  - No artificial icons
- **Persistent Session**: Auto-relogin

## 🐛 Troubleshooting

### Backend Won't Start
- Check that `.env` file exists and has all variables
- Ensure virtual environment is activated
- Install all dependencies: `pip install -r requirements.txt`

### "undefined" Error in Stats
✅ **Fixed**: Keys are now in camelCase (`avgRating`, `positivePercent`)

### 401 Error on `/analytics/charts`
✅ **Fixed**: JWT token is now sent in all protected calls

### Circular Import Error
✅ **Fixed**: `get_stats()` method is in `qdrant_service.py`, not `routes.py`

### Chatbot Not Displaying
- Click the floating purple button at bottom-right
- Panel opens from the right with animation

### Git Issues (Rebase)
```bash
# Abort rebase
git rebase --abort

# Add changes
git add .
git commit -m "feat: Add JWT auth and collapsible chatbot"

# Push
git push origin main --force
```

## 🔒 Security

- ✅ **JWT Authentication**: Protected admin routes
- ✅ **Token Expiration**: 24h default
- ✅ **CORS Configured**: Only localhost:3000/3001
- ✅ **Sensitive Variables**: In `.env` (not committed)
- ✅ **Input Validation**: Required fields checked
- ⚠️ **Production**: Change `JWT_SECRET` and use HTTPS

## 📄 Changelog

### Version 2.0 (Latest)
- ✅ Added JWT authentication for admin
- ✅ Collapsible AI chatbot
- ✅ Fixed stats keys (camelCase)
- ✅ Clean and professional design
- ✅ Simplified charts (progress bars)
- ✅ Persistent session with localStorage
- ✅ Fixed JWT token in fetchChartData
- ✅ Removed "Order Number" field

### Version 1.0
- Basic client/admin interface
- Kafka + Qdrant + Groq integration
- Functional RAG system

## 🚀 Roadmap

- [ ] Add multi-language support (English/French toggle)
- [ ] Integrate real e-commerce APIs (e.g., Shopify)
- [ ] Implement user accounts for clients
- [ ] Add advanced AI models for deeper sentiment analysis
- [ ] Create a live demo on Heroku/Vercel
- [ ] Add unit and integration tests
- [ ] Optimize performance for large datasets

## 📄 License

This project is for educational use. Licensed under MIT.

## 👥 Contributors

- **Khalfallah Marwa** ([@Khalfallah2023](https://github.com/Khalfallah2023))
- **Karim Maktouf** ([@karimmaktouf](https://github.com/karimmaktouf))

## 📧 Contact

For questions, open an issue on GitHub or email: karim.maktouf@example.com

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
- Fork the repo
- Create a feature branch
- Submit a pull request
- Report issues or suggest features

