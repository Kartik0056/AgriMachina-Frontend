import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL
  || (import.meta.env.PROD ? 'https://agrimachina-backend.onrender.com/api' : '/api');

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('user_token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiry gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token was invalid or expired on an authenticated route
      const isAuthRoute = error.config?.url?.includes('/users/login') || error.config?.url?.includes('/users/register');
      if (!isAuthRoute && typeof window !== 'undefined' && localStorage.getItem('user_token')) {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_data');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
