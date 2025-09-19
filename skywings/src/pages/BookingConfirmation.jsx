import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircleIcon, ArrowLeftIcon, CreditCardIcon, UserIcon, TicketIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import bookingService from '../services/bookingService';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get data from location state
  const { flight, selectedSeats, searchParams } = location.state || {};
  const passengerCount = searchParams?.passengers || 1;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  
  // Calculate total price
  const totalPrice = flight ? (flight.price * passengerCount) : 0;
  
  // Format date and time
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const handleConfirmBooking = async () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    
    if (!flight || !selectedSeats || selectedSeats.length === 0) {
      setError('Missing booking information. Please start over.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Prepare booking data
      const bookingData = {
        flightId: flight.id,
        userId: user.id,
        passengers: Array(passengerCount).fill().map((_, index) => ({
          firstName: user.firstName || 'Passenger',
          lastName: user.lastName || String(index + 1),
          seatNumber: selectedSeats[index]?.number || `SEAT${index + 1}`,
          passportNumber: '',
          dateOfBirth: '',
        })),
        totalAmount: totalPrice,
        status: 'confirmed',
        bookingDate: new Date().toISOString(),
      };
      
      // In a real app, you would process payment here first
      // For this example, we'll just create the booking
      const booking = await bookingService.createBooking(bookingData);
      
      // Update flight to mark seats as taken
      await bookingService.updateFlightSeats(flight.id, selectedSeats.map(s => s.number));
      
      setBookingComplete(true);
      setBookingDetails(booking);
      
      // In a real app, you might want to send a confirmation email here
      
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to confirm booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleViewBookings = () => {
    navigate('/my-bookings');
  };
  
  if (!flight || !selectedSeats || selectedSeats.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Missing booking information. Please start your booking process again.
              </p>
            </div>
          </div>
        </div>
        <Button onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </div>
    );
  }
  
  if (bookingComplete && bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Booking Confirmed!</h1>
            <p className="mt-2 text-lg text-gray-600">
              Your booking has been successfully confirmed. We've sent the details to your email.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Booking Reference: <span className="font-mono font-medium">{bookingDetails.bookingNumber}</span>
            </p>
          </div>
          
          <div className="mt-10 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Flight Details
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Flight Number</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {flight.airline?.code} {flight.flightNumber}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Departure</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {flight.origin?.name} ({flight.origin?.code})
                    <div className="text-sm text-gray-500">
                      {formatDateTime(flight.departureTime)}
                    </div>
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Arrival</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {flight.destination?.name} ({flight.destination?.code})
                    <div className="text-sm text-gray-500">
                      {formatDateTime(flight.arrivalTime)}
                    </div>
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Passengers</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {passengerCount} {passengerCount === 1 ? 'Passenger' : 'Passengers'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Seats</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {selectedSeats.map(seat => seat.number).join(', ')}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                  <dd className="mt-1 text-lg font-semibold text-blue-600 sm:mt-0 sm:col-span-2">
                    ${totalPrice.toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="w-full sm:w-auto"
            >
              Print Itinerary
            </Button>
            <Button
              onClick={handleViewBookings}
              className="w-full sm:w-auto"
            >
              View My Bookings
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/')}
              className="w-full sm:w-auto"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={handleBack} className="flex items-center text-gray-600">
          <ArrowLeftIcon className="h-5 w-5 mr-1" /> Back to Seat Selection
        </Button>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Confirm Your Booking</h1>
            <p className="text-gray-600">Please review your flight details before confirming</p>
          </div>
          
          {/* Flight Summary */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <TicketIcon className="h-5 w-5 text-blue-500 mr-2" />
              Flight Details
            </h2>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <div className="text-2xl font-bold">
                    {flight.origin?.city} ({flight.origin?.code})
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(flight.departureTime).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(flight.departureTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                
                <div className="flex flex-col items-center mb-4 md:mb-0">
                  <div className="text-sm text-gray-500 mb-1">
                    {Math.floor(flight.duration / 60)}h {flight.duration % 60}m
                  </div>
                  <div className="w-32 h-px bg-gray-300 relative">
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-blue-500"></div>
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-blue-500"></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Non-stop</div>
                </div>
                
                <div className="text-center md:text-right">
                  <div className="text-2xl font-bold">
                    {flight.destination?.city} ({flight.destination?.code})
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(flight.arrivalTime).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(flight.arrivalTime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {flight.airline?.name} {flight.flightNumber}
                    </div>
                    <div className="text-sm text-gray-500">
                      {flight.aircraft || 'Boeing 737'} • Economy
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      ${flight.price} <span className="text-gray-500 font-normal">per passenger</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Passenger Details */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <UserIcon className="h-5 w-5 text-blue-500 mr-2" />
              Passenger Details
            </h2>
            
            <div className="space-y-4">
              {Array(passengerCount).fill().map((_, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3">Passenger {index + 1} {index === 0 ? '(You)' : ''}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        defaultValue={index === 0 ? (user?.firstName || '') : ''}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="First name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        defaultValue={index === 0 ? (user?.lastName || '') : ''}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Last name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Passport number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  {selectedSeats[index] && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1.5" />
                        Selected seat: <span className="font-medium ml-1">{selectedSeats[index].number}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Payment Information */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <CreditCardIcon className="h-5 w-5 text-blue-500 mr-2" />
              Payment Information
            </h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Base Fare ({passengerCount} {passengerCount === 1 ? 'Passenger' : 'Passengers'})</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-4 pt-2 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex items-start">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</a> and 
                    <a href="/privacy" className="text-blue-600 hover:underline ml-1">Privacy Policy</a>.
                  </label>
                </div>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                    {error}
                  </div>
                )}
                
                <div className="mt-6">
                  <Button
                    onClick={handleConfirmBooking}
                    disabled={loading}
                    className="w-full justify-center py-3 text-base"
                  >
                    {loading ? 'Processing...' : `Confirm Booking for $${totalPrice.toFixed(2)}`}
                  </Button>
                  <p className="mt-2 text-center text-xs text-gray-500">
                    Your card will be charged after you confirm your booking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Price Summary */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Base Fare ({passengerCount} {passengerCount === 1 ? 'Passenger' : 'Passengers'})</span>
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxes & Fees</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount</span>
              <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
