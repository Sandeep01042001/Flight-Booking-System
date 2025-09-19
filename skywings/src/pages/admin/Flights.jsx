import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ArrowPathIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  MapPinIcon,
  ArrowPathIcon as RefreshIcon
} from '@heroicons/react/24/outline';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import Button from '../../components/ui/buttons/Button';
import Card from '../../components/common/Card';
import Input from '../../components/ui/forms/Input';
import Select from '../../components/ui/forms/Select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';

// Mock data - in a real app, this would come from an API
const mockFlights = [
  {
    id: 'FL1001',
    flightNumber: 'SW101',
    origin: { code: 'JFK', city: 'New York' },
    destination: { code: 'LAX', city: 'Los Angeles' },
    departure: new Date(2025, 9, 20, 8, 30).toISOString(),
    arrival: new Date(2025, 9, 20, 12, 15).toISOString(),
    aircraft: 'Boeing 737-800',
    status: 'scheduled',
    economySeats: 150,
    businessSeats: 30,
    firstClassSeats: 20,
    economyPrice: 299.99,
    businessPrice: 599.99,
    firstClassPrice: 899.99,
    availableEconomy: 45,
    availableBusiness: 8,
    availableFirstClass: 5,
    createdAt: new Date(2025, 8, 1).toISOString(),
    updatedAt: new Date(2025, 8, 1).toISOString()
  },
  // Add more mock flights...
  {
    id: 'FL1002',
    flightNumber: 'SW202',
    origin: { code: 'LAX', city: 'Los Angeles' },
    destination: { code: 'ORD', city: 'Chicago' },
    departure: new Date(2025, 9, 21, 14, 0).toISOString(),
    arrival: new Date(2025, 9, 21, 19, 30).toISOString(),
    aircraft: 'Airbus A320',
    status: 'scheduled',
    economySeats: 140,
    businessSeats: 25,
    firstClassSeats: 15,
    economyPrice: 249.99,
    businessPrice: 549.99,
    firstClassPrice: 849.99,
    availableEconomy: 32,
    availableBusiness: 5,
    availableFirstClass: 2,
    createdAt: new Date(2025, 8, 2).toISOString(),
    updatedAt: new Date(2025, 8, 2).toISOString()
  },
  {
    id: 'FL1003',
    flightNumber: 'SW303',
    origin: { code: 'ORD', city: 'Chicago' },
    destination: { code: 'MIA', city: 'Miami' },
    departure: new Date(2025, 9, 22, 9, 15).toISOString(),
    arrival: new Date(2025, 9, 22, 12, 45).toISOString(),
    aircraft: 'Boeing 737-700',
    status: 'delayed',
    economySeats: 130,
    businessSeats: 20,
    firstClassSeats: 10,
    economyPrice: 199.99,
    businessPrice: 449.99,
    firstClassPrice: 699.99,
    availableEconomy: 28,
    availableBusiness: 3,
    availableFirstClass: 1,
    createdAt: new Date(2025, 8, 3).toISOString(),
    updatedAt: new Date(2025, 8, 10).toISOString()
  },
  {
    id: 'FL1004',
    flightNumber: 'SW404',
    origin: { code: 'SFO', city: 'San Francisco' },
    destination: { code: 'SEA', city: 'Seattle' },
    departure: new Date(2025, 9, 23, 11, 30).toISOString(),
    arrival: new Date(2025, 9, 23, 13, 15).toISOString(),
    aircraft: 'Embraer E175',
    status: 'cancelled',
    economySeats: 80,
    businessSeats: 12,
    firstClassSeats: 0,
    economyPrice: 149.99,
    businessPrice: 299.99,
    firstClassPrice: 0,
    availableEconomy: 0,
    availableBusiness: 0,
    availableFirstClass: 0,
    createdAt: new Date(2025, 8, 4).toISOString(),
    updatedAt: new Date(2025, 8, 15).toISOString()
  },
  {
    id: 'FL1005',
    flightNumber: 'SW505',
    origin: { code: 'DFW', city: 'Dallas' },
    destination: { code: 'ATL', city: 'Atlanta' },
    departure: new Date(2025, 9, 24, 16, 45).toISOString(),
    arrival: new Date(2025, 9, 24, 19, 30).toISOString(),
    aircraft: 'Boeing 737-800',
    status: 'completed',
    economySeats: 150,
    businessSeats: 30,
    firstClassSeats: 20,
    economyPrice: 229.99,
    businessPrice: 499.99,
    firstClassPrice: 799.99,
    availableEconomy: 0,
    availableBusiness: 0,
    availableFirstClass: 0,
    createdAt: new Date(2025, 8, 5).toISOString(),
    updatedAt: new Date(2025, 8, 20).toISOString()
  }
];

