import React, { useState, useEffect } from 'react';
import { PieChart as RechartsPie, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MetricCard from './MetricCard';
import { SentimentPieChart, ProductRatingsChart, RatingDistributionChart, TimelineChart, TopProductsChart } from './ModernCharts';
import { Package, Star, TrendingUp, AlertCircle, RefreshCw, MessageSquare, PieChart, BarChart3, Award } from 'lucide-react';
const AdminDashboard = ({ stats, onRefresh }) => {
  const [query, setQuery] = useState('');
  const [ragResponse, setRagResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);

  const suggestedQueries = [
    "Quels sont les produits problématiques ?",
    "Quels produits ont les meilleures notes ?",
    "Y a-t-il des problèmes de livraison ?"
  ];

  // Charger les données des graphiques
  useEffect(() => {
    fetchChartData();
  }, [stats]);

  const fetchChartData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/analytics/charts');
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
      const response = await fetch('http://localhost:5000/api/rag/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      const data = await response.json();
      setRagResponse(data);
    } catch (error) {
      alert('Erreur lors de la recherche RAG');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
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

      {/* Section RAG */}
      <div className="bg-white rounded-3xl shadow-2xl p-10 mb-10 border border-gray-100">
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-fuchsia-500 p-4 rounded-2xl text-white shadow-lg">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800">Assistant d'Analyse IA</h3>
            <p className="text-sm text-gray-500">Posez vos questions sur les feedbacks clients</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-600 mb-3">💡 Questions suggérées:</p>
          <div className="flex flex-wrap gap-3">
            {suggestedQueries.map((q, i) => (
              <button
                key={i}
                onClick={() => setQuery(q)}
                className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-purple-100 hover:to-fuchsia-100 px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-purple-300"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleRagSearch()}
            placeholder="Ex: Analyse du Smartphone Galaxy X..."
            className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all text-lg"
          />
          <button
            onClick={handleRagSearch}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 font-bold shadow-lg hover:shadow-2xl"
          >
            {loading ? '🔍 Analyse...' : '🔍 Analyser'}
          </button>
        </div>

        {ragResponse && (
          <div className="mt-8 bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-2xl p-8 border-2 border-purple-200">
            <h4 className="font-bold text-lg mb-4 text-gray-800 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
              💬 Analyse IA
            </h4>
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed mb-6 bg-white/50 p-6 rounded-xl">
              {ragResponse.response}
            </div>
            
            {ragResponse.sources && ragResponse.sources.length > 0 && (
              <div>
                <h4 className="font-bold mb-4 text-gray-800">
                  📄 Sources ({ragResponse.sources.length} avis analysés)
                </h4>
                <div className="space-y-4">
                  {ragResponse.sources.map((source, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-purple-300 transition-all hover:shadow-lg">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-bold text-gray-800">{source.product}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-500 font-bold">{source.rating}⭐</span>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            source.sentiment === 'positif' ? 'bg-green-100 text-green-700' : 
                            source.sentiment === 'negatif' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {source.sentiment}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3 italic">"{source.text}"</p>
                      <div className="flex space-x-4 text-xs text-gray-500">
                        <span className="bg-gray-100 px-3 py-1 rounded-full">📦 {source.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

     {chartData && (
      <>
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Graphique Sentiment */}
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

          {/* Graphique Produits */}
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

        {/* Deuxième ligne de graphiques */}
        <div className="grid grid-cols-3 gap-6">
          {/* Distribution des notes */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Distribution des Notes
            </h4>
            <RatingDistributionChart data={chartData.all_feedbacks || []} />
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Timeline des Avis
            </h4>
            <TimelineChart data={chartData.all_feedbacks || []} />
          </div>

          {/* Top Produits */}
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
        </div>
  );
};

export default AdminDashboard;