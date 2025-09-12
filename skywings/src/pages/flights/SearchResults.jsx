import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Filter, Plane, Clock, MapPin, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { searchFlights, getCities } from '@/services/flightService';
import { useToast } from '@/components/ui/use-toast';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Parse search parameters
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const departureDate = searchParams.get('departureDate');
  const returnDate = searchParams.get('returnDate');
  const passengers = searchParams.get('passengers') || 1;
  const travelClass = searchParams.get('class') || 'economy';
  const tripType = returnDate ? 'round-trip' : 'one-way';

  // Fetch flight search results
  const { data: flights = [], isLoading, error } = useQuery({
    queryKey: ['flights', from, to, departureDate, returnDate, passengers, travelClass],
    queryFn: () => searchFlights({
      from,
      to,
      departureDate,
      ...(returnDate && { returnDate }),
      passengers: parseInt(passengers),
      class: travelClass,
    }),
    enabled: !!from && !!to && !!departureDate,
  });

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load flight results',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const handleBookNow = (flightId) => {
    navigate(`/booking?flightId=${flightId}&passengers=${passengers}&class=${travelClass}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Search
      </Button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          {from} to {to} • {format(parseISO(departureDate), 'EEE, MMM d, yyyy')}
          {returnDate && ` • Return: ${format(parseISO(returnDate), 'EEE, MMM d, yyyy')}`}
        </h1>
        <p className="text-muted-foreground">
          {passengers} {parseInt(passengers) === 1 ? 'passenger' : 'passengers'} • {travelClass}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                <CardTitle className="text-lg">Filters</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Stops</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="nonstop" className="rounded" defaultChecked />
                      <label htmlFor="nonstop" className="text-sm">Non-stop</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="onestop" className="rounded" defaultChecked />
                      <label htmlFor="onestop" className="text-sm">1 Stop</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Price Range</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="all" name="price" className="rounded" defaultChecked />
                      <label htmlFor="all" className="text-sm">All Prices</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="under5k" name="price" className="rounded" />
                      <label htmlFor="under5k" className="text-sm">Under ₹5,000</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="5k-10k" name="price" className="rounded" />
                      <label htmlFor="5k-10k" className="text-sm">₹5,000 - ₹10,000</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="over10k" name="price" className="rounded" />
                      <label htmlFor="over10k" className="text-sm">Over ₹10,000</label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Flight Results */}
        <div className="md:col-span-3 space-y-4">
          {flights.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Plane className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No flights found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your search criteria</p>
              </CardContent>
            </Card>
          ) : (
            flights.map((flight) => (
              <Card key={flight.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
                  {/* Airline and Flight Info */}
                  <div className="md:col-span-3 flex items-center">
                    <div className="bg-blue-50 p-3 rounded-lg mr-4">
                      <Plane className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{flight.airline}</h3>
                      <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
                    </div>
                  </div>

                  {/* Departure and Arrival */}
                  <div className="md:col-span-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-2xl font-bold">
                          {new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {flight.origin} • {new Date(flight.departureTime).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">
                          {new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {flight.destination} • {new Date(flight.arrivalTime).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 text-center text-sm text-muted-foreground">
                      {flight.duration} • {flight.stops === 0 ? 'Non-stop' : `${flight.stops} ${flight.stops === 1 ? 'stop' : 'stops'}`}
                    </div>
                  </div>

                  {/* Price and Book Button */}
                  <div className="md:col-span-3 flex flex-col items-end justify-between">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">₹{flight.price.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">per person</p>
                    </div>
                    <Button 
                      onClick={() => handleBookNow(flight.id)}
                      className="mt-2 w-full md:w-auto"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
