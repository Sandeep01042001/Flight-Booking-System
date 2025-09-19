import api from './apiClient';

class BaseService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  // Create
  async create(data) {
    try {
      return await api.post(`/${this.endpoint}`, data);
    } catch (error) {
      console.error(`Error creating ${this.endpoint}:`, error);
      throw error;
    }
  }

  // Read (all)
  async getAll(params = {}) {
    try {
      return await api.get(`/${this.endpoint}`, { params });
    } catch (error) {
      console.error(`Error fetching ${this.endpoint}:`, error);
      throw error;
    }
  }

  // Read (single)
  async getById(id) {
    try {
      return await api.get(`/${this.endpoint}/${id}`);
    } catch (error) {
      console.error(`Error fetching ${this.endpoint} ${id}:`, error);
      throw error;
    }
  }

  // Update
  async update(id, data) {
    try {
      return await api.put(`/${this.endpoint}/${id}`, data);
    } catch (error) {
      console.error(`Error updating ${this.endpoint} ${id}:`, error);
      throw error;
    }
  }

  // Delete
  async delete(id) {
    try {
      return await api.delete(`/${this.endpoint}/${id}`);
    } catch (error) {
      console.error(`Error deleting ${this.endpoint} ${id}:`, error);
      throw error;
    }
  }
}

export default BaseService;
