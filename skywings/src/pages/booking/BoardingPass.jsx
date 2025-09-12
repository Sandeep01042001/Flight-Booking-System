import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO, addMinutes } from 'date-fns';
import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useEffect } from 'react';
import { 
  Download, 
  Printer, 
  Share2, 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Smartphone, 
  Mail, 
  Loader2,
  X,
  Check,
  AlertCircle,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { bookingService } from '@/services/bookingService';
import { flightService } from '@/services/flightService';
import { useAuth } from '@/hooks/useAuth';
import { trackEvent } from '@/utils/analytics';

const BoardingPass = () => {
  const { id: bookingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const boardingPassRef = useRef();
  const [isPrinting, setIsPrinting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  // Fetch booking details
  const { 
    data: booking, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingService.getBooking(bookingId),
    enabled: !!bookingId,
  });
  
  // Handle print
  const handlePrint = useReactToPrint({
    content: () => boardingPassRef.current,
    onBeforeGetContent: () => {
      setIsPrinting(true);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
    },
    onAfterPrint: () => {
      setIsPrinting(false);
      trackEvent('boarding_pass_printed', { bookingId });
    },
  });
  
  // Handle download as PDF
  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    // For now, we'll just show a success message
    toast({
      title: 'Download Started',
      description: 'Your boarding pass is being downloaded as a PDF.',
    });
    trackEvent('boarding_pass_downloaded', { bookingId });
  };
  
  // Handle share
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Boarding Pass - ${booking.flight.airline} ${booking.flight.flightNumber}`,
          text: `Your boarding pass for ${booking.flight.origin} to ${booking.flight.destination}`,
          url: window.location.href,
        });
        trackEvent('boarding_pass_shared', { bookingId, method: 'native_share' });
      } else {
        setShowShareOptions(true);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
        toast({
          title: 'Error',
          description: 'Could not share the boarding pass.',
          variant: 'destructive',
        });
      }
    }
  };
  
  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: 'Copied to clipboard!',
      });
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };
  
  // Check if boarding pass is available
  const isBoardingPassAvailable = () => {
    if (!booking) return false;
    
    // Check if check-in is completed
    if (!booking.checkedIn) return false;
    
    // Check if flight has departed
    const departureTime = new Date(booking.flight.departureTime);
    const now = new Date();
    const minutesUntilDeparture = (departureTime - now) / (1000 * 60);
    
    // Boarding pass is available from online check-in until departure
    return minutesUntilDeparture > 0;
  };
  
  // Format time
  const formatTime = (date) => {
    return format(parseISO(date), 'h:mm a');
  };
  
  // Format date
  const formatDate = (date) => {
    return format(parseISO(date), 'EEE, MMM d, yyyy');
  };
  
  // Format duration
  const formatDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate - startDate;
    const diffMins = Math.round(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Calculate boarding time (30 minutes before departure)
  const getBoardingTime = (departureTime) => {
    return addMinutes(parseISO(departureTime), -30);
  };
  
  // Get gate number (mock function)
  const getGateNumber = () => {
    const gates = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'];
    return gates[Math.floor(Math.random() * gates.length)];
  };
  
  // Get seat number (mock function)
  const getSeatNumber = (passenger) => {
    if (passenger.seatNumber) return passenger.seatNumber;
    
    const rows = Array.from({ length: 30 }, (_, i) => i + 1);
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    return `${rows[Math.floor(Math.random() * rows.length)]}${letters[Math.floor(Math.random() * letters.length)]}`;
  };
  
  // Get boarding group (mock function)
  const getBoardingGroup = () => {
    const groups = ['1', '2', '3', '4', '5'];
    return groups[Math.floor(Math.random() * groups.length)];
  };
  
  // Get barcode data (mock function)
  const generateBarcodeData = (bookingRef) => {
    // In a real app, this would generate a proper barcode
    return `BP${bookingRef.replace(/[^0-9]/g, '').padStart(10, '0')}`;
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading boarding pass...</p>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold mb-2">Error Loading Boarding Pass</h2>
          <p className="text-gray-600 mb-6">
            {error.message || 'There was an error loading your boarding pass.'}
          </p>
          <Button onClick={() => navigate('/bookings')}>
            View My Bookings
          </Button>
        </div>
      </div>
    );
  }
  
  // Check if boarding pass is available
  if (!isBoardingPassAvailable()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-2xl font-bold mb-2">Boarding Pass Not Available</h2>
          <p className="text-gray-600 mb-6">
            {!booking.checkedIn 
              ? 'Please complete check-in to get your boarding pass.'
              : 'Your boarding pass will be available after check-in and before departure.'
            }
          </p>
          <div className="space-y-2">
            {!booking.checkedIn && (
              <Button 
                className="w-full" 
                onClick={() => navigate(`/booking/${bookingId}/check-in`)}
              >
                Go to Check-In
              </Button>
            )}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/bookings')}
            >
              View My Bookings
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Get flight details
  const flight = booking.flight;
  const departureTime = parseISO(flight.departureTime);
  const arrivalTime = parseISO(flight.arrivalTime);
  const boardingTime = getBoardingTime(flight.departureTime);
  const gateNumber = getGateNumber();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="pl-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold mt-2">Boarding Pass</h1>
            <p className="text-gray-600">
              {flight.airline} Flight {flight.flightNumber} • {flight.origin} to {flight.destination}
            </p>
          </div>
          
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownload}
              className="hidden sm:flex"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrint}
              className="hidden sm:flex"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShare}
              className="relative"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
              
              {showShareOptions && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="p-2">
                    <button 
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      onClick={() => {
                        copyToClipboard(window.location.href);
                        setShowShareOptions(false);
                      }}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </button>
                    <button 
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      onClick={() => {
                        window.open(`mailto:?subject=Boarding Pass for ${flight.airline} ${flight.flightNumber}&body=Here's your boarding pass: ${window.location.href}`);
                        setShowShareOptions(false);
                      }}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </button>
                  </div>
                </div>
              )}
            </Button>
            
            {/* Mobile buttons */}
            <div className="sm:hidden flex space-x-2">
              <Button variant="outline" size="icon" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handlePrint}>
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Boarding Pass */}
        <div className="space-y-6">
          {booking.passengers.map((passenger, index) => {
            const seatNumber = getSeatNumber(passenger);
            const boardingGroup = getBoardingGroup();
            const barcodeData = generateBarcodeData(booking.bookingReference + passenger.id);
            
            return (
              <div key={passenger.id} className="relative" ref={index === 0 ? boardingPassRef : null}>
                {/* Mobile View */}
                <div className="sm:hidden">
                  <div className="bg-white rounded-t-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs font-medium">PASSAGEIRO / PASSENGER</div>
                          <div className="text-lg font-bold">
                            {passenger.firstName} {passenger.lastName}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-medium">VOO / FLIGHT</div>
                          <div className="text-lg font-bold">{flight.airline} {flight.flightNumber}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Flight Info */}
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="text-2xl font-bold">{flight.origin}</div>
                          <div className="text-sm text-gray-500">
                            {format(departureTime, 'MMM d, yyyy')}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500">
                            {formatDuration(flight.departureTime, flight.arrivalTime)}
                          </div>
                          <div className="h-px w-12 bg-gray-300 my-1"></div>
                          <div className="text-xs text-gray-500">
                            {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{flight.destination}</div>
                          <div className="text-sm text-gray-500">
                            {format(arrivalTime, 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <div className="text-xs text-gray-500">PARTIDA / DEPARTURE</div>
                          <div className="font-medium">{formatTime(departureTime)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">CHEGADA / ARRIVAL</div>
                          <div className="font-medium">{formatTime(arrivalTime)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">ASSENTO / SEAT</div>
                          <div className="font-medium">{seatNumber}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">GRUPO / GROUP</div>
                          <div className="font-medium">{boardingGroup}</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-500 mb-2">EMBARQUE / BOARDING</div>
                        <div className="flex items-center text-sm">
                          <div className="bg-blue-600 text-white rounded-full h-8 w-8 flex items-center justify-center mr-2">
                            {boardingGroup}
                          </div>
                          <div>
                            <div>Starts at {format(boardingTime, 'h:mm a')}</div>
                            <div className="text-xs text-gray-500">Gate closes at {format(departureTime, 'h:mm a')}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Barcode */}
                    <div className="bg-gray-100 p-4 text-center border-t border-gray-200">
                      <div className="font-mono text-sm tracking-widest mb-1">
                        {barcodeData.match(/.{1,4}/g).join(' ')}
                      </div>
                      <div className="h-12 bg-black">
                        {/* Barcode would be rendered here */}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {booking.bookingReference} • {passenger.id}
                      </div>
                    </div>
                  </div>
                  
                  {/* Flight Details */}
                  <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 border-t-0 p-4 mt-1">
                    <h3 className="font-medium mb-2">Flight Details</h3>
                    <div className="space-y-3">
                      <div className="flex">
                        <div className="w-1/3 text-sm text-gray-500">Aircraft</div>
                        <div className="w-2/3">Boeing 737-800</div>
                      </div>
                      <div className="flex">
                        <div className="w-1/3 text-sm text-gray-500">Cabin</div>
                        <div className="w-2/3">Economy</div>
                      </div>
                      <div className="flex">
                        <div className="w-1/3 text-sm text-gray-500">Gate</div>
                        <div className="w-2/3 font-medium">{gateNumber}</div>
                      </div>
                      <div className="flex">
                        <div className="w-1/3 text-sm text-gray-500">Terminal</div>
                        <div className="w-2/3">1</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Desktop View */}
                <div className="hidden sm:block">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex">
                      {/* Left Side - Flight Info */}
                      <div className="w-2/3 p-6 border-r border-gray-200">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <div className="text-xs text-gray-500">PASSAGEIRO / PASSENGER</div>
                            <div className="text-xl font-bold">
                              {passenger.firstName} {passenger.lastName}
                            </div>
                            {passenger.isInfant && (
                              <Badge variant="outline" className="mt-1">Infant</Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">VOO / FLIGHT</div>
                            <div className="text-xl font-bold">{flight.airline} {flight.flightNumber}</div>
                            <div className="text-sm text-gray-500">
                              {formatDate(departureTime)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <div className="text-3xl font-bold">{flight.origin}</div>
                            <div className="text-sm text-gray-500">
                              {format(departureTime, 'h:mm a')}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              {formatDuration(flight.departureTime, flight.arrivalTime)}
                            </div>
                            <div className="relative w-32 h-px bg-gray-300 my-2">
                              <div className="absolute left-0 top-1/2 w-2 h-2 rounded-full bg-gray-400 transform -translate-y-1/2"></div>
                              <div className="absolute right-0 top-1/2 w-2 h-2 rounded-full bg-gray-400 transform -translate-y-1/2"></div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold">{flight.destination}</div>
                            <div className="text-sm text-gray-500">
                              {format(arrivalTime, 'h:mm a')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-6">
                          <div>
                            <div className="text-xs text-gray-500">ASSENTO / SEAT</div>
                            <div className="text-2xl font-bold">{seatNumber}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">GRUPO / GROUP</div>
                            <div className="text-2xl font-bold">{boardingGroup}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">PORTÃO / GATE</div>
                            <div className="text-2xl font-bold">{gateNumber}</div>
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <div className="text-xs text-gray-500 mb-2">EMBARQUE / BOARDING</div>
                          <div className="flex items-center">
                            <div className="bg-blue-600 text-white rounded-full h-10 w-10 flex items-center justify-center text-lg font-bold mr-3">
                              {boardingGroup}
                            </div>
                            <div>
                              <div className="font-medium">Starts at {format(boardingTime, 'h:mm a')}</div>
                              <div className="text-sm text-gray-500">Gate closes at {format(departureTime, 'h:mm a')}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right Side - Barcode */}
                      <div className="w-1/3 bg-gray-50 p-6 flex flex-col">
                        <div className="text-center mb-4">
                          <div className="text-xs text-gray-500 mb-1">CÓDIGO DE BARRAS / BARCODE</div>
                          <div className="font-mono text-sm tracking-widest">
                            {barcodeData}
                          </div>
                        </div>
                        
                        <div className="flex-grow flex items-center justify-center">
                          <div className="w-full h-24 bg-white border border-gray-300 p-2 flex items-center justify-center">
                            {/* Barcode would be rendered here */}
                            <div className="text-xs text-gray-400">BARCODE</div>
                          </div>
                        </div>
                        
                        <div className="text-center mt-4">
                          <div className="text-xs text-gray-500">
                            {booking.bookingReference} • {passenger.id}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {flight.airline} • {format(departureTime, 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Passenger number badge */}
                {booking.passengers.length > 1 && (
                  <div className="absolute -top-3 -right-3 bg-blue-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Important Information */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-medium mb-4">Important Information</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-blue-600" />
                Boarding Process
              </h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Boarding starts {format(boardingTime, 'h:mm a')} - {format(departureTime, 'h:mm a')}</li>
                <li>• Have your boarding pass and ID ready</li>
                <li>• Board when your group is called</li>
                <li>• Gate closes 15 minutes before departure</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Luggage className="h-4 w-4 mr-2 text-blue-600" />
                Baggage Allowance
              </h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• 1 cabin bag (max 7kg, 56x36x23cm)</li>
                <li>• 1 personal item (max 30x20x10cm)</li>
                <li>• Checked baggage: {booking.checkedBags || 0} x 23kg included</li>
                <li>• Excess baggage fees apply for additional items</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
            <div className="text-sm text-gray-600">
              Visit our help center or contact customer service at +1 (800) 123-4567
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This is an electronic boarding pass. You can present this on your mobile device or print it.</p>
          <p className="mt-1">Last updated: {format(new Date(), 'MMM d, yyyy h:mm a')}</p>
        </div>
      </div>
      
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BoardingPass;
