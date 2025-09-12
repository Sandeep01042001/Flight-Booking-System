import apiClient from './apiClient';

const PAYMENT_API_BASE_URL = import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:8084';

// Process a payment
export const processPayment = async (paymentData) => {
  try {
    const response = await apiClient.post(
      `${PAYMENT_API_BASE_URL}/api/v1/payments/process`,
      paymentData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get payment details by ID
export const getPaymentById = async (paymentId) => {
  try {
    const response = await apiClient.get(`${PAYMENT_API_BASE_URL}/api/v1/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Refund a payment
export const refundPayment = async (paymentId, amount) => {
  try {
    const response = await apiClient.post(
      `${PAYMENT_API_BASE_URL}/api/v1/payments/${paymentId}/refund`,
      { amount }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get payment methods
export const getPaymentMethods = async () => {
  try {
    const response = await apiClient.get(`${PAYMENT_API_BASE_URL}/api/v1/payments/methods`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Save payment method for future use
export const savePaymentMethod = async (paymentMethodData) => {
  try {
    const response = await apiClient.post(
      `${PAYMENT_API_BASE_URL}/api/v1/payments/methods`,
      paymentMethodData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
