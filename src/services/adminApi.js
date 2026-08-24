import axios from 'axios';

const adminApi = axios.create({
  baseURL: '/api/admin',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach Bearer token if stored in localStorage
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle session invalidation
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and broadcast logout
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
    return Promise.reject(error);
  }
);

export default adminApi;
