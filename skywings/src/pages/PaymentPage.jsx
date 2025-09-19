import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon, XMarkIcon, CreditCardIcon, QrCodeIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, selectedSeats, passengerCount, total } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    upiId: '',
    bank: '',
    netbankingUserId: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    if (!flight || !selectedSeats) {
      navigate('/');
    }
  }, [flight, selectedSeats, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces after every 4 digits
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{4})(?=\d)/g, '$1 ')
        .trim();
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }
    
    // Format expiry date as MM/YY
    if (name === 'expiryDate') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .substring(0, 5);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }
    
    // Limit CVV to 3-4 digits
    if (name === 'cvv') {
      const formattedValue = value.replace(/\D/g, '').substring(0, 4);
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    // Validate according to selected payment method
    if (paymentMethod === 'card') {
      if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
        setError('Please enter a valid 16-digit card number');
        return false;
      }
      if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        setError('Please enter a valid expiry date (MM/YY)');
        return false;
      }
      if (!formData.cvv || formData.cvv.length < 3) {
        setError('Please enter a valid CVV');
        return false;
      }
      if (!formData.nameOnCard) {
        setError('Please enter the name on card');
        return false;
      }
    } else if (paymentMethod === 'upi') {
      if (!formData.upiId || !/^[\w.-]+@[\w.-]+$/.test(formData.upiId)) {
        setError('Please enter a valid UPI ID (e.g., username@bank)');
        return false;
      }
    } else if (paymentMethod === 'netbanking') {
      if (!formData.bank) {
        setError('Please select your bank');
        return false;
      }
      if (!formData.netbankingUserId || formData.netbankingUserId.length < 4) {
        setError('Please enter your Netbanking User ID');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Simulate API call for payment processing
      const paymentSuccess = await processPayment();
      
      if (paymentSuccess) {
        setPaymentSuccess(true);
        
        // Redirect to booking confirmation after a short delay
        setTimeout(() => {
          setBookingConfirmed(true);
          const bookingId = `BK${Math.floor(100000 + Math.random() * 900000)}`;
          navigate(`/booking/confirmation/${bookingId}`, { 
            state: { 
              flight,
              selectedSeats,
              passengerCount,
              total: calculateTotal(),
            } 
          });
        }, 2000);
      } else {
        setError('Payment failed. Please try again or use a different payment method.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An error occurred while processing your payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Simulate payment processing with 90% success rate
  const processPayment = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.random() < 0.9);
      }, 1500);
    });
  };

  const calculateTotal = () => {
    if (typeof total === 'number') return total;
    if (!flight || !selectedSeats) return 0;
    return (selectedSeats.length || Number(passengerCount) || 1) * Number(flight.price || 0);
  };

  if (paymentSuccess && bookingConfirmed) {
    return null; // Will redirect automatically
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Seat Selection
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Payment Details</h1>
          <p className="mt-2 text-gray-600">Complete your booking by providing your payment information</p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            {paymentSuccess ? (
              <div className="text-center py-12">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                  <CheckCircleIcon className="h-10 w-10 text-green-600" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-900">Payment Successful!</h3>
                <p className="mt-2 text-gray-600">Your booking is being confirmed. Redirecting you to the confirmation page...</p>
                <div className="mt-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Payment Form */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Payment Information</h2>
                    {/* Payment method selector */}
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => { setError(''); setPaymentMethod('card'); }}
                        className={`px-3 py-2 rounded-md border text-sm flex items-center gap-2 ${paymentMethod==='card' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-300 text-gray-700'}`}
                      >
                        <CreditCardIcon className="h-4 w-4" /> Card
                      </button>
                      <button
                        type="button"
                        onClick={() => { setError(''); setPaymentMethod('upi'); }}
                        className={`px-3 py-2 rounded-md border text-sm flex items-center gap-2 ${paymentMethod==='upi' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-300 text-gray-700'}`}
                      >
                        <QrCodeIcon className="h-4 w-4" /> UPI
                      </button>
                      <button
                        type="button"
                        onClick={() => { setError(''); setPaymentMethod('netbanking'); }}
                        className={`px-3 py-2 rounded-md border text-sm flex items-center gap-2 ${paymentMethod==='netbanking' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-300 text-gray-700'}`}
                      >
                        <BanknotesIcon className="h-4 w-4" /> Netbanking
                      </button>
                    </div>

                    <div className="space-y-4">
                      {paymentMethod === 'card' && (
                        <>
                          <div>
                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                              Card Number
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CreditCardIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                              </div>
                              <input
                                type="text"
                                name="cardNumber"
                                id="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleInputChange}
                                placeholder="0000 0000 0000 0000"
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border"
                                maxLength="19"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                name="expiryDate"
                                id="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                                placeholder="MM/YY"
                                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                maxLength="5"
                              />
                            </div>
                            <div>
                              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                                CVV
                              </label>
                              <input
                                type="text"
                                name="cvv"
                                id="cvv"
                                value={formData.cvv}
                                onChange={handleInputChange}
                                placeholder="123"
                                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                maxLength="4"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700">
                              Name on Card
                            </label>
                            <input
                              type="text"
                              name="nameOnCard"
                              id="nameOnCard"
                              value={formData.nameOnCard}
                              onChange={handleInputChange}
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                              placeholder="John Doe"
                            />
                          </div>
                        </>
                      )}

                      {paymentMethod === 'upi' && (
                        <>
                          <div>
                            <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">
                              UPI ID
                            </label>
                            <input
                              type="text"
                              name="upiId"
                              id="upiId"
                              value={formData.upiId}
                              onChange={handleInputChange}
                              placeholder="username@bank"
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                            />
                            <p className="mt-2 text-xs text-gray-500">We'll send a collect request to your UPI app.</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <QrCodeIcon className="h-5 w-5 text-gray-400" />
                            You can also scan a QR in your UPI app after clicking Pay Now.
                          </div>
                        </>
                      )}

                      {paymentMethod === 'netbanking' && (
                        <>
                          <div>
                            <label htmlFor="bank" className="block text-sm font-medium text-gray-700">
                              Select Bank
                            </label>
                            <select
                              id="bank"
                              name="bank"
                              value={formData.bank}
                              onChange={handleInputChange}
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                            >
                              <option value="">-- Choose Bank --</option>
                              <option value="HDFC">HDFC Bank</option>
                              <option value="ICICI">ICICI Bank</option>
                              <option value="SBI">SBI</option>
                              <option value="AXIS">Axis Bank</option>
                              <option value="KOTAK">Kotak Mahindra</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="netbankingUserId" className="block text-sm font-medium text-gray-700">
                              Netbanking User ID
                            </label>
                            <input
                              type="text"
                              id="netbankingUserId"
                              name="netbankingUserId"
                              value={formData.netbankingUserId}
                              onChange={handleInputChange}
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                              placeholder="Enter your User ID"
                            />
                          </div>
                          <p className="text-xs text-gray-500">You'll be redirected to your bank's secure page to complete the payment.</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Booking Summary */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Booking Summary</h2>
                    
                    {flight && (
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Flight:</span>
                          <span className="font-medium">
                            {(flight.origin?.code || flight.origin) || 'JFK'} → {(flight.destination?.code || flight.destination) || 'LHR'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">
                            {flight.departureTime ? new Date(flight.departureTime).toLocaleDateString() : new Date().toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Passengers:</span>
                          <span className="font-medium">{Number(passengerCount) || selectedSeats?.length || 1}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Selected Seats:</span>
                          <span className="font-medium">
                            {Array.isArray(selectedSeats) && selectedSeats.length > 0
                              ? selectedSeats.map(s => (typeof s === 'string' ? s : (s.number || s.id || s.seatNumber))).join(', ')
                              : 'Not selected'}
                          </span>
                        </div>
                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <XMarkIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Pay Now'
                    )}
                  </Button>
                  
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    Your payment is secure and encrypted. We do not store your card details.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
