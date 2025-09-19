import BaseService from './baseService';
import api from './apiClient';

class BookingService extends BaseService {
  constructor() {
    super('bookings');
  }

  async createBooking(bookingData) {
    try {
      // First, check flight availability
      const flight = await api.get(`/flights/${bookingData.flightId}`);
      
      if (flight.availableSeats < bookingData.passengers.length) {
        throw new Error('Not enough seats available');
      }

      // Calculate total amount
      const totalAmount = flight.price * bookingData.passengers.length;
      
      // Create booking
      const booking = await this.create({
        ...bookingData,
        totalAmount,
        status: 'confirmed',
        bookingDate: new Date().toISOString(),
        paymentStatus: 'pending'
      });

      // Update available seats
      await api.patch(`/flights/${bookingData.flightId}`, {
        availableSeats: flight.availableSeats - bookingData.passengers.length
      });

      return booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async cancelBooking(bookingId) {
    try {
      const booking = await this.getById(bookingId);
      
      // Update booking status
      await this.update(bookingId, {
        status: 'cancelled',
        cancellationDate: new Date().toISOString()
      });

      // Return seats to available pool
      const flight = await api.get(`/flights/${booking.flightId}`);
      await api.patch(`/flights/${booking.flightId}`, {
        availableSeats: flight.availableSeats + booking.passengers.length
      });

      return { success: true };
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  async getBookingDetails(bookingId) {
    try {
      const booking = await this.getById(bookingId);
      const flight = await api.get(`/flights/${booking.flightId}`);
      const airline = await api.get(`/airlines/${flight.airlineId}`);
      
      return {
        ...booking,
        flight: {
          ...flight,
          airline
        }
      };
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error;
    }
  }

  async getBookingsByUser(userId, params = {}) {
    try {
      return await api.get(`/bookings?userId=${userId}`, { 
        params,
        _expand: ['flight', 'user']
      });
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }
}

export default new BookingService();
