import apiClient from './apiClient';

const BOOKING_API_BASE_URL = import.meta.env.VITE_BOOKING_SERVICE_URL || 'http://localhost:8083';

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const response = await apiClient.post(
      `${BOOKING_API_BASE_URL}/api/v1/bookings`,
      bookingData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get booking by ID
export const getBookingById = async (bookingId) => {
  try {
    const response = await apiClient.get(`${BOOKING_API_BASE_URL}/api/v1/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user's booking history
export const getUserBookings = async (userId) => {
  try {
    const response = await apiClient.get(
      `${BOOKING_API_BASE_URL}/api/v1/bookings/user/${userId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId) => {
  try {
    const response = await apiClient.patch(
      `${BOOKING_API_BASE_URL}/api/v1/bookings/${bookingId}/cancel`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Check in for a flight
export const checkIn = async (bookingId, seatNumber) => {
  try {
    const response = await apiClient.post(
      `${BOOKING_API_BASE_URL}/api/v1/bookings/${bookingId}/check-in`,
      { seatNumber }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get booking by PNR
export const getBookingByPnr = async (pnr) => {
  try {
    const response = await apiClient.get(
      `${BOOKING_API_BASE_URL}/api/v1/bookings/pnr/${pnr}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
