import React, { useState, useEffect, useCallback } from 'react';
import { format, parseISO, isBefore, isAfter, isToday, isTomorrow } from 'date-fns';
import { Link } from 'react-router-dom';
import {
  CalendarIcon,
  ClockIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronUpDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { showError } from '../../components/common/ToastHandler';
import Loader from '../../components/common/Loader';
import ErrorBoundary from '../../components/common/ErrorBoundary';

const statusStyles = {
  scheduled: 'bg-blue-100 text-blue-800',
  boarding: 'bg-yellow-100 text-yellow-800',
  departed: 'bg-purple-100 text-purple-800',
  in_air: 'bg-indigo-100 text-indigo-800',
  landed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  delayed: 'bg-orange-100 text-orange-800',
};

const roleIcons = {
  pilot: PaperAirplaneIcon,
  copilot: PaperAirplaneIcon,
  flight_attendant: InformationCircleIcon,
  engineer: InformationCircleIcon,
  crew: InformationCircleIcon,
};

const getFlightStatus = (flight) => {
  const now = new Date();
  const departure = new Date(flight.departureTime);
  const arrival = new Date(flight.arrivalTime);
  
  if (flight.status === 'cancelled') return 'cancelled';
  if (flight.status === 'delayed') return 'delayed';
  
  if (isBefore(now, departure)) return 'scheduled';
  if (isAfter(now, arrival)) return 'landed';
  if (isBefore(now, new Date(departure.getTime() + 30 * 60000))) return 'boarding';
  return 'in_air';
};

const getStatusText = (status) => {
  const statusMap = {
    scheduled: 'Scheduled',
    boarding: 'Boarding',
    departed: 'Departed',
    in_air: 'In Air',
    landed: 'Landed',
    cancelled: 'Cancelled',
    delayed: 'Delayed'
  };
  return statusMap[status] || status;
};

const formatFlightDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
};

const formatFlightTime = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'h:mm a');
};

const getUpcomingFlights = (flights) => {
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);
  
  return flights
    .filter(flight => {
      const departure = new Date(flight.departureTime);
      return departure >= now && departure <= nextWeek;
    })
    .sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
};

