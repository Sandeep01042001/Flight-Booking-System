import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Printer, Mail, ArrowLeft, Calendar, Share2, Plus, Clock, MapPin, Info } from 'lucide-react';
import QRCode from 'react-qr-code';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/services/bookingService';
import { useAuth } from '@/hooks/useAuth';

const Confirmation = () => {
  const { id: bookingReference } = useParams();
  const { user } = useAuth();

  // In a real app, you would fetch the booking details using the reference
  // For now, we'll use mock data
  const booking = {
    bookingReference,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    flight: {
      airline: 'SkyWings',
      flightNumber: 'SW123',
      departureAirport: 'DEL',
      arrivalAirport: 'BOM',
      departureCity: 'Delhi',
      arrivalCity: 'Mumbai',
      departureTime: '2025-10-15T08:00:00',
      arrivalTime: '2025-10-15T10:30:00',
      duration: '2h 30m',
      cabinClass: 'Economy',
    },
    passengers: [
      {
        firstName: user?.firstName || 'John',
        lastName: user?.lastName || 'Doe',
        seat: '12A',
      },
    ],
    contactInfo: {
      email: user?.email || 'john.doe@example.com',
      phone: user?.phone || '+91 9876543210',
    },
    payment: {
      amount: 12500,
      currency: 'INR',
      method: 'Credit Card',
      lastFour: '1234',
    },
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmailItinerary = () => {
    // In a real app, this would trigger an email with the itinerary
    alert('Itinerary has been sent to your email!');
  };

  const handleDownloadBoardingPass = async () => {
    const boardingPassElement = document.getElementById('boarding-pass');
    if (boardingPassElement) {
      const canvas = await html2canvas(boardingPassElement);
      canvas.toBlob((blob) => {
        saveAs(blob, `boarding-pass-${booking.bookingReference}.png`);
      });
    }
  };

  const handleAddToCalendar = () => {
    const startTime = new Date(booking.flight.departureTime);
    const endTime = new Date(booking.flight.arrivalTime);
    
    // Format dates for calendar
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(startTime)}`,
      `DTEND:${formatDate(endTime)}`,
      `SUMMARY:Flight ${booking.flight.airline} ${booking.flight.flightNumber}`,
      `DESCRIPTION:${booking.flight.departureCity} to ${booking.flight.arrivalCity}\\n      Booking Reference: ${booking.bookingReference}\\n      Passenger: ${booking.passengers[0].firstName} ${booking.passengers[0].lastName}`,
      `LOCATION:${booking.flight.departureAirport} to ${booking.flight.arrivalAirport}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `flight-${booking.bookingReference}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `My Flight to ${booking.flight.arrivalCity}`,
          text: `I'm flying to ${booking.flight.arrivalCity} on ${formatDate(booking.flight.departureTime)}. Flight ${booking.flight.airline} ${booking.flight.flightNumber}`,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Your booking reference is <span className="font-semibold">{booking.bookingReference}</span>
          </p>
          <p className="text-gray-500 mt-2">
            We've sent a confirmation email to {booking.contactInfo.email}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <CardTitle>Flight Details</CardTitle>
                  <div className="text-sm text-gray-500">
                    {formatDate(booking.flight.departureTime)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">{booking.flight.airline[0]}</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-lg font-semibold">
                            {booking.flight.departureAirport} → {booking.flight.arrivalAirport}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.flight.airline} {booking.flight.flightNumber} • {booking.flight.cabinClass}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{booking.flight.duration}</p>
                          <p className="text-sm text-gray-500">Non-stop</p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-2xl font-bold">
                            {formatTime(booking.flight.departureTime)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(booking.flight.departureTime)}
                          </p>
                          <p className="font-medium mt-1">
                            {booking.flight.departureCity} ({booking.flight.departureAirport})
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {formatTime(booking.flight.arrivalTime)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(booking.flight.arrivalTime)}
                          </p>
                          <p className="font-medium mt-1">
                            {booking.flight.arrivalCity} ({booking.flight.arrivalAirport})
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Passenger Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {booking.passengers.map((passenger, index) => (
                    <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">
                            {passenger.firstName} {passenger.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Passenger {index + 1} • {booking.flight.cabinClass}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Seat {passenger.seat}</p>
                          <p className="text-sm text-gray-500">
                            Boarding Pass Available
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {/* Boarding Pass QR Code */}
            <Card id="boarding-pass" className="relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white p-2 rounded">
                <QRCode 
                  value={JSON.stringify({
                    bookingReference: booking.bookingReference,
                    passenger: `${booking.passengers[0].firstName} ${booking.passengers[0].lastName}`,
                    flight: `${booking.flight.airline} ${booking.flight.flightNumber}`,
                    from: booking.flight.departureAirport,
                    to: booking.flight.arrivalAirport,
                    date: formatDate(booking.flight.departureTime),
                    seat: booking.passengers[0].seat,
                  })}
                  size={80}
                  level="H"
                />
              </div>
              <CardHeader>
                <CardTitle>Boarding Pass</CardTitle>
                <p className="text-sm text-gray-500">Show this QR code at the airport</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Flight</span>
                    <span className="font-medium">{booking.flight.airline} {booking.flight.flightNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passenger</span>
                    <span className="font-medium">{booking.passengers[0].firstName} {booking.passengers[0].lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seat</span>
                    <span className="font-medium">{booking.passengers[0].seat}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Reference</span>
                    <span className="font-medium">{booking.bookingReference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Confirmed
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Date</span>
                    <span>{formatDate(booking.createdAt)}</span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between font-medium">
                      <span>Total Paid</span>
                      <span className="text-lg">₹{booking.payment.amount.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Paid with {booking.payment.method} ending in {booking.payment.lastFour}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleAddToCalendar}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Add to Calendar
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Booking
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handlePrint}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Itinerary
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleEmailItinerary}
              >
                <Mail className="mr-2 h-4 w-4" />
                Email Itinerary
              </Button>
              <Button 
                className="w-full justify-start"
                onClick={handleDownloadBoardingPass}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Boarding Pass
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>

            {/* Next Steps Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Check-in Online</h4>
                    <p className="text-sm text-gray-600">Available 24 hours before departure</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Airport Information</h4>
                    <p className="text-sm text-gray-600">Arrive at least 2 hours before departure</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Info className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Travel Requirements</h4>
                    <p className="text-sm text-gray-600">Check passport and visa requirements</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Need Help?</h3>
              <p className="text-sm text-blue-700 mb-3">
                Our customer service team is available 24/7 to assist you with any questions or changes to your booking.
              </p>
              <div className="space-y-1 text-sm">
                <p className="text-blue-800">
                  <span className="font-medium">Phone:</span> +91 1800 123 4567
                </p>
                <p className="text-blue-800">
                  <span className="font-medium">Email:</span> support@skywings.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
