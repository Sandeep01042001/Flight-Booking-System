import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  ClockIcon, 
  MapPinIcon, 
  UserIcon, 
  CheckCircleIcon, 
  CurrencyDollarIcon,
  ShieldCheckIcon,
  TicketIcon,
  CalendarIcon,
  ClockIcon as ClockIconSolid,
  ArrowPathIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  MapIcon,
  WifiIcon,
  TvIcon,
  CakeIcon,
  ShoppingBagIcon,
  BriefcaseIcon,
  CreditCardIcon,
  BanknotesIcon,
  QrCodeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { format, addHours, differenceInMinutes, parseISO } from 'date-fns';
import { showError } from '../../components/common/ToastHandler';
import Button from '../../components/ui/buttons/Button';
import Card from '../../components/common/Card';
import { Tabs } from '../../components/ui/Tabs';
import useAuth from '../../hooks/useAuth';

const FlightDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  // Removed selectedTab state as it's now managed by the Tabs component
  const [passengerCount, setPassengerCount] = useState(1);
  const [selectedFare, setSelectedFare] = useState('economy');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Mock flight data - in a real app, this would come from an API
  const mockFlight = {
    id: id || 'FL123',
    airline: 'SkyWings',
    flightNumber: 'SW' + Math.floor(100 + Math.random() * 900),
    aircraft: 'Boeing 737-800',
    departure: {
      airport: 'JFK',
      city: 'New York',
      terminal: '4',
      gate: 'B12',
      time: '2023-11-15T14:30:00',
    },
    arrival: {
      airport: 'LAX',
      city: 'Los Angeles',
      terminal: '5',
      gate: 'A7',
      time: '2023-11-15T18:15:00',
    },
    duration: 225, // in minutes
    price: {
      economy: 299,
      premiumEconomy: 499,
      business: 899,
      first: 1499,
    },
    availableSeats: {
      economy: 45,
      premiumEconomy: 24,
      business: 12,
      first: 4,
    },
    amenities: [
      { id: 'wifi', name: 'WiFi Available', icon: WifiIcon },
      { id: 'entertainment', name: 'In-flight Entertainment', icon: TvIcon },
      { id: 'food', name: 'Meal Included', icon: CakeIcon },
      { id: 'luggage', name: 'Free Checked Bag', icon: ShoppingBagIcon },
    ],
    cancellationPolicy: 'Free cancellation up to 24 hours before departure',
    baggageAllowance: {
      cabin: '1 x 7kg',
      checked: '2 x 23kg',
    },
  };

  useEffect(() => {
    // Simulate API call
    const fetchFlightDetails = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch this data from your API
        // const response = await fetch(`/api/flights/${flightId}`);
        // const data = await response.json();
        // setFlight(data);
        
        // Using mock data for now
        setTimeout(() => {
          setFlight(mockFlight);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching flight details:', error);
        showError('Failed to load flight details');
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [id]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    navigate(`/flights/${id}/seats`, {
      state: {
        passengers: passengerCount,
        fare: selectedFare,
        // Do not pass full flight object (contains React icons). SeatSelection fetches by id.
      },
    });
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    handleBookNow();
  };

  const formatTime = (dateString) => {
    return format(parseISO(dateString), 'h:mm a');
  };

  const formatDate = (dateString) => {
    return format(parseISO(dateString), 'EEE, MMM d, yyyy');
  };

  const getDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Flight Not Found</h2>
        <p className="text-gray-600 mb-6">We couldn't find the flight you're looking for.</p>
        <Button as={Link} to="/flights" variant="primary">
          Search Flights
        </Button>
      </div>
    );
  }

  const fareTypes = [
    { id: 'economy', name: 'Economy', price: flight.price.economy },
    { id: 'premiumEconomy', name: 'Premium Economy', price: flight.price.premiumEconomy },
    { id: 'business', name: 'Business', price: flight.price.business },
    { id: 'first', name: 'First Class', price: flight.price.first },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button
          variant="text"
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Search Results
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Flight Summary Card */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {flight.departure.city} to {flight.arrival.city}
                  </h1>
                  <p className="text-gray-500">
                    {formatDate(flight.departure.time)} • {getDuration(flight.duration)} • {flight.aircraft}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    {flight.availableSeats[selectedFare]} seats left
                  </span>
                </div>
              </div>

              {/* Flight Itinerary */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Flight Itinerary</h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formatTime(flight.departure.time)}</div>
                      <div className="text-sm text-gray-500">{formatDate(flight.departure.time)}</div>
                      <div className="mt-1 font-medium">{flight.departure.airport}</div>
                      <div className="text-sm text-gray-500">{flight.departure.city}</div>
                      <div className="mt-1 text-sm">
                        Terminal {flight.departure.terminal} • Gate {flight.departure.gate}
                      </div>
                    </div>

                    <div className="flex-1 px-4">
                      <div className="relative">
                        <div className="h-1 bg-gray-200 rounded-full">
                          <div className="h-1 bg-indigo-600 rounded-full w-3/4"></div>
                        </div>
                        <div className="absolute -top-2 left-0 w-4 h-4 bg-indigo-600 rounded-full"></div>
                        <div className="absolute -top-2 right-0 w-4 h-4 bg-indigo-600 rounded-full"></div>
                      </div>
                      <div className="mt-2 text-center text-sm text-gray-500">
                        {getDuration(flight.duration)}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold">{formatTime(flight.arrival.time)}</div>
                      <div className="text-sm text-gray-500">{formatDate(flight.arrival.time)}</div>
                      <div className="mt-1 font-medium">{flight.arrival.airport}</div>
                      <div className="text-sm text-gray-500">{flight.arrival.city}</div>
                      <div className="mt-1 text-sm">
                        Terminal {flight.arrival.terminal} • Gate {flight.arrival.gate}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flight Details Tabs */}
              <div className="mt-6">
                <Tabs
                  tabs={[
                    { id: 'overview', name: 'Flight Overview' },
                    { id: 'amenities', name: 'Amenities' },
                    { id: 'baggage', name: 'Baggage' },
                    { id: 'policies', name: 'Policies' },
                    { id: 'reviews', name: 'Reviews' }
                  ]}
                  defaultTab="overview"
                >
                  <Tabs.Panel id="overview">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Flight {flight.flightNumber}</h3>
                    <p className="text-gray-600">
                      Operated by {flight.airline} • {flight.aircraft}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Departure</h4>
                        <div className="flex items-center text-gray-600">
                          <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                          <span>{formatDate(flight.departure.time)}</span>
                        </div>
                        <div className="flex items-center mt-1 text-gray-600">
                          <ClockIconSolid className="h-5 w-5 mr-2 text-gray-400" />
                          <span>{formatTime(flight.departure.time)}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          {flight.departure.city} ({flight.departure.airport}) • Terminal {flight.departure.terminal}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Arrival</h4>
                        <div className="flex items-center text-gray-600">
                          <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                          <span>{formatDate(flight.arrival.time)}</span>
                        </div>
                        <div className="flex items-center mt-1 text-gray-600">
                          <ClockIconSolid className="h-5 w-5 mr-2 text-gray-400" />
                          <span>{formatTime(flight.arrival.time)}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          {flight.arrival.city} ({flight.arrival.airport}) • Terminal {flight.arrival.terminal}
                        </div>
                      </div>
                    </div>
                  </div>
                </Tabs.Panel>

                <Tabs.Panel id="amenities">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Flight Amenities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {flight.amenities.map((amenity) => {
                        const Icon = amenity.icon;
                        return (
                          <div key={amenity.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
                            <Icon className="h-6 w-6 text-indigo-600 mr-3" />
                            <span className="text-sm text-gray-700">{amenity.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Tabs.Panel>

                <Tabs.Panel id="baggage">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Baggage Allowance</h3>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Cabin Baggage</h4>
                          <p className="text-gray-600">{flight.baggageAllowance.cabin}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Checked Baggage</h4>
                          <p className="text-gray-600">{flight.baggageAllowance.checked}</p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-gray-500">
                        Additional baggage can be purchased during check-in or at the airport.
                      </p>
                    </div>
                  </div>
                </Tabs.Panel>

                <Tabs.Panel id="reviews">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Customer Reviews</h3>
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <p className="text-gray-600 text-center py-8">
                        No reviews yet. Be the first to review this flight!
                      </p>
                    </div>
                  </div>
                </Tabs.Panel>
                </Tabs>
              </div>
            </div>
          </Card>
        </div>
        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Trip</h2>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Passengers</h3>
                  <div className="flex items-center">
                    <button 
                      onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                      className="p-1 rounded-full hover:bg-gray-100"
                      disabled={passengerCount <= 1}
                    >
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="mx-2 w-8 text-center">{passengerCount}</span>
                    <button 
                      onClick={() => setPassengerCount(passengerCount + 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                      disabled={passengerCount >= 9}
                    >
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-medium mb-2">Fare Type</h3>
                  <div className="space-y-2">
                    {fareTypes.map((fare) => (
                      <div 
                        key={fare.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedFare === fare.id 
                            ? 'border-indigo-600 bg-indigo-50' 
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                        onClick={() => setSelectedFare(fare.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{fare.name}</div>
                            <div className="text-sm text-gray-500">
                              {flight.availableSeats[fare.id]} seats left
                            </div>
                          </div>
                          <div className="text-lg font-semibold">
                            ${fare.price}
                            <span className="text-sm font-normal text-gray-500">/person</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Fare ({passengerCount} {passengerCount > 1 ? 'persons' : 'person'})</span>
                    <span className="font-medium">${flight.price[selectedFare] * passengerCount}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-medium">${Math.round(flight.price[selectedFare] * 0.15 * passengerCount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-200">
                    <span>Total</span>
                    <span>${Math.round(flight.price[selectedFare] * 1.15 * passengerCount)}</span>
                  </div>
                </div>
              </div>

              <Button 
                variant="primary" 
                className="w-full justify-center py-3 text-lg"
                onClick={handleBookNow}
              >
                Book Now
              </Button>

              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Free cancellation up to 24 hours before departure</p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-medium mb-3">Secure Payment</h3>
                <div className="flex space-x-2 justify-center">
                  <div className="p-2 bg-gray-100 rounded">
                    <CreditCardIcon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="p-2 bg-gray-100 rounded">
                    <BanknotesIcon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="p-2 bg-gray-100 rounded">
                    <QrCodeIcon className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-center text-green-600 text-sm">
                  <ShieldCheckIcon className="h-5 w-5 mr-1" />
                  <span>Secure SSL Encryption</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Sign In Required</h2>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Please sign in to continue with your booking. Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 hover:underline">
                Sign up
              </Link>
            </p>
            <div className="space-y-4">
              <Button 
                as={Link}
                to="/login"
                variant="primary"
                className="w-full justify-center"
                state={{ from: `/flights/${id}/seats` }}
              >
                Sign In
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-center"
                onClick={() => setShowLoginModal(false)}
              >
                Continue as Guest
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightDetails;
