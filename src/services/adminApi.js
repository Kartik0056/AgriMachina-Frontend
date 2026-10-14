import axios from 'axios';

const adminBaseURL = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api/admin`
  : (import.meta.env.PROD ? 'https://agrimachina-backend.onrender.com/api/admin' : '/api/admin');

const adminApi = axios.create({
  baseURL: adminBaseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach Bearer token if stored in localStorage
adminApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle session invalidation
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and broadcast logout
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    }
    return Promise.reject(error);
  }
);

export default adminApi;
