import React, { useState, useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import { CheckCircleIcon, XCircleIcon, ClockIcon, TicketIcon } from '@heroicons/react/24/outline';
import Table from '../ui/Table';
import Pagination from '../ui/Pagination';
import Card from '../ui/Card';

const statusStyles = {
  confirmed: { 
    bg: 'bg-green-100 text-green-800', 
    icon: CheckCircleIcon,
    label: 'Confirmed'
  },
  pending: { 
    bg: 'bg-yellow-100 text-yellow-800', 
    icon: ClockIcon,
    label: 'Pending'
  },
  cancelled: { 
    bg: 'bg-red-100 text-red-800', 
    icon: XCircleIcon,
    label: 'Cancelled'
  },
  completed: { 
    bg: 'bg-blue-100 text-blue-800', 
    icon: TicketIcon,
    label: 'Completed'
  },
};

const BookingHistory = ({
  bookings = [],
  loading = false,
  onBookingSelect,
  className = '',
  pageSize = 10,
  showPagination = true,
  emptyMessage = 'No bookings found',
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate pagination
  const totalItems = bookings.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedBookings = bookings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Optional: Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRowClick = useCallback((booking) => {
    if (onBookingSelect) {
      onBookingSelect(booking);
    }
  }, [onBookingSelect]);

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <span className="font-mono text-sm text-gray-900">#{id.substring(0, 8)}</span>
      ),
    },
    {
      title: 'Flight',
      dataIndex: 'flight',
      key: 'flight',
      render: (flight) => (
        <div className="flex flex-col">
          <span className="font-medium">{flight?.flightNumber}</span>
          <span className="text-xs text-gray-500">
            {flight?.origin} → {flight?.destination}
          </span>
        </div>
      ),
    },
    {
      title: 'Passenger',
      dataIndex: 'passengerName',
      key: 'passengerName',
      render: (name, record) => (
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          <span className="text-xs text-gray-500">{record.passengerCount} {record.passengerCount === 1 ? 'passenger' : 'passengers'}</span>
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'departureDate',
      key: 'date',
      render: (date) => formatDate(date),
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'amount',
      align: 'right',
      render: (amount, record) => formatCurrency(amount, record.currency),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = statusStyles[status] || statusStyles.pending;
        const Icon = statusConfig.icon;
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg}`}>
            <Icon className="h-3 w-3 mr-1" />
            {statusConfig.label}
          </span>
        );
      },
    },
  ];

  return (
    <div className={className}>
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Booking History</h3>
        </div>
        
        <Table
          columns={columns}
          data={paginatedBookings}
          loading={loading}
          emptyMessage={emptyMessage}
          onRowClick={onBookingSelect ? handleRowClick : undefined}
          hover={!!onBookingSelect}
          striped
          responsive
        />
        
        {showPagination && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            className="border-t border-gray-200"
          />
        )}
      </Card>
    </div>
  );
};

export default BookingHistory;
