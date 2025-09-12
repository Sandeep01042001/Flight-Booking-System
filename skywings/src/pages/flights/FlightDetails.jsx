import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO, differenceInHours, differenceInMinutes } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plane, Clock, MapPin, Users, Luggage, CreditCard, Shield, Info, AlertCircle } from 'lucide-react';
import { flightService } from '@/services/flightService';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { trackEvent } from '@/utils/analytics';

const FlightDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [selectedFare, setSelectedFare] = useState('economy');
  const [passengerCount, setPassengerCount] = useState(1);

  // Fetch flight details
  const { data: flight, isLoading, error } = useQuery({
    queryKey: ['flight', id],
    queryFn: () => flightService.getFlightById(id),
    enabled: !!id,
  });

  // Track page view
  useEffect(() => {
    if (flight) {
      trackEvent('flight_details_view', { 
        flightId: flight.id,
        from: flight.from,
        to: flight.to,
        airline: flight.airline
      });
    }
  }, [flight]);

  // Handle booking
  const handleBookNow = () => {
    if (!isAuthenticated()) {
      toast({
        title: 'Sign In Required',
        description: 'Please sign in to book this flight',
        action: (
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => navigate('/login', { state: { from: `/flights/${id}` } })}
          >
            Sign In
          </Button>
        ),
      });
      return;
    }
    
    // Navigate to booking page with selected options
    navigate(`/booking/flight/${id}`, {
      state: {
        flight,
        fareType: selectedFare,
        passengerCount,
      },
    });
  };

  // Format flight duration
  const formatDuration = (departure, arrival) => {
    const hours = differenceInHours(new Date(arrival), new Date(departure));
    const minutes = differenceInMinutes(new Date(arrival), new Date(departure)) % 60;
    return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`.trim();
  };

  // Format time
  const formatTime = (dateTime) => {
    return format(parseISO(dateTime), 'h:mm a');
  };

  // Format date
  const formatDate = (dateTime) => {
    return format(parseISO(dateTime), 'EEE, MMM d, yyyy');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error.message || 'Failed to load flight details. Please try again later.'}
              </p>
            </div>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Flights
        </Button>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800">Flight Not Found</h2>
          <p className="mt-2 text-gray-600">The requested flight could not be found.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/flights')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Flights
          </Button>
        </div>
      </div>
    );
  }

  // Fare options
  const fareOptions = [
    {
      id: 'economy',
      name: 'Economy',
      price: flight.price,
      benefits: [
        'Standard legroom',
        'Free carry-on (7kg)',
        'Meal available for purchase',
        'Seat selection for a fee',
      ],
    },
    {
      id: 'premium_economy',
      name: 'Premium Economy',
      price: Math.round(flight.price * 1.5),
      benefits: [
        'Extra legroom',
        'Free carry-on (7kg)',
        'Complimentary meal',
        'Free seat selection',
        'Priority boarding',
      ],
    },
    {
      id: 'business',
      name: 'Business Class',
      price: Math.round(flight.price * 2.5),
      benefits: [
        'Luxury seating',
        '2 checked bags (23kg each)',
        'Gourmet meals',
        'Free seat selection',
        'Priority boarding & check-in',
        'Lounge access',
      ],
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Results
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flight Summary Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">
                    {flight.origin} to {flight.destination}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {formatDate(flight.departureTime)} • {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-sm">
                  {flight.aircraft}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatTime(flight.departureTime)}</div>
                  <div className="text-sm text-gray-500">{flight.from}</div>
                  <div className="text-xs text-gray-400">{formatDate(flight.departureTime)}</div>
                </div>
                
                <div className="flex-1 px-4">
                  <div className="relative">
                    <div className="h-px bg-gray-300 w-full absolute top-1/2"></div>
                    <div className="absolute -top-3 left-0 right-0 flex justify-between">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <Plane className="h-6 w-6 text-blue-500 transform rotate-90" />
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    </div>
                  </div>
                  <div className="text-center text-sm text-gray-500 mt-6">
                    {formatDuration(flight.departureTime, flight.arrivalTime)} • {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatTime(flight.arrivalTime)}</div>
                  <div className="text-sm text-gray-500">{flight.to}</div>
                  <div className="text-xs text-gray-400">{formatDate(flight.arrivalTime)}</div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="font-medium text-gray-500">Flight Number</div>
                  <div>{flight.flightNumber}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-gray-500">Airline</div>
                  <div>{flight.airline}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-gray-500">Aircraft</div>
                  <div>{flight.aircraft}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-gray-500">Seats Available</div>
                  <div>{flight.seatsAvailable}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-gray-500">Fare Type</div>
                  <div>{flight.fareType}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Flight Details Tabs */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Flight Details</TabsTrigger>
              <TabsTrigger value="baggage">Baggage</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Flight Itinerary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Plane className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium">Departure</h4>
                      <p className="text-sm text-gray-500">
                        {flight.origin} ({flight.from}) • {formatDate(flight.departureTime)}
                      </p>
                      <p className="text-sm text-gray-500">{formatTime(flight.departureTime)} - {formatTime(flight.arrivalTime)}</p>
                    </div>
                  </div>
                  
                  <div className="border-l-2 border-gray-200 ml-5 pl-8 py-2">
                    <div className="text-sm text-gray-500">
                      <div className="font-medium">{flight.airline} {flight.flightNumber}</div>
                      <div>Duration: {formatDuration(flight.departureTime, flight.arrivalTime)}</div>
                      <div>Aircraft: {flight.aircraft}</div>
                      <div>Travel Class: Economy</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium">Arrival</h4>
                      <p className="text-sm text-gray-500">
                        {flight.destination} ({flight.to}) • {formatDate(flight.arrivalTime)}
                      </p>
                      <p className="text-sm text-gray-500">{formatTime(flight.arrivalTime)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="baggage" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Baggage Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium flex items-center">
                        <Luggage className="h-5 w-5 mr-2 text-blue-600" />
                        Cabin Baggage
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {flight.baggage?.cabin || '1 cabin bag (up to 7kg) and 1 personal item (laptop bag/handbag)'}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium flex items-center">
                        <Luggage className="h-5 w-5 mr-2 text-blue-600" />
                        Checked Baggage
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {flight.baggage?.checkIn || '15kg included'}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Additional baggage can be purchased during booking or at the airport.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                      <h4 className="font-medium flex items-center text-yellow-800">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        Important Notes
                      </h4>
                      <ul className="text-sm text-yellow-700 list-disc pl-5 mt-2 space-y-1">
                        <li>Carry-on dimensions should not exceed 56cm x 36cm x 23cm</li>
                        <li>Liquids in carry-on must be in containers of 100ml or less</li>
                        <li>Check-in closes 45 minutes before departure</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="policies" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Fare Rules & Policies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-blue-600" />
                      Cancellation Policy
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {flight.fareType === 'Refundable' 
                        ? 'Fully refundable. Cancel up to 2 hours before departure for a full refund.'
                        : 'Non-refundable. Changes or cancellations not permitted after booking.'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium flex items-center">
                      <Info className="h-5 w-5 mr-2 text-blue-600" />
                      Date Change Policy
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {flight.fareType === 'Refundable'
                        ? 'Date changes allowed up to 2 hours before departure with no change fee.'
                        : 'Date changes subject to availability and change fees.'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">General Conditions</h4>
                    <ul className="text-sm text-gray-600 list-disc pl-5 mt-1 space-y-1">
                      <li>Valid photo ID is mandatory for check-in</li>
                      <li>Check-in opens 48 hours before departure</li>
                      <li>Gates close 20 minutes before departure</li>
                      <li>Unaccompanied minors and special assistance available upon request</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Booking Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-xl">Book Your Flight</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Fare Selection */}
              <div>
                <h3 className="text-sm font-medium mb-2">Select Fare Type</h3>
                <div className="space-y-2">
                  {fareOptions.map((fare) => (
                    <div 
                      key={fare.id}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        selectedFare === fare.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedFare(fare.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{fare.name}</div>
                          <div className="text-sm text-gray-500">
                            ₹{fare.price.toLocaleString('en-IN')}
                          </div>
                        </div>
                        {selectedFare === fare.id && (
                          <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <ul className="text-xs text-gray-500 mt-2 space-y-1">
                        {fare.benefits.slice(0, 2).map((benefit, i) => (
                          <li key={i} className="flex items-center">
                            <svg className="h-3 w-3 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {benefit}
                          </li>
                        ))}
                        {fare.benefits.length > 2 && (
                          <li className="text-blue-600">+{fare.benefits.length - 2} more benefits</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Passenger Count */}
              <div>
                <h3 className="text-sm font-medium mb-2">Passengers</h3>
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button 
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() => setPassengerCount(prev => Math.max(1, prev - 1))}
                    type="button"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center">
                    {passengerCount} {passengerCount === 1 ? 'Passenger' : 'Passengers'}
                  </div>
                  <button 
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() => setPassengerCount(prev => Math.min(9, prev + 1))}
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
              
              {/* Price Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Base Fare (x{passengerCount})</span>
                  <span>₹{(fareOptions.find(f => f.id === selectedFare)?.price * passengerCount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span>₹{(500 * passengerCount).toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t mt-3 pt-3 flex justify-between font-medium">
                  <span>Total Amount</span>
                  <span className="text-lg">
                    ₹{((fareOptions.find(f => f.id === selectedFare)?.price + 500) * passengerCount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              
              {/* Book Now Button */}
              <Button 
                className="w-full mt-4 py-6 text-lg"
                size="lg"
                onClick={handleBookNow}
              >
                Book Now
              </Button>
              
              {/* Price Guarantee */}
              <div className="text-center text-sm text-gray-500 mt-2">
                <Shield className="h-4 w-4 inline-block mr-1" />
                Best Price Guaranteed
              </div>
            </CardContent>
          </Card>
          
          {/* Why Book With Us */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Why Book With Us?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Secure Booking</div>
                  <p className="text-gray-500">Your personal and payment details are protected</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">24/7 Support</div>
                  <p className="text-gray-500">Round-the-clock assistance for your travel needs</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Flexible Payments</div>
                  <p className="text-gray-500">Multiple payment options available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;
