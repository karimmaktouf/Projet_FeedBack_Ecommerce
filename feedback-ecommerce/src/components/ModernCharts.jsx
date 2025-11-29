import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, Area, AreaChart } from 'recharts';

// Couleurs modernes
const COLORS = {
  positif: '#10b981',
  neutre: '#6b7280',
  negatif: '#ef4444',
  primary: '#8b5cf6',
  secondary: '#ec4899'
};

// Custom Tooltip moderne
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-xl shadow-2xl p-4">
        <p className="font-bold text-gray-800 mb-2">{payload[0].name}</p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">{payload[0].value}</span> {payload[0].dataKey === 'rating' ? '⭐' : 'avis'}
        </p>
      </div>
    );
  }
  return null;
};

// 1. Graphique Sentiment (Pie Chart moderne)
export const SentimentPieChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={120}
          innerRadius={60}
          fill="#8884d8"
          dataKey="value"
          paddingAngle={5}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

// 2. Graphique Notes par Produit (Bar Chart moderne avec gradient)
export const ProductRatingsChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
        <defs>
          <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="#ec4899" stopOpacity={0.7}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="product" 
          angle={-45} 
          textAnchor="end" 
          height={100}
          style={{ fontSize: '11px', fontWeight: '500' }}
          stroke="#6b7280"
        />
        <YAxis 
          domain={[0, 5]} 
          style={{ fontSize: '12px' }}
          stroke="#6b7280"
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="rating" 
          fill="url(#colorRating)" 
          radius={[10, 10, 0, 0]}
          maxBarSize={60}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

// 3. Distribution des Notes (Area Chart avec gradient)
export const RatingDistributionChart = ({ data }) => {
  // Transformer les données pour avoir la distribution 1-5 étoiles
  const distribution = [
    { rating: '1⭐', count: data.filter(d => d.rating === 1).length },
    { rating: '2⭐', count: data.filter(d => d.rating === 2).length },
    { rating: '3⭐', count: data.filter(d => d.rating === 3).length },
    { rating: '4⭐', count: data.filter(d => d.rating === 4).length },
    { rating: '5⭐', count: data.filter(d => d.rating === 5).length }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={distribution} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="rating" style={{ fontSize: '12px', fontWeight: '600' }} />
        <YAxis style={{ fontSize: '12px' }} />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="count" 
          stroke="#f59e0b" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorCount)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// 4. Timeline des avis (Line Chart)
export const TimelineChart = ({ data }) => {
  // Grouper par date
  const timelineData = data.reduce((acc, item) => {
    const date = new Date(item.timestamp).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
    const existing = acc.find(d => d.date === date);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ date, count: 1 });
    }
    return acc;
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="date" 
          style={{ fontSize: '11px' }}
          angle={-30}
          textAnchor="end"
          height={60}
        />
        <YAxis style={{ fontSize: '12px' }} />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke="url(#colorLine)" 
          strokeWidth={3}
          dot={{ fill: '#8b5cf6', r: 5 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// 5. Top Produits (Bar Chart horizontal)
export const TopProductsChart = ({ data }) => {
  const topData = [...data]
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
    .reverse(); // Pour afficher du haut en bas

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart 
        data={topData} 
        layout="vertical"
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorTopProducts" x1="0" y1="0" x2="1" y2="0">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.7}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" style={{ fontSize: '12px' }} />
        <YAxis 
          type="category" 
          dataKey="product" 
          width={95}
          style={{ fontSize: '11px', fontWeight: '500' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="count" 
          fill="url(#colorTopProducts)" 
          radius={[0, 10, 10, 0]}
          maxBarSize={30}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};