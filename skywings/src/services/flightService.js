import BaseService from './baseService';
import api from './apiClient';

class FlightService extends BaseService {
  constructor() {
    super('flights');
  }

  // Override to support fetching by flight number (e.g., "SW967") when using mock JSON server
  async getById(idOrNumber) {
    try {
      const isNumeric = /^\d+$/.test(String(idOrNumber));
      if (isNumeric) {
        return await super.getById(idOrNumber);
      }
      // Lookup by flightNumber on mock API
      const results = await api.get(`/${this.endpoint}`, { params: { flightNumber: idOrNumber } });
      if (Array.isArray(results) && results.length > 0) {
        return results[0];
      }
      throw new Error(`Flight not found for flightNumber ${idOrNumber}`);
    } catch (error) {
      console.error(`Error fetching ${this.endpoint} ${idOrNumber}:`, error);
      throw error;
    }
  }

  async searchFlights(params = {}) {
    try {
      return await api.get(`/${this.endpoint}/search`, { params });
    } catch (error) {
      console.error('Error searching flights:', error);
      throw error;
    }
  }

  async getFlightWithDetails(flightId) {
    try {
      const flight = await this.getById(flightId);
      const [airline, origin, destination] = await Promise.all([
        api.get(`/airlines/${flight.airlineId}`),
        api.get(`/airports/${flight.departureAirportId}`),
        api.get(`/airports/${flight.arrivalAirportId}`)
      ]);
      
      return {
        ...flight,
        airline,
        departureAirport: origin,
        arrivalAirport: destination
      };
    } catch (error) {
      console.error('Error fetching flight details:', error);
      throw error;
    }
  }

  async getAvailableSeats(flightId) {
    try {
      // Try to fetch the flight; if not found (e.g., random ID from mock UI), fall back to default
      let flight;
      try {
        flight = await this.getById(flightId);
      } catch (_) {
        flight = null;
      }

      // Build a mock seat list compatible with SeatSelection expectations
      // 20 rows x 6 seats (A-F). Mark a subset as available based on availableSeats count or default 60
      const rows = 20;
      const seatsPerRow = 6;
      const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
      const totalSeats = rows * seatsPerRow; // 120
      const availableCount = Math.min(
        Math.max(1, Number(flight?.availableSeats || 60)),
        totalSeats
      );

      // Create list of all seat IDs
      const allSeatIds = [];
      for (let r = 1; r <= rows; r++) {
        for (let i = 0; i < seatsPerRow; i++) {
          allSeatIds.push(`${r}${seatLetters[i]}`);
        }
      }

      // Randomly pick availableCount seats
      const availableSet = new Set();
      while (availableSet.size < availableCount) {
        const idx = Math.floor(Math.random() * allSeatIds.length);
        availableSet.add(allSeatIds[idx]);
      }

      // Return array in the shape SeatSelection expects: [{ seatNumber: '1A' }, ...]
      return Array.from(availableSet).map((s) => ({ seatNumber: s }));
    } catch (error) {
      console.error('Error fetching available seats:', error);
      throw error;
    }
  }
}

export default new FlightService();
