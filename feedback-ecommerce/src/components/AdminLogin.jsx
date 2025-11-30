import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';

const AdminLogin = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker le token dans le localStorage
        localStorage.setItem('adminToken', data.token);
        onLoginSuccess();
      } else {
        setError(data.error || 'Identifiants incorrects');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Effets de fond */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-2xl mb-4 shadow-2xl">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Administration</h1>
          <p className="text-gray-400">Espace réservé aux administrateurs</p>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email administrateur
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                placeholder="admin@example.com"
                required
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2 flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Mot de passe
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-500/20 border-2 border-red-500/50 rounded-xl p-4 flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{loading ? 'Connexion...' : 'Se connecter'}</span>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              🔒 Connexion sécurisée et cryptée
            </p>
          </div>
        </div>

        {/* Info supplémentaire */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Accès réservé • Toutes les tentatives sont enregistrées
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;