const FlightAssignments = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('upcoming');
  const [sortConfig, setSortConfig] = useState({ key: 'departureTime', direction: 'asc' });

  const fetchFlights = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call with error handling
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random error (10% chance)
          if (Math.random() < 0.1) {
            reject(new Error('Failed to load flight data. Please try again later.'));
          } else {
            resolve({
              data: [
                {
                  id: 'FL123',
                  flightNumber: 'SKY123',
                  origin: 'JFK',
                  originCity: 'New York',
                  destination: 'LAX',
                  destinationCity: 'Los Angeles',
                  departureTime: new Date(Date.now() + 3600000 * 2).toISOString(), // 2 hours from now
                  arrivalTime: new Date(Date.now() + 3600000 * 6).toISOString(),
                  status: 'scheduled',
                  aircraft: 'Boeing 737-800',
                  role: 'pilot',
                  position: 'Captain',
                  checkInTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
                  duration: '4h 30m',
                  gate: 'B12',
                  crew: [
                    { id: '1', name: 'John Smith', role: 'pilot', position: 'Captain' },
                    { id: '2', name: 'Sarah Johnson', role: 'copilot', position: 'First Officer' },
                    { id: '3', name: 'Emma Wilson', role: 'flight_attendant', position: 'Lead FA' },
                  ]
                },
                {
                  id: 'FL456',
                  flightNumber: 'SKY456',
                  origin: 'LAX',
                  originCity: 'Los Angeles',
                  destination: 'ORD',
                  destinationCity: 'Chicago',
                  departureTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                  arrivalTime: new Date(Date.now() + 86400000 + 18000000).toISOString(),
                  status: 'scheduled',
                  aircraft: 'Airbus A320',
                  role: 'pilot',
                  position: 'First Officer',
                  checkInTime: new Date(Date.now() + 82800000).toISOString(),
                  duration: '3h 45m',
                  gate: 'A5',
                  crew: [
                    { id: '4', name: 'Michael Brown', role: 'pilot', position: 'Captain' },
                    { id: '5', name: 'You', role: 'pilot', position: 'First Officer' },
                  ]
                },
                {
                  id: 'FL789',
                  flightNumber: 'SKY789',
                  origin: 'ORD',
                  originCity: 'Chicago',
                  destination: 'MIA',
                  destinationCity: 'Miami',
                  departureTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                  arrivalTime: new Date(Date.now() + 10800000).toISOString(), // 3 hours from now
                  status: 'in_air',
                  aircraft: 'Boeing 787-9',
                  role: 'pilot',
                  position: 'Captain',
                  checkInTime: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                  duration: '2h 30m',
                  gate: 'C8',
                  crew: [
                    { id: '6', name: 'You', role: 'pilot', position: 'Captain' },
                    { id: '7', name: 'Robert Taylor', role: 'copilot', position: 'First Officer' },
                  ]
                }
              ]
            });
          }
        }, 500);
      });
      
      // Mock data for demonstration
      const mockFlights = [
        {
          id: 'FL123',
          flightNumber: 'SKY123',
          origin: 'JFK',
          originCity: 'New York',
          destination: 'LAX',
          destinationCity: 'Los Angeles',
          departureTime: new Date(Date.now() + 3600000 * 2).toISOString(),
          arrivalTime: new Date(Date.now() + 3600000 * 6).toISOString(),
          status: 'scheduled',
          aircraft: 'Boeing 737-800',
          role: 'pilot',
          position: 'Captain',
          checkInTime: new Date(Date.now() + 3600000).toISOString(),
          duration: '4h 30m',
          gate: 'B12',
          crew: [
            { id: '1', name: 'John Smith', role: 'pilot', position: 'Captain' },
            { id: '2', name: 'Sarah Johnson', role: 'copilot', position: 'First Officer' },
            { id: '3', name: 'Emma Wilson', role: 'flight_attendant', position: 'Lead FA' },
          ]
        },
        {
          id: 'FL456',
          flightNumber: 'SKY456',
          origin: 'LAX',
          originCity: 'Los Angeles',
          destination: 'ORD',
          destinationCity: 'Chicago',
          departureTime: new Date(Date.now() + 86400000).toISOString(),
          arrivalTime: new Date(Date.now() + 86400000 + 18000000).toISOString(),
          status: 'scheduled',
          aircraft: 'Airbus A320',
          role: 'pilot',
          position: 'First Officer',
          checkInTime: new Date(Date.now() + 82800000).toISOString(),
          duration: '3h 45m',
          gate: 'A5',
          crew: [
            { id: '4', name: 'Michael Brown', role: 'pilot', position: 'Captain' },
            { id: '5', name: 'You', role: 'pilot', position: 'First Officer' },
          ]
        },
        {
          id: 'FL789',
          flightNumber: 'SKY789',
          origin: 'ORD',
          originCity: 'Chicago',
          destination: 'MIA',
          destinationCity: 'Miami',
          departureTime: new Date(Date.now() - 3600000).toISOString(),
          arrivalTime: new Date(Date.now() + 10800000).toISOString(),
          status: 'in_air',
          aircraft: 'Boeing 787-9',
          role: 'pilot',
          position: 'Captain',
          checkInTime: new Date(Date.now() - 7200000).toISOString(),
          duration: '2h 30m',
          gate: 'C8',
          crew: [
            { id: '6', name: 'You', role: 'pilot', position: 'Captain' },
            { id: '7', name: 'Robert Taylor', role: 'copilot', position: 'First Officer' },
          ]
        }
      ];

      // Simulate API call with timeout
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: mockFlights });
        }, 500);
      });
    } catch (err) {
      console.error('Error fetching flight assignments:', err);
      setError(err.message || 'Failed to load flight assignments');
      showError(err.message || 'Failed to load flight assignments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFlights();
  }, [fetchFlights]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedFlights = React.useMemo(() => {
    const sortableFlights = [...flights];
    if (sortConfig.key) {
      sortableFlights.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableFlights;
  }, [flights, sortConfig]);

  const filteredFlights = sortedFlights.filter(flight => {
    const status = getFlightStatus(flight);
    const matchesSearch = 
      flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      (statusFilter === 'upcoming' && ['scheduled', 'boarding', 'delayed'].includes(status)) ||
      (statusFilter === 'completed' && ['landed', 'cancelled'].includes(status)) ||
      statusFilter === 'all';
    
    return matchesSearch && matchesStatus;
  });

  const upcomingFlights = getUpcomingFlights(flights);
  const nextFlight = upcomingFlights[0];

  const RoleIcon = ({ role }) => {
    const Icon = roleIcons[role] || InformationCircleIcon;
    return <Icon className="h-5 w-5 text-gray-400" />;
  };

  if (loading) {
    return <Loader fullScreen={true} />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <XCircleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Error loading flights</h3>
        <p className="mt-2 text-sm text-gray-500">{error}</p>
        <button
          onClick={fetchFlights}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowPathIcon className="-ml-1 mr-2 h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Next Flight Card */}
      {nextFlight && (
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Your Next Flight</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Check-in {formatFlightTime(nextFlight.checkInTime)} • {nextFlight.role} • {nextFlight.position}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span 
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusStyles[getFlightStatus(nextFlight)] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {getStatusText(getFlightStatus(nextFlight))}
                </span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{nextFlight.origin}</p>
                <p className="text-sm text-gray-500">{nextFlight.originCity}</p>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {formatFlightTime(nextFlight.departureTime)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFlightDate(nextFlight.departureTime)}
                </p>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm text-gray-500">{nextFlight.duration}</div>
                  <div className="mt-1">
                    <PaperAirplaneIcon className="h-5 w-5 mx-auto text-gray-400 transform rotate-90" />
                  </div>
                  <div className="text-xs text-gray-500">Gate {nextFlight.gate}</div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{nextFlight.destination}</p>
                <p className="text-sm text-gray-500">{nextFlight.destinationCity}</p>
                <p className="mt-1 text-lg font-medium text-gray-900">
                  {formatFlightTime(nextFlight.arrivalTime)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFlightDate(nextFlight.arrivalTime)}
                </p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2 overflow-hidden">
                  {nextFlight.crew.slice(0, 5).map((member, index) => (
                    <div key={index} className="inline-block h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                      <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <UserCircleIcon className="h-6 w-6" />
                      </div>
                    </div>
                  ))}
                  {nextFlight.crew.length > 5 && (
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-xs font-medium text-gray-500">
                      +{nextFlight.crew.length - 5}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Check In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Flight List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Your Flight Assignments</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                View and manage your upcoming and past flight assignments
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              {filteredFlights.length === 0 ? (
                <div className="text-center py-12">
                  <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No flight assignments found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || statusFilter !== 'all' || roleFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria.'
                      : 'You currently have no flight assignments.'}
                  </p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Flight
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Route
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Date & Time
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Role
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredFlights.map((flight) => {
                      const status = getFlightStatus(flight);
                      const RoleIcon = roleIcons[flight.role] || UserCircleIcon;
                      
                      return (
                        <tr key={flight.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            <div className="font-semibold">{flight.flightNumber}</div>
                            <div className="text-gray-500 text-xs">{flight.aircraft}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="font-medium">
                              {flight.origin} → {flight.destination}
                            </div>
                            <div className="text-xs text-gray-400">
                              {flight.originCity} to {flight.destinationCity}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div>{format(parseISO(flight.departureTime), 'MMM d, yyyy')}</div>
                            <div className="font-medium">
                              {format(parseISO(flight.departureTime), 'h:mm a')} - {format(parseISO(flight.arrivalTime), 'h:mm a')}
                            </div>
                            <div className="text-xs text-gray-400">{flight.duration}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <RoleIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <span>{flight.position}</span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                statusStyles[status] || 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {getStatusText(status)}
                            </span>
                            {status === 'scheduled' && (
                              <div className="mt-1 text-xs text-gray-500">
                                Check-in: {format(parseISO(flight.checkInTime), 'h:mm a')}
                              </div>
                            )}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <Link
                              to={`/employee/flights/${flight.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View<span className="sr-only">, {flight.flightNumber}</span>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightAssignments;
