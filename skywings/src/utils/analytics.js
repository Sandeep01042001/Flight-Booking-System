/**
 * Analytics utility for tracking events in the application
 * This provides a centralized way to track user interactions and application events
 */

/**
 * Track an analytics event
 * @param {string} event - The name of the event to track
 * @param {Object} [properties] - Additional properties to include with the event
 */
export const trackEvent = (event, properties = {}) => {
  if (process.env.NODE_ENV === 'development') {
    // Log events in development for debugging
    console.log(`[Analytics] ${event}`, properties);
  }

  // TODO: Integrate with analytics services (e.g., Google Analytics, Mixpanel, etc.)
  // This is a placeholder for actual analytics integration
  try {
    // Example integration with window.gtag (Google Analytics 4)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, {
        ...properties,
        app_name: 'SkyWings',
        timestamp: new Date().toISOString(),
      });
    }
    
    // Example integration with Mixpanel
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track(event, properties);
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

/**
 * Track page views
 * @param {string} path - The current path
 * @param {string} title - The page title
 * @param {Object} [properties] - Additional properties to include
 */
export const trackPageView = (path, title, properties = {}) => {
  trackEvent('page_view', {
    path,
    title,
    ...properties,
  });
};

/**
 * Track authentication events
 * @param {string} eventType - The type of auth event (e.g., 'login', 'logout', 'signup')
 * @param {Object} [properties] - Additional properties
 */
export const trackAuthEvent = (eventType, properties = {}) => {
  trackEvent(`auth_${eventType}`, properties);
};

/**
 * Track errors
 * @param {Error} error - The error that occurred
 * @param {Object} [context] - Additional context about where the error occurred
 */
export const trackError = (error, context = {}) => {
  trackEvent('error', {
    name: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    ...context,
  });
};

/**
 * Track API request events
 * @param {string} endpoint - The API endpoint
 * @param {string} method - The HTTP method
 * @param {number} status - The HTTP status code
 * @param {Object} [properties] - Additional properties
 */
export const trackApiRequest = (endpoint, method, status, properties = {}) => {
  trackEvent('api_request', {
    endpoint,
    method,
    status,
    isError: status >= 400,
    ...properties,
  });
};

/**
 * Track performance metrics
 * @param {string} metricName - The name of the performance metric
 * @param {number} value - The value of the metric
 * @param {Object} [properties] - Additional properties
 */
export const trackPerformance = (metricName, value, properties = {}) => {
  trackEvent('performance_metric', {
    metric_name: metricName,
    value,
    unit: 'ms',
    ...properties,
  });
};

export default {
  trackEvent,
  trackPageView,
  trackAuthEvent,
  trackError,
  trackApiRequest,
  trackPerformance,
};
