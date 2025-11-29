import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const feedbackAPI = {
  submitFeedback: async (feedbackData) => {
    const response = await api.post('/feedback/submit', feedbackData);
    return response.data;
  },
};

export const analyticsAPI = {
  getStats: async () => {
    const response = await api.get('/analytics/stats');
    return response.data;
  },
  
  getAllFeedbacks: async () => {
    const response = await api.get('/analytics/feedbacks');
    return response.data;
  },
};

export const ragAPI = {
  search: async (query) => {
    const response = await api.post('/rag/search', { query });
    return response.data;
  },
};

export default api;