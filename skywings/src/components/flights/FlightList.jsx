import React, { useState, useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import { PaperAirplaneIcon, ClockIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Table from '../ui/Table';
import Pagination from '../ui/Pagination';
import Card from '../ui/Card';

const statusStyles = {
  scheduled: { bg: 'bg-blue-100 text-blue-800', icon: ClockIcon },
  boarding: { bg: 'bg-yellow-100 text-yellow-800', icon: ArrowPathIcon },
  departed: { bg: 'purple-100 text-purple-800', icon: PaperAirplaneIcon },
  in_air: { bg: 'bg-indigo-100 text-indigo-800', icon: PaperAirplaneIcon },
  landed: { bg: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
  cancelled: { bg: 'bg-red-100 text-red-800', icon: XCircleIcon },
  delayed: { bg: 'bg-orange-100 text-orange-800', icon: ClockIcon },
};

const FlightList = ({
  flights = [],
  loading = false,
  onFlightSelect,
  className = '',
  pageSize = 10,
  showPagination = true,
  emptyMessage = 'No flights found',
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate pagination
  const totalItems = flights.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedFlights = flights.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Optional: Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRowClick = useCallback((flight) => {
    if (onFlightSelect) {
      onFlightSelect(flight);
    }
  }, [onFlightSelect]);

  const formatTime = (dateString) => {
    try {
      return format(parseISO(dateString), 'h:mm a');
    } catch (e) {
      return dateString;
    }
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
      title: 'Flight',
      dataIndex: 'flightNumber',
      key: 'flightNumber',
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{record.flightNumber}</span>
          <span className="text-xs text-gray-500">{record.aircraft || 'N/A'}</span>
        </div>
      ),
    },
    {
      title: 'Route',
      dataIndex: 'route',
      key: 'route',
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="font-medium">{record.origin}</div>
            <div className="text-xs text-gray-500">{record.originCity}</div>
          </div>
          <div className="flex-1 flex flex-col items-center px-2">
            <div className="h-px w-full bg-gray-300 relative">
              <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-2 h-2 border-t-2 border-r-2 border-gray-400 rotate-45"></div>
            </div>
          </div>
          <div className="text-left">
            <div className="font-medium">{record.destination}</div>
            <div className="text-xs text-gray-500">{record.destinationCity}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Departure',
      dataIndex: 'departureTime',
      key: 'departure',
      render: (time) => (
        <div className="flex flex-col">
          <span className="font-medium">{formatTime(time)}</span>
          <span className="text-xs text-gray-500">{formatDate(time)}</span>
        </div>
      ),
    },
    {
      title: 'Arrival',
      dataIndex: 'arrivalTime',
      key: 'arrival',
      render: (time) => (
        <div className="flex flex-col">
          <span className="font-medium">{formatTime(time)}</span>
          <span className="text-xs text-gray-500">{formatDate(time)}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = statusStyles[status] || statusStyles.scheduled;
        const Icon = statusConfig.icon;
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg}`}>
            <Icon className="h-3 w-3 mr-1" />
            {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
          </span>
        );
      },
    },
  ];

  return (
    <div className={className}>
      <Card className="overflow-hidden">
        <Table
          columns={columns}
          data={paginatedFlights}
          loading={loading}
          emptyMessage={emptyMessage}
          onRowClick={onFlightSelect ? handleRowClick : undefined}
          hover={!!onFlightSelect}
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

export default FlightList;
