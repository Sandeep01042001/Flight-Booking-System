import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, CreditCard, Wallet, Landmark, Smartphone, Gift, Shield, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { flightService } from '@/services/flightService';
import { bookingService } from '@/services/bookingService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { trackEvent } from '@/utils/analytics';

// Form validation schemas
const creditCardSchema = z.object({
  cardNumber: z.string().min(15, 'Invalid card number'),
  cardHolder: z.string().min(3, 'Card holder name is required'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Invalid expiry date'),
  cvv: z.string().min(3, 'CVV must be at least 3 digits'),
  saveCard: z.boolean().default(false),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

const upiSchema = z.object({
  upiId: z.string().email('Invalid UPI ID').or(z.string().regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/, 'Invalid UPI ID')),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

const netBankingSchema = z.object({
  bank: z.string().min(1, 'Please select a bank'),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

const walletSchema = z.object({
  wallet: z.string().min(1, 'Please select a wallet'),
  mobileNumber: z.string().min(10, 'Mobile number must be 10 digits'),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

const Payment = () => {
  const { id: bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('creditCard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [booking, setBooking] = useState(null);
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState({
    type: 'creditCard',
    lastFour: '',
    brand: '',
  });

  // Initialize forms
  const creditCardForm = useForm({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
      saveCard: false,
      termsAccepted: false,
    },
  });

  const upiForm = useForm({
    resolver: zodResolver(upiSchema),
    defaultValues: {
      upiId: user?.email || '',
      termsAccepted: false,
    },
  });

  const netBankingForm = useForm({
    resolver: zodResolver(netBankingSchema),
    defaultValues: {
      bank: '',
      termsAccepted: false,
    },
  });

  const walletForm = useForm({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      wallet: 'phonepe',
      mobileNumber: user?.phone || '',
      termsAccepted: false,
    },
  });

  // Fetch booking details
  const { data: bookingData, isLoading: isBookingLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingService.getBooking(bookingId),
    enabled: !!bookingId,
    onSuccess: (data) => {
      setBooking(data);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load booking details',
        variant: 'destructive',
      });
      navigate('/bookings');
    },
  });

  // Fetch saved payment methods
  const { data: paymentMethods, isLoading: isPaymentMethodsLoading } = useQuery({
    queryKey: ['paymentMethods', user?.id],
    queryFn: () => bookingService.getSavedPaymentMethods(user?.id),
    enabled: !!user?.id,
    onSuccess: (data) => {
      setSavedCards(data.cards || []);
      // Select the first saved card by default
      if (data.cards?.length > 0) {
        setSelectedCard(data.cards[0].id);
        setPaymentMethod({
          type: 'creditCard',
          lastFour: data.cards[0].lastFour,
          brand: data.cards[0].brand,
        });
      } else {
        setShowNewCardForm(true);
      }
    },
  });

  // Process payment mutation
  const processPaymentMutation = useMutation({
    mutationFn: (paymentData) => bookingService.processPayment(bookingId, paymentData),
    onSuccess: (data) => {
      setIsProcessing(false);
      trackEvent('payment_success', { 
        bookingId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
      });
      
      setPaymentStatus({
        success: true,
        message: 'Payment Successful!',
        details: `Your payment of ₹${(data.amount / 100).toLocaleString('en-IN')} has been processed successfully.`,
        bookingReference: data.bookingReference,
      });
      
      // Redirect to booking confirmation after a delay
      setTimeout(() => {
        navigate(`/booking/confirmation/${bookingId}`);
      }, 3000);
    },
    onError: (error) => {
      setIsProcessing(false);
      trackEvent('payment_error', { 
        error: error.message,
        bookingId,
        paymentMethod: paymentMethod.type,
      });
      
      setPaymentStatus({
        success: false,
        message: 'Payment Failed',
        details: error.message || 'There was an error processing your payment. Please try again or use a different payment method.',
      });
    },
  });

  // Handle payment submission
  const handlePaymentSubmit = (data) => {
    if (!booking) return;
    
    setIsProcessing(true);
    
    // Prepare payment data based on the selected method
    let paymentData = {
      amount: booking.totalAmount * 100, // Convert to paise
      currency: 'INR',
      paymentMethod: paymentMethod.type,
      bookingId: booking.id,
      customer: {
        id: user?.id,
        name: `${user?.firstName} ${user?.lastName}`,
        email: user?.email,
        phone: user?.phone,
      },
    };
    
    // Add payment method specific data
    if (paymentMethod.type === 'creditCard') {
      paymentData = {
        ...paymentData,
        card: {
          number: data.cardNumber.replace(/\s+/g, ''),
          expiryMonth: data.expiryDate.split('/')[0],
          expiryYear: `20${data.expiryDate.split('/')[1]}`,
          cvv: data.cvv,
          name: data.cardHolder,
          saveCard: data.saveCard,
        },
      };
    } else if (paymentMethod.type === 'upi') {
      paymentData = {
        ...paymentData,
        upi: {
          id: data.upiId,
        },
      };
    } else if (paymentMethod.type === 'netbanking') {
      paymentData = {
        ...paymentData,
        bank: {
          code: data.bank,
        },
      };
    } else if (paymentMethod.type === 'wallet') {
      paymentData = {
        ...paymentData,
        wallet: {
          provider: data.wallet,
          mobileNumber: data.mobileNumber,
        },
      };
    }
    
    // Process payment
    processPaymentMutation.mutate(paymentData);
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    
    if (v.length >= 3) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    
    return v;
  };

  // Get card brand from number
  const getCardBrand = (cardNumber) => {
    // Remove all non-digit characters
    const cleanNumber = cardNumber.replace(/\D/g, '');
    
    // Visa
    if (/^4/.test(cleanNumber)) return 'visa';
    
    // Mastercard
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
    
    // AMEX
    if (/^3[47]/.test(cleanNumber)) return 'amex';
    
    // Discover
    if (/^6(?:011|5)/.test(cleanNumber)) return 'discover';
    
    // Diners
    if (/^3(?:0[0-5]|[68][0-9])/.test(cleanNumber)) return 'diners';
    
    // JCB
    if (/^35(2[89]|[3-8][0-9])/.test(cleanNumber)) return 'jcb';
    
    // Default to generic card
    return 'credit';
  };

  // Render payment form based on selected method
  const renderPaymentForm = () => {
    switch (activeTab) {
      case 'creditCard':
        return (
          <Form {...creditCardForm}>
            <form onSubmit={creditCardForm.handleSubmit(handlePaymentSubmit)} className="space-y-4">
              {savedCards.length > 0 && !showNewCardForm ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Saved Cards</h3>
                  <div className="space-y-2">
                    {savedCards.map((card) => (
                      <div 
                        key={card.id}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedCard === card.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setSelectedCard(card.id);
                          setPaymentMethod({
                            type: 'creditCard',
                            lastFour: card.lastFour,
                            brand: card.brand,
                          });
                        }}
                      >
                        <div className="flex-shrink-0 mr-3">
                          {getCardIcon(card.brand)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">
                            {card.brand ? card.brand.charAt(0).toUpperCase() + card.brand.slice(1) : 'Card'} 
                            ending in {card.lastFour}
                          </div>
                          <div className="text-sm text-gray-500">
                            Expires {card.expiryMonth}/{card.expiryYear}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                            selectedCard === card.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                          }`}>
                            {selectedCard === card.id && (
                              <CheckCircle className="h-3.5 w-3.5 text-white" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => setShowNewCardForm(true)}
                  >
                    Use a new card
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={creditCardForm.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="1234 5678 9012 3456"
                                {...field}
                                onChange={(e) => {
                                  const formattedValue = formatCardNumber(e.target.value);
                                  field.onChange(formattedValue);
                                  
                                  // Update card brand
                                  if (formattedValue.replace(/\s/g, '').length >= 6) {
                                    const brand = getCardBrand(formattedValue);
                                    setPaymentMethod(prev => ({
                                      ...prev,
                                      brand,
                                    }));
                                  }
                                }}
                                maxLength={19}
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {paymentMethod.brand && getCardIcon(paymentMethod.brand)}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={creditCardForm.control}
                      name="cardHolder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cardholder Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="JOHN DOE" 
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e.target.value.toUpperCase());
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={creditCardForm.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="MM/YY" 
                              {...field} 
                              onChange={(e) => {
                                const formattedValue = formatExpiryDate(e.target.value);
                                field.onChange(formattedValue);
                              }}
                              maxLength={5}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={creditCardForm.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type="password" 
                                placeholder="123" 
                                {...field} 
                                maxLength={4}
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <Shield className="h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={creditCardForm.control}
                    name="saveCard"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Save this card for future payments</FormLabel>
                          <FormDescription>
                            Your card details will be securely stored for faster checkout next time.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}
              
              <TermsAndConditionsCheckbox form={creditCardForm} />
              
              <Button 
                type="submit" 
                className="w-full mt-6"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${booking?.totalAmount?.toLocaleString('en-IN') || '0'}`
                )}
              </Button>
              
              <div className="text-center text-xs text-gray-500 mt-2">
                <Shield className="h-3 w-3 inline-block mr-1" />
                Secure SSL Encryption
              </div>
            </form>
          </Form>
        );
        
      case 'upi':
        return (
          <Form {...upiForm}>
            <form onSubmit={upiForm.handleSubmit(handlePaymentSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={upiForm.control}
                  name="upiId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UPI ID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="yourname@upi" 
                            {...field} 
                            className="pl-10"
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            @
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Enter your UPI ID (e.g., yourname@okhdfcbank)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-800">How to pay with UPI</h4>
                      <ul className="list-decimal list-inside text-sm text-blue-700 mt-1 space-y-1">
                        <li>Enter your UPI ID and proceed</li>
                        <li>You'll be redirected to your UPI app</li>
                        <li>Approve the payment to complete your booking</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <TermsAndConditionsCheckbox form={upiForm} />
                
                <Button 
                  type="submit" 
                  className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${booking?.totalAmount?.toLocaleString('en-IN') || '0'} with UPI`
                  )}
                </Button>
              </div>
            </form>
          </Form>
        );
        
      case 'netbanking':
        return (
          <Form {...netBankingForm}>
            <form onSubmit={netBankingForm.handleSubmit(handlePaymentSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={netBankingForm.control}
                  name="bank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Bank</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your bank" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="HDFC">HDFC Bank</SelectItem>
                          <SelectItem value="ICICI">ICICI Bank</SelectItem>
                          <SelectItem value="SBI">State Bank of India</SelectItem>
                          <SelectItem value="AXIS">Axis Bank</SelectItem>
                          <SelectItem value="KOTAK">Kotak Mahindra Bank</SelectItem>
                          <SelectItem value="YES">Yes Bank</SelectItem>
                          <SelectItem value="INDUSIND">IndusInd Bank</SelectItem>
                          <SelectItem value="PNB">Punjab National Bank</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-800">How to pay with Net Banking</h4>
                      <ul className="list-decimal list-inside text-sm text-blue-700 mt-1 space-y-1">
                        <li>Select your bank and proceed</li>
                        <li>You'll be redirected to your bank's login page</li>
                        <li>Login and authorize the payment</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <TermsAndConditionsCheckbox form={netBankingForm} />
                
                <Button 
                  type="submit" 
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${booking?.totalAmount?.toLocaleString('en-IN') || '0'} with Net Banking`
                  )}
                </Button>
              </div>
            </form>
          </Form>
        );
        
      case 'wallet':
        return (
          <Form {...walletForm}>
            <form onSubmit={walletForm.handleSubmit(handlePaymentSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={walletForm.control}
                  name="wallet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Wallet</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your wallet" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="phonepe">
                            <div className="flex items-center">
                              <img src="/wallets/phonepe.png" alt="PhonePe" className="h-5 mr-2" />
                              PhonePe
                            </div>
                          </SelectItem>
                          <SelectItem value="paytm">
                            <div className="flex items-center">
                              <img src="/wallets/paytm.png" alt="Paytm" className="h-5 mr-2" />
                              Paytm
                            </div>
                          </SelectItem>
                          <SelectItem value="amazonpay">
                            <div className="flex items-center">
                              <img src="/wallets/amazonpay.png" alt="Amazon Pay" className="h-5 mr-2" />
                              Amazon Pay
                            </div>
                          </SelectItem>
                          <SelectItem value="mobikwik">
                            <div className="flex items-center">
                              <img src="/wallets/mobikwik.png" alt="MobiKwik" className="h-5 mr-2" />
                              MobiKwik
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={walletForm.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">+91</span>
                          </div>
                          <Input 
                            type="tel" 
                            placeholder="9876543210" 
                            className="pl-12"
                            {...field} 
                            onChange={(e) => {
                              // Allow only numbers
                              const value = e.target.value.replace(/\D/g, '');
                              field.onChange(value);
                            }}
                            maxLength={10}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-800">How to pay with Wallet</h4>
                      <ul className="list-decimal list-inside text-sm text-blue-700 mt-1 space-y-1">
                        <li>Select your wallet and enter mobile number</li>
                        <li>You'll be redirected to your wallet app</li>
                        <li>Approve the payment to complete your booking</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <TermsAndConditionsCheckbox form={walletForm} />
                
                <Button 
                  type="submit" 
                  className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-white"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ₹${booking?.totalAmount?.toLocaleString('en-IN') || '0'} with Wallet`
                  )}
                </Button>
              </div>
            </form>
          </Form>
        );
        
      default:
        return null;
    }
  };

  // Card brand icon component
  const getCardIcon = (brand) => {
    switch (brand) {
      case 'visa':
        return <img src="/cards/visa.png" alt="Visa" className="h-5" />;
      case 'mastercard':
        return <img src="/cards/mastercard.png" alt="Mastercard" className="h-5" />;
      case 'amex':
        return <img src="/cards/amex.png" alt="American Express" className="h-5" />;
      case 'discover':
        return <img src="/cards/discover.png" alt="Discover" className="h-5" />;
      case 'diners':
        return <img src="/cards/diners.png" alt="Diners Club" className="h-5" />;
      case 'jcb':
        return <img src="/cards/jcb.png" alt="JCB" className="h-5" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-400" />;
    }
  };

  // Terms and conditions checkbox component
  const TermsAndConditionsCheckbox = ({ form }) => (
    <FormField
      control={form.control}
      name="termsAccepted"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border border-red-100 bg-red-50">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="text-red-800">
              I agree to the Terms & Conditions and Privacy Policy *
            </FormLabel>
            <FormDescription className="text-red-700">
              You must accept the terms and conditions to proceed with the payment.
            </FormDescription>
          </div>
        </FormItem>
      )}
    />
  );

  // Render payment status
  const renderPaymentStatus = () => {
    if (!paymentStatus) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto text-center">
          {paymentStatus.success ? (
            <div className="text-green-500">
              <CheckCircle className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">{paymentStatus.message}</h2>
              <p className="text-gray-600 mb-4">{paymentStatus.details}</p>
              <p className="text-sm text-gray-500">Booking Reference: {paymentStatus.bookingReference}</p>
              <div className="mt-6">
                <div className="inline-block h-8 w-8 border-4 border-t-4 border-t-green-500 border-gray-200 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-500 mt-2">Redirecting to booking details...</p>
              </div>
            </div>
          ) : (
            <div className="text-red-500">
              <XCircle className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">{paymentStatus.message}</h2>
              <p className="text-gray-600 mb-6">{paymentStatus.details}</p>
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={() => setPaymentStatus(null)}
                  className="w-full"
                >
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/bookings')}
                  className="w-full"
                >
                  View My Bookings
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render loading state
  if (isBookingLoading || isPaymentMethodsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  // Render error state if booking not found
  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the booking you're looking for.</p>
          <Button onClick={() => navigate('/bookings')}>
            View My Bookings
          </Button>
        </div>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold mt-2">Complete Payment</h1>
        <p className="text-gray-600">
          Booking Reference: <span className="font-medium">{booking.bookingReference}</span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
              <CardDescription>
                Choose your preferred payment method to complete your booking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="creditCard" className="flex flex-col h-auto py-2">
                    <CreditCard className="h-5 w-5 mb-1" />
                    <span className="text-xs">Credit/Debit Card</span>
                  </TabsTrigger>
                  <TabsTrigger value="upi" className="flex flex-col h-auto py-2">
                    <Landmark className="h-5 w-5 mb-1" />
                    <span className="text-xs">UPI</span>
                  </TabsTrigger>
                  <TabsTrigger value="netbanking" className="flex flex-col h-auto py-2">
                    <Landmark className="h-5 w-5 mb-1" />
                    <span className="text-xs">Net Banking</span>
                  </TabsTrigger>
                  <TabsTrigger value="wallet" className="flex flex-col h-auto py-2">
                    <Smartphone className="h-5 w-5 mb-1" />
                    <span className="text-xs">Wallets</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="creditCard">
                  {renderPaymentForm()}
                </TabsContent>
                
                <TabsContent value="upi">
                  {renderPaymentForm()}
                </TabsContent>
                
                <TabsContent value="netbanking">
                  {renderPaymentForm()}
                </TabsContent>
                
                <TabsContent value="wallet">
                  {renderPaymentForm()}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800">Secure Payment</h4>
                <p className="text-sm text-blue-700">
                  Your payment information is encrypted and secure. We do not store your full card details on our servers.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Booking Summary */}
        <div className="lg:sticky lg:top-6 h-fit">
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">
                      {booking.flight.origin} to {booking.flight.destination}
                    </h3>
                    <Badge variant="outline">
                      {booking.flight.stops === 0 ? 'Non-stop' : `${booking.flight.stops} stop${booking.flight.stops > 1 ? 's' : ''}`}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>{booking.flight.airline} {booking.flight.flightNumber}</span>
                    <span>{booking.flight.duration}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {format(parseISO(booking.flight.departureTime), 'EEE, MMM d, yyyy')}
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium">{format(parseISO(booking.flight.departureTime), 'h:mm a')}</div>
                      <div className="text-gray-500">{booking.flight.from}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">
                        {formatDuration(booking.flight.departureTime, booking.flight.arrivalTime)}
                      </div>
                      <div className="h-px w-16 bg-gray-300 my-1"></div>
                      <div className="text-xs text-gray-500">
                        {booking.flight.stops === 0 ? 'Non-stop' : `${booking.flight.stops} stop${booking.flight.stops > 1 ? 's' : ''}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{format(parseISO(booking.flight.arrivalTime), 'h:mm a')}</div>
                      <div className="text-gray-500">{booking.flight.to}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Fare (x{booking.passengers.length})</span>
                    <span>₹{(booking.baseFare * booking.passengers.length).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span>₹{booking.taxes.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Convenience Fee</span>
                    <span>₹{booking.convenienceFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2 mt-2">
                    <span>Total Amount</span>
                    <span className="text-lg">
                      ₹{booking.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">Free Cancellation</h4>
                      <p className="text-sm text-green-600">
                        Cancel within 24 hours for a full refund
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Important Information</h4>
                <ul className="list-disc list-inside text-sm text-yellow-700 mt-1 space-y-1">
                  <li>Please complete your payment within 15 minutes to secure your booking</li>
                  <li>Fares are subject to change until ticketed</li>
                  <li>Check your email for booking confirmation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Status Modal */}
      {renderPaymentStatus()}
    </div>
  );
};

// Helper function to format duration
const formatDuration = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate - startDate;
  const diffMins = Math.round(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return `${hours}h ${mins}m`;
};

export default Payment;
