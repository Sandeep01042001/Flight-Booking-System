import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/calendar';
import { CalendarIcon, Search, Plane, ArrowRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, addDays } from 'date-fns';
import { getCities, searchFlights } from '@/services/flightService';
import { useToast } from '@/components/ui/use-toast';

const Flights = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    departureDate: new Date(),
    returnDate: addDays(new Date(), 7),
    tripType: 'one-way',
    passengers: 1,
    class: 'economy',
  });

  // Fetch cities for autocomplete
  const { data: cities = [], isLoading: isLoadingCities } = useQuery({
    queryKey: ['cities'],
    queryFn: getCities,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchParams.from || !searchParams.to) {
      toast({
        title: 'Error',
        description: 'Please select origin and destination',
        variant: 'destructive',
      });
      return;
    }

    // Navigate to search results with query params
    const params = new URLSearchParams({
      from: searchParams.from,
      to: searchParams.to,
      departureDate: format(searchParams.departureDate, 'yyyy-MM-dd'),
      ...(searchParams.tripType === 'round-trip' && {
        returnDate: format(searchParams.returnDate, 'yyyy-MM-dd'),
      }),
      passengers: searchParams.passengers,
      class: searchParams.class,
    });

    navigate(`/flights/search?${params.toString()}`);
  };

  const handleCitySelect = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const swapCities = () => {
    setSearchParams(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Find Your Perfect Flight</h1>
      
      {/* Search Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-6 w-6 text-blue-600" />
            <span>Search Flights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Trip Type Toggle */}
            <div className="flex gap-4 mb-4">
              <Button
                type="button"
                variant={searchParams.tripType === 'one-way' ? 'default' : 'outline'}
                onClick={() => setSearchParams(prev => ({ ...prev, tripType: 'one-way' }))}
              >
                One Way
              </Button>
              <Button
                type="button"
                variant={searchParams.tripType === 'round-trip' ? 'default' : 'outline'}
                onClick={() => setSearchParams(prev => ({ ...prev, tripType: 'round-trip' }))}
              >
                Round Trip
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* From */}
              <div className="space-y-2">
                <label className="text-sm font-medium">From</label>
                <Select 
                  value={searchParams.from}
                  onValueChange={(value) => handleCitySelect('from', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city.id} value={city.code}>
                        {`${city.name} (${city.code})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Swap Button */}
              <div className="flex items-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={swapCities}
                  className="self-end mb-1"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* To */}
              <div className="space-y-2">
                <label className="text-sm font-medium">To</label>
                <Select 
                  value={searchParams.to}
                  onValueChange={(value) => handleCitySelect('to', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city.id} value={city.code}>
                        {`${city.name} (${city.code})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Departure Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Departure</label>
                <DatePicker
                  selected={searchParams.departureDate}
                  onSelect={(date) => {
                    if (date) {
                      setSearchParams(prev => ({
                        ...prev,
                        departureDate: date,
                      }));
                    }
                  }}
                  fromDate={new Date()}
                  toDate={new Date('2100-01-01')}
                  placeholder="Select departure date"
                />
              </div>

              {/* Return Date - Only show for round trip */}
              {searchParams.tripType === 'round-trip' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Return</label>
                  <DatePicker
                    selected={searchParams.returnDate}
                    onSelect={(date) => {
                      if (date) {
                        setSearchParams(prev => ({
                          ...prev,
                          returnDate: date,
                        }));
                      }
                    }}
                    fromDate={searchParams.departureDate}
                    toDate={new Date('2100-01-01')}
                    placeholder="Select return date"
                  />
                </div>
              )}

              {/* Passengers */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Passengers</label>
                <Input
                  type="number"
                  min="1"
                  max="9"
                  value={searchParams.passengers}
                  onChange={(e) =>
                    setSearchParams(prev => ({
                      ...prev,
                      passengers: parseInt(e.target.value) || 1,
                    }))
                  }
                />
              </div>

              {/* Class */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Class</label>
                <Select
                  value={searchParams.class}
                  onValueChange={(value) =>
                    setSearchParams(prev => ({
                      ...prev,
                      class: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">Economy</SelectItem>
                    <SelectItem value="premium_economy">Premium Economy</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="first">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="gap-2">
                <Search className="h-4 w-4" />
                Search Flights
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Popular Destinations */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Popular Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { code: 'DEL', name: 'Delhi', price: 4999, image: '/images/delhi.jpg' },
            { code: 'BOM', name: 'Mumbai', price: 5999, image: '/images/mumbai.jpg' },
            { code: 'BLR', name: 'Bangalore', price: 6999, image: '/images/bangalore.jpg' },
            { code: 'MAA', name: 'Chennai', price: 5499, image: '/images/chennai.jpg' },
          ].map((destination) => (
            <Card key={destination.code} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 relative">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMzAwIDIwMCI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2VlZSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiM2NjYiPk5vIEltYWdlPC90ZXh0PgogIDxsaW5lIHgxPSIwIiB5MT0iMCIgeDI9IjMwMCIgeTI9IjIwMCIgc3Ryb2tlPSIjY2NjIiBzdHJva2Utd2lkdGg9IjEiLz4KICA8bGluZSB4MT0iMzAwIiB5MT0iMCIgeDI9IjAiIHkyPSIyMDAiIHN0cm9rZT0iI2NjYyIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==';
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                  <h3 className="font-bold text-lg">{destination.name}</h3>
                  <p className="text-sm">From ₹{destination.price.toLocaleString()}</p>
                </div>
              </div>
              <Button 
                variant="link" 
                className="w-full rounded-t-none"
                onClick={() => {
                  setSearchParams(prev => ({
                    ...prev,
                    to: destination.code,
                  }));
                }}
              >
                Book Now
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Special Offers */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Special Offers</h2>
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 mb-8">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2">Up to 30% Off on International Flights</h3>
            <p className="mb-4">Book your international flights now and save big on your next vacation!</p>
            <Button variant="secondary">View Deals</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flights;
