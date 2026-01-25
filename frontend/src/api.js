/**
 * Axios instance for API calls
 */
import axios from 'axios';

// Determine base URL priority (no forced localhost fallback in production):
// 1. Explicit VITE_API_URL env var (if provided)
// 2. Current window.location.origin + /api
//    This prevents accidental use of localhost after deployment if stale bundle cached.
const deriveBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (envUrl) return envUrl.replace(/\/$/, '');
  return `${window.location.origin}/api`;
};

const baseURL = deriveBaseURL();

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Debug log (will be stripped in production minification but helpful if visible)
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log('[API] Using baseURL:', baseURL);
}

// Add token to requests if available (as Authorization header)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(`[API] Token attached to ${config.method?.toUpperCase()} ${config.url}`);
    }
  } else if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn(`[API] No token found for ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error information
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('[API] Error Response:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
      });
    }
    
    if (error.response?.status === 401 || error.response?.status === 422) {
      // Token expired or invalid - clear it and reload
      // eslint-disable-next-line no-console
      console.warn('[API] Authentication failed (401/422) - clearing token and redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('is_superuser');
      localStorage.removeItem('username');
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
