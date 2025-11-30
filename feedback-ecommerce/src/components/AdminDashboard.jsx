import React, { useState, useEffect } from 'react';
import { PieChart as RechartsPie, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MetricCard from './MetricCard';
import { SentimentPieChart, ProductRatingsChart, RatingDistributionChart, TimelineChart, TopProductsChart } from './ModernCharts';
import { Package, Star, TrendingUp, AlertCircle, RefreshCw, MessageSquare, PieChart, BarChart3, Award, X, Send } from 'lucide-react';

const AdminDashboard = ({ stats, onRefresh }) => {
  const [query, setQuery] = useState('');
  const [ragResponse, setRagResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const suggestedQueries = [
    "Quels sont les produits problématiques ?",
    "Quels produits ont les meilleures notes ?",
    "Y a-t-il des problèmes de livraison ?"
  ];

  useEffect(() => {
    fetchChartData();
  }, [stats]);

  const fetchChartData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('http://localhost:5000/api/analytics/charts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error('Erreur chargement graphiques:', response.status);
        return;
      }
      
      const data = await response.json();
      setChartData(data);
    } catch (error) {
      console.error('Erreur chargement graphiques:', error);
    }
  };

  const handleRagSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('http://localhost:5000/api/rag/search', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }
      
      const data = await response.json();
      setRagResponse(data);
    } catch (error) {
      console.error('Erreur RAG:', error);
      alert('Erreur lors de la recherche RAG');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Métriques */}
      <div className="grid grid-cols-5 gap-6 mb-10">
        <MetricCard 
          icon={<Package />} 
          label="Total d'avis" 
          value={stats.total} 
          color="blue"
          trend={12}
        />
        <MetricCard 
          icon={<Star />} 
          label="Note Moyenne" 
          value={`${stats.avgRating} ⭐`} 
          color="orange"
          trend={5}
        />
        <MetricCard 
          icon={<TrendingUp />} 
          label="Positifs" 
          value={`${stats.positivePercent}%`} 
          color="green"
          trend={8}
        />
        <MetricCard 
          icon={<AlertCircle />} 
          label="Négatifs" 
          value={`${stats.negativePercent}%`} 
          color="red"
          trend={-3}
        />
        <button
          onClick={() => { onRefresh(); fetchChartData(); }}
          className="bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl flex flex-col items-center justify-center space-y-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
        >
          <RefreshCw className="w-8 h-8" />
          <span className="font-bold text-sm">Actualiser</span>
        </button>
      </div>

      {/* Graphiques */}
      {chartData && (
        <>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-xl text-gray-800 flex items-center">
                  <PieChart className="w-6 h-6 mr-3 text-purple-600" />
                  Distribution des Sentiments
                </h4>
                <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {chartData.sentiment_distribution.reduce((sum, item) => sum + item.value, 0)} avis
                </div>
              </div>
              <SentimentPieChart data={chartData.sentiment_distribution} />
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-xl text-gray-800 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
                  Notes par Produit (Top 10)
                </h4>
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Moyennes ⭐
                </div>
              </div>
              <ProductRatingsChart data={chartData.ratings_by_product} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Distribution des Notes
              </h4>
              <RatingDistributionChart data={chartData.all_feedbacks || []} />
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Timeline des Avis
              </h4>
              <TimelineChart data={chartData.all_feedbacks || []} />
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-purple-500" />
                Top 8 Produits
              </h4>
              <TopProductsChart data={chartData.ratings_by_product} />
            </div>
          </div>
        </>
      )}

      {/* Bouton flottant pour ouvrir le chat */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white p-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-50"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Panel Chat latéral */}
      <div
        className={`fixed top-0 right-0 h-full w-[450px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isChatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-br from-purple-600 to-fuchsia-600 p-6 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6" />
              <div>
                <h3 className="text-xl font-bold">Assistant IA</h3>
                <p className="text-sm text-purple-100">Analyse de feedbacks</p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="hover:bg-white/20 p-2 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contenu scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Questions suggérées */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-3">💡 Questions suggérées</p>
              <div className="space-y-2">
                {suggestedQueries.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(q)}
                    className="w-full text-left bg-gray-50 hover:bg-purple-50 px-4 py-3 rounded-xl text-sm text-gray-700 hover:text-purple-700 transition-all border border-gray-200 hover:border-purple-300"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Réponse RAG */}
            {ragResponse && (
              <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-2xl p-6 border-2 border-purple-200">
                <h4 className="font-bold text-lg mb-3 text-gray-800 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
                  Analyse IA
                </h4>
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed mb-4 bg-white/50 p-4 rounded-xl text-sm">
                  {ragResponse.response}
                </div>
                
                {ragResponse.sources && ragResponse.sources.length > 0 && (
                  <div>
                    <h5 className="font-bold mb-3 text-sm text-gray-800">
                      📄 Sources ({ragResponse.sources.length} avis)
                    </h5>
                    <div className="space-y-3">
                      {ragResponse.sources.map((source, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-sm text-gray-800">{source.product}</span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              source.sentiment === 'positif' ? 'bg-green-100 text-green-700' : 
                              source.sentiment === 'negatif' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {source.rating}⭐
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 italic">"{source.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input en bas */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex space-x-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleRagSearch()}
                placeholder="Posez votre question..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
              />
              <button
                onClick={handleRagSearch}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white px-4 py-3 rounded-xl transition-all disabled:opacity-50 shadow-lg"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay pour fermer le chat en cliquant à côté */}
      {isChatOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;