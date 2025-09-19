import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { format, parseISO, differenceInMinutes, addMinutes } from 'date-fns';
import { ArrowLeftIcon, UserIcon, ClockIcon, MapPinIcon, TicketIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';

const FlightDetails = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passengerCount, setPassengerCount] = useState(location.state?.searchParams?.passengers || 1);

  useEffect(() => {
    const loadDetails = () => {
      try {
        setLoading(true);
        // If flight was passed from search, use it directly (no API)
        if (location.state?.flight) {
          setFlight(location.state.flight);
          return;
        }
        // Fallback: build a minimal mock flight from the ID
        const now = new Date();
        const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);
        const mock = {
          id: flightId,
          flightNumber: flightId,
          origin: { code: 'JFK', city: 'New York', name: 'John F. Kennedy International Airport', country: 'USA' },
          destination: { code: 'LHR', city: 'London', name: 'Heathrow Airport', country: 'UK' },
          departureTime: now.toISOString(),
          arrivalTime: threeHoursLater.toISOString(),
          price: 199,
          availableSeats: 60,
          airline: { name: 'Skywings' },
          aircraft: 'Boeing 737-800',
        };
        setFlight(mock);
      } catch (err) {
        console.error('Error preparing flight details:', err);
        setError('Failed to load flight details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flightId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleContinue = () => {
    navigate(`/flights/${flightId}/seats`, {
      state: {
        searchParams: {
          ...location.state?.searchParams,
          passengers: passengerCount,
        },
        flight,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Flight not found</h3>
        <p className="mt-1 text-sm text-gray-500">The requested flight could not be found.</p>
        <Button variant="outline" className="mt-4" onClick={handleBack}>
          <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Search
        </Button>
      </div>
    );
  }

  const departureTime = parseISO(flight.departureTime);
  const arrivalTime = parseISO(flight.arrivalTime);
  const duration = differenceInMinutes(arrivalTime, departureTime);
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1920&auto=format&fit=crop"
          alt="Airplane wing over clouds"
          className="w-full h-56 md:h-72 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="absolute inset-0 flex items-end md:items-center justify-center md:justify-between px-4 md:px-8">
          <div className="text-center md:text-left text-white py-4">
            <h1 className="text-2xl md:text-4xl font-extrabold">
              {flight.origin?.city} ({flight.origin?.code}) → {flight.destination?.city} ({flight.destination?.code})
            </h1>
            <p className="mt-1 text-indigo-100">
              {format(departureTime, 'EEE, MMM d, yyyy')} • {flight.airline?.name} {flight.flightNumber}
            </p>
          </div>
          <div className="hidden md:flex space-x-3 pb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm">
              <ClockIcon className="h-4 w-4 mr-1" /> {hours}h {minutes}m
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm">
              <UserIcon className="h-4 w-4 mr-1" /> {passengerCount} pax
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-10 md:-mt-12">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBack} className="flex items-center text-gray-600">
            <ArrowLeftIcon className="h-5 w-5 mr-1" /> Back to Results
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur rounded-xl shadow-md ring-1 ring-gray-100 overflow-hidden">
              <div className="p-6">
                {/* Itinerary timeline */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex-1">
                    <div className="text-3xl font-bold text-gray-900">{format(departureTime, 'h:mm a')}</div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <MapPinIcon className="h-4 w-4 mr-1" /> {flight.origin?.name}
                    </div>
                    <div className="text-xs text-gray-500">{flight.origin?.city}, {flight.origin?.country}</div>
                  </div>
                  <div className="my-6 md:my-0 flex flex-col items-center flex-1 w-full px-4">
                    <div className="relative w-full h-2">
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-gray-300" />
                      <div className="absolute top-1/2 -translate-y-1/2 left-2 w-2 h-2 bg-indigo-600 rounded-full" />
                      <div className="absolute top-1/2 -translate-y-1/2 right-2 w-2 h-2 bg-indigo-600 rounded-full" />
                    </div>
                    <div className="text-xs text-gray-500 mt-2 flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" /> {hours}h {minutes}m • Non-stop
                    </div>
                  </div>
                  <div className="flex-1 text-right">
                    <div className="text-3xl font-bold text-gray-900">{format(arrivalTime, 'h:mm a')}</div>
                    <div className="text-sm text-gray-500 flex items-center justify-end mt-1">
                      <MapPinIcon className="h-4 w-4 mr-1" /> {flight.destination?.name}
                    </div>
                    <div className="text-xs text-gray-500">{flight.destination?.city}, {flight.destination?.country}</div>
                  </div>
                </div>

                {/* Info cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <UserIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="font-medium text-gray-900">Passengers</h3>
                    </div>
                    <select
                      value={passengerCount}
                      onChange={(e) => setPassengerCount(parseInt(e.target.value))}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      {[1,2,3,4,5,6,7,8,9].map((num) => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                      ))}
                    </select>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <h3 className="font-medium text-gray-900">Fare Summary</h3>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between"><span>Base Fare (x{passengerCount})</span><span>${(flight.price * passengerCount).toFixed(2)}</span></div>
                      <div className="flex justify-between"><span>Taxes & Fees</span><span>$0.00</span></div>
                      <div className="border-t border-gray-200 my-2" />
                      <div className="flex justify-between font-medium text-gray-900"><span>Total</span><span>${(flight.price * passengerCount).toFixed(2)}</span></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="bg-purple-100 p-2 rounded-full mr-3">
                        <TicketIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <h3 className="font-medium text-gray-900">Flight Details</h3>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between"><span>Flight Number:</span><span className="font-medium">{flight.flightNumber}</span></div>
                      <div className="flex justify-between"><span>Aircraft:</span><span className="font-medium">{flight.aircraft || 'Boeing 737'}</span></div>
                      <div className="flex justify-between"><span>Travel Class:</span><span className="font-medium">Economy</span></div>
                      <div className="flex justify-between"><span>Available Seats:</span><span className="font-medium">{flight.availableSeats}</span></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-500">Price shown is per traveler. Taxes included.</p>
                  <Button
                    onClick={handleContinue}
                    className="mt-3 sm:mt-0 px-6 py-3 text-base"
                    disabled={flight.availableSeats < passengerCount}
                  >
                    {flight.availableSeats < passengerCount ? 'Not enough seats available' : `Continue ($${(flight.price * passengerCount).toFixed(2)})`}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Baggage & Extras */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur rounded-xl shadow-md ring-1 ring-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Baggage Information</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4 text-sm text-gray-600">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Cabin Baggage</h4>
                    <ul className="space-y-1">
                      <li>• 1 cabin bag (max 7kg) + 1 personal item</li>
                      <li>• Max dimensions: 56cm x 36cm x 23cm</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Check-in Baggage</h4>
                    <ul className="space-y-1">
                      <li>• 1 check-in bag (max 23kg) included</li>
                      <li>• Max dimensions: 158cm (L+W+H)</li>
                      <li>• Additional fees for extra/overweight bags</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;
