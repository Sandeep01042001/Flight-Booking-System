import apiClient from './apiClient';
import { trackEvent } from '../utils/analytics';

const FLIGHT_API_BASE_URL = import.meta.env.VITE_FLIGHT_SERVICE_URL || 'http://localhost:8082';

// Mock data for development
const MOCK_CITIES = [
  { id: 1, code: 'DEL', name: 'Delhi', country: 'India' },
  { id: 2, code: 'BOM', name: 'Mumbai', country: 'India' },
  { id: 3, code: 'BLR', name: 'Bangalore', country: 'India' },
  { id: 4, code: 'MAA', name: 'Chennai', country: 'India' },
  { id: 5, code: 'HYD', name: 'Hyderabad', country: 'India' },
  { id: 6, code: 'CCU', name: 'Kolkata', country: 'India' },
  { id: 7, code: 'GOI', name: 'Goa', country: 'India' },
  { id: 8, code: 'PNQ', name: 'Pune', country: 'India' },
  { id: 9, code: 'JAI', name: 'Jaipur', country: 'India' },
  { id: 10, code: 'COK', name: 'Kochi', country: 'India' },
];

/**
 * Search for available flights
 * @param {Object} searchParams - Search parameters
 * @param {string} searchParams.from - Origin airport code
 * @param {string} searchParams.to - Destination airport code
 * @param {string} searchParams.departureDate - Departure date in YYYY-MM-DD format
 * @param {string} [searchParams.returnDate] - Return date in YYYY-MM-DD format (for round trips)
 * @param {number} [searchParams.passengers=1] - Number of passengers
 * @param {string} [searchParams.class='economy'] - Travel class
 * @returns {Promise<Array>} List of available flights
 */
const searchFlights = async (searchParams) => {
  try {
    trackEvent('flight_search', { ...searchParams });
    
    // In development, always return mock data
    if (import.meta.env.DEV) {
      console.log('Using mock flight data');
      return generateMockFlights(searchParams);
    }
    
    const response = await apiClient.get(`${FLIGHT_API_BASE_URL}/api/v1/flights/search`, {
      params: searchParams,
    });
    
    return response.data;
  } catch (error) {
    trackEvent('flight_search_error', { 
      error: error.message,
      params: searchParams 
    });
    
    // In case of error, return mock data in development
    if (import.meta.env.DEV) {
      console.warn('API Error, falling back to mock data:', error.message);
      return generateMockFlights(searchParams);
    }
    
    throw error.response?.data || error.message;
  }
};

/**
 * Get list of cities with airports
 * @returns {Promise<Array>} List of cities with airport codes
 */
