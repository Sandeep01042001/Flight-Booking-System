import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Download, Printer, Mail, Share2, ArrowLeft } from 'lucide-react';
import { getBookingById } from '../../services/bookingService';
import Loader from '../../components/common/Loader';
import { toast } from '@/components/ui/use-toast';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const data = await getBookingById(bookingId);
        setBooking(data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load booking details. Please try again.',
          variant: 'destructive',
        });
        navigate('/my-bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, navigate]);

  const handleDownloadTicket = async () => {
    try {
      setDownloading(true);
      // In a real app, this would generate and download a PDF ticket
      // For now, we'll just simulate the download
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: 'Success',
        description: 'E-ticket downloaded successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error downloading ticket:', error);
      toast({
        title: 'Error',
        description: 'Failed to download ticket. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDownloading(false);
    }
  };

  const handlePrintTicket = () => {
    window.print();
  };

  const handleEmailTicket = async () => {
    try {
      // In a real app, this would send the ticket to the user's email
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('E-ticket has been sent to your email');
    } catch (error) {
      console.error('Error emailing ticket:', error);
      toast.error('Failed to send email. Please try again.');
    }
  };

  const handleShareTicket = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `My Flight Booking - ${booking?.bookingReference}`,
          text: `Check out my flight booking details. Booking Reference: ${booking?.bookingReference}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Booking link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading || !booking) {
    return <Loader />;
  }

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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Flights
          </button>
        </div>

        {/* Confirmation Header */}
        <div className="bg-white rounded-lg shadow-sm border border-green-200 overflow-hidden mb-8">
          <div className="p-6 md:p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600 mb-4">
              Your flight has been successfully booked. A confirmation has been sent to{' '}
              <span className="font-medium">{booking.contactInfo.email}</span>
            </p>
            <div className="bg-blue-50 p-3 rounded-md inline-block">
              <p className="text-sm font-medium text-gray-700">
                Booking Reference: <span className="font-bold">{booking.bookingReference}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Flight Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Itinerary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">Flight Itinerary</h2>
              </div>
              <div className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium">
                      {booking.flight.origin} <span className="text-gray-400">→</span>{' '}
                      {booking.flight.destination}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(booking.flight.departureTime)}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {booking.flight.airline.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          {booking.flight.airline}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {booking.flight.flightNumber} • {booking.flight.aircraft}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatTime(booking.flight.departureTime)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(booking.flight.departureTime)}
                        </div>
                        <div className="mt-1 text-sm font-medium">
                          {booking.flight.origin} Airport
                        </div>
                        <div className="text-xs text-gray-500">
                          Terminal: {booking.flight.originTerminal || 'T1'}
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-xs text-gray-500">
                            {booking.flight.duration} • Non-stop
                          </div>
                          <div className="my-2">
                            <div className="h-px bg-gray-300 w-full relative">
                              <div className="absolute -top-1.5 left-0 w-3 h-3 rounded-full bg-blue-500"></div>
                              <div className="absolute -top-1.5 right-0 w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatTime(booking.flight.arrivalTime)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(booking.flight.arrivalTime)}
                        </div>
                        <div className="mt-1 text-sm font-medium">
                          {booking.flight.destination} Airport
                        </div>
                        <div className="text-xs text-gray-500">
                          Terminal: {booking.flight.destinationTerminal || 'T2'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">Passenger Details</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {booking.passengers.map((passenger, index) => (
                  <div key={index} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {passenger.title} {passenger.firstName} {passenger.lastName}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {passenger.type} • {passenger.gender}
                        </p>
                        {passenger.passportNumber && (
                          <p className="text-sm text-gray-500 mt-1">
                            Passport: {passenger.passportNumber}
                          </p>
                        )}
                        {passenger.seatNumber && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Seat: {passenger.seatNumber}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Confirmed
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Baggage Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">Baggage Information</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Cabin Baggage</h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">1 piece</span> (max 7kg)<br />
                      Max dimensions: 55 x 35 x 25 cm
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Check-in Baggage</h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">1 piece</span> (max 15kg)<br />
                      Max dimensions: 158 cm (L+W+H)
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  * Additional baggage can be purchased during online check-in or at the airport.
                </p>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">Booking Summary</h2>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Booking Reference</span>
                    <span className="text-sm font-medium">{booking.bookingReference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Booking Date</span>
                    <span className="text-sm">{formatDate(booking.bookingDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Passengers</span>
                    <span className="text-sm">{booking.passengers.length}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="font-medium">Total Amount</span>
                    <span className="font-bold text-lg">₹{booking.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleDownloadTicket}
                    disabled={downloading}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {downloading ? (
                      'Downloading...'
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download E-Ticket
                      </>
                    )}
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handlePrintTicket}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </button>
                    <button
                      onClick={handleEmailTicket}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </button>
                  </div>
                  
                  <button
                    onClick={handleShareTicket}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Booking
                  </button>
                </div>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">Help & Support</h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Need to make changes?</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      For changes to your booking, please contact our customer support.
                    </p>
                    <button className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800">
                      Contact Support
                    </button>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900">Check-in Information</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Online check-in opens 48 hours before departure.
                    </p>
                    <Link
                      to={`/check-in`}
                      className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Check-in Online
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
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

export default BookingConfirmation;
