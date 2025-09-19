import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon, UserIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';

const SeatSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [flight, setFlight] = useState(location.state?.flight);
  const [loading, setLoading] = useState(!location.state?.flight);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState(null);
  const passengerCount = Number(location.state?.passengers || location.state?.searchParams?.passengers || 1);
  const [seatMap, setSeatMap] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeatType, setSelectedSeatType] = useState('window');

  useEffect(() => {
    const buildMockSeats = (count = 60) => {
      const rows = 20;
      const seatsPerRow = 6;
      const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
      const totalSeats = rows * seatsPerRow; // 120
      const target = Math.min(Math.max(1, Number(count || 60)), totalSeats);
      const allSeatIds = [];
      for (let r = 1; r <= rows; r++) {
        for (let i = 0; i < seatsPerRow; i++) {
          allSeatIds.push(`${r}${seatLetters[i]}`);
        }
      }
      const availableSet = new Set();
      while (availableSet.size < target) {
        const idx = Math.floor(Math.random() * allSeatIds.length);
        availableSet.add(allSeatIds[idx]);
      }
      return Array.from(availableSet).map(s => ({ seatNumber: s }));
    };

    const loadSeats = async () => {
      try {
        setLoading(true);
        let currentFlight = flight;
        // If we don't have flight data (deep link), create a minimal mock flight
        if (!currentFlight) {
          currentFlight = {
            id,
            flightNumber: id,
            origin: { code: 'JFK' },
            destination: { code: 'LHR' },
            departureTime: new Date().toISOString(),
            price: 199,
            availableSeats: 60,
          };
          setFlight(currentFlight);
        }

        const seats = buildMockSeats(currentFlight.availableSeats);
        setAvailableSeats(seats);
        generateSeatMap(seats);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load seat information. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadSeats();
  }, [id]);

  const generateSeatMap = (seats) => {
    // This is a simplified seat map generation
    // In a real app, this would come from the API based on the aircraft type
    const rows = 20;
    const seatsPerRow = 6; // 3 on each side of the aisle
    const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    const map = [];
    
    for (let row = 1; row <= rows; row++) {
      const rowSeats = [];
      
      for (let seatNum = 0; seatNum < seatsPerRow; seatNum++) {
        const seatId = `${row}${seatLetters[seatNum]}`;
        const isAvailable = seats.some(s => s.seatNumber === seatId);
        const seatType = 
          seatNum === 0 || seatNum === seatsPerRow - 1 ? 'window' : 
          seatNum === 1 || seatNum === seatsPerRow - 2 ? 'aisle' : 'middle';
        
        rowSeats.push({
          id: seatId,
          number: seatId,
          available: isAvailable,
          type: seatType,
          selected: false,
          premium: row <= 5, // First 5 rows are premium
          exitRow: row === 10 || row === 20, // Example exit rows
        });
      }
      
      map.push({
        rowNumber: row,
        seats: rowSeats,
      });
    }
    
    setSeatMap(map);
  };

  const handleSeatClick = (seat) => {
    if (!seat.available) return;
    
    setSelectedSeats(prev => {
      const isSelected = prev.some(s => s.id === seat.id);
      
      if (isSelected) {
        return prev.filter(s => s.id !== seat.id);
      } else if (prev.length < passengerCount) {
        return [...prev, seat];
      } else {
        // Replace the first selected seat if we've reached the passenger count
        const newSelection = [...prev];
        newSelection[0] = seat;
        return newSelection;
      }
    });
  };

  const handleContinue = () => {
    if (selectedSeats.length !== passengerCount) {
      setError(`Please select ${passengerCount} seat${passengerCount > 1 ? 's' : ''}`);
      return;
    }
    
    // Go to payment page with required state
    navigate(`/payment`, {
      state: {
        ...location.state,
        flight,
        selectedSeats,
        passengerCount,
        total: Number(flight?.price || 0) * passengerCount,
      },
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const filterSeats = (type) => {
    setSelectedSeatType(type);
    // In a real app, you would filter the seat map here
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <XMarkIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={handleBack} className="flex items-center text-gray-600">
          <ArrowLeftIcon className="h-5 w-5 mr-1" /> Back to Flight Details
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Choose Your Seats
          </h2>
          <p className="text-gray-600">
            Select {passengerCount} seat{passengerCount > 1 ? 's' : ''} for your flight
          </p>
        </div>

        <div className="p-6">
          {/* Seat Map Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-sm mr-2"></div>
              <span className="text-sm text-gray-600">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
              <span className="text-sm text-gray-600">Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-300 rounded-sm mr-2"></div>
              <span className="text-sm text-gray-600">Occupied</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-400 rounded-sm mr-2"></div>
              <span className="text-sm text-gray-600">Premium</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-400 rounded-sm mr-2"></div>
              <span className="text-sm text-gray-600">Exit Row</span>
            </div>
          </div>

          {/* Seat Type Filters */}
          <div className="flex justify-center mb-6 space-x-4">
            <button
              onClick={() => filterSeats('window')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedSeatType === 'window' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Window
            </button>
            <button
              onClick={() => filterSeats('aisle')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedSeatType === 'aisle' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Aisle
            </button>
            <button
              onClick={() => filterSeats('middle')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedSeatType === 'middle' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Middle
            </button>
          </div>

          {/* Aircraft Layout */}
          <div className="relative bg-blue-50 p-6 rounded-lg mb-8">
            {/* Cockpit */}
            <div className="w-24 h-12 bg-gray-800 rounded-t-full mx-auto mb-8"></div>
            
            {/* Seats */}
            <div className="space-y-4">
              {seatMap.map((row) => (
                <div key={row.rowNumber} className="flex items-center justify-center">
                  <div className="w-8 text-center font-medium text-gray-700">{row.rowNumber}</div>
                  <div className="flex">
                    {row.seats.slice(0, 3).map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        disabled={!seat.available}
                        className={`w-10 h-10 m-1 rounded flex items-center justify-center text-sm font-medium ${
                          selectedSeats.some(s => s.id === seat.id)
                            ? 'bg-green-500 text-white'
                            : seat.available
                            ? seat.premium
                              ? 'bg-yellow-400 hover:bg-yellow-500'
                              : seat.exitRow
                                ? 'bg-red-400 hover:bg-red-500'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                        title={`${seat.number} - ${seat.type.charAt(0).toUpperCase() + seat.type.slice(1)}`}
                      >
                        {seat.number}
                      </button>
                    ))}
                    <div className="w-16"></div> {/* Aisle */}
                    {row.seats.slice(3).map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        disabled={!seat.available}
                        className={`w-10 h-10 m-1 rounded flex items-center justify-center text-sm font-medium ${
                          selectedSeats.some(s => s.id === seat.id)
                            ? 'bg-green-500 text-white'
                            : seat.available
                            ? seat.premium
                              ? 'bg-yellow-400 hover:bg-yellow-500'
                              : seat.exitRow
                                ? 'bg-red-400 hover:bg-red-500'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                        title={`${seat.number} - ${seat.type.charAt(0).toUpperCase() + seat.type.slice(1)}`}
                      >
                        {seat.number}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Cabin divider */}
            <div className="h-1 bg-gray-300 my-6"></div>
            
            {/* Exit row indicators */}
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Exit rows are marked in red. Please ensure you're willing and able to assist in an emergency.</p>
            </div>
          </div>

          {/* Selected Seats Summary */}
          {selectedSeats.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Selected Seats ({selectedSeats.length}/{passengerCount})</h3>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <span 
                    key={seat.id} 
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {seat.number}
                    <button 
                      onClick={() => handleSeatClick(seat)}
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 hover:bg-blue-300"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <div className="flex items-center">
              {error && <p className="text-red-600 text-sm mr-4">{error}</p>}
              <Button 
                onClick={handleContinue}
                disabled={selectedSeats.length !== passengerCount}
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Summary Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Flight Summary</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {flight.origin?.city} ({flight.origin?.code}) → {flight.destination?.city} ({flight.destination?.code})
              </p>
              <p className="text-sm text-gray-500">
                {new Date(flight.departureTime).toLocaleDateString()} • {flight.airline?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                ${flight.price * passengerCount}
              </p>
              <p className="text-sm text-gray-500">
                {passengerCount} {passengerCount === 1 ? 'Passenger' : 'Passengers'}
              </p>
            </div>
          </div>
          
          {selectedSeats.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-2">Selected Seats</p>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map(seat => (
                  <span 
                    key={seat.id} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {seat.number}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
