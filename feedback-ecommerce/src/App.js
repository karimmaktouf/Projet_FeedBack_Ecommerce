import React, { useState, useEffect } from 'react';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import ClientFeedbackForm from './components/ClientFeedbackForm';
import { Users, ShieldCheck } from 'lucide-react';

function App() {
  const [view, setView] = useState('client'); // 'client' ou 'admin'
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0,
    positivePercent: 0,
    negativePercent: 0
  });
  const [loading, setLoading] = useState(false);

  // Vérifier si l'admin est déjà connecté au chargement
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setIsAdminAuthenticated(true);
        if (view === 'admin') {
          loadStats();
        }
      } else {
        localStorage.removeItem('adminToken');
        setIsAdminAuthenticated(false);
      }
    } catch (error) {
      console.error('Erreur de vérification du token:', error);
      localStorage.removeItem('adminToken');
      setIsAdminAuthenticated(false);
    }
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    loadStats();
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdminAuthenticated(false);
    setView('client');
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const handleClientSubmit = async (formData) => {
    setLoading(true);
    
    try {
      // Soumettre directement le feedback (pas de validation de commande)
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('✅ Merci pour votre avis ! Il a été enregistré avec succès.');
        window.location.reload();
      } else {
        const error = await response.json();
        alert('❌ Erreur : ' + (error.error || 'Erreur lors de l\'envoi'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header avec navigation */}
      <header className="bg-white border-b-2 border-gray-200 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-purple-600 to-fuchsia-600 p-3 rounded-2xl text-white shadow-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">FeedbackPro</h1>
                <p className="text-xs text-gray-500">Système de gestion des avis clients</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Boutons de navigation */}
              <button
                onClick={() => setView('client')}
                className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  view === 'client'
                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                👤 Espace Client
              </button>

              <button
                onClick={() => {
                  if (isAdminAuthenticated) {
                    setView('admin');
                    loadStats();
                  } else {
                    setView('admin');
                  }
                }}
                className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  view === 'admin'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Administration</span>
              </button>

              {/* Bouton de déconnexion si admin connecté */}
              {isAdminAuthenticated && view === 'admin' && (
                <button
                  onClick={handleAdminLogout}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-300"
                >
                  Déconnexion
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="py-10 px-6">
        {view === 'client' ? (
          <ClientFeedbackForm onSubmit={handleClientSubmit} loading={loading} />
        ) : (
          <>
            {isAdminAuthenticated ? (
              <AdminDashboard stats={stats} onRefresh={loadStats} />
            ) : (
              <AdminLogin onLoginSuccess={handleAdminLogin} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-200 py-6 mt-20">
      </footer>
    </div>
  );
}

export default App;