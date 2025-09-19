import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/buttons/Button';
import Input from '../../components/ui/forms/Input';
import Select from '../../components/ui/forms/Select';

const FlightSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useState({
    tripType: 'roundtrip',
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    cabinClass: 'economy',
  });
  const [isOneWay, setIsOneWay] = useState(false);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const quickBook = (destinationCode) => {
    setSearchParams((prev) => {
      const next = {
        ...prev,
        to: destinationCode,
        from: prev.from || 'NYC',
        departureDate: prev.departureDate || new Date().toISOString().slice(0,10),
      };
      // After state update, submit the form
      setTimeout(() => {
        document.getElementById('searchForm')?.requestSubmit();
        document.getElementById('searchForm')?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would handle the search logic here
    console.log('Searching flights with params:', searchParams);
    // Navigate with query params on the same route (results UI on this page)
    navigate(`/flights?from=${encodeURIComponent(searchParams.from)}&to=${encodeURIComponent(searchParams.to)}&date=${encodeURIComponent(searchParams.departureDate)}`);
  };

  const toggleTripType = (type) => {
    setSearchParams(prev => ({
      ...prev,
      tripType: type
    }));
    setIsOneWay(type === 'oneway');
  };

  // Mock data for dropdowns
  const cities = [
    { value: 'NYC', label: 'New York (JFK)' },
    { value: 'LON', label: 'London (LHR)' },
    { value: 'PAR', label: 'Paris (CDG)' },
    { value: 'TOK', label: 'Tokyo (HND)' },
    { value: 'SYD', label: 'Sydney (SYD)' },
  ];

  // Sync form with query params and fetch results
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const from = params.get('from') || '';
    const to = params.get('to') || '';
    const date = params.get('date') || '';
    if (from || to || date) {
      setSearchParams((prev) => ({ ...prev, from, to, departureDate: date }));
      performSearch({ from, to, date });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const performSearch = ({ from, to, date }) => {
    setLoading(true);
    // Mock results
    setTimeout(() => {
      const basePrice = 199;
      const sample = [
        {
          id: 'SW' + Math.floor(Math.random() * 900 + 100),
          flightNumber: 'SW' + Math.floor(Math.random() * 900 + 100),
          origin: { code: from || 'JFK' },
          destination: { code: to || 'LHR' },
          departureTime: new Date().toISOString(),
          arrivalTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
          duration: 180,
          price: basePrice,
          availableSeats: 7,
          airline: { name: 'Skywings', logo: 'https://source.unsplash.com/random/80x80?airline' },
        },
        {
          id: 'SW' + Math.floor(Math.random() * 900 + 100),
          flightNumber: 'SW' + Math.floor(Math.random() * 900 + 100),
          origin: { code: from || 'JFK' },
          destination: { code: to || 'LHR' },
          departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          arrivalTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
          duration: 180,
          price: basePrice + 60,
          availableSeats: 3,
          airline: { name: 'Skywings', logo: 'https://source.unsplash.com/random/80x80?logo' },
        },
      ];
      setFlights(sample);
      setLoading(false);
    }, 400);
  };

  const handleSelectFlight = (flightId) => {
    const selected = flights.find(f => f.id === flightId);
    navigate(`/flights/${flightId}`, {
      state: { searchParams, flight: selected },
    });
  };

  // image fallback for logos/thumbnails
  const handleImgError = (e) => {
    if (e?.target) {
      e.target.src = '/skywings-logo.svg';
    }
  };

  const cabinClasses = [
    { value: 'economy', label: 'Economy' },
    { value: 'premium', label: 'Premium Economy' },
    { value: 'business', label: 'Business Class' },
    { value: 'first', label: 'First Class' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=1920&auto=format&fit=crop"
          alt="Airport terminal"
          className="w-full h-56 md:h-72 object-cover"
          onError={handleImgError}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold">Find Your Flight</h1>
            <p className="mt-2 text-indigo-100 max-w-2xl mx-auto">Search and book flights to destinations around the world</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-10 sm:-mt-12">
        {/* Overlapping card with form */}
        <div className="bg-white/95 backdrop-blur rounded-xl shadow-md ring-1 ring-gray-100 overflow-hidden">
        
          {/* Trip Type Toggle */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                type="button"
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  searchParams.tripType === 'roundtrip'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => toggleTripType('roundtrip')}
              >
                Round Trip
              </button>
              <button
                type="button"
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  searchParams.tripType === 'oneway'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => toggleTripType('oneway')}
              >
                One Way
              </button>
              <button
                type="button"
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  searchParams.tripType === 'multicity'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => toggleTripType('multicity')}
              >
                Multi-City
              </button>
            </div>
          </div>

          {/* Search Form */}
          <form id="searchForm" onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="col-span-2 sm:col-span-1">
                <Select
                  label="From"
                  name="from"
                  value={searchParams.from}
                  onChange={handleChange}
                  options={cities}
                  required
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <Select
                  label="To"
                  name="to"
                  value={searchParams.to}
                  onChange={handleChange}
                  options={cities}
                  required
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <Input
                  label="Departure Date"
                  name="departureDate"
                  type="date"
                  value={searchParams.departureDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <Input
                  label={isOneWay ? 'Return (Optional)' : 'Return Date'}
                  name="returnDate"
                  type="date"
                  value={searchParams.returnDate}
                  onChange={handleChange}
                  min={searchParams.departureDate}
                  disabled={isOneWay}
                  required={!isOneWay}
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <Select
                  label="Cabin Class"
                  name="cabinClass"
                  value={searchParams.cabinClass}
                  onChange={handleChange}
                  options={cabinClasses}
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <Input
                  label="Passengers"
                  name="passengers"
                  type="number"
                  min="1"
                  max="9"
                  value={searchParams.passengers}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 px-4 text-base font-medium"
              >
                Search Flights
              </Button>
            </div>
          </form>
        </div>

        {/* Results as cards */}
        <div className="mt-10">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : flights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {flights.map((f) => (
                <div key={f.id} className="bg-white rounded-xl shadow-sm ring-1 ring-gray-100 p-5 flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={f.airline?.logo}
                      onError={handleImgError}
                      alt={f.airline?.name}
                      className="h-12 w-12 rounded-full object-cover"
                      loading="lazy"
                    />
                    <div className="ml-4">
                      <div className="text-sm text-gray-500">{f.airline?.name}</div>
                      <div className="text-lg font-semibold text-gray-900">{f.flightNumber}</div>
                      <div className="text-xs text-gray-500 mt-1">{f.origin.code} → {f.destination.code}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">${f.price}</div>
                    <Button size="sm" className="mt-2" onClick={() => handleSelectFlight(f.id)}>Select</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Popular Destinations - horizontal slider */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
          <div className="flex gap-6 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory">
            {[
              { id: 1, city: 'New York', country: 'USA', code: 'JFK', price: '$499', image: 'https://picsum.photos/seed/ny/600/400' },
              { id: 2, city: 'London', country: 'UK', code: 'LHR', price: '$599', image: 'https://picsum.photos/seed/lon/600/400' },
              { id: 3, city: 'Paris', country: 'France', code: 'CDG', price: '$549', image: 'https://picsum.photos/seed/par/600/400' },
              { id: 4, city: 'Tokyo', country: 'Japan', code: 'HND', price: '$799', image: 'https://picsum.photos/seed/tok/600/400' },
            ].map((destination) => (
              <div key={destination.id} className="snap-start min-w-[280px] max-w-[340px] bg-white overflow-hidden shadow rounded-xl ring-1 ring-gray-100">
                <div className="h-40 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={destination.image}
                    alt={destination.city}
                    loading="lazy"
                    onError={handleImgError}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">{destination.city}</h3>
                  <p className="text-sm text-gray-500">{destination.country} • {destination.code}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-indigo-600">From {destination.price}</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => quickBook(destination.code)}
                    >
                      Book
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;
