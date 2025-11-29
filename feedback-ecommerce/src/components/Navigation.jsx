import React from 'react';
import { Star, Users, BarChart3 } from 'lucide-react';

const Navigation = ({ currentView, setCurrentView }) => {
  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
              <Star className="w-8 h-8 fill-yellow-300 text-yellow-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Feedback Pro</h1>
              <p className="text-xs text-white/80">E-Commerce Analytics Platform</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setCurrentView('client')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                currentView === 'client'
                  ? 'bg-white text-indigo-600 shadow-xl'
                  : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              <Users className="inline w-5 h-5 mr-2" />
              Espace Client
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                currentView === 'admin'
                  ? 'bg-white text-purple-600 shadow-xl'
                  : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              <BarChart3 className="inline w-5 h-5 mr-2" />
              Dashboard Admin
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;