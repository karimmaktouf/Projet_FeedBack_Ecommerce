import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricCard = ({ icon, label, value, color = 'blue', trend, subtitle, loading = false }) => {
  const colors = {
    blue: {
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600',
      glow: 'shadow-blue-500/20'
    },
    green: {
      gradient: 'from-green-500 to-emerald-500',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-600',
      glow: 'shadow-green-500/20'
    },
    red: {
      gradient: 'from-red-500 to-pink-500',
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-600',
      glow: 'shadow-red-500/20'
    },
    purple: {
      gradient: 'from-purple-500 to-fuchsia-500',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-600',
      glow: 'shadow-purple-500/20'
    },
    orange: {
      gradient: 'from-orange-500 to-amber-500',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-600',
      glow: 'shadow-orange-500/20'
    }
  };

  const colorScheme = colors[color];

  return (
    <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
      {/* Effet de brillance au survol */}
      <div className={`absolute inset-0 bg-gradient-to-r ${colorScheme.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      {/* Cercle décoratif animé */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 ${colorScheme.bg} rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-all duration-700 group-hover:scale-150`}></div>
      
      <div className="relative z-10">
        {/* Header avec icône et trend */}
        <div className="flex items-start justify-between mb-4">
          {/* Icône avec animation */}
          <div className={`bg-gradient-to-br ${colorScheme.gradient} p-3 rounded-xl text-white shadow-lg ${colorScheme.glow} transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
            {React.cloneElement(icon, { 
              className: 'w-6 h-6 transition-transform duration-300 group-hover:scale-110' 
            })}
          </div>
          
          {/* Badge de tendance amélioré */}
          {trend !== undefined && trend !== null && (
            <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full font-semibold text-xs transition-all duration-300 ${
              trend > 0 
                ? 'bg-green-100 text-green-700 group-hover:bg-green-200' 
                : trend < 0
                ? 'bg-red-100 text-red-700 group-hover:bg-red-200'
                : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'
            }`}>
              {trend > 0 ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : trend < 0 ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : null}
              <span>{trend > 0 ? '+' : ''}{Math.abs(trend)}%</span>
            </div>
          )}
        </div>

        {/* Valeur principale avec animation */}
        {loading ? (
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ) : (
          <>
            <div className={`text-4xl font-bold text-gray-800 mb-2 transition-all duration-300 group-hover:${colorScheme.text} group-hover:scale-105`}>
              {value}
            </div>
            
            {/* Label */}
            <div className="text-sm text-gray-500 font-medium mb-1 transition-colors duration-300 group-hover:text-gray-700">
              {label}
            </div>
            
            {/* Sous-titre optionnel */}
            {subtitle && (
              <div className="text-xs text-gray-400 mt-2 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></span>
                <span>{subtitle}</span>
              </div>
            )}
          </>
        )}

        {/* Barre de progression décorative en bas */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${colorScheme.gradient} transform transition-all duration-700 ease-out group-hover:translate-x-0 -translate-x-full`}></div>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;