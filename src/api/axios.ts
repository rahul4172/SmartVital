import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const API_URL = import.meta.env.VITE_API_URL || 'https://smartvital-backend.onrender.com';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for sending/receiving httpOnly refresh cookies
});

// Request interceptor: attach memory access token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401, we haven't retried yet, and it's not an auth endpoint
    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/signup');
    
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token using httpOnly cookie
        const response = await axios.post(`${API_URL}/auth/refresh`, {}, {
          withCredentials: true 
        });
        
        const { access_token } = response.data;
        
        // Update Zustand store
        useAuthStore.setState({ accessToken: access_token });
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // If refresh fails, clear auth state
        useAuthStore.getState().clearAuth();
        // Redirect will be handled by ProtectedRoute component
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
