import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO, addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Loader2, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  User, 
  Plane, 
  MapPin, 
  Clock, 
  Calendar, 
  Ticket, 
  Luggage, 
  Smartphone, 
  Mail, 
  Download, 
  Printer, 
  Share2,
  Info,
  ChevronRight,
  Check
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { bookingService } from '@/services/bookingService';
import { flightService } from '@/services/flightService';
import { useToast } from '@/components/ui/use-toast';
import { trackEvent } from '@/utils/analytics';

const CheckIn = () => {
  const { id: bookingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // State
  const [activeTab, setActiveTab] = useState('passengers');
  const [selectedPassengers, setSelectedPassengers] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState({});
  const [mealPreferences, setMealPreferences] = useState({});
  const [contactInfo, setContactInfo] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [isCheckInComplete, setIsCheckInComplete] = useState(false);
  const [isSeatMapOpen, setIsSeatMapOpen] = useState(false);
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
  
  // Fetch booking details
  const { data: booking, isLoading, isError, error } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingService.getBooking(bookingId),
    enabled: !!bookingId,
    onSuccess: (data) => {
      // Initialize selected passengers with all passengers
      if (data?.passengers) {
        setSelectedPassengers(data.passengers.map(p => p.id));
        
        // Initialize seat selections and meal preferences
        const initialSeats = {};
        const initialMeals = {};
        
        data.passengers.forEach(passenger => {
          if (passenger.seatNumber) {
            initialSeats[passenger.id] = passenger.seatNumber;
          }
          if (passenger.mealPreference) {
            initialMeals[passenger.id] = passenger.mealPreference;
          } else {
            initialMeals[passenger.id] = 'none';
          }
        });
        
        setSelectedSeats(initialSeats);
        setMealPreferences(initialMeals);
      }
    },
  });
  
  // Check if check-in is available
  const isCheckInAvailable = () => {
    if (!booking?.flight?.departureTime) return false;
    
    const departureTime = new Date(booking.flight.departureTime);
    const now = new Date();
    const hoursUntilDeparture = (departureTime - now) / (1000 * 60 * 60);
    
    // Check-in is typically available between 48 hours and 1 hour before departure
    return hoursUntilDeparture <= 48 && hoursUntilDeparture >= 1;
  };
  
  // Check-in mutation
  const checkInMutation = useMutation({
    mutationFn: (checkInData) => bookingService.checkIn(bookingId, checkInData),
    onSuccess: () => {
      queryClient.invalidateQueries(['booking', bookingId]);
      setIsCheckInComplete(true);
      trackEvent('check_in_success', { bookingId, passengerCount: selectedPassengers.length });
      
      toast({
        title: 'Check-in Complete!',
        description: 'Your check-in was successful. Your boarding pass has been sent to your email.',
      });
    },
    onError: (error) => {
      trackEvent('check_in_error', { error: error.message, bookingId });
      
      toast({
        title: 'Check-in Failed',
        description: error.message || 'There was an error processing your check-in. Please try again.',
        variant: 'destructive',
      });
    },
  });
  
  // Handle passenger selection
  const togglePassengerSelection = (passengerId) => {
    setSelectedPassengers(prev => 
      prev.includes(passengerId)
        ? prev.filter(id => id !== passengerId)
        : [...prev, passengerId]
    );
  };
  
  // Handle seat selection
  const handleSeatSelect = (passengerId, seatNumber) => {
    setSelectedSeats(prev => ({
      ...prev,
      [passengerId]: seatNumber,
    }));
    
    // Move to next passenger if available
    if (currentPassengerIndex < (booking?.passengers?.length - 1)) {
      setCurrentPassengerIndex(currentPassengerIndex + 1);
    }
  };
  
  // Handle meal preference change
  const handleMealPreferenceChange = (passengerId, preference) => {
    setMealPreferences(prev => ({
      ...prev,
      [passengerId]: preference,
    }));
  };
  
  // Handle contact info change
  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle check-in submission
  const handleCheckIn = () => {
    if (selectedPassengers.length === 0) {
      toast({
        title: 'No Passengers Selected',
        description: 'Please select at least one passenger to check in.',
        variant: 'destructive',
      });
      return;
    }
    
    // Validate all selected passengers have seats assigned
    const passengersWithoutSeats = selectedPassengers.filter(
      passengerId => !selectedSeats[passengerId]
    );
    
    if (passengersWithoutSeats.length > 0) {
      toast({
        title: 'Seat Selection Required',
        description: 'Please select seats for all passengers before checking in.',
        variant: 'destructive',
      });
      return;
    }
    
    // Prepare check-in data
    const checkInData = {
      passengerIds: selectedPassengers,
      seatAssignments: selectedSeats,
      mealPreferences: mealPreferences,
      contactInfo: contactInfo,
    };
    
    // Submit check-in
    checkInMutation.mutate(checkInData);
  };
  
  // Render passenger list
  const renderPassengerList = () => {
    if (!booking?.passengers) return null;
    
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-medium text-blue-800 flex items-center">
            <Info className="h-4 w-4 mr-2" />
            Select passengers to check in
          </h3>
          <p className="text-sm text-blue-700 mt-1">
            You can check in up to {booking.passengers.length} passengers on this booking.
          </p>
        </div>
        
        <div className="space-y-3">
          {booking.passengers.map((passenger) => (
            <div 
              key={passenger.id}
              className={`p-4 border rounded-lg transition-colors cursor-pointer ${
                selectedPassengers.includes(passenger.id) 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'hover:border-gray-300'
              }`}
              onClick={() => togglePassengerSelection(passenger.id)}
            >
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <Checkbox 
                    id={`passenger-${passenger.id}`}
                    checked={selectedPassengers.includes(passenger.id)}
                    onClick={(e) => e.stopPropagation()}
                    onCheckedChange={() => togglePassengerSelection(passenger.id)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3">
                  <div className="flex items-center">
                    <Label 
                      htmlFor={`passenger-${passenger.id}`} 
                      className="text-base font-medium text-gray-900"
                    >
                      {passenger.firstName} {passenger.lastName}
                    </Label>
                    {passenger.isInfant && (
                      <Badge variant="outline" className="ml-2 text-xs">Infant</Badge>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {passenger.passportNumber && (
                      <div>Passport: {passenger.passportNumber}</div>
                    )}
                    {selectedSeats[passenger.id] && (
                      <div>Seat: {selectedSeats[passenger.id]}</div>
                    )}
                  </div>
                </div>
                <div className="ml-auto">
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end mt-6">
          <Button 
            onClick={() => setActiveTab('seats')}
            disabled={selectedPassengers.length === 0}
          >
            Continue to Seat Selection
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  
  // Render seat selection
  const renderSeatSelection = () => {
    if (!booking?.passengers) return null;
    
    const currentPassenger = booking.passengers.find(p => p.id === selectedPassengers[currentPassengerIndex]);
    if (!currentPassenger) return null;
    
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-medium text-blue-800">
            Select seats for {currentPassenger.firstName} {currentPassenger.lastName}
          </h3>
          <p className="text-sm text-blue-700 mt-1">
            {currentPassengerIndex + 1} of {selectedPassengers.length} passengers
          </p>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-medium">
                {booking.flight.airline} {booking.flight.flightNumber}
              </h4>
              <p className="text-sm text-gray-500">
                {booking.flight.origin} to {booking.flight.destination}
              </p>
            </div>
            <div className="text-right">
              <div className="font-medium">
                {format(parseISO(booking.flight.departureTime), 'MMM d, yyyy')}
              </div>
              <div className="text-sm text-gray-500">
                {format(parseISO(booking.flight.departureTime), 'h:mm a')}
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Cabin View
              </span>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="text-center mb-2">
              <div className="w-24 h-8 bg-gray-200 mx-auto rounded-t-lg"></div>
              <div className="text-xs text-gray-500 mt-1">Front of Cabin</div>
            </div>
            
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full py-2">
                <div className="grid grid-cols-8 gap-2">
                  {/* Left side seats */}
                  <div className="col-span-3 grid grid-cols-3 gap-2">
                    {renderSeatGrid('left', 10, currentPassenger.id)}
                  </div>
                  
                  {/* Aisle */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="h-full w-1 bg-gray-200"></div>
                  </div>
                  
                  {/* Right side seats */}
                  <div className="col-span-3 grid grid-cols-3 gap-2">
                    {renderSeatGrid('right', 10, currentPassenger.id)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center space-x-6">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Selected</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Occupied</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-400 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Premium</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={() => setActiveTab('passengers')}
          >
            Back to Passengers
          </Button>
          <Button 
            onClick={() => {
              if (currentPassengerIndex < selectedPassengers.length - 1) {
                setCurrentPassengerIndex(currentPassengerIndex + 1);
              } else {
                setActiveTab('meals');
              }
            }}
            disabled={!selectedSeats[currentPassenger.id]}
          >
            {currentPassengerIndex < selectedPassengers.length - 1 ? 'Next Passenger' : 'Continue to Meals'}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  
  // Render seat grid
  const renderSeatGrid = (side, rows, passengerId) => {
    const seatLetters = side === 'left' ? ['A', 'B', 'C'] : ['D', 'E', 'F'];
    const seats = [];
    
    for (let row = 1; row <= rows; row++) {
      for (let col = 0; col < 3; col++) {
        const seatNumber = `${row}${seatLetters[col]}`;
        const isOccupied = Math.random() < 0.3; // 30% chance a seat is occupied
        const isPremium = row <= 3; // First 3 rows are premium
        const isSelected = selectedSeats[passengerId] === seatNumber;
        const isEmergencyExit = row === 5; // Row 5 is emergency exit
        
        // Skip seats that are already assigned to other passengers
        const isAssignedToOther = Object.entries(selectedSeats)
          .some(([pid, seat]) => seat === seatNumber && pid !== passengerId);
        
        // Determine seat class
        let seatClass = 'bg-white border-gray-300 hover:border-blue-500';
        if (isSelected) {
          seatClass = 'bg-blue-500 text-white border-blue-500';
        } else if (isOccupied || isAssignedToOther) {
          seatClass = 'bg-gray-200 border-gray-300 cursor-not-allowed';
        } else if (isPremium) {
          seatClass = 'bg-yellow-50 border-yellow-300 hover:border-yellow-400';
        }
        
        seats.push(
          <button
            key={`${side}-${row}-${col}`}
            className={`w-12 h-12 rounded flex items-center justify-center font-medium text-sm border-2 ${seatClass} ${
              isEmergencyExit ? 'border-dashed' : ''
            }`}
            disabled={isOccupied || isAssignedToOther}
            onClick={() => handleSeatSelect(passengerId, seatNumber)}
            title={isEmergencyExit ? 'Emergency Exit Row' : ''}
          >
            {seatNumber}
          </button>
        );
      }
    }
    
    return seats;
  };
  
  // Render meal selection
  const renderMealSelection = () => {
    if (!booking?.passengers) return null;
    
    const selectedPassengerList = booking.passengers.filter(
      p => selectedPassengers.includes(p.id)
    );
    
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-medium text-blue-800">Meal Preferences</h3>
          <p className="text-sm text-blue-700 mt-1">
            Select meal preferences for each passenger (if applicable)
          </p>
        </div>
        
        <div className="space-y-6">
          {selectedPassengerList.map((passenger) => (
            <Card key={passenger.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {passenger.firstName} {passenger.lastName}
                </CardTitle>
                <CardDescription>
                  Seat: {selectedSeats[passenger.id] || 'Not assigned'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: 'vegetarian', label: 'Vegetarian', description: 'Plant-based meals' },
                    { id: 'non-vegetarian', label: 'Non-Vegetarian', description: 'Includes meat and fish' },
                    { id: 'vegan', label: 'Vegan', description: 'No animal products' },
                    { id: 'gluten-free', label: 'Gluten-Free', description: 'No gluten ingredients' },
                    { id: 'diabetic', label: 'Diabetic', description: 'Low sugar options' },
                    { id: 'child', label: 'Child Meal', description: 'For children under 12' },
                    { id: 'fruit', label: 'Fruit Platter', description: 'Fresh fruit selection' },
                    { id: 'none', label: 'No Meal', description: 'I don\'t want a meal' },
                  ].map((meal) => (
                    <div 
                      key={meal.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        mealPreferences[passenger.id] === meal.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => handleMealPreferenceChange(passenger.id, meal.id)}
                    >
                      <div className="flex items-start">
                        <div className="flex items-center h-5 mt-0.5">
                          <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                            mealPreferences[passenger.id] === meal.id 
                              ? 'border-blue-500 bg-blue-500' 
                              : 'border-gray-300'
                          }`}>
                            {mealPreferences[passenger.id] === meal.id && (
                              <Check className="h-2.5 w-2.5 text-white" />
                            )}
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">{meal.label}</div>
                          <div className="text-sm text-gray-500">{meal.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={() => setActiveTab('seats')}
          >
            Back to Seat Selection
          </Button>
          <Button 
            onClick={() => setActiveTab('contact')}
          >
            Continue to Contact Information
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  
  // Render contact information
  const renderContactInfo = () => {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-medium text-blue-800">Contact Information</h3>
          <p className="text-sm text-blue-700 mt-1">
            We'll send your boarding pass to this email and phone number
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={contactInfo.email}
                  onChange={handleContactInfoChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Mobile Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={contactInfo.phone}
                  onChange={handleContactInfoChange}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-md">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800">Important Information</h4>
                  <ul className="list-disc list-inside text-sm text-yellow-700 mt-1 space-y-1">
                    <li>Please ensure your contact information is correct</li>
                    <li>Your boarding pass will be sent to the email and phone number provided</li>
                    <li>You can also access your boarding pass in the app</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={() => setActiveTab('meals')}
          >
            Back to Meal Selection
          </Button>
          <Button 
            onClick={handleCheckIn}
            disabled={!contactInfo.email || !contactInfo.phone}
          >
            Complete Check-In
          </Button>
        </div>
      </div>
    );
  };
  
  // Render check-in complete
  const renderCheckInComplete = () => {
    if (!booking) return null;
    
    return (
      <div className="text-center py-12">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Check-In Complete!</h2>
        <p className="mt-2 text-gray-600">
          Your boarding pass has been sent to {contactInfo.email}
        </p>
        
        <div className="mt-8 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  Boarding Pass
                </div>
                <p className="mt-1 text-gray-500">
                  {booking.bookingReference}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Flight</div>
                <div className="text-lg font-bold">
                  {booking.flight.airline} {booking.flight.flightNumber}
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">From</div>
                <div className="text-lg font-bold">{booking.flight.origin}</div>
                <div className="text-sm text-gray-500">
                  {format(parseISO(booking.flight.departureTime), 'MMM d, yyyy h:mm a')}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">To</div>
                <div className="text-lg font-bold">{booking.flight.destination}</div>
                <div className="text-sm text-gray-500">
                  {format(parseISO(booking.flight.arrivalTime), 'MMM d, yyyy h:mm a')}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Passenger</div>
                <div className="font-medium">
                  {booking.passengers.map(p => `${p.firstName} ${p.lastName}`).join(', ')}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Seat</div>
                <div className="font-medium">
                  {Object.values(selectedSeats).join(', ')}
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="ml-2">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm" className="ml-2">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <Button onClick={() => navigate('/bookings')}>
            View All Bookings
          </Button>
        </div>
      </div>
    );
  };
  
  // Render check-in not available
  const renderCheckInNotAvailable = () => {
    if (!booking?.flight?.departureTime) return null;
    
    const departureTime = new Date(booking.flight.departureTime);
    const now = new Date();
    const hoursUntilDeparture = (departureTime - now) / (1000 * 60 * 60);
    
    let message = '';
    if (hoursUntilDeparture > 48) {
      message = `Check-in will open on ${format(addDays(now, -2), 'MMM d, yyyy h:mm a')}`;
    } else if (hoursUntilDeparture < 1) {
      message = 'Check-in has closed for this flight. Please see an agent at the airport.';
    } else {
      message = 'Check-in is not available at this time. Please try again later.';
    }
    
    return (
      <div className="text-center py-12">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
          <AlertCircle className="h-8 w-8 text-yellow-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Check-In Not Available</h2>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">
          {message}
        </p>
        
        <div className="mt-8">
          <Button onClick={() => navigate('/bookings')}>
            View All Bookings
          </Button>
        </div>
      </div>
    );
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading booking details...</p>
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
          <h2 className="text-xl font-bold mb-2">Error Loading Booking</h2>
          <p className="text-gray-600 mb-6">
            {error.message || 'There was an error loading your booking details.'}
          </p>
          <Button onClick={() => navigate('/bookings')}>
            View My Bookings
          </Button>
        </div>
      </div>
    );
  }
  
  // Check if check-in is available
  if (!isCheckInAvailable() && !isCheckInComplete) {
    return renderCheckInNotAvailable();
  }
  
  // Render check-in complete view
  if (isCheckInComplete) {
    return renderCheckInComplete();
  }
  
  // Render main check-in flow
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="pl-0"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Booking
        </Button>
        <h1 className="text-2xl font-bold mt-2">Online Check-In</h1>
        <p className="text-gray-600">
          Complete your check-in and get your boarding pass
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between relative">
            {['Passengers', 'Seats', 'Meals', 'Contact'].map((step, index) => {
              const stepNumber = index + 1;
              let stepState = 'upcoming';
              
              if (activeTab === 'passengers' && stepNumber === 1) stepState = 'current';
              else if (activeTab === 'seats' && stepNumber === 2) stepState = 'current';
              else if (activeTab === 'meals' && stepNumber === 3) stepState = 'current';
              else if (activeTab === 'contact' && stepNumber === 4) stepState = 'current';
              else if (
                (stepNumber === 1) ||
                (stepNumber === 2 && ['seats', 'meals', 'contact'].includes(activeTab)) ||
                (stepNumber === 3 && ['meals', 'contact'].includes(activeTab)) ||
                (stepNumber === 4 && activeTab === 'contact')
              ) {
                stepState = 'complete';
              }
              
              return (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                    stepState === 'current' 
                      ? 'bg-blue-600 text-white border-2 border-blue-600' 
                      : stepState === 'complete'
                        ? 'bg-green-100 text-green-600 border-2 border-green-600'
                        : 'bg-gray-100 text-gray-400 border-2 border-gray-300'
                  }`}>
                    {stepState === 'complete' ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    stepState === 'current' 
                      ? 'text-blue-600' 
                      : stepState === 'complete'
                        ? 'text-green-600'
                        : 'text-gray-500'
                  }`}>
                    {step}
                  </span>
                </div>
              );
            })}
            
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
              <div 
                className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
                style={{
                  width: activeTab === 'passengers' 
                    ? '12.5%' 
                    : activeTab === 'seats' 
                      ? '37.5%' 
                      : activeTab === 'meals' 
                        ? '62.5%' 
                        : '100%',
                }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Check-in Content */}
        <Card className="mb-8">
          <CardContent className="p-6">
            {activeTab === 'passengers' && renderPassengerList()}
            {activeTab === 'seats' && renderSeatSelection()}
            {activeTab === 'meals' && renderMealSelection()}
            {activeTab === 'contact' && renderContactInfo()}
          </CardContent>
        </Card>
        
        {/* Flight Summary */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Flight Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{booking.flight.origin}</div>
                <div className="text-sm text-gray-500">
                  {format(parseISO(booking.flight.departureTime), 'MMM d, yyyy')}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-500">
                  {booking.flight.duration}
                </div>
                <div className="relative w-32 h-px bg-gray-300 my-2">
                  <div className="absolute left-0 top-1/2 w-2 h-2 rounded-full bg-gray-400 transform -translate-y-1/2"></div>
                  <div className="absolute right-0 top-1/2 w-2 h-2 rounded-full bg-gray-400 transform -translate-y-1/2"></div>
                </div>
                <div className="text-xs text-gray-500">
                  {booking.flight.stops === 0 ? 'Non-stop' : `${booking.flight.stops} stop${booking.flight.stops > 1 ? 's' : ''}`}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold">{booking.flight.destination}</div>
                <div className="text-sm text-gray-500">
                  {format(parseISO(booking.flight.arrivalTime), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Flight Number</div>
                <div className="font-medium">{booking.flight.airline} {booking.flight.flightNumber}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Departure</div>
                <div className="font-medium">
                  {format(parseISO(booking.flight.departureTime), 'h:mm a')}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Arrival</div>
                <div className="font-medium">
                  {format(parseISO(booking.flight.arrivalTime), 'h:mm a')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckIn;
