import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Plane, MapPin, User, Clock as ClockIcon, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getUserBookings, cancelBooking } from '../../services/bookingService';
import { useAuth } from '../../contexts/AuthContext';
import Loader from '../../components/common/Loader';
import { toast } from '@/components/ui/use-toast';
import BookingDetailsModal from '../../components/booking/BookingDetailsModal';

const BookingHistory = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBookings, setFilteredBookments] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCheckInSuccess = (updatedBooking) => {
    // Update the booking in the list with the checked-in status
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === updatedBooking.id ? updatedBooking : booking
      )
    );
    
    // Update filtered bookings as well
    setFilteredBookings(prevFiltered => 
      prevFiltered.map(booking => 
        booking.id === updatedBooking.id ? updatedBooking : booking
      )
    );
    
    toast({
      title: 'Success',
      description: 'Check-in completed successfully!',
      variant: 'default',
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleBookingCancelled = async (bookingId) => {
    try {
      // Update the local state to reflect the cancellation
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' } 
            : booking
        )
      );
      
      // Refetch bookings to ensure we have the latest data
      const updatedBookings = await getUserBookings(user.id);
      setBookings(updatedBookings);
      setFilteredBookings(updatedBookings);
      
      toast({
        title: 'Success',
        description: 'Booking cancelled successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error updating bookings after cancellation:', error);
      toast({
        title: 'Error',
        description: 'Failed to update booking status. Please refresh the page.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getUserBookings(user.id);
        setBookings(data);
        setFilteredBookments(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load booking history. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  useEffect(() => {
    // Filter bookings based on search query and active tab
    const filtered = bookings.filter(booking => {
      const matchesSearch = 
        booking.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.flight.airline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.flight.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.flight.destination.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = 
        (activeTab === 'upcoming' && booking.status !== 'cancelled' && !isPastFlight(booking.flight.departureTime)) ||
        (activeTab === 'past' && isPastFlight(booking.flight.departureTime)) ||
        (activeTab === 'cancelled' && booking.status === 'cancelled');
      
      return matchesSearch && matchesTab;
    });
    
    setFilteredBookings(filtered);
  }, [searchQuery, activeTab, bookings]);

  const isPastFlight = (departureTime) => {
    return new Date(departureTime) < new Date();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusBadge = (status, departureTime, passengers = []) => {
    const now = new Date();
    const departure = new Date(departureTime);
    const isUpcoming = departure > now;
    const hoursUntilDeparture = (departure - now) / (1000 * 60 * 60);
    const canCheckIn = isUpcoming && status === 'confirmed' && hoursUntilDeparture <= 48 && hoursUntilDeparture > 0;
    const allCheckedIn = passengers.length > 0 && passengers.every(p => p.hasCheckedIn);
    const someCheckedIn = passengers.length > 0 && passengers.some(p => p.hasCheckedIn);

    if (!isUpcoming) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </span>
      );
    }

    if (allCheckedIn) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Checked In
        </span>
      );
    }

    if (someCheckedIn) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <ClockIcon className="h-3 w-3 mr-1" />
          Partially Checked In
        </span>
      );
    }

    if (canCheckIn) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Check-in Available
        </span>
      );
    }

    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
    }
  };

  const getFlightDuration = (departureTime, arrivalTime) => {
    const diffMs = new Date(arrivalTime) - new Date(departureTime);
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`.trim();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your flight bookings
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search by PNR, airline, or destination"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex-shrink-0">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => setActiveTab('upcoming')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                    activeTab === 'upcoming'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('past')}
                  className={`px-4 py-2 text-sm font-medium border-t border-b ${
                    activeTab === 'past'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Past Trips
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('cancelled')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                    activeTab === 'cancelled'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancelled
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Plane className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No {activeTab} bookings</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'upcoming' 
                  ? 'You don\'t have any upcoming trips.'
                  : activeTab === 'past'
                  ? 'Your past trips will appear here.'
                  : 'You don\'t have any cancelled bookings.'}
              </p>
              {activeTab === 'upcoming' && (
                <div className="mt-6">
                  <Link
                    to="/"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plane className="-ml-1 mr-2 h-5 w-5" />
                    Book a Flight
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <li key={booking.bookingReference} className="hover:bg-gray-50">
                  <div className="block hover:bg-gray-50 p-4">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-blue-600 truncate">
                              {booking.bookingReference}
                            </div>
                            <div className="ml-2 flex-shrink-0">
                              {getStatusBadge(booking.status, booking.flight.departureTime, booking.passengers)}
                            </div>
                          </div>
                          
                          {/* Flight Summary */}
                          <div className="mt-2 text-sm text-gray-500">
                            {booking.flight.origin} → {booking.flight.destination} • {formatDate(booking.flight.departureTime)}
                          </div>
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="flex flex-wrap gap-2 sm:ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCardClick(booking);
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            View Details
                          </button>
                          
                          {/* Check-in Button */}
                          {booking.status === 'confirmed' && 
                          new Date(booking.flight.departureTime) > new Date() && 
                          booking.passengers.some(p => !p.hasCheckedIn) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBooking(booking);
                                setIsModalOpen(true);
                                // Small delay to ensure modal is open before triggering check-in
                                setTimeout(() => {
                                  const checkInButton = document.querySelector('[title="Check in for your flight"]');
                                  if (checkInButton) checkInButton.click();
                                }, 100);
                              }}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Check-in Now
                            </button>
                          )}
                          
                          {/* Boarding Pass Button */}
                          {booking.passengers.some(p => p.hasCheckedIn) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBooking(booking);
                                setIsModalOpen(true);
                                // Small delay to ensure modal is open before triggering boarding pass
                                setTimeout(() => {
                                  const boardingPassButton = document.querySelector('[title="View boarding pass"]');
                                  if (boardingPassButton) boardingPassButton.click();
                                }, 100);
                              }}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Boarding Pass
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-500">
                        <time dateTime={booking.bookingDate}>
                          Booked on {formatDate(booking.bookingDate)}
                        </time>
                      </div>
                      
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <Plane className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {booking.flight.airline} {booking.flight.flightNumber}
                              </p>
                              <div className="text-sm text-gray-900">
                                {booking.flight.origin} ({booking.flight.originCode || 'DEL'})
                                <span className="text-xs text-gray-500 ml-2">
                                  Terminal {booking.flight.originTerminal || 'T1'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              {getFlightDuration(booking.flight.departureTime, booking.flight.arrivalTime)}
                            </div>
                            <div className="mt-1">
                              <div className="h-px w-24 bg-gray-300 relative">
                                <div className="absolute -top-1.5 left-0 w-3 h-3 rounded-full bg-blue-500"></div>
                                <div className="absolute -top-1.5 right-0 w-3 h-3 rounded-full bg-green-500"></div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {booking.flight.stops === 0 ? 'Non-stop' : `${booking.flight.stops} ${booking.flight.stops === 1 ? 'stop' : 'stops'}`}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {formatTime(booking.flight.arrivalTime)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(booking.flight.arrivalTime)}
                          </div>
                          <div className="mt-1 text-sm text-gray-900">
                            {booking.flight.destination} ({booking.flight.destinationCode || 'BOM'})
                          </div>
                          <div className="text-xs text-gray-500">
                            Terminal {booking.flight.destinationTerminal || 'T2'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          <p>
                            {booking.passengers.length} {booking.passengers.length === 1 ? 'Passenger' : 'Passengers'}
                            {booking.seatNumbers && ` • Seat${booking.seatNumbers.length > 1 ? 's' : ''} ${booking.seatNumbers.join(', ')}`}
                          </p>
                        </div>
                        
                        <div className="mt-2 sm:mt-0">
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-900">
                              ₹{booking.totalAmount.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              {booking.passengers.length > 1 ? `for ${booking.passengers.length} passengers` : 'total'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Booking Details Modal */}
      {isModalOpen && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={closeModal}
          onBookingCancelled={handleBookingCancelled}
          onCheckInSuccess={handleCheckInSuccess}
        />
      )}
    </div>
  );
};

export default BookingHistory;
