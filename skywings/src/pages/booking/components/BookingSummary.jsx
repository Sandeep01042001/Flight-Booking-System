import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Plane, Clock, MapPin, Users } from 'lucide-react';

const BookingSummary = ({ flight, passengers, totalAmount }) => {
  if (!flight) return null;

  const formatTime = (dateTime) => {
    return format(new Date(dateTime), 'h:mm a');
  };

  const formatDate = (dateTime) => {
    return format(new Date(dateTime), 'EEE, MMM d, yyyy');
  };

  const calculateDuration = (departure, arrival) => {
    const diff = new Date(arrival) - new Date(departure);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Your Flight</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {flight.departureCity} → {flight.arrivalCity}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(flight.departureTime)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  ₹{flight.price?.toLocaleString() || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  {passengers.length} {passengers.length === 1 ? 'passenger' : 'passengers'}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Plane className="h-4 w-4 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="font-medium">
                    {flight.airline} {flight.flightNumber}
                  </p>
                  <p className="text-sm text-gray-500">{flight.aircraftType}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="font-medium">
                    {formatTime(flight.departureTime)} - {formatTime(flight.arrivalTime)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {calculateDuration(flight.departureTime, flight.arrivalTime)} • {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="font-medium">
                    {flight.departureAirport} • {flight.arrivalAirport}
                  </p>
                  <p className="text-sm text-gray-500">
                    {flight.departureCity}, {flight.departureCountry} → {flight.arrivalCity}, {flight.arrivalCountry}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Price Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Base Fare ({passengers.length} {passengers.length === 1 ? 'passenger' : 'passengers'})</span>
              <span>₹{(flight.price * passengers.length).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxes & Fees</span>
              <span>₹{(flight.taxes * passengers.length).toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total Amount</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              Free cancellation available up to 24 hours before departure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
