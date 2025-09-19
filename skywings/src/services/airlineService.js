import BaseService from './baseService';
import api from './apiClient';

class AirlineService extends BaseService {
  constructor() {
    super('airlines');
  }

  // Flights Management
  async getFlights(airlineId, params = {}) {
    try {
      return await api.get(`/airlines/${airlineId}/flights`, { params });
    } catch (error) {
      console.error('Error fetching flights:', error);
      throw error;
    }
  }

  async getFlight(airlineId, flightId) {
    try {
      return await api.get(`/airlines/${airlineId}/flights/${flightId}`);
    } catch (error) {
      console.error('Error fetching flight:', error);
      throw error;
    }
  }

  async createFlight(airlineId, flightData) {
    try {
      return await api.post(`/airlines/${airlineId}/flights`, flightData);
    } catch (error) {
      console.error('Error creating flight:', error);
      throw error;
    }
  }

  async updateFlight(airlineId, flightId, flightData) {
    try {
      return await api.put(`/airlines/${airlineId}/flights/${flightId}`, flightData);
    } catch (error) {
      console.error('Error updating flight:', error);
      throw error;
    }
  }

  async deleteFlight(airlineId, flightId) {
    try {
      await api.delete(`/airlines/${airlineId}/flights/${flightId}`);
      return true;
    } catch (error) {
      console.error('Error deleting flight:', error);
      throw error;
    }
  }

  // Aircraft Management
  async getAircrafts(airlineId) {
    try {
      return await api.get(`/airlines/${airlineId}/aircrafts`);
    } catch (error) {
      console.error('Error fetching aircrafts:', error);
      throw error;
    }
  }

  async manageAircraft(airlineId, aircraftData, aircraftId = null) {
    try {
      if (aircraftId) {
        return await api.put(`/airlines/${airlineId}/aircrafts/${aircraftId}`, aircraftData);
      } else {
        return await api.post(`/airlines/${airlineId}/aircrafts`, aircraftData);
      }
    } catch (error) {
      console.error('Error managing aircraft:', error);
      throw error;
    }
  }

  async deleteAircraft(airlineId, aircraftId) {
    try {
      await api.delete(`/airlines/${airlineId}/aircrafts/${aircraftId}`);
      return true;
    } catch (error) {
      console.error('Error deleting aircraft:', error);
      throw error;
    }
  }

  // Employee Management
  async getEmployees(airlineId) {
    try {
      return await api.get(`/airlines/${airlineId}/employees`);
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  }

  async manageEmployee(airlineId, employeeData, employeeId = null) {
    try {
      if (employeeId) {
        return await api.put(`/airlines/${airlineId}/employees/${employeeId}`, employeeData);
      } else {
        return await api.post(`/airlines/${airlineId}/employees`, employeeData);
      }
    } catch (error) {
      console.error('Error managing employee:', error);
      throw error;
    }
  }

  async updateEmployeeStatus(airlineId, employeeId, status) {
    try {
      return await api.patch(`/airlines/${airlineId}/employees/${employeeId}/status`, { status });
    } catch (error) {
      console.error('Error updating employee status:', error);
      throw error;
    }
  }

  // Flight Assignments
  async getFlightAssignments(airlineId, flightId = null) {
    try {
      const url = flightId 
        ? `/airlines/${airlineId}/flights/${flightId}/assignments`
        : `/airlines/${airlineId}/assignments`;
      return await api.get(url);
    } catch (error) {
      console.error('Error fetching flight assignments:', error);
      throw error;
    }
  }

  async assignCrew(airlineId, flightId, assignments) {
    try {
      return await api.post(`/airlines/${airlineId}/flights/${flightId}/assign`, { assignments });
    } catch (error) {
      console.error('Error assigning crew:', error);
      throw error;
    }
  }

  // Dashboard Stats
  async getDashboardStats(airlineId) {
    try {
      return await api.get(`/airlines/${airlineId}/dashboard/stats`);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
}

export default new AirlineService();
