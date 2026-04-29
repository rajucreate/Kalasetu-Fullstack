import axios from 'axios';
import { storage } from '../utils/storage';
import { emitGlobalError, normalizeApiError } from '../services/errorService';

const API_BASE = import.meta.env.VITE_API_URL || 'https://kalasetu-01fa.onrender.com/api';

// Create axios instance
const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor - add token to headers
client.interceptors.request.use(
  (config) => {
    const token = storage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url || '';
    const isAuthEndpoint = ['/auth/login/', '/auth/register/', '/auth/refresh/'].some((path) =>
      requestUrl.includes(path)
    );

    // Let auth endpoint errors pass through unchanged (e.g. invalid login credentials).
    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (status !== 401 && status !== 403) {
      emitGlobalError(normalizeApiError(error));
      return Promise.reject(error);
    }

    // If 401 and not already retried, try to refresh token
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return client(originalRequest);
          })
          .catch((refreshError) => Promise.reject(refreshError));
      }

      isRefreshing = true;

      try {
        const refreshToken = storage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_BASE}/auth/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        storage.setAccessToken(access);

        processQueue(null, access);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear tokens and redirect to login
        storage.clearAuth();
        emitGlobalError('Your session has expired. Please sign in again.');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 403) {
      emitGlobalError('You do not have permission to perform this action.');
    }

    return Promise.reject(error);
  }
);

export default client;
