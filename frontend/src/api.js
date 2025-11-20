/**
 * Axios instance for API calls
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available (as Authorization header)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 422 || error.response?.status === 500) {
      // Token expired or invalid - clear it and reload
      localStorage.removeItem('token');
      if (window.location.pathname === '/admin') {
        window.location.reload();
      } else {
        window.location.href = '/admin';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
