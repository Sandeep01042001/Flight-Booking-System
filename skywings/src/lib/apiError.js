/**
 * Custom API Error class
 * Extends the built-in Error class to include HTTP status codes and additional context
 */
class ApiError extends Error {
  /**
   * Create a new API error
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {Object} [details] - Additional error details
   * @param {string} [code] - Error code for programmatic handling
   */
  constructor(message, statusCode, details = {}, code) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode || 500;
    this.details = details;
    this.code = code || 'API_ERROR';
    
    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a bad request error (400)
   * @param {string} message - Error message
   * @param {Object} [details] - Additional error details
   * @returns {ApiError}
   */
  static badRequest(message = 'Bad Request', details = {}) {
    return new ApiError(message, 400, details, 'BAD_REQUEST');
  }

  /**
   * Create an unauthorized error (401)
   * @param {string} message - Error message
   * @param {Object} [details] - Additional error details
   * @returns {ApiError}
   */
  static unauthorized(message = 'Unauthorized', details = {}) {
    return new ApiError(message, 401, details, 'UNAUTHORIZED');
  }

  /**
   * Create a forbidden error (403)
   * @param {string} message - Error message
   * @param {Object} [details] - Additional error details
   * @returns {ApiError}
   */
  static forbidden(message = 'Forbidden', details = {}) {
    return new ApiError(message, 403, details, 'FORBIDDEN');
  }

  /**
   * Create a not found error (404)
   * @param {string} message - Error message
   * @param {Object} [details] - Additional error details
   * @returns {ApiError}
   */
  static notFound(message = 'Not Found', details = {}) {
    return new ApiError(message, 404, details, 'NOT_FOUND');
  }

  /**
   * Create a conflict error (409)
   * @param {string} message - Error message
   * @param {Object} [details] - Additional error details
   * @returns {ApiError}
   */
  static conflict(message = 'Conflict', details = {}) {
    return new ApiError(message, 409, details, 'CONFLICT');
  }

  /**
   * Create a validation error (422)
   * @param {string} message - Error message
   * @param {Object} [details] - Validation errors (e.g., field-specific errors)
   * @returns {ApiError}
   */
  static validationError(message = 'Validation Error', details = {}) {
    return new ApiError(message, 422, details, 'VALIDATION_ERROR');
  }

  /**
   * Create a too many requests error (429)
   * @param {string} message - Error message
   * @param {Object} [details] - Additional error details
   * @param {number} [retryAfter] - Number of seconds to wait before retrying
   * @returns {ApiError}
   */
  static tooManyRequests(message = 'Too Many Requests', details = {}, retryAfter) {
    const headers = {};
    if (retryAfter) {
      headers['Retry-After'] = retryAfter;
    }
    return new ApiError(message, 429, { ...details, headers }, 'TOO_MANY_REQUESTS');
  }

  /**
   * Create an internal server error (500)
   * @param {string} message - Error message
   * @param {Object} [details] - Additional error details
   * @returns {ApiError}
   */
  static internal(message = 'Internal Server Error', details = {}) {
    return new ApiError(message, 500, details, 'INTERNAL_SERVER_ERROR');
  }

  /**
   * Create an error from an Axios error response
   * @param {import('axios').AxiosError} error - Axios error object
   * @returns {ApiError}
   */
  static fromAxiosError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      const message = data?.message || error.message || 'Request failed';
      const details = {
        ...data,
        statusCode: status,
        url: error.config?.url,
        method: error.config?.method,
      };

      switch (status) {
        case 400:
          return ApiError.badRequest(message, details);
        case 401:
          return ApiError.unauthorized(message, details);
        case 403:
          return ApiError.forbidden(message, details);
        case 404:
          return ApiError.notFound(message, details);
        case 409:
          return ApiError.conflict(message, details);
        case 422:
          return ApiError.validationError(message, details);
        case 429:
          const retryAfter = error.response.headers?.['retry-after'];
          return ApiError.tooManyRequests(message, details, retryAfter);
        default:
          return new ApiError(
            message,
            status,
            details,
            data?.code || 'API_ERROR'
          );
      }
    } else if (error.request) {
      // The request was made but no response was received
      return new ApiError(
        'No response received from server',
        0,
        {
          code: 'NO_RESPONSE',
          url: error.config?.url,
          method: error.config?.method,
        },
        'NETWORK_ERROR'
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      return new ApiError(
        error.message || 'Error setting up request',
        0,
        {
          code: 'REQUEST_SETUP_ERROR',
          url: error.config?.url,
          method: error.config?.method,
        },
        'REQUEST_ERROR'
      );
    }
  }

  /**
   * Convert error to a plain object for API responses
   * @returns {Object} Plain object representation of the error
   */
  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      code: this.code,
      ...(Object.keys(this.details).length > 0 && { details: this.details }),
    };
  }
}

export default ApiError;
