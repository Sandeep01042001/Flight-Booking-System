import React, { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import { Card, Table, Button, Modal } from '../../components/ui';

export default function ManageSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Mock data - replace with API call
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        // Simulate API call
        const mockSchedules = [
          {
            id: 'SCH001',
            flightNumber: 'SKY123',
            origin: 'JFK',
            destination: 'LAX',
            departureTime: new Date(Date.now() + 86400000).toISOString(),
            arrivalTime: new Date(Date.now() + 86400000 + 14400000).toISOString(),
            aircraft: 'Boeing 737-800',
            status: 'scheduled',
            crew: [
              { id: '1', name: 'John Smith', role: 'pilot' },
              { id: '2', name: 'Sarah Johnson', role: 'copilot' },
            ],
          },
          // Add more mock schedules as needed
        ];
        
        setSchedules(mockSchedules);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setShowModal(true);
  };

  const handleDelete = (scheduleId) => {
    // Implement delete logic
    console.log('Delete schedule:', scheduleId);
  };

  const handleSave = (scheduleData) => {
    // Implement save/update logic
    console.log('Save schedule:', scheduleData);
    setShowModal(false);
  };

  const columns = [
    {
      title: 'Flight',
      dataIndex: 'flightNumber',
      key: 'flight',
      render: (_, record) => (
        <div className="font-medium">
          <div>{record.flightNumber}</div>
          <div className="text-sm text-gray-500">{record.origin} → {record.destination}</div>
        </div>
      ),
    },
    {
      title: 'Date & Time',
      dataIndex: 'departureTime',
      key: 'datetime',
      render: (time) => (
        <div className="flex items-center">
          <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
          <div>
            <div>{format(parseISO(time), 'MMM d, yyyy')}</div>
            <div className="text-sm text-gray-500">
              {format(parseISO(time), 'h:mm a')} - {format(parseISO(time), 'h:mm a')}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Aircraft',
      dataIndex: 'aircraft',
      key: 'aircraft',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
          status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(record)}
            className="p-1 text-gray-500 hover:text-blue-600"
            title="Edit"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(record.id)}
            className="p-1 text-gray-500 hover:text-red-600"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flight Schedule Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your airline's flight schedules
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedSchedule(null);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Schedule
        </Button>
      </div>

      <Card className="overflow-hidden">
        <Table
          columns={columns}
          data={schedules}
          emptyMessage="No flight schedules found. Click 'Add Schedule' to create one."
          className="min-w-full"
        />
      </Card>

      {/* Schedule Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedSchedule ? 'Edit Flight Schedule' : 'Add New Flight Schedule'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Flight Number</label>
              <input
                type="text"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={selectedSchedule?.flightNumber || ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aircraft</label>
              <select className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option>Select Aircraft</option>
                <option selected={selectedSchedule?.aircraft === 'Boeing 737-800'}>
                  Boeing 737-800
                </option>
                <option selected={selectedSchedule?.aircraft === 'Airbus A320'}>
                  Airbus A320
                </option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
              <input
                type="text"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={selectedSchedule?.origin || ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <input
                type="text"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={selectedSchedule?.destination || ''}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
              <input
                type="datetime-local"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={selectedSchedule?.departureTime ? format(parseISO(selectedSchedule.departureTime), "yyyy-MM-dd'T'HH:mm") : ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Arrival</label>
              <input
                type="datetime-local"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                defaultValue={selectedSchedule?.arrivalTime ? format(parseISO(selectedSchedule.arrivalTime), "yyyy-MM-dd'T'HH:mm") : ''}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSave(selectedSchedule || {})}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {selectedSchedule ? 'Update' : 'Create'} Schedule
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
