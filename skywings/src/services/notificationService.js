import apiClient from './apiClient';

const NOTIFICATION_API_BASE_URL = import.meta.env.VITE_NOTIFICATION_SERVICE_URL || 'http://localhost:8087';

// Get user notifications
export const getUserNotifications = async (userId, limit = 10) => {
  try {
    const response = await apiClient.get(
      `${NOTIFICATION_API_BASE_URL}/api/v1/notifications/user/${userId}`,
      { params: { limit } }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Mark notification as read
export const markAsRead = async (notificationId) => {
  try {
    const response = await apiClient.patch(
      `${NOTIFICATION_API_BASE_URL}/api/v1/notifications/${notificationId}/read`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Mark all notifications as read
export const markAllAsRead = async (userId) => {
  try {
    const response = await apiClient.patch(
      `${NOTIFICATION_API_BASE_URL}/api/v1/notifications/user/${userId}/mark-all-read`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get unread notification count
export const getUnreadCount = async (userId) => {
  try {
    const response = await apiClient.get(
      `${NOTIFICATION_API_BASE_URL}/api/v1/notifications/user/${userId}/unread-count`
    );
    return response.data.count;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Subscribe to push notifications
export const subscribeToPushNotifications = async (subscriptionData) => {
  try {
    const response = await apiClient.post(
      `${NOTIFICATION_API_BASE_URL}/api/v1/notifications/subscribe`,
      subscriptionData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
