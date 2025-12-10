import axios from 'axios';

// Get API base URL from environment variable
// Fallback to localhost:5000 if not set
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

console.log('🌐 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(request => {
  console.log('🚀 API Request:', request.method, request.url);
  return request;
});

// Response interceptor for debugging
api.interceptors.response.use(response => {
  console.log('✅ API Response:', response.status, response.config.url);
  return response;
}, error => {
  console.error('❌ API Error:', {
    url: error.config?.url,
    status: error.response?.status,
    message: error.message
  });
  return Promise.reject(error);
});

export const todoApi = {
  // Get todos with pagination
  getTodos: (page = 1, limit = 10, status = '') => {
    const params = { page, limit };
    if (status) params.status = status;
    return api.get('/todos', { params });
  },

  // Get single todo
  getTodo: (id) => api.get(`/todos/${id}`),

  // Create todo
  createTodo: (todoData) => api.post('/todos', todoData),

  // Update todo
  updateTodo: (id, todoData) => api.put(`/todos/${id}`, todoData),

  // Delete todo
  deleteTodo: (id) => {
    console.log('🗑️ Deleting todo with ID:', id);
    return api.delete(`/todos/${id}`);
  },

  // Get stats
  getStats: () => api.get('/todos/stats'),
};