const getCities = async () => {
  try {
    // In development, always return mock data
    if (import.meta.env.DEV) {
      console.log('Using mock cities data');
      return MOCK_CITIES;
    }
    
    const response = await apiClient.get(`${FLIGHT_API_BASE_URL}/api/v1/cities`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    // In production, return empty array if API fails
    if (!import.meta.env.DEV) {
      return [];
    }
    return MOCK_CITIES;
  }
};

/**
 * Get popular flight routes
 * @returns {Promise<Array>} List of popular routes
 */
const getPopularRoutes = async () => {
  try {
    // In development, return mock data if API is not available
    if (import.meta.env.DEV && !import.meta.env.VITE_FLIGHT_API_URL) {
      return [
        { from: 'DEL', to: 'BOM', price: 3499, popularity: 95 },
        { from: 'BOM', to: 'BLR', price: 2999, popularity: 90 },
        { from: 'DEL', to: 'MAA', price: 5499, popularity: 85 },
        { from: 'BLR', to: 'DEL', price: 4999, popularity: 82 },
        { from: 'BOM', to: 'GOI', price: 2499, popularity: 80 },
      ];
    }
    
    const response = await apiClient.get(`${FLIGHT_API_BASE_URL}/api/v1/routes/popular`);
    return response.data;
  } catch (error) {
    // In case of error, return mock data in development
    if (import.meta.env.DEV) {
      return [
        { from: 'DEL', to: 'BOM', price: 3499, popularity: 95 },
        { from: 'BOM', to: 'BLR', price: 2999, popularity: 90 },
        { from: 'DEL', to: 'MAA', price: 5499, popularity: 85 },
        { from: 'BLR', to: 'DEL', price: 4999, popularity: 82 },
        { from: 'BOM', to: 'GOI', price: 2499, popularity: 80 },
      ];
    }
    
    throw error.response?.data || error.message;
  }
};

// Helper function to generate mock flight data for development
const generateMockFlights = (searchParams) => {
  const { from, to, departureDate, returnDate, passengers = 1, travelClass = 'economy' } = searchParams;
  const now = new Date();
  
  // Generate 5-10 random flights
  const flightCount = 5 + Math.floor(Math.random() * 5);
  const flights = [];
  
  // Get city names for display
  const originCity = MOCK_CITIES.find(city => city.code === from)?.name || from;
  const destCity = MOCK_CITIES.find(city => city.code === to)?.name || to;
  
  for (let i = 0; i < flightCount; i++) {
    // Generate random departure time (today + 1-30 days)
    const daysToAdd = 1 + Math.floor(Math.random() * 30);
    const departureDate = new Date(now);
    departureDate.setDate(now.getDate() + daysToAdd);
    
    // Generate random flight duration (1-6 hours)
    const durationHours = 1 + Math.floor(Math.random() * 5);
    const durationMinutes = Math.floor(Math.random() * 60);
    
    // Generate random price based on class and duration
    let basePrice = 2000 + (Math.random() * 10000);
    if (travelClass === 'business') basePrice *= 2.5;
    if (travelClass === 'first') basePrice *= 4;
    
    // Round price to nearest 100
    const price = Math.round(basePrice / 100) * 100;
    
    flights.push({
      id: `FL${1000 + i}`,
      airline: ['IndiGo', 'Air India', 'Vistara', 'SpiceJet', 'AirAsia'][Math.floor(Math.random() * 5)],
      flightNumber: `${['6E', 'AI', 'UK', 'SG', 'I5'][Math.floor(Math.random() * 5)]}${100 + Math.floor(Math.random() * 900)}`,
      from,
      to,
      origin: originCity,
      destination: destCity,
      departureTime: departureDate.toISOString(),
      arrivalTime: new Date(departureDate.getTime() + (durationHours * 60 + durationMinutes) * 60000).toISOString(),
      duration: `${durationHours}h ${durationMinutes}m`,
      price,
      seatsAvailable: 5 + Math.floor(Math.random() * 50),
      stops: Math.random() > 0.7 ? 1 : 0,
      aircraft: 'Boeing 737',
      baggage: {
        cabin: '7 kg',
        checkIn: '15 kg',
      },
      fareType: 'Refundable',
      // Add more details as needed
    });
  }
  
  // Sort flights by price
  return flights.sort((a, b) => a.price - b.price);
};

// Get flight details by ID
const getFlightById = async (flightId) => {
  try {
    const response = await apiClient.get(`${FLIGHT_API_BASE_URL}/api/v1/flights/${flightId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get available seats for a flight
const getAvailableSeats = async (flightId) => {
  try {
    const response = await apiClient.get(
      `${FLIGHT_API_BASE_URL}/api/v1/flights/${flightId}/seats/available`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get flight schedule
const getFlightSchedule = async (airlineId, date) => {
  try {
    const response = await apiClient.get(
      `${FLIGHT_API_BASE_URL}/api/v1/flights/schedule`,
      {
        params: {
          airlineId,
          date,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Export all functions as named exports
export {
  searchFlights,
  getCities,
  getPopularRoutes,
  getFlightById,
  getAvailableSeats,
  getFlightSchedule,
  generateMockFlights
};
