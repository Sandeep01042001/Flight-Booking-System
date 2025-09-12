import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { getAuthToken, refreshAuthToken, isAuthenticated } from './auth';
import tokenManager from './tokenManager';

// Request queue for handling token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Create axios instance with base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
  withCredentials: true, // Important for sending cookies with cross-origin requests
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  async (config) => {
    // Skip token check for auth endpoints
    if (config.url.includes('/auth/')) {
      return config;
    }

    // Get a valid token (will refresh if needed)
    try {
      const token = await tokenManager.getValidToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting valid token:', error);
      // Don't block the request, it will fail with 401 if not authenticated
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timed out. Please check your connection and try again.');
      return Promise.reject(new Error('Request timeout'));
    }

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // If this is a login request, just reject it
      if (originalRequest.url.includes('/auth/login') || 
          originalRequest.url.includes('/auth/refresh-token')) {
        return Promise.reject(error);
      }

      // If we've already retried, reject
      if (originalRequest._retry) {
        // Clear auth data and redirect to login
        if (isAuthenticated()) {
          toast.error('Your session has expired. Please log in again.');
          // Clear auth data and redirect to login
          clearAuthData();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const newToken = await refreshAuthToken();
        if (newToken) {
          // Update the Authorization header with the new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          // Retry the original request with the new token
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear auth data and redirect to login
        if (isAuthenticated()) {
          toast.error('Your session has expired. Please log in again.');
          clearAuthData();
          window.location.href = '/login';
        }
        console.error('Token refresh failed:', refreshError);
        clearAuthData();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Convert Axios error to our custom ApiError
    return Promise.reject(ApiError.fromAxiosError(error));
  }
);

/**
 * Make an API request with retry logic
 * @param {Object} config - Axios request config
 * @param {number} [retries=2] - Number of retry attempts
 * @param {number} [backoff=300] - Initial backoff time in ms
 * @returns {Promise} Promise that resolves with the response data
 */
const apiRequest = async (config, retries = 2, backoff = 300) => {
  try {
    // Add request timestamp for tracking
    const requestStartTime = Date.now();
    
    const response = await api({
      ...config,
      timeout: config.timeout || 30000,
      headers: {
        'X-Request-ID': generateRequestId(),
        ...config.headers,
      },
    });
    
    // Log successful request
    logRequest({
      method: config.method || 'GET',
      url: config.url,
      status: response.status,
      duration: Date.now() - requestStartTime,
    });
    
    return response.data;
  } catch (error) {
    // Log failed request
    logError({
      method: config.method || 'GET',
      url: config.url,
      error: error.message,
      status: error.response?.status,
    });
    
    // Handle rate limiting (429)
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 5;
      toast.error(`Too many requests. Please try again in ${retryAfter} seconds.`);
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
      return apiRequest(config, retries, backoff);
    }
    
    // Handle server errors with retry
    if (isRetryableError(error) && retries > 0) {
      // Exponential backoff with jitter
      const jitter = Math.random() * 100; // 0-100ms jitter
      await new Promise(resolve => setTimeout(resolve, backoff + jitter));
      return apiRequest(config, retries - 1, Math.min(backoff * 2, 10000)); // Max 10s backoff
    }
    
    handleApiError(error);
    throw error;
  }
};

// Generate a unique request ID
const generateRequestId = () => {
  return 'req_' + Math.random().toString(36).substr(2, 9);
};

// Log request details
const logRequest = ({ method, url, status, duration }) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API] ${method} ${url} - ${status} (${duration}ms)`);
  }
  // TODO: Add analytics/error tracking integration
};

// Log error details
const logError = ({ method, url, error, status }) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[API Error] ${method} ${url} - ${status}: ${error}`);
  }
  // TODO: Add error tracking integration (e.g., Sentry, LogRocket)
};

/**
 * Check if an error is retryable
 * @param {Error} error - The error to check
 * @returns {boolean} True if the error is retryable
 */
const isRetryableError = (error) => {
  // Don't retry if it's not an API error or if it's a 4xx error (except 429)
  if (!(error instanceof ApiError) || (error.statusCode >= 400 && error.statusCode < 500 && error.statusCode !== 429)) {
    return false;
  }
  
  // Don't retry on these HTTP methods
  const nonIdempotentMethods = ['POST', 'PATCH', 'PUT', 'DELETE'];
  if (error.config && nonIdempotentMethods.includes(error.config.method?.toUpperCase())) {
    return false;
  }
  
  return true;
};

/**
 * Handle API errors and show appropriate user feedback
 * @param {Error} error - The error to handle
 */
const handleApiError = (error) => {
  if (error instanceof ApiError) {
    // Show error message to user
    const errorMessage = error.details?.message || error.message;
    
    // Don't show toast for 401 errors (handled by interceptor)
    if (error.statusCode === 401) return;
    
    // Show appropriate error message based on error type
    switch (error.statusCode) {
      case 400:
        toast({
          title: 'Error',
          description: errorMessage || 'Invalid request. Please check your input.',
          variant: 'destructive',
        });
        break;
      case 403:
        toast({
          title: 'Error',
          description: 'You do not have permission to perform this action.',
          variant: 'destructive',
        });
        break;
      case 404:
        toast({
          title: 'Error',
          description: 'The requested resource was not found.',
          variant: 'destructive',
        });
        break;
      case 409:
        toast({
          title: 'Error',
          description: 'This resource already exists.',
          variant: 'destructive',
        });
        break;
      case 422:
        // Show error toast for client-side errors
        if (error.response?.status >= 400 && error.response?.status < 500) {
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
        } else if (error.response?.status >= 500) {
          // Server error
          toast({
            title: 'Error',
            description: 'Server error. Please try again later.',
            variant: 'destructive',
          });
        } else {
          // Network error or other issues
          toast({
            title: 'Error',
            description: 'Network error. Please check your connection.',
            variant: 'destructive',
          });
        }
        break;
      case 429:
        toast({
          title: 'Error',
          description: 'Too many requests. Please try again later.',
          variant: 'destructive',
        });
        break;
      case 500:
      default:
        toast({
          title: 'Error',
          description: 'An unexpected error occurred. Please try again later.',
          variant: 'destructive',
        });
        toast({
          title: 'Error',
          description: 'An unexpected error occurred. Please try again later.',
          variant: 'destructive',
        });
        console.error('API Error:', error);
        break;
    }
  } else {
    // Handle non-API errors
    console.error('Unexpected Error:', error);
    toast({
      title: 'Error',
      description: 'An unexpected error occurred. Please try again.',
      variant: 'destructive',
    });
  }
};

// Helper methods for common HTTP methods
const http = {
  get: (url, config = {}) => apiRequest({ ...config, method: 'GET', url }),
  post: (url, data, config = {}) => apiRequest({ ...config, method: 'POST', url, data }),
  put: (url, data, config = {}) => apiRequest({ ...config, method: 'PUT', url, data }),
  patch: (url, data, config = {}) => apiRequest({ ...config, method: 'PATCH', url, data }),
  delete: (url, config = {}) => apiRequest({ ...config, method: 'DELETE', url }),
  request: (config) => apiRequest(config),
};

export { http as default, api, handleApiError, isRetryableError };