// Mock aircraft data
const aircraftList = [
  'Airbus A320',
  'Airbus A321',
  'Boeing 737-700',
  'Boeing 737-800',
  'Boeing 737-900',
  'Boeing 737 MAX 8',
  'Boeing 787-8 Dreamliner',
  'Boeing 787-9 Dreamliner',
  'Embraer E175',
  'Embraer E190'
];

// Mock airport data
const airports = [
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles' },
  { code: 'ORD', name: "O'Hare International", city: 'Chicago' },
  { code: 'MIA', name: 'Miami International', city: 'Miami' },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco' },
  { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle' },
  { code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas' },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta International', city: 'Atlanta' },
  { code: 'DEN', name: 'Denver International', city: 'Denver' },
  { code: 'LAS', name: 'Harry Reid International', city: 'Las Vegas' }
];

const statusOptions = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'delayed', label: 'Delayed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
  { value: 'boarding', label: 'Boarding' },
  { value: 'in_air', label: 'In Air' },
  { value: 'diverted', label: 'Diverted' },
  { value: 'returned', label: 'Returned to Gate' }
];

const Flights = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    origin: '',
    destination: '',
    dateFrom: null,
    dateTo: null,
    aircraft: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [flightToDelete, setFlightToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'departure', direction: 'asc' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    flightNumber: '',
    origin: '',
    destination: '',
    departure: '',
    arrival: '',
    aircraft: '',
    status: 'scheduled',
    economySeats: 0,
    businessSeats: 0,
    firstClassSeats: 0,
    economyPrice: 0,
    businessPrice: 0,
    firstClassPrice: 0,
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [flightToEdit, setFlightToEdit] = useState(null);
  const [editForm, setEditForm] = useState({
    flightNumber: '',
    origin: { code: '', city: '' },
    destination: { code: '', city: '' },
    departure: '',
    arrival: '',
    aircraft: '',
    status: 'scheduled',
    economySeats: 0,
    businessSeats: 0,
    firstClassSeats: 0,
    economyPrice: 0,
    businessPrice: 0,
    firstClassPrice: 0,
  });

  // Load flights
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setFlights(mockFlights);
        setFilteredFlights(mockFlights);
      } catch (error) {
        console.error('Error fetching flights:', error);
        toast.error('Failed to load flights. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...flights];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(flight => 
        flight.flightNumber.toLowerCase().includes(term) ||
        flight.origin.code.toLowerCase().includes(term) ||
        flight.destination.code.toLowerCase().includes(term) ||
        flight.aircraft.toLowerCase().includes(term)
      );
    }

    // Apply filters
    if (filters.status) {
      result = result.filter(flight => flight.status === filters.status);
    }
    if (filters.origin) {
      result = result.filter(flight => flight.origin.code === filters.origin);
    }
    if (filters.destination) {
      result = result.filter(flight => flight.destination.code === filters.destination);
    }
    if (filters.aircraft) {
      result = result.filter(flight => flight.aircraft === filters.aircraft);
    }
    if (filters.dateFrom) {
      result = result.filter(flight => 
        isAfter(parseISO(flight.departure), filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      const endOfDay = new Date(filters.dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      result = result.filter(flight => 
        isBefore(parseISO(flight.departure), endOfDay)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;
      
      // Handle nested properties
      if (sortConfig.key.includes('.')) {
        const keys = sortConfig.key.split('.');
        aValue = keys.reduce((obj, key) => obj && obj[key], a);
        bValue = keys.reduce((obj, key) => obj && obj[key], b);
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }

      // Convert to date if the value is a date string
      if (typeof aValue === 'string' && !isNaN(Date.parse(aValue))) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredFlights(result);
  }, [flights, searchTerm, filters, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date, name) => {
    setFilters(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      origin: '',
      destination: '',
      dateFrom: null,
      dateTo: null,
      aircraft: ''
    });
    setSearchTerm('');
  };

  const handleDeleteClick = (flight) => {
    setFlightToDelete(flight);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // In a real app, this would be an API call
    setFlights(flights.filter(flight => flight.id !== flightToDelete.id));
    setShowDeleteModal(false);
    toast.success(`Flight ${flightToDelete.flightNumber} has been deleted.`);
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddFlight = (e) => {
    e.preventDefault();
    
    // Validation
    if (!addForm.flightNumber || !addForm.origin || !addForm.destination || 
        !addForm.departure || !addForm.arrival || !addForm.aircraft) {
      toast.error('Please fill in all required fields.');
      return;
    }

    // Check if flight number already exists
    if (flights.some(flight => flight.flightNumber === addForm.flightNumber)) {
      toast.error('Flight number already exists. Please use a different flight number.');
      return;
    }

    // Find origin and destination airport details
    const originAirport = airports.find(airport => airport.code === addForm.origin);
    const destinationAirport = airports.find(airport => airport.code === addForm.destination);

    if (!originAirport || !destinationAirport) {
      toast.error('Invalid origin or destination airport.');
      return;
    }

    // Create new flight object
    const newFlight = {
      id: `FL${Date.now()}`,
      flightNumber: addForm.flightNumber,
      origin: { code: originAirport.code, city: originAirport.city },
      destination: { code: destinationAirport.code, city: destinationAirport.city },
      departure: new Date(addForm.departure).toISOString(),
      arrival: new Date(addForm.arrival).toISOString(),
      aircraft: addForm.aircraft,
      status: addForm.status,
      economySeats: parseInt(addForm.economySeats) || 0,
      businessSeats: parseInt(addForm.businessSeats) || 0,
      firstClassSeats: parseInt(addForm.firstClassSeats) || 0,
      economyPrice: parseFloat(addForm.economyPrice) || 0,
      businessPrice: parseFloat(addForm.businessPrice) || 0,
      firstClassPrice: parseFloat(addForm.firstClassPrice) || 0,
      availableEconomy: parseInt(addForm.economySeats) || 0,
      availableBusiness: parseInt(addForm.businessSeats) || 0,
      availableFirstClass: parseInt(addForm.firstClassSeats) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to flights list
    setFlights(prev => [...prev, newFlight]);
    
    // Reset form and close modal
    setAddForm({
      flightNumber: '',
      origin: '',
      destination: '',
      departure: '',
      arrival: '',
      aircraft: '',
      status: 'scheduled',
      economySeats: 0,
      businessSeats: 0,
      firstClassSeats: 0,
      economyPrice: 0,
      businessPrice: 0,
      firstClassPrice: 0,
    });
    setShowAddModal(false);
    toast.success(`Flight ${newFlight.flightNumber} has been added successfully.`);
  };

  // Edit flight form handlers
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    // Handle nested origin/destination from selects by airport code
    if (name === 'origin') {
      const originAirport = airports.find(a => a.code === value);
      if (!originAirport) return;
      setEditForm(prev => ({
        ...prev,
        origin: { code: originAirport.code, city: originAirport.city },
      }));
      return;
    }
    if (name === 'destination') {
      const destinationAirport = airports.find(a => a.code === value);
      if (!destinationAirport) return;
      setEditForm(prev => ({
        ...prev,
        destination: { code: destinationAirport.code, city: destinationAirport.city },
      }));
      return;
    }

    setEditForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateFlight = (e) => {
    e.preventDefault();

    if (!flightToEdit) return;

    // Basic validation
    if (!editForm.flightNumber || !editForm.origin?.code || !editForm.destination?.code ||
        !editForm.departure || !editForm.arrival || !editForm.aircraft) {
      toast.error('Please fill in all required fields.');
      return;
    }

    // If flight number changed, ensure uniqueness
    if (editForm.flightNumber !== flightToEdit.flightNumber &&
        flights.some(f => f.flightNumber === editForm.flightNumber)) {
      toast.error('Flight number already exists. Please use a different flight number.');
      return;
    }

    // Build updated flight
    const updated = {
      ...flightToEdit,
      flightNumber: editForm.flightNumber,
      origin: editForm.origin,
      destination: editForm.destination,
      departure: new Date(editForm.departure).toISOString(),
      arrival: new Date(editForm.arrival).toISOString(),
      aircraft: editForm.aircraft,
      status: editForm.status,
      economySeats: parseInt(editForm.economySeats) || 0,
      businessSeats: parseInt(editForm.businessSeats) || 0,
      firstClassSeats: parseInt(editForm.firstClassSeats) || 0,
      economyPrice: parseFloat(editForm.economyPrice) || 0,
      businessPrice: parseFloat(editForm.businessPrice) || 0,
      firstClassPrice: parseFloat(editForm.firstClassPrice) || 0,
      updatedAt: new Date().toISOString(),
    };

    // Clamp available seats to not exceed total seats
    updated.availableEconomy = Math.min(flightToEdit.availableEconomy ?? 0, updated.economySeats);
    updated.availableBusiness = Math.min(flightToEdit.availableBusiness ?? 0, updated.businessSeats);
    updated.availableFirstClass = Math.min(flightToEdit.availableFirstClass ?? 0, updated.firstClassSeats);

    setFlights(prev => prev.map(f => (f.id === flightToEdit.id ? updated : f)));
    setShowEditModal(false);
    toast.success(`Flight ${updated.flightNumber} has been updated.`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'delayed':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'boarding':
        return 'bg-purple-100 text-purple-800';
      case 'in_air':
        return 'bg-indigo-100 text-indigo-800';
      case 'diverted':
        return 'bg-orange-100 text-orange-800';
      case 'returned':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':
        return <ClockIcon className="h-4 w-4 mr-1" />;
      case 'delayed':
        return <ExclamationTriangleIcon className="h-4 w-4 mr-1" />;
      case 'cancelled':
        return <XMarkIcon className="h-4 w-4 mr-1" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 mr-1" />;
      default:
        return <ClockIcon className="h-4 w-4 mr-1" />;
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <span className="ml-1 opacity-0 group-hover:opacity-100">↕</span>;
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const getOccupancyPercentage = (flight) => {
    const totalSeats = flight.economySeats + flight.businessSeats + flight.firstClassSeats;
    const availableSeats = flight.availableEconomy + flight.availableBusiness + flight.availableFirstClass;
    const occupiedSeats = totalSeats - availableSeats;
    return Math.round((occupiedSeats / totalSeats) * 100);
  };

  const getOccupancyColor = (percentage) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flight Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all flights, schedules, and availability
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            onClick={() => setShowAddModal(true)}
            leftIcon={<PlusIcon className="h-5 w-5 mr-2" />}
          >
            Add New Flight
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search flights by number, origin, destination, or aircraft..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex-shrink-0"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              {showFilters ? 'Hide Filters' : 'Filters'}
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Select
                  label="Status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  options={[
                    { value: '', label: 'All Statuses' },
                    ...statusOptions.map(status => ({
                      value: status.value,
                      label: status.label
                    }))
                  ]}
                />
                
                <Select
                  label="Origin"
                  name="origin"
                  value={filters.origin}
                  onChange={handleFilterChange}
                  options={[
                    { value: '', label: 'All Origins' },
                    ...airports.map(airport => ({
                      value: airport.code,
                      label: `${airport.code} - ${airport.city}`
                    }))
                  ]}
                />
                
                <Select
                  label="Destination"
                  name="destination"
                  value={filters.destination}
                  onChange={handleFilterChange}
                  options={[
                    { value: '', label: 'All Destinations' },
                    ...airports.map(airport => ({
                      value: airport.code,
                      label: `${airport.code} - ${airport.city}`
                    }))
                  ]}
                />
                
                <Select
                  label="Aircraft"
                  name="aircraft"
                  value={filters.aircraft}
                  onChange={handleFilterChange}
                  options={[
                    { value: '', label: 'All Aircraft' },
                    ...aircraftList.map(aircraft => ({
                      value: aircraft,
                      label: aircraft
                    }))
                  ]}
                />
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Departure From</label>
                  <DatePicker
                    selected={filters.dateFrom}
                    onChange={(date) => handleDateChange(date, 'dateFrom')}
                    selectsStart
                    startDate={filters.dateFrom}
                    endDate={filters.dateTo}
                    maxDate={filters.dateTo || addDays(new Date(), 365)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholderText="Start date"
                    dateFormat="MMM d, yyyy"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Departure To</label>
                  <DatePicker
                    selected={filters.dateTo}
                    onChange={(date) => handleDateChange(date, 'dateTo')}
                    selectsEnd
                    startDate={filters.dateFrom}
                    endDate={filters.dateTo}
                    minDate={filters.dateFrom}
                    maxDate={addDays(new Date(), 365)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholderText="End date"
                    dateFormat="MMM d, yyyy"
                  />
                </div>
                
                <div className="flex items-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Flights Table */}
      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredFlights.length === 0 ? (
            <div className="text-center p-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No flights found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || Object.values(filters).some(Boolean) 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'There are currently no flights scheduled.'}
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    clearFilters();
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort('flightNumber')}
                  >
                    <div className="flex items-center">
                      Flight
                      <span className="ml-1">{getSortIcon('flightNumber')}</span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort('origin.code')}
                  >
                    <div className="flex items-center">
                      Route
                      <span className="ml-1">{getSortIcon('origin.code')}</span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort('departure')}
                  >
                    <div className="flex items-center">
                      Departure
                      <span className="ml-1">{getSortIcon('departure')}</span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort('arrival')}
                  >
                    <div className="flex items-center">
                      Arrival
                      <span className="ml-1">{getSortIcon('arrival')}</span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Aircraft
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Occupancy
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      <span className="ml-1">{getSortIcon('status')}</span>
                    </div>
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFlights.map((flight) => {
                  const departure = parseISO(flight.departure);
                  const arrival = parseISO(flight.arrival);
                  const occupancy = getOccupancyPercentage(flight);
                  
                  return (
                    <tr key={flight.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100">
                            <span className="text-indigo-800 font-medium">{flight.flightNumber}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{flight.aircraft}</div>
                            <div className="text-sm text-gray-500">{flight.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="font-medium">{flight.origin.code}</span>
                          <span className="mx-2">→</span>
                          <span className="font-medium">{flight.destination.code}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {flight.origin.city} to {flight.destination.city}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(departure, 'MMM d, yyyy')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(departure, 'h:mm a')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(arrival, 'MMM d, yyyy')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(arrival, 'h:mm a')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {flight.aircraft}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className={`h-2.5 rounded-full ${getOccupancyColor(occupancy)}`}
                              style={{ width: `${occupancy}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">{occupancy}%</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {flight.economySeats + flight.businessSeats + flight.firstClassSeats - 
                           flight.availableEconomy - flight.availableBusiness - flight.availableFirstClass} / 
                          {flight.economySeats + flight.businessSeats + flight.firstClassSeats} seats
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(flight.status)}`}>
                          {getStatusIcon(flight.status)}
                          {statusOptions.find(s => s.value === flight.status)?.label || flight.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="icon" 
                            size="sm"
                            title="Edit Flight"
                            onClick={() => {
                              setFlightToEdit(flight);
                              setEditForm({
                                flightNumber: flight.flightNumber || '',
                                origin: flight.origin || { code: '', city: '' },
                                destination: flight.destination || { code: '', city: '' },
                                departure: flight.departure ? flight.departure.slice(0,16) : '',
                                arrival: flight.arrival ? flight.arrival.slice(0,16) : '',
                                aircraft: flight.aircraft || '',
                                status: flight.status || 'scheduled',
                                economySeats: flight.economySeats ?? 0,
                                businessSeats: flight.businessSeats ?? 0,
                                firstClassSeats: flight.firstClassSeats ?? 0,
                                economyPrice: flight.economyPrice ?? 0,
                                businessPrice: flight.businessPrice ?? 0,
                                firstClassPrice: flight.firstClassPrice ?? 0,
                              });
                              setShowEditModal(true);
                            }}
                          >
                            <PencilIcon className="h-4 w-4 text-gray-600 hover:text-indigo-600" />
                          </Button>
                          <Button 
                            variant="icon" 
                            size="sm"
                            onClick={() => handleDeleteClick(flight)}
                            title="Delete Flight"
                          >
                            <TrashIcon className="h-4 w-4 text-gray-600 hover:text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                <span className="font-medium">{filteredFlights.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  aria-current="page"
                  className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  1
                </button>
                <button
                  className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  2
                </button>
                <button
                  className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  3
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
                <button
                  className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  8
                </button>
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal (Headless UI v2) */}
      <Transition appear show={showDeleteModal}>
        <Dialog as="div" className="relative z-10" onClose={setShowDeleteModal}>
          <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <DialogTitle as="h3" className="text-lg leading-6 font-medium text-gray-900">
                        Delete Flight
                      </DialogTitle>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete flight {flightToDelete?.flightNumber}? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={confirmDelete}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Add Flight Modal (Headless UI v2) */}
      <Transition appear show={showAddModal}>
        <Dialog as="div" className="relative z-10" onClose={setShowAddModal}>
          <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                  <div>
                    <div className="flex items-center">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                        <PlusIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <DialogTitle as="h3" className="text-lg leading-6 font-medium text-gray-900">
                          Add New Flight
                        </DialogTitle>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Create a new flight with all the necessary details.
                          </p>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleAddFlight} className="mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Flight Number */}
                        <div>
                          <Input
                            label="Flight Number *"
                            name="flightNumber"
                            value={addForm.flightNumber}
                            onChange={handleAddFormChange}
                            placeholder="e.g., SW101"
                            required
                          />
                        </div>

                        {/* Aircraft */}
                        <div>
                          <Select
                            label="Aircraft *"
                            name="aircraft"
                            value={addForm.aircraft}
                            onChange={handleAddFormChange}
                            options={[
                              { value: '', label: 'Select Aircraft' },
                              ...aircraftList.map(aircraft => ({
                                value: aircraft,
                                label: aircraft
                              }))
                            ]}
                            required
                          />
                        </div>

                        {/* Origin */}
                        <div>
                          <Select
                            label="Origin Airport *"
                            name="origin"
                            value={addForm.origin}
                            onChange={handleAddFormChange}
                            options={[
                              { value: '', label: 'Select Origin' },
                              ...airports.map(airport => ({
                                value: airport.code,
                                label: `${airport.code} - ${airport.city}`
                              }))
                            ]}
                            required
                          />
                        </div>

                        {/* Destination */}
                        <div>
                          <Select
                            label="Destination Airport *"
                            name="destination"
                            value={addForm.destination}
                            onChange={handleAddFormChange}
                            options={[
                              { value: '', label: 'Select Destination' },
                              ...airports.map(airport => ({
                                value: airport.code,
                                label: `${airport.code} - ${airport.city}`
                              }))
                            ]}
                            required
                          />
                        </div>

                        {/* Departure Date & Time */}
                        <div>
                          <Input
                            label="Departure Date & Time *"
                            name="departure"
                            type="datetime-local"
                            value={addForm.departure}
                            onChange={handleAddFormChange}
                            required
                          />
                        </div>

                        {/* Arrival Date & Time */}
                        <div>
                          <Input
                            label="Arrival Date & Time *"
                            name="arrival"
                            type="datetime-local"
                            value={addForm.arrival}
                            onChange={handleAddFormChange}
                            required
                          />
                        </div>

                        {/* Status */}
                        <div>
                          <Select
                            label="Status"
                            name="status"
                            value={addForm.status}
                            onChange={handleAddFormChange}
                            options={statusOptions.map(status => ({
                              value: status.value,
                              label: status.label
                            }))}
                          />
                        </div>

                        {/* Economy Seats */}
                        <div>
                          <Input
                            label="Economy Seats"
                            name="economySeats"
                            type="number"
                            min="0"
                            value={addForm.economySeats}
                            onChange={handleAddFormChange}
                            placeholder="0"
                          />
                        </div>

                        {/* Business Seats */}
                        <div>
                          <Input
                            label="Business Seats"
                            name="businessSeats"
                            type="number"
                            min="0"
                            value={addForm.businessSeats}
                            onChange={handleAddFormChange}
                            placeholder="0"
                          />
                        </div>

                        {/* First Class Seats */}
                        <div>
                          <Input
                            label="First Class Seats"
                            name="firstClassSeats"
                            type="number"
                            min="0"
                            value={addForm.firstClassSeats}
                            onChange={handleAddFormChange}
                            placeholder="0"
                          />
                        </div>

                        {/* Economy Price */}
                        <div>
                          <Input
                            label="Economy Price ($)"
                            name="economyPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            value={addForm.economyPrice}
                            onChange={handleAddFormChange}
                            placeholder="0.00"
                          />
                        </div>

                        {/* Business Price */}
                        <div>
                          <Input
                            label="Business Price ($)"
                            name="businessPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            value={addForm.businessPrice}
                            onChange={handleAddFormChange}
                            placeholder="0.00"
                          />
                        </div>

                        {/* First Class Price */}
                        <div>
                          <Input
                            label="First Class Price ($)"
                            name="firstClassPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            value={addForm.firstClassPrice}
                            onChange={handleAddFormChange}
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="mt-8 sm:flex sm:flex-row-reverse">
                        <Button
                          type="submit"
                          className="w-full sm:ml-3 sm:w-auto"
                        >
                          Add Flight
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowAddModal(false)}
                          className="mt-3 w-full sm:mt-0 sm:w-auto"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Flight Modal (Headless UI v2) */}
      <Transition appear show={showEditModal}>
        <Dialog as="div" className="relative z-10" onClose={setShowEditModal}>
          <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                  <div>
                    <div className="flex items-center">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                        <PencilIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <DialogTitle as="h3" className="text-lg leading-6 font-medium text-gray-900">
                          Edit Flight
                        </DialogTitle>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Update flight details and save your changes.
                          </p>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleUpdateFlight} className="mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Flight Number */}
                        <div>
                          <Input
                            label="Flight Number *"
                            name="flightNumber"
                            value={editForm.flightNumber}
                            onChange={handleEditFormChange}
                            required
                          />
                        </div>

                        {/* Aircraft */}
                        <div>
                          <Select
                            label="Aircraft *"
                            name="aircraft"
                            value={editForm.aircraft}
                            onChange={handleEditFormChange}
                            options={[
                              { value: '', label: 'Select Aircraft' },
                              ...aircraftList.map(aircraft => ({ value: aircraft, label: aircraft }))
                            ]}
                            required
                          />
                        </div>

                        {/* Origin */}
                        <div>
                          <Select
                            label="Origin Airport *"
                            name="origin"
                            value={editForm.origin?.code || ''}
                            onChange={handleEditFormChange}
                            options={[
                              { value: '', label: 'Select Origin' },
                              ...airports.map(a => ({ value: a.code, label: `${a.code} - ${a.city}` }))
                            ]}
                            required
                          />
                        </div>

                        {/* Destination */}
                        <div>
                          <Select
                            label="Destination Airport *"
                            name="destination"
                            value={editForm.destination?.code || ''}
                            onChange={handleEditFormChange}
                            options={[
                              { value: '', label: 'Select Destination' },
                              ...airports.map(a => ({ value: a.code, label: `${a.code} - ${a.city}` }))
                            ]}
                            required
                          />
                        </div>

                        {/* Departure Date & Time */}
                        <div>
                          <Input
                            label="Departure Date & Time *"
                            name="departure"
                            type="datetime-local"
                            value={editForm.departure}
                            onChange={handleEditFormChange}
                            required
                          />
                        </div>

                        {/* Arrival Date & Time */}
                        <div>
                          <Input
                            label="Arrival Date & Time *"
                            name="arrival"
                            type="datetime-local"
                            value={editForm.arrival}
                            onChange={handleEditFormChange}
                            required
                          />
                        </div>

                        {/* Status */}
                        <div>
                          <Select
                            label="Status"
                            name="status"
                            value={editForm.status}
                            onChange={handleEditFormChange}
                            options={statusOptions.map(s => ({ value: s.value, label: s.label }))}
                          />
                        </div>

                        {/* Economy Seats */}
                        <div>
                          <Input
                            label="Economy Seats"
                            name="economySeats"
                            type="number"
                            min="0"
                            value={editForm.economySeats}
                            onChange={handleEditFormChange}
                          />
                        </div>

                        {/* Business Seats */}
                        <div>
                          <Input
                            label="Business Seats"
                            name="businessSeats"
                            type="number"
                            min="0"
                            value={editForm.businessSeats}
                            onChange={handleEditFormChange}
                          />
                        </div>

                        {/* First Class Seats */}
                        <div>
                          <Input
                            label="First Class Seats"
                            name="firstClassSeats"
                            type="number"
                            min="0"
                            value={editForm.firstClassSeats}
                            onChange={handleEditFormChange}
                          />
                        </div>

                        {/* Economy Price */}
                        <div>
                          <Input
                            label="Economy Price ($)"
                            name="economyPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            value={editForm.economyPrice}
                            onChange={handleEditFormChange}
                          />
                        </div>

                        {/* Business Price */}
                        <div>
                          <Input
                            label="Business Price ($)"
                            name="businessPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            value={editForm.businessPrice}
                            onChange={handleEditFormChange}
                          />
                        </div>

                        {/* First Class Price */}
                        <div>
                          <Input
                            label="First Class Price ($)"
                            name="firstClassPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            value={editForm.firstClassPrice}
                            onChange={handleEditFormChange}
                          />
                        </div>
                      </div>

                      <div className="mt-8 sm:flex sm:flex-row-reverse">
                        <Button type="submit" className="w-full sm:ml-3 sm:w-auto">Save Changes</Button>
                        <Button type="button" variant="outline" onClick={() => setShowEditModal(false)} className="mt-3 w-full sm:mt-0 sm:w-auto">Cancel</Button>
                      </div>
                    </form>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      
    </div>
  );
};

export default Flights;
