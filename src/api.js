import axios from 'axios';


const API_URL = 'https://backend-7eck.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

/**
 * Global Request Interceptor
 * Automatically attaches the JWT to the header of every outgoing request.
 * This is critical for maintaining Role-Based Access Control (RBAC).
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Matches the 'x-auth-token' expected by your backend middleware
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default api;