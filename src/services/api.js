import axios from 'axios';

// Get API base URL from environment variable
// Fallback to localhost:3000/api if not set (CHANGED FROM 5000)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

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
    message: error.message,
    data: error.response?.data
  });
  return Promise.reject(error);
});

export const todoApi = {
  // Get todos with pagination and filters
  getTodos: (params = {}) => {
    // Default parameters
    const defaultParams = { 
      page: 1, 
      limit: 10, 
      status: '',
      sortBy: 'createdAt',
      order: 'desc'
    };
    
    const queryParams = { ...defaultParams, ...params };
    // Remove empty status from params
    if (!queryParams.status) delete queryParams.status;
    
    return api.get('/todos', { params: queryParams });
  },

  // Get single todo
  getTodo: (id) => api.get(`/todos/${id}`),

  // Create todo
  createTodo: (todoData) => {
    // Ensure deadline is properly formatted if provided
    if (todoData.deadline && typeof todoData.deadline === 'string') {
      // Convert to ISO string if it's not already
      try {
        const date = new Date(todoData.deadline);
        if (!isNaN(date.getTime())) {
          todoData.deadline = date.toISOString();
        }
      } catch (e) {
        console.warn('Could not parse deadline date:', e);
      }
    }
    
    return api.post('/todos', todoData);
  },

  // Update todo
  updateTodo: (id, todoData) => api.put(`/todos/${id}`, todoData),

  // Delete todo
  deleteTodo: (id) => {
    console.log('🗑️ Deleting todo with ID:', id);
    return api.delete(`/todos/${id}`);
  },

  // Get stats
  getStats: () => api.get('/todos/stats'),
  
  // Test API connection
  testConnection: () => api.get('/'),
};