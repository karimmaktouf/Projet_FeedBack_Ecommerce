import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token admin aux requêtes protégées
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token && (
    config.url.includes('/analytics') || 
    config.url.includes('/rag/search')
  )) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================
// API PUBLIQUE (Clients)
// ============================================

export const feedbackAPI = {
  // ✅ Route correcte : /api/feedback (pas /feedback/submit)
  submitFeedback: async (feedbackData) => {
    const response = await api.post('/feedback', feedbackData);
    return response.data;
  },
};

// ============================================
// API PROTÉGÉE (Admin uniquement)
// ============================================

export const analyticsAPI = {
  // ✅ Route correcte : /api/analytics
  getStats: async () => {
    const response = await api.get('/analytics');
    return response.data;
  },
  
  // ✅ Route correcte : /api/analytics/charts
  getChartData: async () => {
    const response = await api.get('/analytics/charts');
    return response.data;
  },
};

export const ragAPI = {
  // ✅ Route correcte : /api/rag/search
  search: async (query) => {
    const response = await api.post('/rag/search', { query });
    return response.data;
  },
};

// ============================================
// API ADMIN (Authentification)
// ============================================

export const adminAPI = {
  login: async (credentials) => {
    const response = await api.post('/admin/login', credentials);
    return response.data;
  },
  
  verify: async (token) => {
    const response = await api.get('/admin/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;