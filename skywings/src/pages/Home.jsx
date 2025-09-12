import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Clock, DollarSign, Plane, Check, MapPin, Calendar, User, ChevronDown } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    departureDate: new Date().toISOString().split('T')[0],
    returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    travelers: 1,
    class: 'economy',
  });
  const [tripType, setTripType] = useState('roundtrip');
  const [showTravelersDropdown, setShowTravelersDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  
  // Popular destinations
  const popularDestinations = [
    { name: 'New York', code: 'NYC', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9' },
    { name: 'London', code: 'LHR', image: 'https://images.unsplash.com/photo-1505761671935-60ed3edb24cb' },
    { name: 'Paris', code: 'CDG', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a' },
    { name: 'Tokyo', code: 'HND', image: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      from: searchParams.from,
      to: searchParams.to,
      date: searchParams.departureDate,
      ...(tripType === 'roundtrip' && { returnDate: searchParams.returnDate }),
      passengers: searchParams.travelers,
      class: searchParams.class,
      trip: tripType,
    });
    navigate(`/flights?${queryParams.toString()}`);
  };

  const features = [
    { 
      icon: <Shield className="h-8 w-8 text-blue-600" />, 
      title: 'Safe & Secure', 
      description: 'Your safety is our top priority with enhanced cleaning and contactless procedures.' 
    },
    { 
      icon: <Clock className="h-8 w-8 text-blue-600" />, 
      title: 'On-time Flights', 
      description: '95% on-time performance with real-time flight status updates.' 
    },
    { 
      icon: <DollarSign className="h-8 w-8 text-blue-600" />, 
      title: 'Best Price', 
      description: 'Price match guarantee and exclusive member deals.' 
    },
  ];

  const travelClasses = ['Economy', 'Premium Economy', 'Business', 'First Class'];
  
  const handleIncrementTravelers = () => {
    setSearchParams(prev => ({
      ...prev,
      travelers: Math.min(9, prev.travelers + 1)
    }));
  };
  
  const handleDecrementTravelers = () => {
    setSearchParams(prev => ({
      ...prev,
      travelers: Math.max(1, prev.travelers - 1)
    }));
  };
  
  const selectTravelClass = (travelClass) => {
    setSearchParams(prev => ({
      ...prev,
      class: travelClass.toLowerCase()
    }));
    setShowClassDropdown(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-blue-600/50"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-extrabold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Explore the World with Ease
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Find the best flight deals and book your next adventure with SkyWings. Enjoy seamless travel experiences with our premium services.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <motion.div 
          className="bg-white rounded-xl shadow-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <form onSubmit={handleSearch}>
            <div className="flex flex-wrap gap-4 mb-6">
              {[
                { value: 'roundtrip', label: 'Round Trip' },
                { value: 'oneway', label: 'One Way' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTripType(value)}
                  className={`flex items-center px-5 py-3 rounded-lg transition-all ${
                    tripType === value 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tripType === value && (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  {label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <div className="relative">
                  <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="City or Airport"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={searchParams.from}
                    onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="City or Airport"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={searchParams.to}
                    onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    value={searchParams.departureDate}
                    onChange={(e) => setSearchParams({ ...searchParams, departureDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              {tripType === 'roundtrip' && (
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Return</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                      value={searchParams.returnDate}
                      onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
                      min={searchParams.departureDate}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Travelers & Class</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowTravelersDropdown(!showTravelersDropdown)}
                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <span>{searchParams.travelers} {searchParams.travelers === 1 ? 'Traveler' : 'Travelers'}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                  
                  {showTravelersDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700">Travelers</span>
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={handleDecrementTravelers}
                              className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
                              disabled={searchParams.travelers <= 1}
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="mx-2 w-8 text-center">{searchParams.travelers}</span>
                            <button
                              type="button"
                              onClick={handleIncrementTravelers}
                              className="p-1 rounded-full text-gray-600 hover:bg-gray-100"
                              disabled={searchParams.travelers >= 9}
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Class</span>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setShowClassDropdown(!showClassDropdown)}
                                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                              >
                                {searchParams.class.charAt(0).toUpperCase() + searchParams.class.slice(1)}
                                <ChevronDown className="ml-1 h-4 w-4" />
                              </button>
                              
                              {showClassDropdown && (
                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
                                  {travelClasses.map((travelClass) => (
                                    <button
                                      key={travelClass}
                                      type="button"
                                      onClick={() => selectTravelClass(travelClass)}
                                      className={`block w-full text-left px-4 py-2 text-sm ${
                                        searchParams.class === travelClass.toLowerCase()
                                          ? 'bg-blue-50 text-blue-700'
                                          : 'text-gray-700 hover:bg-gray-50'
                                      }`}
                                    >
                                      {travelClass}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowTravelersDropdown(false)}
                          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 rounded-lg font-medium text-lg hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.01] shadow-lg hover:shadow-xl"
              >
                Search Flights
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Why Choose SkyWings?</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Experience the difference with our premium services and exclusive benefits.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Popular Destinations</h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Discover amazing places around the world with our best deals
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {popularDestinations.map((destination, index) => (
              <motion.div
                key={destination.code}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={`${destination.image}?w=600&h=400&fit=crop`}
                    alt={destination.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">{destination.name}</h3>
                    <p className="text-blue-200">From $199</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link
              to="/flights"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              View All Destinations
              <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to explore the world?</span>
          </h2>
          <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
            Join thousands of travelers who trust SkyWings for their journeys. Book your next adventure today!
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/register"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-10 transition-colors"
            >
              Sign Up for Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
