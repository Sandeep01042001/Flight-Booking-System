// Mock data for flights
const airports = [
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA', timezone: 'America/New_York' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'UK', timezone: 'Europe/London' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', timezone: 'Europe/Paris' },
  { code: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  { code: 'SYD', name: 'Sydney Airport', city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney' },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai' },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles' },
];

const airlines = [
  { code: 'SW', name: 'Skywings', logo: '/logos/skywings.png' },
  { code: 'AA', name: 'American Airlines', logo: '/logos/american.png' },
  { code: 'BA', name: 'British Airways', logo: '/logos/british-airways.png' },
  { code: 'AF', name: 'Air France', logo: '/logos/airfrance.png' },
  { code: 'JL', name: 'Japan Airlines', logo: '/logos/jal.png' },
  { code: 'EK', name: 'Emirates', logo: '/logos/emirates.png' },
  { code: 'SQ', name: 'Singapore Airlines', logo: '/logos/singapore-airlines.png' },
];

// Generate random flight numbers
const generateFlightNumber = (airlineCode) => {
  return `${airlineCode}${Math.floor(100 + Math.random() * 900)}`;
};

// Generate random price based on class and distance
const generatePrice = (cabinClass, distance) => {
  const basePrice = distance * 0.12; // Base price per mile
  const classMultiplier = {
    economy: 1,
    premium: 1.5,
    business: 2.5,
    first: 4,
  };
  
  const price = basePrice * classMultiplier[cabinClass];
  // Add some random variation
  const variation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
  return Math.round(price * variation / 10) * 10; // Round to nearest 10
};

// Generate random flights
const generateFlights = (from, to, date, count = 5) => {
  const fromAirport = airports.find(a => a.code === from);
  const toAirport = airports.find(a => a.code === to);
  
  if (!fromAirport || !toAirport) {
    return [];
  }
  
  // Simple distance calculation (not accurate, just for demo)
  const distance = Math.floor(Math.hypot(
    (fromAirport.lat || 0) - (toAirport.lat || 0),
    (fromAirport.lng || 0) - (toAirport.lng || 0)
  ) * 100) || 1000;
  
  const flights = [];
  const departureDate = new Date(date);
  
  for (let i = 0; i < count; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const flightNumber = generateFlightNumber(airline.code);
    const departureTime = new Date(departureDate);
    departureTime.setHours(6 + Math.floor(Math.random() * 12));
    departureTime.setMinutes(Math.floor(Math.random() * 12) * 5);
    
    const durationMinutes = Math.floor(distance / 8 + Math.random() * 60);
    const arrivalTime = new Date(departureTime.getTime() + durationMinutes * 60000);
    
    const cabinClasses = ['economy', 'premium', 'business', 'first'];
    const availableClasses = cabinClasses
      .filter(() => Math.random() > 0.3) // 70% chance for each class to be available
      .map(cls => ({
        class: cls,
        price: generatePrice(cls, distance),
        availableSeats: Math.floor(Math.random() * 20) + 5,
      }));
    
    flights.push({
      id: `FL${1000 + i}`,
      flightNumber,
      airline,
      from: fromAirport,
      to: toAirport,
      departureTime: departureTime.toISOString(),
      arrivalTime: arrivalTime.toISOString(),
      duration: durationMinutes,
      distance,
      availableClasses,
      aircraft: {
        model: 'Boeing 787-9',
        registration: `N${Math.floor(1000 + Math.random() * 9000)}SW`,
        seats: 290,
      },
    });
  }
  
  return flights;
};

// Mock API functions
const mockApi = {
  // Search for flights
  searchFlights: async (params) => {
    const { from, to, date } = params;
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    const flights = generateFlights(from, to, date, 10);
    
    return {
      success: true,
      data: {
        flights,
        from,
        to,
        date,
        totalResults: flights.length,
      },
    };
  },
  
  // Get flight details
  getFlightDetails: async (flightId) => {
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
    
    // In a real app, we'd look up the flight by ID
    // For demo, we'll just generate a random flight
    const fromAirport = airports[Math.floor(Math.random() * airports.length)];
    let toAirport;
    do {
      toAirport = airports[Math.floor(Math.random() * airports.length)];
    } while (toAirport.code === fromAirport.code);
    
    const flight = generateFlights(fromAirport.code, toAirport.code, new Date().toISOString().split('T')[0], 1)[0];
    flight.id = flightId;
    
    return {
      success: true,
      data: flight,
    };
  },
  
  // Book a flight
  bookFlight: async (bookingData) => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const bookingId = `BK${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    
    return {
      success: true,
      data: {
        bookingId,
        status: 'confirmed',
        bookingDate: now.toISOString(),
        passengers: bookingData.passengers,
        flight: bookingData.flight,
        totalPrice: bookingData.totalPrice,
        paymentStatus: 'paid',
        pnr: `${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      },
    };
  },
  
  // Get user's bookings
  getBookings: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
    
    // Generate some random bookings for the user
    const bookings = [];
    const count = Math.floor(Math.random() * 3) + 1; // 1-3 bookings
    
    for (let i = 0; i < count; i++) {
      const fromAirport = airports[Math.floor(Math.random() * airports.length)];
      let toAirport;
      do {
        toAirport = airports[Math.floor(Math.random() * airports.length)];
      } while (toAirport.code === fromAirport.code);
      
      const flightDate = new Date();
      flightDate.setDate(flightDate.getDate() + Math.floor(Math.random() * 30));
      
      const flight = generateFlights(fromAirport.code, toAirport.code, flightDate.toISOString().split('T')[0], 1)[0];
      
      bookings.push({
        id: `BK${100000 + i}`,
        status: ['confirmed', 'pending', 'cancelled'][Math.floor(Math.random() * 3)],
        bookingDate: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
        passengers: [
          { name: 'John Doe', type: 'adult' },
          ...(Math.random() > 0.5 ? [{ name: 'Jane Doe', type: 'adult' }] : []),
        ],
        flight,
        cabinClass: ['economy', 'premium', 'business', 'first'][Math.floor(Math.random() * 4)],
        totalPrice: 100 + Math.floor(Math.random() * 1000),
        paymentStatus: 'paid',
        pnr: `${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      });
    }
    
    return {
      success: true,
      data: bookings,
    };
  },
  
  // Get booking details
  getBookingDetails: async (bookingId) => {
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
    
    // In a real app, we'd look up the booking by ID
    // For demo, we'll just return a random booking
    const bookings = await mockApi.getBookings('user123');
    const booking = bookings.data[0];
    booking.id = bookingId;
    
    return {
      success: true,
      data: booking,
    };
  },
  
  // Cancel booking
  cancelBooking: async (bookingId) => {
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
    
    return {
      success: true,
      data: {
        bookingId,
        status: 'cancelled',
        refundAmount: Math.floor(Math.random() * 500) + 100,
        message: 'Booking has been cancelled successfully',
      },
    };
  },
};

export default mockApi;
