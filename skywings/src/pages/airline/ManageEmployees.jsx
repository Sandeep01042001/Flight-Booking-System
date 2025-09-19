import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import airlineService from '../../services/airlineService';
import { toast } from 'react-toastify';

const roleStyles = {
  pilot: 'bg-blue-100 text-blue-800',
  flight_attendant: 'bg-purple-100 text-purple-800',
  engineer: 'bg-yellow-100 text-yellow-800',
  operations: 'bg-green-100 text-green-800',
  management: 'bg-indigo-100 text-indigo-800',
  other: 'bg-gray-100 text-gray-800',
};

const statusStyles = {
  active: 'bg-green-100 text-green-800',
  on_leave: 'bg-yellow-100 text-yellow-800',
  suspended: 'bg-red-100 text-red-800',
  inactive: 'bg-gray-100 text-gray-800',
};

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, roleFilter, statusFilter, searchTerm]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call with pagination and filters
      // const { data, total } = await airlineService.getEmployees({
      //   page: currentPage,
      //   limit: itemsPerPage,
      //   role: roleFilter === 'all' ? undefined : roleFilter,
      //   status: statusFilter === 'all' ? undefined : statusFilter,
      //   search: searchTerm || undefined,
      // });
      
      // Mock data
      const mockEmployees = [
        {
          id: 'EMP001',
          employeeId: 'PIL12345',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@example.com',
          phone: '+1 (555) 123-4567',
          role: 'pilot',
          position: 'Senior Captain',
          department: 'Flight Operations',
          status: 'active',
          hireDate: '2018-05-15T00:00:00',
          lastLogin: '2025-09-16T08:45:23',
          totalFlights: 1245,
          totalHours: 9876,
          avatar: '',
        },
        {
          id: 'EMP002',
          employeeId: 'FA78901',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.j@example.com',
          phone: '+1 (555) 234-5678',
          role: 'flight_attendant',
          position: 'Lead Flight Attendant',
          department: 'Cabin Crew',
          status: 'active',
          hireDate: '2019-02-20T00:00:00',
          lastLogin: '2025-09-16T09:12:45',
          totalFlights: 876,
          totalHours: 0,
          avatar: '',
        },
        {
          id: 'EMP003',
          employeeId: 'ENG34567',
          firstName: 'Michael',
          lastName: 'Brown',
          email: 'michael.b@example.com',
          phone: '+1 (555) 345-6789',
          role: 'engineer',
          position: 'Senior Aircraft Engineer',
          department: 'Maintenance',
          status: 'active',
          hireDate: '2017-11-05T00:00:00',
          lastLogin: '2025-09-15T14:23:10',
          totalFlights: 0,
          totalHours: 0,
          avatar: '',
        },
        {
          id: 'EMP004',
          employeeId: 'OPS56789',
          firstName: 'Emily',
          lastName: 'Davis',
          email: 'emily.d@example.com',
          phone: '+1 (555) 456-7890',
          role: 'operations',
          position: 'Operations Manager',
          department: 'Operations',
          status: 'on_leave',
          hireDate: '2020-03-12T00:00:00',
          lastLogin: '2025-09-10T11:34:22',
          totalFlights: 0,
          totalHours: 0,
          avatar: '',
        },
        {
          id: 'EMP005',
          employeeId: 'PIL23456',
          firstName: 'Robert',
          lastName: 'Taylor',
          email: 'robert.t@example.com',
          phone: '+1 (555) 567-8901',
          role: 'pilot',
          position: 'First Officer',
          department: 'Flight Operations',
          status: 'active',
          hireDate: '2021-06-18T00:00:00',
          lastLogin: '2025-09-16T07:56:33',
          totalFlights: 342,
          totalHours: 2543,
          avatar: '',
        },
      ];
      
      // Apply filters for mock data
      let filteredEmployees = [...mockEmployees];
      
      if (roleFilter !== 'all') {
        filteredEmployees = filteredEmployees.filter(emp => emp.role === roleFilter);
      }
      
      if (statusFilter !== 'all') {
        filteredEmployees = filteredEmployees.filter(emp => emp.status === statusFilter);
      }
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredEmployees = filteredEmployees.filter(
          emp =>
            emp.employeeId.toLowerCase().includes(searchLower) ||
            `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchLower) ||
            emp.email.toLowerCase().includes(searchLower) ||
            emp.phone.replace(/\D/g, '').includes(searchLower.replace(/\D/g, ''))
        );
      }
      
      setEmployees(filteredEmployees);
      setTotalItems(filteredEmployees.length);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    
    try {
      // In a real app, this would be an API call
      // await airlineService.deleteEmployee(employeeToDelete.id);
      
      setEmployees(employees.filter(e => e.id !== employeeToDelete.id));
      toast.success('Employee deactivated successfully');
    } catch (error) {
      console.error('Error deactivating employee:', error);
      toast.error('Failed to deactivate employee');
    } finally {
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    }
  };

  const getRoleText = (role) => {
    const roleMap = {
      pilot: 'Pilot',
      flight_attendant: 'Flight Attendant',
      engineer: 'Engineer',
      operations: 'Operations',
      management: 'Management',
      other: 'Other',
    };
    return roleMap[role] || role;
  };

  const getStatusText = (status) => {
    const statusMap = {
      active: 'Active',
      on_leave: 'On Leave',
      suspended: 'Suspended',
      inactive: 'Inactive',
    };
    return statusMap[status] || status;
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Filter options
  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'pilot', label: 'Pilot' },
    { value: 'flight_attendant', label: 'Flight Attendant' },
    { value: 'engineer', label: 'Engineer' },
    { value: 'operations', label: 'Operations' },
    { value: 'management', label: 'Management' },
    { value: 'other', label: 'Other' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'on_leave', label: 'On Leave' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'inactive', label: 'Inactive' },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Manage Employees</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage your airline's employees and their details
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="employees/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Employee
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mt-6 flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4">
        <div className="relative rounded-md shadow-sm flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <UserGroupIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full rounded-md border-gray-300 pl-10 pr-8 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="relative flex-1 sm:w-48">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <ClockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full rounded-md border-gray-300 pl-10 pr-8 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-2">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={fetchEmployees}
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
      </div>
      
      {/* Employees Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : employees.length === 0 ? (
                <div className="text-center py-12">
                  <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || roleFilter !== 'all' || statusFilter !== 'active'
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Get started by adding a new employee.'}
                  </p>
                  <div className="mt-6">
                    <Link
                      to="employees/new"
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                      Add Employee
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                          Employee
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Contact
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Position
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Role
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Employment
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {currentEmployees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                {employee.avatar ? (
                                  <img className="h-10 w-10 rounded-full" src={employee.avatar} alt="" />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">{employee.firstName} {employee.lastName}</div>
                                <div className="text-gray-500 text-xs">ID: {employee.employeeId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="truncate max-w-[180px] block">{employee.email}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              <PhoneIcon className="h-4 w-4 text-gray-400 mr-1" />
                              <span>{employee.phone}</span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="font-medium">{employee.position}</div>
                            <div className="text-gray-500 text-xs">{employee.department}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                roleStyles[employee.role] || 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {getRoleText(employee.role)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                statusStyles[employee.status] || 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {getStatusText(employee.status)}
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              Last login: {employee.lastLogin ? format(new Date(employee.lastLogin), 'MMM d, yyyy') : 'Never'}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div>Hired: {format(new Date(employee.hireDate), 'MMM d, yyyy')}</div>
                            {(employee.role === 'pilot' || employee.role === 'flight_attendant') && (
                              <div className="text-xs text-gray-500 mt-1">
                                {employee.totalFlights} flights • {employee.totalHours} hours
                              </div>
                            )}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end space-x-2">
                              <Link
                                to={`employees/${employee.id}`}
                                className="text-blue-600 hover:text-blue-900"
                                title="View/Edit"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => handleDeleteClick(employee)}
                                className="text-red-600 hover:text-red-900"
                                title="Deactivate"
                                disabled={employee.status === 'inactive'}
                              >
                                <TrashIcon className={`h-4 w-4 ${employee.status === 'inactive' ? 'opacity-30' : ''}`} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6" aria-label="Pagination">
                      <div className="hidden sm:block">
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                          <span className="font-medium">
                            {Math.min(indexOfLastItem, totalItems)}
                          </span>{' '}
                          of <span className="font-medium">{totalItems}</span> employees
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && employeeToDelete && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <BriefcaseIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {employeeToDelete.status === 'inactive' ? 'Delete Employee' : 'Deactivate Employee'}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {employeeToDelete.status === 'inactive' ? (
                        `Are you sure you want to permanently delete ${employeeToDelete.firstName} ${employeeToDelete.lastName}? This action cannot be undone.`
                      ) : (
                        `Are you sure you want to deactivate ${employeeToDelete.firstName} ${employeeToDelete.lastName}? The employee will no longer have access to the system.`
                      )}
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
                  {employeeToDelete.status === 'inactive' ? 'Delete Permanently' : 'Deactivate'}
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
    </div>
  );
};

export default ManageEmployees;
