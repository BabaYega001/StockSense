import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const auth = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (email, password, full_name) => apiClient.post('/auth/register', { email, password, full_name }),
  me: () => apiClient.get('/auth/me'),
  updateMe: (data) => apiClient.patch('/auth/me', data),
  demo: () => apiClient.post('/auth/demo'),
};

// Market
export const market = {
  quote: (symbol) => apiClient.get('/market/quote', { params: { symbol, fresh: 1 } }).then(res => res.data),
  search: (q) => apiClient.get('/market/search', { params: { q } }).then(res => res.data)
};

// Entities
export const entities = {
  Portfolio: {
    list: () => apiClient.get('/portfolio'),
    create: (data) => apiClient.post('/portfolio', data),
    update: (id, data) => apiClient.patch(`/portfolio/${id}`, data),
    delete: (id) => apiClient.delete(`/portfolio/${id}`),
  },
  Trade: {
    list: () => apiClient.get('/trades'),
    create: (data) => apiClient.post('/trades', data),
  },
  Goal: {
    list: () => apiClient.get('/goals'),
    create: (data) => apiClient.post('/goals', data),
    update: (id, data) => apiClient.patch(`/goals/${id}`, data),
    delete: (id) => apiClient.delete(`/goals/${id}`),
  },
  Watchlist: {
    list: () => apiClient.get('/watchlist'),
    create: (data) => apiClient.post('/watchlist', data),
    delete: (id) => apiClient.delete(`/watchlist/${id}`),
  },
  Prediction: {
    list: () => apiClient.get('/predictions'),
    create: (data) => apiClient.post('/predictions', data),
    delete: (id) => apiClient.delete(`/predictions/${id}`),
  },
};

// OpenAI Integration
export const InvokeLLM = async ({ prompt, add_context_from_internet, response_json_schema }) => {
  const response = await apiClient.post('/ai/invoke', {
    prompt,
    add_context_from_internet,
    response_json_schema
  });
  return response.data;
};
