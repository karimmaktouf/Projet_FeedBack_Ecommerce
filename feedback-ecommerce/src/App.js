import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import ClientFeedbackForm from './components/ClientFeedbackForm';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

const App = () => {
  const [currentView, setCurrentView] = useState('client');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    avgRating: '0',
    positivePercent: '0',
    negativePercent: '0'
  });

  // Charger les statistiques au démarrage
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/analytics');
      if (response.ok) {
        const data = await response.json();
        setStats({
          total: data.total || 0,
          avgRating: data.avg_rating?.toString() || '0',
          positivePercent: data.positive_percent?.toString() || '0',
          negativePercent: data.negative_percent?.toString() || '0'
        });
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const handleFeedbackSubmit = async (formData) => {
    setLoading(true);
    try {
      console.log('Envoi des données:', formData);
      
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      console.log('Status response:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Réponse backend:', data);
      
      alert('✅ Avis envoyé avec succès ! Merci pour votre retour 🎉');
      
      // Rafraîchir les stats
      await fetchStats();
      
    } catch (error) {
      console.error('Erreur complète:', error);
      alert(`❌ Erreur lors de l'envoi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchStats();
    alert('🔄 Données actualisées !');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="px-6 py-10">
        {currentView === 'client' ? (
          <ClientFeedbackForm onSubmit={handleFeedbackSubmit} loading={loading} />
        ) : (
          <AdminDashboard stats={stats} onRefresh={handleRefresh} />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-600">
          <p className="text-sm font-semibold">⭐ Feedback Pro | 📊 Analytics Avancés | ⚡ Indexation Temps Réel</p>
          <p className="text-xs mt-2 text-gray-400">Propulsé par React + Flask + Kafka + Qdrant + LangChain</p>
        </div>
      </footer>
    </div>
  );
};

export default App;