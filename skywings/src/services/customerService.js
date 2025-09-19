import BaseService from './baseService';
import api from './apiClient';

class CustomerService extends BaseService {
  constructor() {
    super('users');
  }

  async getCustomerProfile(userId) {
    try {
      return await this.getById(userId);
    } catch (error) {
      console.error('Error fetching customer profile:', error);
      throw error;
    }
  }

  async updateProfile(userId, profileData) {
    try {
      return await this.update(userId, profileData);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  async getCustomerBookings(userId) {
    try {
      return await api.get(`/bookings?userId=${userId}&_expand=flight`);
    } catch (error) {
      console.error('Error fetching customer bookings:', error);
      throw error;
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      return await api.post(`/users/${userId}/change-password`, {
        currentPassword,
        newPassword
      });
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
}

export default new CustomerService();
