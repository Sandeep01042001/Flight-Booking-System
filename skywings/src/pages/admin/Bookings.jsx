import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  TicketIcon,
  UserCircleIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  EnvelopeIcon,
  CheckIcon,
  XMarkIcon,
  EllipsisVerticalIcon,
  PlusIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Button from '../../components/ui/buttons/Button';
import Card from '../../components/common/Card';
import Input from '../../components/ui/forms/Input';
import Select from '../../components/ui/forms/Select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';

// Mock data - in a real app, this would come from an API
const mockBookings = [
  {
    id: 'BK1001',
    bookingNumber: 'SWB-2023-1001',
    customer: {
      id: 'CUST1001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567'
    },
    flights: [
      {
        id: 'FL1001',
        flightNumber: 'SW101',
        origin: { code: 'JFK', city: 'New York' },
        destination: { code: 'LAX', city: 'Los Angeles' },
        departure: new Date(2025, 9, 20, 8, 30).toISOString(),
        arrival: new Date(2025, 9, 20, 12, 15).toISOString(),
        aircraft: 'Boeing 737-800',
        status: 'scheduled'
      }
    ],
    passengers: [
      {
        id: 'PAX1001',
        firstName: 'John',
        lastName: 'Doe',
        type: 'adult',
        seat: '12A',
        ticketNumber: 'TKT1001',
        checkedIn: true,
        boardingPassIssued: true
      },
      {
        id: 'PAX1002',
        firstName: 'Jane',
        lastName: 'Doe',
        type: 'adult',
        seat: '12B',
        ticketNumber: 'TKT1002',
        checkedIn: false,
        boardingPassIssued: false
      }
    ],
    contactInfo: {
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, New York, NY 10001'
    },
    bookingDate: new Date(2025, 8, 15, 14, 30).toISOString(),
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    totalAmount: 798.98,
    currency: 'USD',
    specialRequests: 'Window seat preferred',
    notes: 'Frequent flyer number: FF12345678',
    createdBy: 'system',
    updatedAt: new Date(2025, 8, 15, 14, 35).toISOString()
  },
  // Add more mock bookings...
  {
    id: 'BK1002',
    bookingNumber: 'SWB-2023-1002',
    customer: {
      id: 'CUST1002',
      name: 'Alice Johnson',
      email: 'alice.j@example.com',
      phone: '+1 (555) 234-5678'
    },
    flights: [
      {
        id: 'FL1002',
        flightNumber: 'SW202',
        origin: { code: 'LAX', city: 'Los Angeles' },
        destination: { code: 'ORD', city: 'Chicago' },
        departure: new Date(2025, 9, 21, 14, 0).toISOString(),
        arrival: new Date(2025, 9, 21, 19, 30).toISOString(),
        aircraft: 'Airbus A320',
        status: 'scheduled'
      },
      {
        id: 'FL1003',
        flightNumber: 'SW203',
        origin: { code: 'ORD', city: 'Chicago' },
        destination: { code: 'JFK', city: 'New York' },
        departure: new Date(2025, 9, 21, 21, 0).toISOString(),
        arrival: new Date(2025, 9, 22, 1, 15).toISOString(),
        aircraft: 'Boeing 737-800',
        status: 'scheduled'
      }
    ],
    passengers: [
      {
        id: 'PAX1003',
        firstName: 'Alice',
        lastName: 'Johnson',
        type: 'adult',
        seat: '8C',
        ticketNumber: 'TKT1003',
        checkedIn: false,
        boardingPassIssued: false
      }
    ],
    contactInfo: {
      email: 'alice.j@example.com',
      phone: '+1 (555) 234-5678',
      address: '456 Oak Ave, Los Angeles, CA 90001'
    },
    bookingDate: new Date(2025, 8, 16, 9, 15).toISOString(),
    status: 'pending_payment',
    paymentStatus: 'pending',
    paymentMethod: 'credit_card',
    totalAmount: 549.99,
    currency: 'USD',
    specialRequests: 'Vegetarian meal',
    notes: 'Traveling for business',
    createdBy: 'web',
    updatedAt: new Date(2025, 8, 16, 9, 20).toISOString()
  },
  {
    id: 'BK1003',
    bookingNumber: 'SWB-2023-1003',
    customer: {
      id: 'CUST1003',
      name: 'Robert Smith',
      email: 'robert.smith@example.com',
      phone: '+1 (555) 345-6789'
    },
    flights: [
      {
        id: 'FL1004',
        flightNumber: 'SW303',
        origin: { code: 'ORD', city: 'Chicago' },
        destination: { code: 'MIA', city: 'Miami' },
        departure: new Date(2025, 9, 22, 9, 15).toISOString(),
        arrival: new Date(2025, 9, 22, 12, 45).toISOString(),
        aircraft: 'Boeing 737-700',
        status: 'delayed'
      }
    ],
    passengers: [
      {
        id: 'PAX1004',
        firstName: 'Robert',
        lastName: 'Smith',
        type: 'adult',
        seat: '15F',
        ticketNumber: 'TKT1004',
        checkedIn: true,
        boardingPassIssued: true
      },
      {
        id: 'PAX1005',
        firstName: 'Sarah',
        lastName: 'Smith',
        type: 'adult',
        seat: '15E',
        ticketNumber: 'TKT1005',
        checkedIn: true,
        boardingPassIssued: true
      },
      {
        id: 'PAX1006',
        firstName: 'Emma',
        lastName: 'Smith',
        type: 'child',
        seat: '15D',
        ticketNumber: 'TKT1006',
        checkedIn: true,
        boardingPassIssued: true
      }
    ],
    contactInfo: {
      email: 'robert.smith@example.com',
      phone: '+1 (555) 345-6789',
      address: '789 Pine St, Chicago, IL 60601'
    },
    bookingDate: new Date(2025, 8, 10, 16, 45).toISOString(),
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'paypal',
    totalAmount: 1125.50,
    currency: 'USD',
    specialRequests: 'Traveling with infant, need bassinet',
    notes: 'Celebrating anniversary',
    createdBy: 'agent',
    updatedAt: new Date(2025, 8, 10, 17, 10).toISOString()
  },
  {
    id: 'BK1004',
    bookingNumber: 'SWB-2023-1004',
    customer: {
      id: 'CUST1004',
      name: 'Emily Davis',
      email: 'emily.d@example.com',
      phone: '+1 (555) 456-7890'
    },
    flights: [
      {
        id: 'FL1005',
        flightNumber: 'SW404',
        origin: { code: 'SFO', city: 'San Francisco' },
        destination: { code: 'SEA', city: 'Seattle' },
        departure: new Date(2025, 9, 23, 11, 30).toISOString(),
        arrival: new Date(2025, 9, 23, 13, 15).toISOString(),
        aircraft: 'Embraer E175',
        status: 'scheduled'
      }
    ],
    passengers: [
      {
        id: 'PAX1007',
        firstName: 'Emily',
        lastName: 'Davis',
        type: 'adult',
        seat: '3A',
        ticketNumber: 'TKT1007',
        checkedIn: false,
        boardingPassIssued: false
      }
    ],
    contactInfo: {
      email: 'emily.d@example.com',
      phone: '+1 (555) 456-7890',
      address: '321 Elm St, San Francisco, CA 94101'
    },
    bookingDate: new Date(2025, 8, 18, 10, 20).toISOString(),
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'credit_card',
    totalAmount: 349.99,
    currency: 'USD',
    specialRequests: '',
    notes: 'Customer called to cancel due to change in plans',
    createdBy: 'web',
    updatedAt: new Date(2025, 8, 19, 14, 30).toISOString(),
    cancellationDate: new Date(2025, 8, 19, 14, 30).toISOString(),
    cancellationReason: 'Change of plans',
    refundAmount: 314.99,
    refundDate: new Date(2025, 8, 19, 15, 45).toISOString()
  },
  {
    id: 'BK1005',
    bookingNumber: 'SWB-2023-1005',
    customer: {
      id: 'CUST1005',
      name: 'Michael Wilson',
      email: 'michael.w@example.com',
      phone: '+1 (555) 567-8901'
    },
    flights: [
      {
        id: 'FL1006',
        flightNumber: 'SW505',
        origin: { code: 'DFW', city: 'Dallas' },
        destination: { code: 'ATL', city: 'Atlanta' },
        departure: new Date(2025, 9, 24, 16, 45).toISOString(),
        arrival: new Date(2025, 9, 24, 19, 30).toISOString(),
        aircraft: 'Boeing 737-800',
        status: 'scheduled'
      }
    ],
    passengers: [
      {
        id: 'PAX1008',
        firstName: 'Michael',
        lastName: 'Wilson',
        type: 'adult',
        seat: '7B',
        ticketNumber: 'TKT1008',
        checkedIn: true,
        boardingPassIssued: true,
        checkedBags: 2,
        cabinBags: 1
      }
    ],
    contactInfo: {
      email: 'michael.w@example.com',
      phone: '+1 (555) 567-8901',
      address: '159 Maple Dr, Dallas, TX 75201'
    },
    bookingDate: new Date(2025, 8, 5, 8, 15).toISOString(),
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    totalAmount: 429.99,
    currency: 'USD',
    specialRequests: 'Extra legroom seat',
    notes: 'Frequent flyer member - Gold status',
    createdBy: 'mobile_app',
    updatedAt: new Date(2025, 8, 5, 8, 30).toISOString(),
    extras: {
      seatSelection: true,
      extraLegroom: true,
      priorityBoarding: true,
      mealPreference: 'vegetarian',
      travelInsurance: true
    }
  }
];

