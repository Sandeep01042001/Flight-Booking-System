import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  PrinterIcon, 
  EnvelopeIcon, 
  ArrowDownTrayIcon,
  TicketIcon,
  ClockIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  HomeIcon,
  ShoppingBagIcon,
  ArrowPathIcon,
  XCircleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { format, parseISO, addDays } from 'date-fns';
import { toast } from 'react-toastify';
import Button from '../../components/ui/buttons/Button';
import Card from '../../components/common/Card';
import useAuth from '../../hooks/useAuth';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  // Mock booking data - in a real app, this would come from an API or location.state
  const mockBooking = {
    id: `BK${Math.floor(10000000 + Math.random() * 90000000)}`,
    status: 'confirmed',
    bookingDate: new Date().toISOString(),
    passengers: [
      {
        id: 1,
        type: 'adult',
        firstName: user?.firstName || 'John',
        lastName: user?.lastName || 'Doe',
        seat: '12A',
        ticketNumber: `TKT${Math.floor(1000000000 + Math.random() * 9000000000)}`
      },
      {
        id: 2,
        type: 'adult',
        firstName: 'Jane',
        lastName: 'Doe',
        seat: '12B',
        ticketNumber: `TKT${Math.floor(1000000000 + Math.random() * 9000000000)}`
      }
    ],
    flight: {
      id: 'FL123',
      airline: 'SkyWings',
      flightNumber: 'SW456',
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
      cabinClass: 'Economy',
      fareRules: {
        baggage: '1 x 7kg cabin + 1 x 23kg checked',
        changes: 'Allowed with fee',
        cancellation: 'Free cancellation up to 24 hours before departure'
      }
    },
    payment: {
      method: 'VISA •••• 4242',
      subtotal: 598.00,
      taxes: 89.70,
      total: 687.70,
      paymentId: `PAY${Math.floor(10000000 + Math.random() * 90000000)}`
    },
    contact: {
      email: user?.email || 'john.doe@example.com',
      phone: user?.phone || '+1 (555) 123-4567'
    }
  };

  useEffect(() => {
    // Simulate API call to fetch booking details
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch this data from your API
        // const bookingId = location.pathname.split('/').pop();
        // const response = await fetch(`/api/bookings/${bookingId}`);
        // const data = await response.json();
        // setBooking(data);
        
        // Using mock data for now
        setTimeout(() => {
          setBooking(mockBooking);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        toast.error('Failed to load booking details');
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [location.pathname]);

  const handlePrint = () => {
    window.print();
  };

  const handleEmailItinerary = async () => {
    try {
      // In a real app, you would call your API to send the email
      // await fetch('/api/bookings/send-itinerary', {
      //   method: 'POST',
      //   body: JSON.stringify({ bookingId: booking.id, email: booking.contact.email })
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmailSent(true);
      toast.success('Itinerary sent to your email!');
      
      // Reset email sent status after 5 seconds
      setTimeout(() => setEmailSent(false), 5000);
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send itinerary email');
    }
  };

  const formatTime = (dateString) => {
    return format(parseISO(dateString), 'h:mm a');
  };

  const formatDate = (dateString) => {
    return format(parseISO(dateString), 'EEEE, MMMM d, yyyy');
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

  if (!booking) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
        <p className="text-gray-600 mb-6">We couldn't find the booking you're looking for.</p>
        <Button as={Link} to="/my-bookings" variant="primary">
          View My Bookings
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <CheckCircleIcon className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
        <p className="mt-2 text-lg text-gray-600">
          Your flight is all set. We've sent the details to {booking.contact.email}
        </p>
        <p className="mt-1 text-sm text-gray-500">Booking Reference: {booking.id}</p>
        
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <Button 
            variant="outline" 
            onClick={handlePrint}
            className="inline-flex items-center justify-center"
          >
            <PrinterIcon className="h-5 w-5 mr-2" />
            Print Itinerary
          </Button>
          <Button 
            variant="outline" 
            onClick={handleEmailItinerary}
            disabled={emailSent}
            className="inline-flex items-center justify-center"
          >
            <EnvelopeIcon className="h-5 w-5 mr-2" />
            {emailSent ? 'Email Sent!' : 'Email Itinerary'}
          </Button>
          <Button 
            as="a" 
            href={`/api/bookings/${booking.id}/download`}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            className="inline-flex items-center justify-center"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Flight Details</h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-indigo-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center">
                <TicketIcon className="h-5 w-5 text-indigo-600 mr-2" />
                <span className="font-medium">{booking.flight.airline} • {booking.flight.flightNumber}</span>
                <span className="ml-auto text-sm text-gray-500">{booking.flight.cabinClass}</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                  <div className="text-2xl font-bold">{formatTime(booking.flight.departure.time)}</div>
                  <div className="text-sm text-gray-500">{formatDate(booking.flight.departure.time)}</div>
                  <div className="mt-1 font-medium">{booking.flight.departure.airport}</div>
                  <div className="text-sm text-gray-500">{booking.flight.departure.city}</div>
                  <div className="mt-1 text-sm">
                    Terminal {booking.flight.departure.terminal} • Gate {booking.flight.departure.gate}
                  </div>
                </div>

                <div className="flex-1 px-4 py-2">
                  <div className="relative">
                    <div className="h-1 bg-gray-200 rounded-full">
                      <div className="h-1 bg-indigo-600 rounded-full w-3/4"></div>
                    </div>
                    <div className="absolute -top-2 left-0 w-4 h-4 bg-indigo-600 rounded-full"></div>
                    <div className="absolute -top-2 right-0 w-4 h-4 bg-indigo-600 rounded-full"></div>
                  </div>
                  <div className="mt-2 text-center text-sm text-gray-500">
                    {getDuration(booking.flight.duration)} • Non-stop
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <div className="text-2xl font-bold">{formatTime(booking.flight.arrival.time)}</div>
                  <div className="text-sm text-gray-500">
                    {format(parseISO(booking.flight.arrival.time), 'EEE, MMM d')}
                    {format(parseISO(booking.flight.arrival.time), 'EEE, MMM d') !== format(parseISO(booking.flight.departure.time), 'EEE, MMM d') && 
                      ` (+${Math.ceil(differenceInMinutes(parseISO(booking.flight.arrival.time), parseISO(booking.flight.departure.time)) / (24 * 60))} days)`
                    }
                  </div>
                  <div className="mt-1 font-medium">{booking.flight.arrival.airport}</div>
                  <div className="text-sm text-gray-500">{booking.flight.arrival.city}</div>
                  <div className="mt-1 text-sm">
                    Terminal {booking.flight.arrival.terminal} • Gate {booking.flight.arrival.gate}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Passengers */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Passengers</h3>
            <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
              <ul className="divide-y divide-gray-200">
                {booking.passengers.map((passenger, index) => (
                  <li key={passenger.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {passenger.firstName} {passenger.lastName}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {passenger.type} • Seat {passenger.seat}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">Ticket #{passenger.ticketNumber}</div>
                        <div className="text-sm text-gray-500">Boarding Pass Available 24h Before Departure</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Fare Rules */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fare Rules</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <ShoppingBagIcon className="h-6 w-6 text-indigo-600 mr-3" />
                    <h4 className="text-sm font-medium text-gray-900">Baggage</h4>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{booking.flight.fareRules.baggage}</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <ArrowPathIcon className="h-6 w-6 text-indigo-600 mr-3" />
                    <h4 className="text-sm font-medium text-gray-900">Changes</h4>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{booking.flight.fareRules.changes}</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <XCircleIcon className="h-6 w-6 text-indigo-600 mr-3" />
                    <h4 className="text-sm font-medium text-gray-900">Cancellation</h4>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{booking.flight.fareRules.cancellation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Payment Summary</h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.passengers.length} {booking.passengers.length > 1 ? 'Passengers' : 'Passenger'} ({booking.flight.cabinClass})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    ${booking.payment.subtotal.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Taxes & Fees
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    ${booking.payment.taxes.toFixed(2)}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Total Paid
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    ${booking.payment.total.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">Paid with {booking.payment.method}</span>
                </div>
                <span className="text-sm text-gray-500">Payment ID: {booking.payment.paymentId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Next Steps</h2>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Check-in Online</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Online check-in opens {format(addDays(parseISO(booking.flight.departure.time), -1), 'EEEE, MMMM d')} at {format(parseISO(booking.flight.departure.time), 'h:mm a')}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  You'll receive an email when check-in opens.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <MapPinIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Airport Information</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Arrive at least 2 hours before departure for domestic flights and 3 hours for international flights.
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Terminal {booking.flight.departure.terminal} at {booking.flight.departure.airport} Airport
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <QuestionMarkCircleIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Need Help?</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Contact our customer service for any questions about your booking.
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Email: support@skywings.com | Phone: +1 (800) 123-4567
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
        <Button
          as={Link}
          to="/"
          variant="outline"
          className="inline-flex items-center justify-center"
        >
          <HomeIcon className="h-5 w-5 mr-2" />
          Back to Home
        </Button>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            as={Link}
            to="/my-bookings"
            variant="outline"
            className="inline-flex items-center justify-center"
          >
            <TicketIcon className="h-5 w-5 mr-2" />
            View My Bookings
          </Button>
          <Button
            as={Link}
            to="/flights"
            variant="primary"
            className="inline-flex items-center justify-center"
          >
            <TicketIcon className="h-5 w-5 mr-2" />
            Book Another Flight
          </Button>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            Need to make changes to your booking?{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Manage Booking
            </a>
          </p>
          <div className="mt-4 md:mt-0 flex items-center">
            <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-sm text-gray-500">Secure Booking • 100% Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
