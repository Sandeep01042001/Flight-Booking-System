import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import airlineService from '../../services/airlineService';
import { toast } from 'react-toastify';
import { Input, Select, Modal, Button } from '../../components/ui';

const statusStyles = {
  active: 'bg-green-100 text-green-800',
  maintenance: 'bg-yellow-100 text-yellow-800',
  inactive: 'bg-red-100 text-red-800',
};

const ManageAircrafts = () => {
  const [aircrafts, setAircrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [aircraftToDelete, setAircraftToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [aircraftToEdit, setAircraftToEdit] = useState(null);
  const [addForm, setAddForm] = useState({
    registration: '',
    model: '',
    manufacturer: '',
    capacity: 0,
    status: 'active',
    lastMaintenance: '',
    nextMaintenance: '',
    year: new Date().getFullYear(),
  });
  const [editForm, setEditForm] = useState({
    registration: '',
    model: '',
    manufacturer: '',
    capacity: 0,
    status: 'active',
    lastMaintenance: '',
    nextMaintenance: '',
    year: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchAircrafts();
  }, [currentPage, statusFilter, searchTerm]);

  const fetchAircrafts = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call with pagination and filters
      // const { data, total } = await airlineService.getAircrafts({
      //   page: currentPage,
      //   limit: itemsPerPage,
      //   status: statusFilter === 'all' ? undefined : statusFilter,
      //   search: searchTerm || undefined,
      // });
      
      // Mock data
      const mockAircrafts = [
        {
          id: 'AC001',
          registration: 'N12345',
          model: 'Boeing 737-800',
          manufacturer: 'Boeing',
          capacity: 180,
          status: 'active',
          lastMaintenance: '2025-08-15T00:00:00',
          nextMaintenance: '2025-11-15T00:00:00',
          year: 2020,
          totalFlights: 1245,
          totalHours: 8765,
        },
        {
          id: 'AC002',
          registration: 'N23456',
          model: 'Airbus A320',
          manufacturer: 'Airbus',
          capacity: 160,
          status: 'maintenance',
          lastMaintenance: '2025-09-01T00:00:00',
          nextMaintenance: '2025-09-30T00:00:00',
          year: 2021,
          totalFlights: 987,
          totalHours: 7234,
        },
        {
          id: 'AC003',
          registration: 'N34567',
          model: 'Boeing 787-9',
          manufacturer: 'Boeing',
          capacity: 290,
          status: 'active',
          lastMaintenance: '2025-07-20T00:00:00',
          nextMaintenance: '2025-10-20T00:00:00',
          year: 2022,
          totalFlights: 456,
          totalHours: 3210,
        },
        {
          id: 'AC004',
          registration: 'N45678',
          model: 'Airbus A350',
          manufacturer: 'Airbus',
          capacity: 315,
          status: 'inactive',
          lastMaintenance: '2025-06-10T00:00:00',
          nextMaintenance: '2025-09-10T00:00:00',
          year: 2023,
          totalFlights: 0,
          totalHours: 0,
        },
      ];
      
      // Apply filters for mock data
      let filteredAircrafts = [...mockAircrafts];
      
      if (statusFilter !== 'all') {
        filteredAircrafts = filteredAircrafts.filter(aircraft => aircraft.status === statusFilter);
      }
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredAircrafts = filteredAircrafts.filter(
          aircraft =>
            aircraft.registration.toLowerCase().includes(searchLower) ||
            aircraft.model.toLowerCase().includes(searchLower) ||
            aircraft.manufacturer.toLowerCase().includes(searchLower)
        );
      }
      
      setAircrafts(filteredAircrafts);
      setTotalItems(filteredAircrafts.length);
    } catch (error) {
      console.error('Error fetching aircrafts:', error);
      toast.error('Failed to load aircrafts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    const numeric = ['capacity', 'year'];
    setAddForm((prev) => ({ ...prev, [name]: numeric.includes(name) ? Number(value) : value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    const numeric = ['capacity', 'year'];
    setEditForm((prev) => ({ ...prev, [name]: numeric.includes(name) ? Number(value) : value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const newAircraft = {
        id: `AC${Math.floor(Math.random() * 900) + 100}`,
        totalFlights: 0,
        totalHours: 0,
        ...addForm,
      };
      // In real app, call API to create
      setAircrafts((prev) => [newAircraft, ...prev]);
      setTotalItems((prev) => prev + 1);
      toast.success('Aircraft added successfully');
      setShowAddModal(false);
      setAddForm({
        registration: '', model: '', manufacturer: '', capacity: 0, status: 'active', lastMaintenance: '', nextMaintenance: '', year: new Date().getFullYear(),
      });
      setStatusFilter('all');
      setSearchTerm('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error adding aircraft:', error);
      toast.error('Failed to add aircraft');
    }
  };

  const openEditModal = (aircraft) => {
    setAircraftToEdit(aircraft);
    setEditForm({
      registration: aircraft.registration || '',
      model: aircraft.model || '',
      manufacturer: aircraft.manufacturer || '',
      capacity: aircraft.capacity ?? 0,
      status: aircraft.status || 'active',
      lastMaintenance: aircraft.lastMaintenance ? aircraft.lastMaintenance.slice(0,10) : '',
      nextMaintenance: aircraft.nextMaintenance ? aircraft.nextMaintenance.slice(0,10) : '',
      year: aircraft.year ?? new Date().getFullYear(),
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!aircraftToEdit) return;
    try {
      // In real app, call API to update
      setAircrafts((prev) => prev.map((a) => (a.id === aircraftToEdit.id ? { ...a, ...editForm } : a)));
      toast.success('Aircraft updated successfully');
      setShowEditModal(false);
      setAircraftToEdit(null);
    } catch (error) {
      console.error('Error updating aircraft:', error);
      toast.error('Failed to update aircraft');
    }
  };

  const handleDeleteClick = (aircraft) => {
    setAircraftToDelete(aircraft);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!aircraftToDelete) return;
    
    try {
      // In a real app, this would be an API call
      // await airlineService.deleteAircraft(aircraftToDelete.id);
      
      setAircrafts(aircrafts.filter(a => a.id !== aircraftToDelete.id));
      toast.success('Aircraft deleted successfully');
    } catch (error) {
      console.error('Error deleting aircraft:', error);
      toast.error('Failed to delete aircraft');
    } finally {
      setShowDeleteModal(false);
      setAircraftToDelete(null);
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      active: 'Active',
      maintenance: 'Maintenance',
      inactive: 'Inactive',
    };
    return statusMap[status] || status;
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAircrafts = aircrafts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Manage Aircrafts</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage your airline's aircraft fleet
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Aircraft
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
            placeholder="Search aircrafts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
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
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={fetchAircrafts}
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
      
      {/* Aircrafts Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : aircrafts.length === 0 ? (
                <div className="text-center py-12">
                  <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No aircrafts found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || statusFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Get started by adding a new aircraft.'}
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                      Add Aircraft
                    </button>
                  </div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Registration
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Model
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Capacity
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Next Maintenance
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Flights / Hours
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {currentAircrafts.map((aircraft) => (
                      <tr key={aircraft.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          <div className="font-semibold">{aircraft.registration}</div>
                          <div className="text-gray-500 text-xs">ID: {aircraft.id}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="font-medium">{aircraft.model}</div>
                          <div className="text-gray-500 text-xs">{aircraft.manufacturer} • {aircraft.year}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {aircraft.capacity} seats
                        </td>
                        <td className="whitespace-nowrap px-3 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              statusStyles[aircraft.status] || 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {getStatusText(aircraft.status)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {format(new Date(aircraft.nextMaintenance), 'MMM d, yyyy')}
                          <div className="text-xs text-gray-400">
                            Last: {format(new Date(aircraft.lastMaintenance), 'MMM d, yyyy')}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div>{aircraft.totalFlights.toLocaleString()} flights</div>
                          <div className="text-xs text-gray-400">
                            {aircraft.totalHours.toLocaleString()} hours
                          </div>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openEditModal(aircraft)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(aircraft)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6" aria-label="Pagination">
                  <div className="hidden sm:block">
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastItem, totalItems)}
                      </span>{' '}
                      of <span className="font-medium">{totalItems}</span> results
                    </p>
                  </div>
                  <div className="flex flex-1 justify-between sm:justify-end space-x-3">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                        currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                        currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && aircraftToDelete && (
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
                    Delete Aircraft
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete aircraft {aircraftToDelete.registration} ({aircraftToDelete.model})? 
                      This action cannot be undone.
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
      
      {/* Add Aircraft Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Aircraft"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Registration" name="registration" value={addForm.registration} onChange={handleAddChange} required />
            <Input label="Model" name="model" value={addForm.model} onChange={handleAddChange} required />
            <Input label="Manufacturer" name="manufacturer" value={addForm.manufacturer} onChange={handleAddChange} required />
            <Input label="Capacity" type="number" name="capacity" value={addForm.capacity} onChange={handleAddChange} min={1} required />
            <Select
              label="Status"
              name="status"
              value={addForm.status}
              onChange={handleAddChange}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
            <Input label="Year" type="number" name="year" value={addForm.year} onChange={handleAddChange} min={1970} />
            <Input label="Last Maintenance" type="date" name="lastMaintenance" value={addForm.lastMaintenance} onChange={handleAddChange} />
            <Input label="Next Maintenance" type="date" name="nextMaintenance" value={addForm.nextMaintenance} onChange={handleAddChange} />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Add Aircraft</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Aircraft Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setAircraftToEdit(null); }}
        title={`Edit Aircraft${aircraftToEdit ? ` - ${aircraftToEdit.registration}` : ''}`}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Registration" name="registration" value={editForm.registration} onChange={handleEditChange} required />
            <Input label="Model" name="model" value={editForm.model} onChange={handleEditChange} required />
            <Input label="Manufacturer" name="manufacturer" value={editForm.manufacturer} onChange={handleEditChange} required />
            <Input label="Capacity" type="number" name="capacity" value={editForm.capacity} onChange={handleEditChange} min={1} required />
            <Select
              label="Status"
              name="status"
              value={editForm.status}
              onChange={handleEditChange}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
            <Input label="Year" type="number" name="year" value={editForm.year} onChange={handleEditChange} min={1970} />
            <Input label="Last Maintenance" type="date" name="lastMaintenance" value={editForm.lastMaintenance} onChange={handleEditChange} />
            <Input label="Next Maintenance" type="date" name="nextMaintenance" value={editForm.nextMaintenance} onChange={handleEditChange} />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" onClick={() => { setShowEditModal(false); setAircraftToEdit(null); }} className="border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageAircrafts;
