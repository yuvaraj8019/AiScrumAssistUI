import axios from 'axios';

// Create generic axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Simple global error logging
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
