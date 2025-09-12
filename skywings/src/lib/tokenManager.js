import storage from './storage';
import http from './apiRequest';

// Token storage keys
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';
const USER_KEY = 'user_data';

// Request queue for token refresh
let refreshPromise = null;
const requestQueue = [];

// Token expiry buffer (in seconds) - refresh token before it expires
const TOKEN_EXPIRY_BUFFER = 300; // 5 minutes

/**
 * Token Manager - Handles authentication tokens with automatic refresh
 */
const tokenManager = {
  /**
   * Set authentication tokens and user data
   * @param {Object} data - Auth response data
   * @param {string} data.token - Access token
   * @param {string} data.refreshToken - Refresh token
   * @param {number} [data.expiresIn] - Token expiry in seconds
   * @param {Object} [data.user] - User data
   */
  setAuthData({ token, refreshToken, expiresIn, user }) {
    if (token) {
      storage.set(TOKEN_KEY, token);
      
      // Calculate and store token expiry time if expiresIn is provided
      if (expiresIn) {
        const expiryTime = Date.now() + (expiresIn * 1000);
        storage.set(TOKEN_EXPIRY_KEY, expiryTime);
      }
    }
    
    if (refreshToken) {
      storage.set(REFRESH_TOKEN_KEY, refreshToken);
    }
    
    if (user) {
      storage.set(USER_KEY, user);
    }
  },
  
  /**
   * Get the current access token
   * @returns {string|null} The access token or null if not found
   */
  getToken() {
    return storage.get(TOKEN_KEY);
  },
  
  /**
   * Get the refresh token
   * @returns {string|null} The refresh token or null if not found
   */
  getRefreshToken() {
    return storage.get(REFRESH_TOKEN_KEY);
  },
  
  /**
   * Get the current user data
   * @returns {Object|null} The user data or null if not found
   */
  getUser() {
    return storage.get(USER_KEY);
  },
  
  /**
   * Check if the current token is expired or about to expire
   * @returns {boolean} True if token is expired or about to expire
   */
  isTokenExpired() {
    const expiryTime = storage.get(TOKEN_EXPIRY_KEY);
    if (!expiryTime) return true; // No expiry time means token is invalid
    
    const currentTime = Date.now();
    return currentTime >= (expiryTime - (TOKEN_EXPIRY_BUFFER * 1000));
  },
  
  /**
   * Check if the user is authenticated
   * @returns {boolean} True if user has a valid token
   */
  isAuthenticated() {
    return !!this.getToken() && !this.isTokenExpired();
  },
  
  /**
   * Process the request queue with a new token
   * @param {string} token - The new access token
   */
  processQueue(token) {
    requestQueue.forEach(({ resolve }) => resolve(token));
    requestQueue.length = 0;
  },

  /**
   * Add request to queue
   * @returns {Promise<string>} Promise that resolves with a valid token
   */
  addToQueue() {
    return new Promise((resolve) => {
      requestQueue.push({ resolve });
    });
  },

  /**
   * Refresh the access token using the refresh token with queue support
   * @returns {Promise<string>} The new access token
   */
  async refreshToken() {
    // If there's already a refresh in progress, return its promise
    if (refreshPromise) {
      return refreshPromise;
    }

    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Create a new promise for the refresh operation
      refreshPromise = http.post('/auth/refresh-token', { refreshToken })
        .then(({ data }) => {
          this.setAuthData({
            token: data.token,
            refreshToken: data.refreshToken,
            expiresIn: data.expiresIn,
            user: data.user
          });
          this.processQueue(data.token);
          return data.token;
        })
        .catch((error) => {
          console.error('Token refresh failed:', error);
          this.clearAuthData();
          // Reject all queued requests
          requestQueue.forEach(({ reject }) => reject(error));
          requestQueue.length = 0;
          throw error;
        })
        .finally(() => {
          refreshPromise = null;
        });

      return refreshPromise;
    } catch (error) {
      refreshPromise = null;
      throw error;
    }
  },

  /**
   * Get a valid token, refreshing if necessary
   * @returns {Promise<string>} A valid access token
   */
  async getValidToken() {
    // If we're already refreshing, add to queue
    if (refreshPromise) {
      return this.addToQueue();
    }

    // If token is valid, return it
    if (!this.isTokenExpired()) {
      return this.getToken();
    }

    // Otherwise, refresh the token
    return this.refreshToken();
  },
  
  /**
   * Clear all authentication data and reject any pending requests
   */
  clearAuthData() {
    storage.remove(TOKEN_KEY);
    storage.remove(REFRESH_TOKEN_KEY);
    storage.remove(TOKEN_EXPIRY_KEY);
    storage.remove(USER_KEY);
    
    // Reject all queued requests
    if (requestQueue.length > 0) {
      const error = new Error('Authentication required');
      requestQueue.forEach(({ reject }) => reject(error));
      requestQueue.length = 0;
    }
  },
  
  /**
   * Initialize token refresh interval
   * @param {number} [interval=300000] - Check interval in milliseconds (default: 5 minutes)
   * @returns {Function} Function to clear the interval
   */
  initTokenRefresh(interval = 300000) {
    const checkAndRefresh = async () => {
      if (this.isTokenExpired()) {
        await this.refreshToken();
      }
    };
    
    // Initial check
    checkAndRefresh();
    
    // Set up interval for periodic checks
    const refreshInterval = setInterval(checkAndRefresh, interval);
    
    // Return cleanup function
    return () => clearInterval(refreshInterval);
  },
};

export default tokenManager;
