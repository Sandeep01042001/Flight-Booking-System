import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, ShieldCheck, Briefcase, Globe, Star, ChevronRight } from 'lucide-react';

// Simple autoplay carousel interval (ms)
const HERO_INTERVAL = 5000;

const Home = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('roundtrip');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('economy');
  const [validationMsg, setValidationMsg] = useState('');

  const handleHomeSearch = () => {
    if (!from || !to || !departureDate) {
      setValidationMsg('Please fill From, To and Departure date');
      return;
    }
    setValidationMsg('');
    const params = new URLSearchParams({
      from,
      to,
      date: departureDate,
    });
    navigate(`/flights?${params.toString()}`);
  };

  const swapFromTo = () => {
    setFrom((prevFrom) => {
      const nextFrom = to;
      setTo(prevFrom);
      return nextFrom;
    });
  };

  const popularDestinations = [
    { id: 1, name: 'New York', country: 'USA', price: '$499', image: 'https://picsum.photos/seed/nyc/800/600' },
    { id: 2, name: 'Paris', country: 'France', price: '$599', image: 'https://picsum.photos/seed/paris/800/600' },
    { id: 3, name: 'Tokyo', country: 'Japan', price: '$899', image: 'https://picsum.photos/seed/tokyo/800/600' },
    { id: 4, name: 'Dubai', country: 'UAE', price: '$699', image: 'https://picsum.photos/seed/dubai/800/600' },
    { id: 5, name: 'Sydney', country: 'Australia', price: '$1,099', image: 'https://picsum.photos/seed/sydney/800/600' },
    { id: 6, name: 'London', country: 'UK', price: '$549', image: 'https://picsum.photos/seed/london/800/600' },
  ];
  
  const heroSlides = [
    {
      id: 'hero1',
      title: 'Explore the World with Skywings',
      subtitle: 'Discover amazing destinations with our best flight deals and exceptional service.',
      image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1920&auto=format&fit=crop', // airplane wing
    },
    {
      id: 'hero2',
      title: 'Seamless Journeys Await',
      subtitle: 'From booking to boarding, enjoy a smooth and delightful travel experience.',
      image: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=1920&auto=format&fit=crop', // airport terminal
    },
    {
      id: 'hero3',
      title: 'Fly Further, Pay Less',
      subtitle: 'Exclusive offers to top destinations. Limited time deals—book now!',
      image: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?q=80&w=1920&auto=format&fit=crop', // airplane takeoff
    },
  ];

  const features = [
    {
      icon: <ShieldCheck className="h-10 w-10 text-indigo-600" />,
      title: 'Safe Travels',
      description: 'Your safety is our top priority with enhanced cleaning and safety measures.'
    },
    {
      icon: <Plane className="h-10 w-10 text-indigo-600" />,
      title: 'Global Network',
      description: 'Fly to over 200 destinations worldwide with our extensive route network.'
    },
    {
      icon: <Briefcase className="h-10 w-10 text-indigo-600" />,
      title: 'Business Class',
      description: 'Experience luxury in the sky with our premium business class service.'
    },
    {
      icon: <Globe className="h-10 w-10 text-indigo-600" />,
      title: 'Eco-Friendly',
      description: 'Committed to reducing our carbon footprint and flying more sustainably.'
    }
  ];

  // Hero carousel state
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHoveringHero, setIsHoveringHero] = useState(false);
  React.useEffect(() => {
    if (isHoveringHero) return; // pause on hover
    const t = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, HERO_INTERVAL);
    return () => clearInterval(t);
  }, [isHoveringHero, heroSlides.length]);

  // Destinations slider scroll refs
  const listRef = React.useRef(null);
  const scrollByCards = (dir = 1) => {
    const el = listRef.current;
    if (!el) return;
    const card = el.querySelector('[data-card]');
    const amount = card ? card.getBoundingClientRect().width * 2 + 32 : 600;
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  // image fallback handler
  const handleImgError = (e, fallback = 'https://picsum.photos/seed/skywings-fallback/1200/800') => {
    if (e.target && e.target.src !== fallback) {
      e.target.src = fallback;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Search + Image Carousel */}
      <div 
        className="relative text-white pt-4 md:pt-6 overflow-hidden"
        onMouseEnter={() => setIsHoveringHero(true)}
        onMouseLeave={() => setIsHoveringHero(false)}
      >
        {/* Slides */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${idx === activeSlide ? 'opacity-100' : 'opacity-0'}`}
              aria-hidden={idx !== activeSlide}
            >
              <img src={slide.image} loading="eager" onError={(e)=>handleImgError(e)} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          {/* Flight Search Form (placed first to be fully visible on load) */}
          <div className="relative rounded-xl shadow-xl max-w-4xl mx-auto overflow-hidden ring-1 ring-gray-100 text-gray-900">
            {/* Background flight image behind the form */}
            <img
              src="https://images.unsplash.com/photo-1521791055366-0d553872125f?q=80&w=1600&auto=format&fit=crop"
              alt="Flight taking off"
              loading="lazy"
              onError={(e)=>handleImgError(e)}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            {/* Foreground form content */}
            <div className="relative p-4 md:p-6 bg-white/70 backdrop-blur">
              <div className="flex space-x-4 mb-6">
                <button 
                  onClick={() => setTripType('roundtrip')}
                  className={`px-4 py-2 rounded-md font-medium ${tripType === 'roundtrip' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'}`}
                >
                  Roundtrip
                </button>
                <button 
                  onClick={() => setTripType('oneway')}
                  className={`px-4 py-2 rounded-md font-medium ${tripType === 'oneway' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600'}`}
                >
                  One Way
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="City or Airport"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="City or Airport"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400"
                    />
                    {/* Swap button between From/To on medium+ */}
                    <button
                      type="button"
                      onClick={swapFromTo}
                      className="hidden md:flex absolute -left-4 -top-4 md:-right-4 md:top-1/2 md:-translate-y-1/2 md:left-auto items-center justify-center h-9 w-9 rounded-full bg-white shadow ring-1 ring-gray-200 text-gray-600 hover:bg-gray-50"
                      title="Swap From/To"
                      aria-label="Swap From and To"
                    >
                      ⇄
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
                  <input
                    type="date"
                    min={new Date().toISOString().slice(0,10)}
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  />
                </div>

                {tripType === 'roundtrip' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return</label>
                    <input
                      type="date"
                      min={departureDate || new Date().toISOString().slice(0,10)}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={passengers}
                    onChange={(e) => setPassengers(parseInt(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value)}
                  >
                    <option value="economy">Economy</option>
                    <option value="premium">Premium Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
              </div>

              {validationMsg && (
                <p className="mt-3 text-sm text-red-600">{validationMsg}</p>
              )}

              <button
                type="button"
                onClick={handleHomeSearch}
                className="mt-6 w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium"
              >
                Search Flights
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              {heroSlides[activeSlide].title}
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-indigo-100">
              {heroSlides[activeSlide].subtitle}
            </p>
          </div>

          {/* Carousel controls */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {heroSlides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActiveSlide(i)}
                className={`h-2.5 w-2.5 rounded-full ${i === activeSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Popular Destinations - Horizontal Slider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Popular Destinations</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular destinations with exclusive flight deals
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => scrollByCards(-1)}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow ring-1 ring-gray-200 hover:bg-gray-50"
            aria-label="Scroll left"
          >
            ‹
          </button>
          <div
            ref={listRef}
            className="flex gap-8 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory"
          >
            {popularDestinations.map((destination) => (
              <div
                key={destination.id}
                data-card
                className="group relative min-w-[280px] max-w-[360px] snap-start overflow-hidden rounded-xl shadow-lg"
              >
                <img 
                  src={destination.image} 
                  loading="lazy"
                  onError={(e)=>handleImgError(e, 'https://picsum.photos/seed/skywings-destination/800/600')} 
                  alt={destination.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent">
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-xl font-bold text-white">{destination.name}</h3>
                        <p className="text-indigo-200">{destination.country}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-300">FROM</span>
                        <p className="text-2xl font-bold text-white">{destination.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <button className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30" title="Add to wishlist">
                    <Star className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => scrollByCards(1)}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow ring-1 ring-gray-200 hover:bg-gray-50"
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>

        <div className="mt-12 text-center">
          <Link 
            to="/flights" 
            className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800"
          >
            View all destinations
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Fly With Us</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the difference with Skywings - where your journey matters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Special Offers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-indigo-700 rounded-2xl p-8 md:p-12 text-white">
          <div className="md:flex items-center justify-between">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Special Offers</h2>
              <p className="text-indigo-100 mb-6">
                Sign up today and get 15% off your first booking. Plus, enjoy exclusive member-only deals and early access to sales.
              </p>
              <Link 
                to="/register" 
                className="inline-block bg-white text-indigo-700 px-6 py-3 rounded-md font-medium hover:bg-gray-100"
              >
                Join Now
              </Link>
            </div>
            <div className="md:w-2/5">
              <img 
                src="https://source.unsplash.com/random/600x400?airplane" 
                alt="Special Offer"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Passengers Say</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The best flying experience I've ever had. The crew was amazing and the service was top-notch!",
                author: "Sarah Johnson",
                location: "Frequent Flyer"
              },
              {
                quote: "Great prices and excellent customer service. Will definitely be flying with Skywings again.",
                author: "Michael Chen",
                location: "Business Traveler"
              },
              {
                quote: "Comfortable seats, on-time departures, and friendly staff. Highly recommended!",
                author: "Emma Davis",
                location: "Travel Enthusiast"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-medium text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile App CTA */}
      <div className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="md:flex items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Download Our Mobile App</h2>
              <p className="text-indigo-100 mb-6 max-w-md">
                Book flights, check-in, manage your bookings, and get real-time flight updates - all in the palm of your hand.
              </p>
              <div className="flex space-x-4">
                <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center">
                  <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.39 2.35 1.28 3.08 1.29.73 0 1.8-1.02 3.08-1.29 2.33-.5 4.04.37 5.23 1.43-4.48 2.76-3.24 8.9 1.36 10.82.9.38 1.4.3 1.92.01.25-.14.57-.4.93-.74-.97-1.13-1.6-1.67-2.6-2.7zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"></path>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </button>
                <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center">
                  <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm.921 18.615L11.75 13.2l-7.22-7.22v14.45zM14.75 12l7.39 7.39a1 1 0 001.61-.92V5.53a1 1 0 00-1.61-.92L14.75 12zm-3.08 0L5.53 4.92v14.16l6.14-6.15.5-.5.5.5 6.14 6.15V4.92l-6.14 6.15-.5.5z"></path>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="font-semibold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
            <div className="md:w-2/5 flex justify-center">
              <img 
                src="https://source.unsplash.com/random/600x400?mobile-app" 
                alt="Mobile App"
                className="max-h-80"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