// Mock data for filters
const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'pending_payment', label: 'Pending Payment' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
  { value: 'no_show', label: 'No Show' },
  { value: 'refunded', label: 'Refunded' }
];

const paymentStatusOptions = [
  { value: 'all', label: 'All Payments' },
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'partially_refunded', label: 'Partially Refunded' }
];

const paymentMethodOptions = [
  { value: 'all', label: 'All Methods' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'apple_pay', label: 'Apple Pay' },
  { value: 'google_pay', label: 'Google Pay' }
];

const sourceOptions = [
  { value: 'all', label: 'All Sources' },
  { value: 'web', label: 'Website' },
  { value: 'mobile_app', label: 'Mobile App' },
  { value: 'agent', label: 'Travel Agent' },
  { value: 'call_center', label: 'Call Center' },
  { value: 'airport', label: 'Airport Counter' }
];

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all',
    paymentMethod: 'all',
    source: 'all',
    dateFrom: null,
    dateTo: null,
    minAmount: '',
    maxAmount: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'bookingDate', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [flightToDelete, setFlightToDelete] = useState(null);

  // Load bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setBookings(mockBookings);
        setFilteredBookings(mockBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...bookings];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(booking => 
        booking.bookingNumber.toLowerCase().includes(term) ||
        booking.customer.name.toLowerCase().includes(term) ||
        booking.customer.email.toLowerCase().includes(term) ||
        booking.flights.some(f => f.flightNumber.toLowerCase().includes(term)) ||
        booking.passengers.some(p => 
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(term) ||
          p.ticketNumber.toLowerCase().includes(term)
        )
      );
    }

    // Apply filters
    if (filters.status !== 'all') {
      result = result.filter(booking => booking.status === filters.status);
    }
    
    if (filters.paymentStatus !== 'all') {
      result = result.filter(booking => booking.paymentStatus === filters.paymentStatus);
    }
    
    if (filters.paymentMethod !== 'all') {
      result = result.filter(booking => booking.paymentMethod === filters.paymentMethod);
    }
    
    if (filters.source !== 'all') {
      result = result.filter(booking => booking.createdBy === filters.source);
    }
    
    if (filters.dateFrom) {
      result = result.filter(booking => 
        isAfter(parseISO(booking.bookingDate), filters.dateFrom)
      );
    }
    
    if (filters.dateTo) {
      const endOfDay = new Date(filters.dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      result = result.filter(booking => 
        isBefore(parseISO(booking.bookingDate), endOfDay)
      );
    }
    
    if (filters.minAmount) {
      result = result.filter(booking => booking.totalAmount >= parseFloat(filters.minAmount));
    }
    
    if (filters.maxAmount) {
      result = result.filter(booking => booking.totalAmount <= parseFloat(filters.maxAmount));
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

    setFilteredBookings(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [bookings, searchTerm, filters, sortConfig]);

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
      status: 'all',
      paymentStatus: 'all',
      paymentMethod: 'all',
      source: 'all',
      dateFrom: null,
      dateTo: null,
      minAmount: '',
      maxAmount: ''
    });
    setSearchTerm('');
  };

  const toggleSelectBooking = (bookingId) => {
    setSelectedBookings(prev => 
      prev.includes(bookingId)
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedBookings.length === currentBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(currentBookings.map(booking => booking.id));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'no_show':
        return 'bg-gray-100 text-gray-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      case 'partially_refunded':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit_card':
        return '💳';
      case 'paypal':
        return '💳';
      case 'bank_transfer':
        return '🏦';
      case 'apple_pay':
        return '🍏';
      case 'google_pay':
        return 'G';
      default:
        return '💳';
    }
  };

  const getSourceBadge = (source) => {
    const sourceMap = {
      web: { bg: 'bg-blue-100 text-blue-800', label: 'Website' },
      mobile_app: { bg: 'bg-indigo-100 text-indigo-800', label: 'Mobile App' },
      agent: { bg: 'bg-purple-100 text-purple-800', label: 'Agent' },
      call_center: { bg: 'bg-pink-100 text-pink-800', label: 'Call Center' },
      airport: { bg: 'bg-cyan-100 text-cyan-800', label: 'Airport' },
      system: { bg: 'bg-gray-100 text-gray-800', label: 'System' }
    };
    
    const sourceInfo = sourceMap[source] || { bg: 'bg-gray-100 text-gray-800', label: source };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sourceInfo.bg}`}>
        {sourceInfo.label}
      </span>
    );
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <span className="ml-1 opacity-0 group-hover:opacity-100">↕</span>;
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Bulk actions
  const handleBulkAction = (action) => {
    if (selectedBookings.length === 0) {
      toast.warning('Please select at least one booking');
      return;
    }

    switch (action) {
      case 'check_in':
        toast.success(`Checked in ${selectedBookings.length} booking(s)`);
        break;
      case 'send_email':
        toast.success(`Email sent to ${selectedBookings.length} booking(s)`);
        break;
      case 'print':
        toast.success(`Printing ${selectedBookings.length} booking(s)`);
        break;
      case 'export':
        toast.success(`Exported ${selectedBookings.length} booking(s)`);
        break;
      case 'cancel':
        // In a real app, this would be an API call
        setBookings(bookings.map(booking => 
          selectedBookings.includes(booking.id) 
            ? { ...booking, status: 'cancelled', updatedAt: new Date().toISOString() } 
            : booking
        ));
        toast.success(`Cancelled ${selectedBookings.length} booking(s)`);
        setSelectedBookings([]);
        break;
      default:
        break;
    }
  };

  // Get booking statistics
  const getBookingStats = () => {
    const stats = {
      total: bookings.length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      pending: bookings.filter(b => b.status === 'pending_payment').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      revenue: bookings.reduce((sum, booking) => 
        booking.status !== 'cancelled' && booking.status !== 'refunded' 
          ? sum + booking.totalAmount 
          : sum, 0
      )
    };

    return stats;
  };

  const stats = getBookingStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all flight bookings
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button 
            variant="outline"
            onClick={() => window.print()}
            leftIcon={<PrinterIcon className="h-5 w-5 mr-2" />}
          >
            Print
          </Button>
          <Button 
            variant="outline"
            leftIcon={<ArrowDownTrayIcon className="h-5 w-5 mr-2" />}
          >
            Export
          </Button>
          <Button 
            as={Link}
            to="/admin/bookings/new"
            leftIcon={<PlusIcon className="h-5 w-5 mr-2" />}
          >
            New Booking
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
              <TicketIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Confirmed</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{stats.confirmed}</div>
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                    {bookings.length > 0 ? Math.round((stats.confirmed / bookings.length) * 100) : 0}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <ClockIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Pending Payment</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{stats.pending}</div>
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-yellow-600">
                    {bookings.length > 0 ? Math.round((stats.pending / bookings.length) * 100) : 0}%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <CurrencyDollarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(stats.revenue)}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </Card>
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
                placeholder="Search bookings by number, name, email, flight, or ticket..."
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
                  label="Booking Status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  options={statusOptions}
                />
                
                <Select
                  label="Payment Status"
                  name="paymentStatus"
                  value={filters.paymentStatus}
                  onChange={handleFilterChange}
                  options={paymentStatusOptions}
                />
                
                <Select
                  label="Payment Method"
                  name="paymentMethod"
                  value={filters.paymentMethod}
                  onChange={handleFilterChange}
                  options={paymentMethodOptions}
                />
                
                <Select
                  label="Source"
                  name="source"
                  value={filters.source}
                  onChange={handleFilterChange}
                  options={sourceOptions}
                />
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Booking Date From</label>
                  <DatePicker
                    selected={filters.dateFrom}
                    onChange={(date) => handleDateChange(date, 'dateFrom')}
                    selectsStart
                    startDate={filters.dateFrom}
                    endDate={filters.dateTo}
                    maxDate={new Date()}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholderText="Start date"
                    dateFormat="MMM d, yyyy"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Booking Date To</label>
                  <DatePicker
                    selected={filters.dateTo}
                    onChange={(date) => handleDateChange(date, 'dateTo')}
                    selectsEnd
                    startDate={filters.dateFrom}
                    endDate={filters.dateTo}
                    minDate={filters.dateFrom}
                    maxDate={new Date()}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholderText="End date"
                    dateFormat="MMM d, yyyy"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Min Amount</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input
                      type="number"
                      name="minAmount"
                      value={filters.minAmount}
                      onChange={handleFilterChange}
                      className="pl-7"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Max Amount</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input
                      type="number"
                      name="maxAmount"
                      value={filters.maxAmount}
                      onChange={handleFilterChange}
                      className="pl-7"
                      placeholder="10000.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
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

      {/* Bulk Actions */}
      {selectedBookings.length > 0 && (
        <div className="bg-indigo-50 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-indigo-700 mr-2" />
            <span className="text-sm font-medium text-indigo-900">
              {selectedBookings.length} {selectedBookings.length === 1 ? 'booking' : 'bookings'} selected
            </span>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleBulkAction('check_in')}
              leftIcon={<CheckCircleIcon className="h-4 w-4 mr-1" />}
            >
              Check In
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleBulkAction('send_email')}
              leftIcon={<EnvelopeIcon className="h-4 w-4 mr-1" />}
            >
              Send Email
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleBulkAction('print')}
              leftIcon={<PrinterIcon className="h-4 w-4 mr-1" />}
            >
              Print
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleBulkAction('export')}
              leftIcon={<ArrowDownTrayIcon className="h-4 w-4 mr-1" />}
            >
              Export
            </Button>
            <Button 
              variant="danger" 
              size="sm"
              onClick={() => handleBulkAction('cancel')}
              leftIcon={<XMarkIcon className="h-4 w-4 mr-1" />}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Bookings Table */}
      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center p-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || Object.values(filters).some(Boolean) 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'There are currently no bookings.'}
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
            <div className="align-middle inline-block min-w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="relative px-6 py-3">
                      <div className="flex items-center">
                        <input
                          id="select-all-bookings"
                          name="select-all-bookings"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={selectedBookings.length === currentBookings.length && currentBookings.length > 0}
                          onChange={toggleSelectAll}
                        />
                        <label htmlFor="select-all-bookings" className="sr-only">Select all</label>
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
                      onClick={() => handleSort('bookingNumber')}
                    >
                      <div className="flex items-center">
                        Booking #
                        <span className="ml-1">{getSortIcon('bookingNumber')}</span>
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
                      onClick={() => handleSort('customer.name')}
                    >
                      <div className="flex items-center">
                        Customer
                        <span className="ml-1">{getSortIcon('customer.name')}</span>
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Flight
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
                      onClick={() => handleSort('bookingDate')}
                    >
                      <div className="flex items-center">
                        Booked On
                        <span className="ml-1">{getSortIcon('bookingDate')}</span>
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
                      onClick={() => handleSort('totalAmount')}
                    >
                      <div className="flex items-center">
                        Amount
                        <span className="ml-1">{getSortIcon('totalAmount')}</span>
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Payment
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentBookings.map((booking) => (
                    <tr key={booking.id} className={selectedBookings.includes(booking.id) ? 'bg-indigo-50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            id={`booking-${booking.id}`}
                            name={`booking-${booking.id}`}
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={selectedBookings.includes(booking.id)}
                            onChange={() => toggleSelectBooking(booking.id)}
                          />
                          <label htmlFor={`booking-${booking.id}`} className="sr-only">Select booking {booking.bookingNumber}</label>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-indigo-600">
                          <Link to={`/admin/bookings/${booking.id}`} className="hover:underline">
                            {booking.bookingNumber}
                          </Link>
                        </div>
                        <div className="text-xs text-gray-500">
                          {getSourceBadge(booking.createdBy)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-200">
                            <UserCircleIcon className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.customer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.passengers.length} {booking.passengers.length === 1 ? 'passenger' : 'passengers'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {booking.flights.map((flight, idx) => (
                            <div key={idx} className="mb-1">
                              <span className="font-medium">{flight.flightNumber}</span>:
                              <span className="ml-1">{flight.origin.code} → {flight.destination.code}</span>
                              <div className="text-xs text-gray-500">
                                {format(parseISO(flight.departure), 'MMM d, yyyy')} • {format(parseISO(flight.departure), 'h:mm a')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(parseISO(booking.bookingDate), 'MMM d, yyyy')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(parseISO(booking.bookingDate), 'h:mm a')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatCurrency(booking.totalAmount, booking.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(booking.status)}`}>
                          {statusOptions.find(s => s.value === booking.status)?.label || booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="mr-1">{getPaymentMethodIcon(booking.paymentMethod)}</span>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadge(booking.paymentStatus)}`}>
                            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1).replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Menu as="div" className="relative inline-block text-left">
                          <div>
                            <Menu.Button className="flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                              <span className="sr-only">Open options</span>
                              <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                            </Menu.Button>
                          </div>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                              <div className="py-1">
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      to={`/admin/bookings/${booking.id}`}
                                      className={`${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                      } flex justify-between w-full px-4 py-2 text-sm`}
                                    >
                                      View Details
                                    </Link>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      className={`${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                      } flex justify-between w-full px-4 py-2 text-sm`}
                                    >
                                      Check In
                                    </button>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      className={`${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                      } flex justify-between w-full px-4 py-2 text-sm`}
                                    >
                                      Send Itinerary
                                    </button>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      className={`${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                      } flex justify-between w-full px-4 py-2 text-sm`}
                                    >
                                      Print Documents
                                    </button>
                                  )}
                                </Menu.Item>
                                {booking.status !== 'cancelled' && (
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={() => {
                                          setFlightToDelete(booking);
                                          setShowDeleteModal(true);
                                        }}
                                        className={`${
                                          active ? 'bg-red-50 text-red-700' : 'text-red-600'
                                        } flex justify-between w-full px-4 py-2 text-sm`}
                                      >
                                        Cancel Booking
                                      </button>
                                    )}
                                  </Menu.Item>
                                )}
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {filteredBookings.length > itemsPerPage && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(indexOfLastItem, filteredBookings.length)}
                        </span>{' '}
                        of <span className="font-medium">{filteredBookings.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={prevPage}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                            currentPage === 1 ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          // Always show first page, last page, current page, and pages around current page
                          let pageNum;
                          if (totalPages <= 5) {
                            // If 5 or fewer pages, show all
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            // First 3 pages
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            // Last 3 pages
                            pageNum = totalPages - 4 + i;
                          } else {
                            // Middle pages
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => paginate(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border ${
                                currentPage === pageNum 
                                  ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              } text-sm font-medium`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={nextPage}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                            currentPage === totalPages ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
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
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && flightToDelete && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Cancel Booking
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to cancel booking {flightToDelete.bookingNumber}? This action cannot be undone.
                      </p>
                      {flightToDelete.paymentStatus === 'paid' && (
                        <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                          <p className="text-sm text-yellow-700">
                            A refund of {formatCurrency(flightToDelete.totalAmount, flightToDelete.currency)} will be processed for this booking.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    // In a real app, this would be an API call
                    setBookings(bookings.map(b => 
                      b.id === flightToDelete.id 
                        ? { ...b, status: 'cancelled', updatedAt: new Date().toISOString() } 
                        : b
                    ));
                    setShowDeleteModal(false);
                    setSelectedBookings(selectedBookings.filter(id => id !== flightToDelete.id));
                    toast.success(`Booking ${flightToDelete.bookingNumber} has been cancelled.`);
                  }}
                >
                  Yes, cancel booking
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  No, keep booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
