import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  TicketIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  ClockIcon as ClockIconSolid,
  ChevronDownIcon,
  ChevronUpIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  XMarkIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import { format, parseISO, isAfter, isBefore, addDays, subDays } from 'date-fns';
import { toast } from 'react-toastify';
import Button from '../../components/ui/buttons/Button';
import Card from '../../components/common/Card';
import Tabs from '../../components/ui/Tabs';
import useAuth from '../../hooks/useAuth';

const Bookings = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    dateRange: 'all',
    status: 'all',
    sortBy: 'departure_asc'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Helper function to get background color based on status
  const getStatusBgColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-800';
      case 'completed':
        return 'bg-blue-50 text-blue-800';
      case 'cancelled':
        return 'bg-red-50 text-red-800';
      case 'pending':
        return 'bg-yellow-50 text-yellow-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

  // Generate mock bookings ONCE (simulate API) and store in state so IDs remain stable

  // Filter and sort bookings based on selected tab and filters
  const filteredBookings = bookings.filter(booking => {
    // Filter by tab
    if (selectedTab === 'upcoming' && booking.status !== 'confirmed') return false;
    if (selectedTab === 'past' && booking.status !== 'completed') return false;
    if (selectedTab === 'cancelled' && booking.status !== 'cancelled') return false;
    
    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        booking.id.toLowerCase().includes(searchLower) ||
        booking.passengers.some(p => 
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchLower)
        );
      if (!matchesSearch) return false;
    }
    
    // Filter by status
    if (filters.status !== 'all' && booking.status !== filters.status) return false;
    
    // Filter by date range
    const bookingDate = parseISO(booking.bookingDate);
    const now = new Date();
    
    if (filters.dateRange === 'today') {
      return (
        bookingDate.getDate() === now.getDate() &&
        bookingDate.getMonth() === now.getMonth() &&
        bookingDate.getFullYear() === now.getFullYear()
      );
    } else if (filters.dateRange === 'this_week') {
      const weekAgo = subDays(now, 7);
      return isAfter(bookingDate, weekAgo);
    } else if (filters.dateRange === 'this_month') {
      return (
        bookingDate.getMonth() === now.getMonth() &&
        bookingDate.getFullYear() === now.getFullYear()
      );
    }
    
    return true;
  });

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (filters.sortBy === 'departure_asc') {
      return new Date(a.flight.departure.time) - new Date(b.flight.departure.time);
    } else if (filters.sortBy === 'departure_desc') {
      return new Date(b.flight.departure.time) - new Date(a.flight.departure.time);
    } else if (filters.sortBy === 'booking_date_asc') {
      return new Date(a.bookingDate) - new Date(b.bookingDate);
    } else if (filters.sortBy === 'booking_date_desc') {
      return new Date(b.bookingDate) - new Date(a.bookingDate);
    } else if (filters.sortBy === 'price_asc') {
      return a.payment.total - b.payment.total;
    } else if (filters.sortBy === 'price_desc') {
      return b.payment.total - a.payment.total;
    }
    return 0;
  });

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  useEffect(() => {
    // Simulate API call: create mock data and set once
    const timer = setTimeout(() => {
      const focusId = location.state?.focusBookingId;
      const generated = [
        {
          id: focusId || `BK${Math.floor(10000000 + Math.random() * 90000000)}`,
          status: 'confirmed',
          bookingDate: subDays(new Date(), 2).toISOString(),
          flight: {
            airline: 'Skywings',
            flightNumber: 'SW123',
            aircraft: 'Boeing 737-800',
            duration: 125,
            departure: {
              city: 'New York',
              airport: 'JFK',
              time: addDays(new Date(), 1).toISOString(),
              terminal: '4',
              gate: 'B12'
            },
            arrival: {
              city: 'Los Angeles',
              airport: 'LAX',
              time: addDays(new Date(), 2).toISOString(),
              terminal: '5',
              gate: 'A8'
            },
            cabinClass: 'Economy'
          },
          passengers: [
            { 
              id: 1, 
              firstName: user?.firstName || 'John', 
              lastName: user?.lastName || 'Doe', 
              type: 'adult',
              ticketNumber: 'TK12345678'
            }
          ],
          payment: {
            total: 299.99,
            status: 'paid',
            method: 'Credit Card',
            lastFour: '1234'
          }
        }
      ];
      setBookings(generated);
      setLoading(false);
      // If a focusBookingId is provided, expand that booking; otherwise expand first by default when coming from dashboard
      if (focusId) {
        setExpandedBooking(focusId);
      } else if (location.state && generated.length > 0) {
        setExpandedBooking(generated[0].id);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [user?.firstName, user?.lastName, location.state]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your flight bookings
        </p>
      </div>

      <Tabs
        tabs={[
          { id: 'upcoming', name: 'Upcoming Trips' },
          { id: 'past', name: 'Past Trips' },
          { id: 'cancelled', name: 'Cancelled' }
        ]}
        selectedTab={selectedTab}
        onChange={setSelectedTab}
        className="mb-6"
      />

      {/* Search and Filter Bar */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
              {showFilters ? (
                <ChevronUpIcon className="h-4 w-4 ml-1" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 ml-1" />
              )}
            </Button>
            
            <select
              className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="departure_asc">Departure (Earliest First)</option>
              <option value="departure_desc">Departure (Latest First)</option>
              <option value="booking_date_asc">Booking Date (Oldest First)</option>
              <option value="booking_date_desc">Booking Date (Newest First)</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {sortedBookings.length === 0 ? (
          <Card className="text-center py-12">
            <TicketIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedTab === 'upcoming' 
                ? "You don't have any upcoming trips. Ready to book your next adventure?"
                : selectedTab === 'past'
                ? "You don't have any past trips to display."
                : "You don't have any cancelled bookings."}
            </p>
            {selectedTab === 'upcoming' && (
              <div className="mt-6">
                <Button as={Link} to="/flights" variant="primary">
                  Search Flights
                </Button>
              </div>
            )}
          </Card>
        ) : (
          sortedBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  {/* Flight Summary */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {booking.flight.departure.city} to {booking.flight.arrival.city}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {format(parseISO(booking.bookingDate), 'MMM d, yyyy')} • {booking.id}
                        </p>
                      </div>
                      
                      <div className="mt-2 md:mt-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBgColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Departure</p>
                        <p className="text-sm text-gray-900">
                          {format(parseISO(booking.flight.departure.time), 'MMM d, yyyy')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(parseISO(booking.flight.departure.time), 'h:mm a')}
                        </p>
                        <p className="text-sm text-gray-900 mt-1">
                          {booking.flight.departure.airport} • {booking.flight.departure.city}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-center">
                        <div className="flex items-center">
                          <div className="w-16 h-0.5 bg-gray-300"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                          <div className="w-16 h-0.5 bg-gray-300"></div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Arrival</p>
                        <p className="text-sm text-gray-900">
                          {format(parseISO(booking.flight.arrival.time), 'MMM d, yyyy')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(parseISO(booking.flight.arrival.time), 'h:mm a')}
                        </p>
                        <p className="text-sm text-gray-900 mt-1">
                          {booking.flight.arrival.airport} • {booking.flight.arrival.city}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <UserIcon className="h-4 w-4 mr-1" />
                        <span>{booking.passengers.length} {booking.passengers.length === 1 ? 'Passenger' : 'Passengers'}</span>
                        <span className="mx-2">•</span>
                        <TicketIcon className="h-4 w-4 mr-1" />
                        <span>{booking.flight.cabinClass}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          ${booking.payment.total.toFixed(2)}
                        </span>
                        <button
                          onClick={() => setExpandedBooking(expandedBooking === booking.id ? null : booking.id)}
                          className="ml-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none flex items-center"
                        >
                          {expandedBooking === booking.id ? 'Show less' : 'View details'}
                          {expandedBooking === booking.id ? (
                            <ChevronUpIcon className="h-4 w-4 ml-1" />
                          ) : (
                            <ChevronDownIcon className="h-4 w-4 ml-1" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Expanded Details */}
                {expandedBooking === booking.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Flight Details */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-900">Flight Details</h4>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {booking.flight.airline} {booking.flight.flightNumber}
                              </p>
                              <p className="text-sm text-gray-500">{booking.flight.aircraft}</p>
                            </div>
                            <div className="text-sm text-gray-500">
                              {Math.floor(booking.flight.duration / 60)}h {booking.flight.duration % 60}m
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <ArrowUpTrayIcon className="h-5 w-5 text-indigo-600" />
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">
                                  {format(parseISO(booking.flight.departure.time), 'h:mm a')}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {format(parseISO(booking.flight.departure.time), 'EEE, MMM d, yyyy')}
                                </p>
                                <p className="text-sm font-medium text-gray-900 mt-1">
                                  {booking.flight.departure.airport}, {booking.flight.departure.city}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Terminal {booking.flight.departure.terminal}
                                  {booking.flight.departure.gate && ` • Gate ${booking.flight.departure.gate}`}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <ArrowDownTrayIcon className="h-5 w-5 text-indigo-600" />
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">
                                  {format(parseISO(booking.flight.arrival.time), 'h:mm a')}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {format(parseISO(booking.flight.arrival.time), 'EEE, MMM d, yyyy')}
                                </p>
                                <p className="text-sm font-medium text-gray-900 mt-1">
                                  {booking.flight.arrival.airport}, {booking.flight.arrival.city}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Terminal {booking.flight.arrival.terminal}
                                  {booking.flight.arrival.gate && ` • Gate ${booking.flight.arrival.gate}`}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Booking Reference */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Booking Reference</h4>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{booking.id}</p>
                                <p className="text-xs text-gray-500">Booking Number</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                  {format(parseISO(booking.bookingDate), 'MMM d, yyyy')}
                                </p>
                                <p className="text-xs text-gray-500">Booked On</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Payment Details */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Payment</h4>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm text-gray-600">Base Fare</p>
                              <p className="text-sm font-medium text-gray-900">
                                ${(booking.payment.total * 0.8).toFixed(2)}
                              </p>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm text-gray-600">Taxes & Fees</p>
                              <p className="text-sm font-medium text-gray-900">
                                ${(booking.payment.total * 0.2).toFixed(2)}
                              </p>
                            </div>
                            <div className="border-t border-gray-200 my-2"></div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">Total Paid</p>
                              <p className="text-lg font-bold text-gray-900">
                                ${booking.payment.total.toFixed(2)}
                              </p>
                            </div>
                            <div className="mt-3 flex items-center text-sm text-gray-500">
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                              <span>Paid on {format(parseISO(booking.bookingDate), 'MMM d, yyyy')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Passengers */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Passengers</h4>
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Name
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Type
                                </th>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Ticket
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {booking.passengers.map((passenger) => (
                                <tr key={passenger.id}>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {passenger.firstName} {passenger.lastName}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">
                                    {passenger.type}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                    {passenger.ticketNumber || 'Not issued yet'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        {/* Actions */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button 
                            as={Link}
                            to={`/booking/${booking.id}/ticket`}
                            variant="outline"
                            size="sm"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                            E-Ticket
                          </Button>
                          
                          <Button 
                            as={Link}
                            to={`/booking/${booking.id}/invoice`}
                            variant="outline"
                            size="sm"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                            Invoice
                          </Button>
                          
                          {booking.status === 'confirmed' && (
                            <Button 
                              as={Link}
                              to={`/booking/${booking.id}/modify`}
                              variant="outline"
                              size="sm"
                            >
                              <PencilIcon className="h-4 w-4 mr-1" />
                              Modify Booking
                            </Button>
                          )}
                          
                          {booking.status === 'confirmed' && (
                            <Button 
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                              onClick={() => {
                                if (window.confirm('Are you sure you want to cancel this booking?')) {
                                  // Handle cancellation
                                  toast.success('Booking cancellation requested');
                                }
                              }}
                            >
                              <XMarkIcon className="h-4 w-4 mr-1" />
                              Cancel Booking
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Bookings;
