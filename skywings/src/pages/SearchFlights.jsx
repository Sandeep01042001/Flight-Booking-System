import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { SearchIcon, ArrowRightIcon } from '@heroicons/react/outline';
import flightService from '../services/flightService';

const SearchFlights = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    departureDate: format(new Date(), 'yyyy-MM-dd'),
    passengers: 1,
  });
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    // Fetch airports for the dropdown
    const fetchAirports = async () => {
      try {
        const data = await flightService.getAirports();
        setAirports(data);
      } catch (error) {
        console.error('Error fetching airports:', error);
      }
    };

    fetchAirports();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await flightService.searchFlights({
        from: searchParams.origin,
        to: searchParams.destination,
        date: searchParams.departureDate,
      });
      setFlights(data);
    } catch (error) {
      console.error('Error searching flights:', error);
      // Handle error (show toast/notification)
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFlight = (flightId) => {
    navigate(`/flights/${flightId}`, {
      state: {
        searchParams: {
          ...searchParams,
          flightId,
        },
      },
    });
  };

  // fallback for airline logos
  const handleImgError = (e) => {
    if (e?.target) {
      e.target.src = '/vite.svg';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=1920&auto=format&fit=crop"
          alt="Airport terminal"
          className="w-full h-56 md:h-72 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold">Find Your Next Flight</h1>
            <p className="mt-2 text-indigo-100 max-w-2xl mx-auto">Book great fares to top destinations with Skywings.</p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-6xl mx-auto px-4 -mt-10">
        <div className="bg-white/95 backdrop-blur rounded-xl shadow-md p-6 mb-8 ring-1 ring-gray-100">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <select
                  required
                  value={searchParams.origin}
                  onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Origin</option>
                  {airports.map((airport) => (
                    <option key={airport.id} value={airport.code}>
                      {airport.city} ({airport.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <select
                  required
                  value={searchParams.destination}
                  onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Destination</option>
                  {airports.map((airport) => (
                    <option key={airport.id} value={airport.code}>
                      {airport.city} ({airport.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                <input
                  type="date"
                  required
                  min={format(new Date(), 'yyyy-MM-dd')}
                  value={searchParams.departureDate}
                  onChange={(e) => setSearchParams({ ...searchParams, departureDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                <select
                  value={searchParams.passengers}
                  onChange={(e) => setSearchParams({ ...searchParams, passengers: parseInt(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Passenger' : 'Passengers'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center font-medium"
            >
              {loading ? (
                'Searching...'
              ) : (
                <>
                  <SearchIcon className="h-5 w-5 mr-2" />
                  Search Flights
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : flights.length > 0 ? (
        <div className="max-w-6xl mx-auto px-4 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {flights.map((flight) => (
              <div key={flight.id} className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-5 flex items-center justify-between">
                <div className="flex gap-6 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory">
                  {[
                    { id: 1, city: 'New York', country: 'USA', code: 'JFK', price: '$499', image: 'https://picsum.photos/seed/ny/600/400' },
                    { id: 2, city: 'London', country: 'UK', code: 'LHR', price: '$599', image: 'https://picsum.photos/seed/lon/600/400' },
                    { id: 3, city: 'Paris', country: 'France', code: 'CDG', price: '$549', image: 'https://picsum.photos/seed/par/600/400' },
                    { id: 4, city: 'Tokyo', country: 'Japan', code: 'HND', price: '$799', image: 'https://picsum.photos/seed/tok/600/400' },
                  ].map((destination) => (
                    <img
                      key={destination.id}
                      src={destination.image}
                      alt={destination.city}
                      className="h-48 w-80 object-cover rounded-lg"
                    />
                  ))}
                </div>
                <div className="flex items-center">
                  <img
                    src={flight.airline?.logo}
                    onError={handleImgError}
                    alt={flight.airline?.name}
                    className="h-12 w-12 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div className="ml-4">
                    <div className="text-sm text-gray-500">{flight.airline?.name}</div>
                    <div className="text-lg font-semibold text-gray-900">{flight.flightNumber}</div>
                  </div>
                </div>
                <div className="hidden sm:flex sm:flex-col sm:items-center">
                  <div className="text-sm text-gray-900">
                    {new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' '}•{' '}
                    {new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-xs text-gray-500">{flight.origin?.code} → {flight.destination?.code} · {Math.floor(flight.duration / 60)}h {flight.duration % 60}m</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">${flight.price}</div>
                  <div className="text-xs text-green-600">{flight.availableSeats} {flight.availableSeats === 1 ? 'seat' : 'seats'} left</div>
                  <button
                    onClick={() => handleSelectFlight(flight.id)}
                    className="mt-3 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Select <ArrowRightIcon className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : flights.length === 0 && searchParams.origin && searchParams.destination ? (
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-12 bg-white/90 backdrop-blur rounded-xl shadow ring-1 ring-gray-100">
            <h3 className="text-lg font-medium text-gray-900">No flights found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SearchFlights;
