import axios from 'axios';

// Create axios instance with base URL from environment variable
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // 15 seconds
  withCredentials: true,
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      
      // Handle specific status codes
      if (status === 401) {
        // Handle unauthorized access
        const currentPath = window.location.pathname;
        if (!['/login', '/register'].includes(currentPath)) {
          localStorage.removeItem('authToken');
          // Store the current path to redirect back after login
          sessionStorage.setItem('redirectAfterLogin', currentPath);
          window.location.href = '/login';
        }
      }
      
      // Create a clean error object with only necessary information
      const apiError = {
        status,
        message: data?.message || 'An error occurred',
        errors: data?.errors || {},
        code: data?.code || 'unknown_error',
      };
      
      return Promise.reject(apiError);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Request Error:', error.request);
      return Promise.reject({
        status: 0,
        message: 'No response from server. Please check your connection.',
        code: 'network_error',
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
      return Promise.reject({
        status: 0,
        message: error.message || 'An unexpected error occurred',
        code: 'request_error',
      });
    }
  }
);

// Export the Axios instance as the default export so callers can use apiClient.get/post/etc.
export default apiClient;

// Optional named helpers (if needed elsewhere); safe to keep for future use
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
  delete apiClient.defaults.headers.common['Authorization'];
};
