import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ChevronUpDownIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import { format, parseISO, isToday, isTomorrow, addDays, isBefore, isAfter } from 'date-fns';
import airlineService from '../../services/airlineService';
import { toast } from 'react-toastify';
import { Input, Select, Modal, Button } from '../../components/ui';
import { useApp } from '../../context/AppContext';

const statusStyles = {
  scheduled: 'bg-blue-100 text-blue-800',
  boarding: 'bg-yellow-100 text-yellow-800',
  departed: 'bg-purple-100 text-purple-800',
  in_air: 'bg-indigo-100 text-indigo-800',
  landed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  delayed: 'bg-orange-100 text-orange-800',
};

const ManageFlights = () => {
  const { assignCrewToFlight } = useApp();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [flightToDelete, setFlightToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [flightToEdit, setFlightToEdit] = useState(null);
  const [editForm, setEditForm] = useState({
    flightNumber: '',
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    status: 'scheduled',
    aircraft: '',
    seatsAvailable: 0,
    totalSeats: 0,
    price: 0,
  });

  // Assign Crew modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [flightToAssign, setFlightToAssign] = useState(null);
  const mockEmployees = [
    { id: 'E100', name: 'John Pilot', role: 'pilot' },
    { id: 'E101', name: 'Anna First', role: 'first_officer' },
    { id: 'E102', name: 'Chris Cabin', role: 'flight_attendant' },
    { id: 'E103', name: 'Sam Cabin', role: 'flight_attendant' },
  ];
  const [assignForm, setAssignForm] = useState({
    pilot: '',
    first_officer: '',
    cabin: '',
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    flightNumber: '',
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    status: 'scheduled',
    aircraft: '',
    seatsAvailable: 0,
    totalSeats: 0,
    price: 0,
  });

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const data = await airlineService.getFlights('current-airline-id');
      
      // Mock data
      const mockFlights = [
        {
          id: 'FL123',
          flightNumber: 'SKY123',
          origin: 'JFK',
          destination: 'LAX',
          departureTime: '2025-09-18T08:00:00',
          arrivalTime: '2025-09-18T11:30:00',
          status: 'scheduled',
          aircraft: 'Boeing 737-800',
          seatsAvailable: 45,
          totalSeats: 180,
          price: 299.99
        },
        // Add more mock flights...
      ];
      
      setFlights(mockFlights);
    } catch (error) {
      console.error('Error fetching flights:', error);
      toast.error('Failed to load flights');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignClick = (flight) => {
    setFlightToAssign(flight);
    setAssignForm({ pilot: '', first_officer: '', cabin: '' });
    setShowAssignModal(true);
  };

  const handleDeleteClick = (flight) => {
    setFlightToDelete(flight);
    setShowDeleteModal(true);
  };

  const handleEditClick = (flight) => {
    setFlightToEdit(flight);
    setEditForm({
      flightNumber: flight.flightNumber || '',
      origin: flight.origin || '',
      destination: flight.destination || '',
      departureTime: flight.departureTime || '',
      arrivalTime: flight.arrivalTime || '',
      status: flight.status || 'scheduled',
      aircraft: flight.aircraft || '',
      seatsAvailable: flight.seatsAvailable ?? 0,
      totalSeats: flight.totalSeats ?? 0,
      price: flight.price ?? 0,
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    // Coerce numeric fields
    const numericFields = ['seatsAvailable', 'totalSeats', 'price'];
    const newValue = numericFields.includes(name) ? Number(value) : value;
    setEditForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['seatsAvailable', 'totalSeats', 'price'];
    const newValue = numericFields.includes(name) ? Number(value) : value;
    setAddForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real app, call API to create flight and get its id
      const newFlight = {
        id: `FL${Math.floor(Math.random() * 90000) + 10000}`,
        ...addForm,
      };
      setFlights((prev) => [newFlight, ...prev]);
      toast.success('Flight added successfully');
      setShowAddModal(false);
      // Reset filters so the new flight is visible
      setStatusFilter('all');
      setSearchTerm('');
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setAddForm({
        flightNumber: '', origin: '', destination: '', departureTime: '', arrivalTime: '', status: 'scheduled', aircraft: '', seatsAvailable: 0, totalSeats: 0, price: 0,
      });
    } catch (error) {
      console.error('Error adding flight:', error);
      toast.error('Failed to add flight');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!flightToEdit) return;
    try {
      // In a real app, call API to update flight
      // const updated = await airlineService.updateFlight('airline-id', flightToEdit.id, editForm);
      setFlights((prev) =>
        prev.map((f) =>
          f.id === flightToEdit.id
            ? { ...f, ...editForm }
            : f
        )
      );
      toast.success('Flight updated successfully');
      setShowEditModal(false);
      setFlightToEdit(null);
    } catch (error) {
      console.error('Error updating flight:', error);
      toast.error('Failed to update flight');
    }
  };

  const confirmDelete = async () => {
    if (!flightToDelete) return;
    
    try {
      // In a real app, this would be an API call
      // await airlineService.deleteFlight('current-airline-id', flightToDelete.id);
      
      setFlights(flights.filter(f => f.id !== flightToDelete.id));
      toast.success('Flight deleted successfully');
    } catch (error) {
      console.error('Error deleting flight:', error);
      toast.error('Failed to delete flight');
    } finally {
      setShowDeleteModal(false);
      setFlightToDelete(null);
    }
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

  const filteredFlights = flights.filter(flight => {
    const matchesSearch = 
      flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || getFlightStatus(flight) === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Manage Flights</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage all flights for your airline
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Flight
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative rounded-md shadow-sm flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Search flights..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="h-10 rounded-md border-gray-300 pl-10 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="boarding">Boarding</option>
              <option value="in_air">In Air</option>
              <option value="landed">Landed</option>
              <option value="cancelled">Cancelled</option>
              <option value="delayed">Delayed</option>
            </select>
          </div>
          
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={fetchFlights}
          >
            <ArrowPathIcon className={`-ml-1 mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <ArrowDownTrayIcon className="-ml-1 mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>
      
      {/* Flights Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredFlights.length === 0 ? (
                <div className="text-center py-12">
                  <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No flights found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Get started by adding a new flight.'}
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                      Add Flight
                    </button>
                  </div>
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
                        Departure
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Arrival
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Seats
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredFlights.map((flight) => {
                      const status = getFlightStatus(flight);
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
                              {flight.distance || 'N/A'} miles
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div>{format(parseISO(flight.departureTime), 'MMM d, yyyy')}</div>
                            <div className="font-medium">
                              {format(parseISO(flight.departureTime), 'h:mm a')}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div>{format(parseISO(flight.arrivalTime), 'MMM d, yyyy')}</div>
                            <div className="font-medium">
                              {format(parseISO(flight.arrivalTime), 'h:mm a')}
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
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ 
                                  width: `${((flight.totalSeats - flight.seatsAvailable) / flight.totalSeats) * 100}%` 
                                }}
                              />
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              {flight.seatsAvailable} of {flight.totalSeats} available
                            </div>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleAssignClick(flight)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Assign Crew"
                              >
                                Assign
                              </button>
                              <button
                                onClick={() => handleEditClick(flight)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(flight)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
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
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <XCircleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete Flight
                  </h3>
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
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Flight Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setFlightToEdit(null);
        }}
        title={`Edit Flight${flightToEdit ? ` - ${flightToEdit.flightNumber}` : ''}`}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Flight Number"
              name="flightNumber"
              value={editForm.flightNumber}
              onChange={handleEditChange}
              required
            />
            <Input
              label="Aircraft"
              name="aircraft"
              value={editForm.aircraft}
              onChange={handleEditChange}
              required
            />
            <Input
              label="Origin"
              name="origin"
              value={editForm.origin}
              onChange={handleEditChange}
              required
            />
            <Input
              label="Destination"
              name="destination"
              value={editForm.destination}
              onChange={handleEditChange}
              required
            />
            <Input
              label="Departure Time"
              type="datetime-local"
              name="departureTime"
              value={editForm.departureTime ? editForm.departureTime.slice(0,16) : ''}
              onChange={handleEditChange}
              required
            />
            <Input
              label="Arrival Time"
              type="datetime-local"
              name="arrivalTime"
              value={editForm.arrivalTime ? editForm.arrivalTime.slice(0,16) : ''}
              onChange={handleEditChange}
              required
            />
            <Select
              label="Status"
              name="status"
              value={editForm.status}
              onChange={handleEditChange}
              options={[
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'boarding', label: 'Boarding' },
                { value: 'in_air', label: 'In Air' },
                { value: 'landed', label: 'Landed' },
                { value: 'cancelled', label: 'Cancelled' },
                { value: 'delayed', label: 'Delayed' },
              ]}
            />
            <Input
              label="Total Seats"
              type="number"
              name="totalSeats"
              value={editForm.totalSeats}
              onChange={handleEditChange}
              min={1}
              required
            />
            <Input
              label="Seats Available"
              type="number"
              name="seatsAvailable"
              value={editForm.seatsAvailable}
              onChange={handleEditChange}
              min={0}
              max={editForm.totalSeats || undefined}
              required
            />
            <Input
              label="Price (USD)"
              type="number"
              step="0.01"
              min={0}
              name="price"
              value={editForm.price}
              onChange={handleEditChange}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowEditModal(false);
                setFlightToEdit(null);
              }}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* Assign Crew Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title={`Assign Crew${flightToAssign ? ` - ${flightToAssign.flightNumber}` : ''}`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!flightToAssign) return;
            const crew = [];
            if (assignForm.pilot) crew.push({ employeeId: assignForm.pilot, role: 'pilot' });
            if (assignForm.first_officer) crew.push({ employeeId: assignForm.first_officer, role: 'first_officer' });
            if (assignForm.cabin) crew.push({ employeeId: assignForm.cabin, role: 'flight_attendant' });
            if (crew.length === 0) {
              toast.warn('Select at least one crew member.');
              return;
            }
            const departureISO = flightToAssign.departureTime;
            const checkInISO = new Date(new Date(departureISO).getTime() - 2 * 60 * 60 * 1000).toISOString();
            assignCrewToFlight({
              flightId: flightToAssign.id,
              crew,
              flightTitle: `${flightToAssign.flightNumber} ${flightToAssign.origin}→${flightToAssign.destination}`,
              departureISO,
              checkInISO,
            });
            toast.success('Crew assigned to flight');
            setShowAssignModal(false);
            setFlightToAssign(null);
          }}
          className="space-y-4"
        >
          <Select
            label="Pilot"
            name="pilot"
            value={assignForm.pilot}
            onChange={(e) => setAssignForm({ ...assignForm, pilot: e.target.value })}
            options={[{ value: '', label: 'Select Pilot' }, ...mockEmployees.filter(e => e.role === 'pilot').map(e => ({ value: e.id, label: e.name }))]}
          />
          <Select
            label="First Officer"
            name="first_officer"
            value={assignForm.first_officer}
            onChange={(e) => setAssignForm({ ...assignForm, first_officer: e.target.value })}
            options={[{ value: '', label: 'Select First Officer' }, ...mockEmployees.filter(e => e.role === 'first_officer').map(e => ({ value: e.id, label: e.name }))]}
          />
          <Select
            label="Cabin Crew"
            name="cabin"
            value={assignForm.cabin}
            onChange={(e) => setAssignForm({ ...assignForm, cabin: e.target.value })}
            options={[{ value: '', label: 'Select Cabin Crew' }, ...mockEmployees.filter(e => e.role === 'flight_attendant').map(e => ({ value: e.id, label: e.name }))]}
          />

          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowAssignModal(false)} className="border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Assign</Button>
          </div>
        </form>
      </Modal>

      {/* Add Flight Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Flight"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Flight Number"
              name="flightNumber"
              value={addForm.flightNumber}
              onChange={handleAddChange}
              required
            />
            <Input
              label="Aircraft"
              name="aircraft"
              value={addForm.aircraft}
              onChange={handleAddChange}
              required
            />
            <Input
              label="Origin"
              name="origin"
              value={addForm.origin}
              onChange={handleAddChange}
              required
            />
            <Input
              label="Destination"
              name="destination"
              value={addForm.destination}
              onChange={handleAddChange}
              required
            />
            <Input
              label="Departure Time"
              type="datetime-local"
              name="departureTime"
              value={addForm.departureTime}
              onChange={handleAddChange}
              required
            />
            <Input
              label="Arrival Time"
              type="datetime-local"
              name="arrivalTime"
              value={addForm.arrivalTime}
              onChange={handleAddChange}
              required
            />
            <Select
              label="Status"
              name="status"
              value={addForm.status}
              onChange={handleAddChange}
              options={[
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'boarding', label: 'Boarding' },
                { value: 'in_air', label: 'In Air' },
                { value: 'landed', label: 'Landed' },
                { value: 'cancelled', label: 'Cancelled' },
                { value: 'delayed', label: 'Delayed' },
              ]}
            />
            <Input
              label="Total Seats"
              type="number"
              name="totalSeats"
              value={addForm.totalSeats}
              onChange={handleAddChange}
              min={1}
              required
            />
            <Input
              label="Seats Available"
              type="number"
              name="seatsAvailable"
              value={addForm.seatsAvailable}
              onChange={handleAddChange}
              min={0}
              max={addForm.totalSeats || undefined}
              required
            />
            <Input
              label="Price (USD)"
              type="number"
              step="0.01"
              min={0}
              name="price"
              value={addForm.price}
              onChange={handleAddChange}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddModal(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Add Flight</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageFlights;
