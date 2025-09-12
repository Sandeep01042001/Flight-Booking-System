import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { ArrowLeft, Loader2, User, Plane, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { 
  getFlightById, 
  getAvailableSeats,
  searchFlights
} from "@/services/flightService";
import { useAuth } from "@/contexts/AuthContext";
import Payment from './components/Payment';
import BookingSummary from './components/BookingSummary';

// Form validation schemas
const passengerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select a gender',
  }),
  dateOfBirth: z.string().refine((val) => {
    if (!val) return false;
    const dob = new Date(val);
    const today = new Date();
    return dob < today;
  }, 'Please enter a valid date of birth'),
  passportNumber: z.string().min(5, 'Passport number must be at least 5 characters'),
  nationality: z.string().min(2, 'Please select a nationality'),
});

const contactSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
});

const Booking = () => {
  const { id: flightId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);
  const [isSeatMapOpen, setIsSeatMapOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState({});
  const [bookingData, setBookingData] = useState({
    flight: null,
    passengers: [],
    contactInfo: {},
    payment: {},
  });

  // Initialize forms
  const passengerForm = useForm({
    resolver: zodResolver(passengerSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      gender: 'male',
      dateOfBirth: '',
      passportNumber: '',
      nationality: 'IN',
    },
  });

  const contactForm = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: user?.email || '',
      phone: user?.phone || '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
    },
  });

  // Fetch flight details
  const { data: flight, isLoading: isFlightLoading } = useQuery({
    queryKey: ['flight', flightId],
    queryFn: () => getFlightById(flightId),
    enabled: !!flightId,
    onSuccess: (data) => {
      setBookingData(prev => ({
        ...prev,
        flight: data,
        passengers: Array(passengerCount).fill().map(() => ({
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          gender: 'male',
          dateOfBirth: '',
          passportNumber: '',
          nationality: 'IN',
        })),
      }));
    },
  });

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
    // Handle form submission
  };

  // Handle form navigation
  const nextStep = () => {
    setStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  // Handle payment submission
  const handlePaymentSubmit = async (paymentData) => {
    try {
      setIsSubmitting(true);
      // Process payment and create booking
      const booking = await createBooking({
        ...bookingData,
        payment: paymentData,
      });
      
      // Navigate to confirmation page
      navigate(`/booking/confirmation/${booking.id}`);
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Error',
        description: 'There was an error processing your payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total amount
  const calculateTotal = () => {
    if (!flight) return 0;
    const basePrice = flight.price || 0;
    const taxes = flight.taxes || 0;
    return (basePrice + taxes) * passengerCount;
  };

  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderPassengerForm();
      case 2:
        return renderContactForm();
      case 3:
        return (
          <Payment
            onPaymentSubmit={handlePaymentSubmit}
            onBack={prevStep}
            isLoading={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  const renderPassengerForm = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Passenger Details</h2>
        <Card>
          <CardContent className="pt-6">
            <form className="space-y-4">
              {Array.from({ length: passengerCount }).map((_, index) => (
                <div key={index} className="space-y-4 mb-6">
                  <h3 className="text-lg font-medium">Passenger {index + 1} {index === 0 && '(Primary Passenger)'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={passengerForm.control}
                      name={`passengers.${index}.firstName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passengerForm.control}
                      name={`passengers.${index}.lastName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passengerForm.control}
                      name={`passengers.${index}.gender`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passengerForm.control}
                      name={`passengers.${index}.dateOfBirth`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passengerForm.control}
                      name={`passengers.${index}.passportNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passport Number</FormLabel>
                          <FormControl>
                            <Input placeholder="A1234567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passengerForm.control}
                      name={`passengers.${index}.nationality`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationality</FormLabel>
                          <FormControl>
                            <Input placeholder="Country" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setPassengerCount(prev => Math.max(1, prev - 1))}
                  disabled={passengerCount <= 1}
                >
                  Remove Passenger
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setPassengerCount(prev => Math.min(9, prev + 1))}
                  disabled={passengerCount >= 9}
                >
                  Add Passenger
                </Button>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button 
                  onClick={() => {
                    nextStep();
                  }}
                >
                  Continue to Contact Details
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderContactForm = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Contact Information</h2>
        <Card>
          <CardContent className="pt-6">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={contactForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+1 (123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="United States" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="10001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="mt-8 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                >
                  Back to Passengers
                </Button>
                <Button 
                  onClick={() => {
                    contactForm.handleSubmit((data) => {
                      setBookingData(prev => ({
                        ...prev,
                        contactInfo: data,
                      }));
                      nextStep();
                    })();
                  }}
                >
                  Continue to Payment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render loading state
  if (isFlightLoading || !flight) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Complete Your Booking</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {renderStepContent()}
            </div>
            
            <div className="lg:col-span-1">
              <BookingSummary 
                flight={flight} 
                passengerCount={passengerCount}
                totalPrice={calculateTotal()}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Booking Summary */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-10">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">
              ₹{calculateTotal().toLocaleString('en-IN')}
            </div>
            <div className="text-sm text-gray-500">
              {passengerCount} {passengerCount === 1 ? 'Passenger' : 'Passengers'}
            </div>
          </div>
          <Button 
            className="flex-1 max-w-xs ml-4"
            onClick={() => {
              if (step === 1) {
                passengerForm.handleSubmit(() => nextStep())();
              } else if (step === 2) {
                contactForm.handleSubmit(() => nextStep())();
              } else {
                // Handle booking submission
              }
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : step === 3 ? (
              'Complete Booking'
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
