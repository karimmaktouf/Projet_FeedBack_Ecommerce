import React, { useState } from 'react';
import { Send, ChevronDown, Award, Target, Rocket, Activity, Zap, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../utils/constants';

const ClientFeedbackForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    product: PRODUCTS[0],
    rating: 5,
    comment: ''
  });

  const handleSubmitClick = () => {
    if (!formData.name || !formData.email || !formData.comment) {
      alert('⚠️ Veuillez remplir tous les champs');
      return;
    }
    if (formData.comment.length < 10) {
      alert('⚠️ Commentaire trop court (minimum 10 caractères)');
      return;
    }
    onSubmit(formData);
  };

  const stars = '⭐'.repeat(formData.rating) + '☆'.repeat(5 - formData.rating);
  
  const ratingLabels = {
    5: '🎉 Excellent !',
    4: '😊 Très bien',
    3: '😐 Correct',
    2: '😕 Décevant',
    1: '😞 Très décevant'
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white p-10 rounded-3xl mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-bold">Vos avis changent tout !</h2>
          </div>
          <p className="text-lg text-white/90 mb-6 leading-relaxed">
            Ce mois-ci, grâce à vous : <span className="font-bold">3 produits améliorés</span>, 
            délai de livraison <span className="font-bold">réduit de 2 jours</span>, 
            et <span className="font-bold">95% de satisfaction</span> client atteinte ! 🎉
          </p>
          <div className="flex space-x-4">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-sm font-semibold">+250 avis ce mois</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-sm font-semibold">⚡ Réponse en 24h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-gray-800">✍️ Partagez votre expérience</h3>
          <div className="bg-blue-50 border-2 border-blue-200 px-4 py-2 rounded-xl flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Indexation temps réel</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">👤 Votre nom</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                placeholder="Ex: Jean Dupont"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">📧 Votre email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                placeholder="jean@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">📦 Produit acheté</label>
            <div className="relative">
              <select
                value={formData.product}
                onChange={(e) => setFormData({...formData, product: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl appearance-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all bg-white"
              >
                {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border-2 border-amber-200">
            <label className="block text-sm font-bold text-gray-700 mb-4">⭐ Votre note</label>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
              className="w-full h-3 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #fbbf24 0%, #f59e0b ${(formData.rating - 1) * 25}%, #e5e7eb ${(formData.rating - 1) * 25}%, #e5e7eb 100%)`
              }}
            />
            <div className="text-6xl text-center mt-6">{stars}</div>
            <div className="text-center mt-2 text-sm font-semibold text-gray-600">
              {ratingLabels[formData.rating]}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">💬 Votre commentaire détaillé</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({...formData, comment: e.target.value})}
              rows="6"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all resize-none"
              placeholder="Partagez votre expérience en détail..."
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {formData.comment.length} caractères (min. 10)
            </div>
          </div>

          <button
            onClick={handleSubmitClick}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
          >
            <Send className="w-5 h-5" />
            <span>{loading ? 'Envoi en cours...' : 'Envoyer mon avis'}</span>
          </button>
        </div>
      </div>

      {/* Impact Cards */}
      <div className="grid grid-cols-4 gap-4 mt-10">
        {[
          { icon: <Target className="w-8 h-8" />, title: 'R&D Guidée', desc: 'Vos retours orientent nos innovations', color: 'from-blue-500 to-cyan-500' },
          { icon: <Rocket className="w-8 h-8" />, title: 'Action Rapide', desc: 'Corrections en moins de 48h', color: 'from-green-500 to-emerald-500' },
          { icon: <Activity className="w-8 h-8" />, title: 'IA Analytique', desc: 'Détection intelligente des patterns', color: 'from-purple-500 to-fuchsia-500' },
          { icon: <Zap className="w-8 h-8" />, title: 'Suivi Proactif', desc: 'Réponse personnalisée garantie', color: 'from-orange-500 to-amber-500' }
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center border border-gray-100">
            <div className={`bg-gradient-to-br ${item.color} p-4 rounded-2xl text-white inline-block mb-4 shadow-lg`}>
              {item.icon}
            </div>
            <h4 className="font-bold text-sm mb-2 text-gray-800">{item.title}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientFeedbackForm;