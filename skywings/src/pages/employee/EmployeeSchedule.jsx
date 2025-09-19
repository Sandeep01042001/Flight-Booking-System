import React, { useState, useEffect } from 'react';
import { format, parseISO, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { toast } from 'react-toastify';
import { 
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  FunnelIcon,
  ChevronUpDownIcon
} from '@heroicons/react/24/outline';
import { Modal, Button } from '../../components/ui';
import { useApp } from '../../context/AppContext';

const EmployeeSchedule = () => {
  const { user, getAssignmentsForEmployee } = useApp();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');
  const [checkedInMap, setCheckedInMap] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        setSchedule([]);
        return;
      }
      // Build schedule from assignments in context for this employee
      const assignments = getAssignmentsForEmployee(user.id) || [];
      const items = assignments.map(a => ({
        id: a.id,
        date: a.date,
        type: 'flight',
        title: a.title,
        description: `${a.role.replace('_', ' ')} assignment`,
        status: 'scheduled',
        duration: '',
        checkIn: a.checkIn,
      }));
      // If no assignments exist, include a demo item so user can test check-in
      if (items.length === 0) {
        items.push({
          id: 'demo-now',
          date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          type: 'flight',
          title: 'Flight SKY-Demo',
          description: 'Check-in open now',
          status: 'scheduled',
          duration: '2h 10m',
          checkIn: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        });
      }
      setSchedule(items);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const canCheckIn = (item) => {
    if (!item.checkIn) return false;
    const now = new Date();
    const opensAt = new Date(item.checkIn);
    const closesAt = new Date(item.date);
    return now >= opensAt && now <= closesAt;
  };

  const handleCheckIn = (item) => {
    if (checkedInMap[item.id]) {
      toast.info('Already checked in.');
      return;
    }
    if (!canCheckIn(item)) {
      toast.warn(`Check-in opens at ${format(new Date(item.checkIn), 'PPpp')}`);
      return;
    }
    // Simulate check-in success
    setCheckedInMap((prev) => ({ ...prev, [item.id]: true }));
    setSchedule((prev) => prev.map((s) => s.id === item.id ? { ...s, status: 'checked-in' } : s));
    toast.success('Checked in successfully.');
    if (selectedItem && selectedItem.id === item.id) {
      setSelectedItem({ ...item, status: 'checked-in' });
    }
  };

  const filteredSchedule = schedule.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'today') return isToday(new Date(item.date));
    if (filter === 'upcoming') return new Date(item.date) > new Date();
    return item.type === filter;
  });

  const sortedSchedule = [...filteredSchedule].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE, MMM d, yyyy');
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'h:mm a');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your upcoming schedule
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <div className="relative">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="upcoming">Upcoming</option>
              <option value="today">Today</option>
              <option value="flight">Flights Only</option>
              <option value="training">Training Only</option>
              <option value="all">All Events</option>
            </select>
          </div>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={fetchSchedule}
          >
            <ArrowPathIcon className="-ml-1 mr-2 h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('date')}
                >
                  <div className="flex items-center">
                    <span>Date & Time</span>
                    <ChevronUpDownIcon className="ml-2 h-4 w-4 text-gray-400" />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Event
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Details
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedSchedule.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No {filter === 'all' ? '' : filter} schedule items found.
                  </td>
                </tr>
              ) : (
                sortedSchedule.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(item.date)}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {formatTime(item.date)}
                        {item.checkIn && (
                          <span className="ml-2 text-xs bg-gray-100 rounded-full px-2 py-0.5">
                            Check-in: {formatTime(item.checkIn)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.type === 'flight' ? 'Flight Assignment' : 'Training'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{item.description}</div>
                      {item.location && (
                        <div className="text-sm text-gray-500">{item.location}</div>
                      )}
                      {item.duration && (
                        <div className="text-sm text-gray-500">Duration: {item.duration}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'scheduled' 
                          ? 'bg-green-100 text-green-800' 
                          : item.status === 'completed' 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => {
                          setSelectedItem(item);
                          setShowViewModal(true);
                        }}
                      >
                        View
                      </button>
                      {item.type === 'flight' && (
                        <button
                          className={`ml-1 ${canCheckIn(item) && !checkedInMap[item.id] ? 'text-indigo-600 hover:text-indigo-900' : 'text-gray-400 cursor-not-allowed'}`}
                          onClick={() => handleCheckIn(item)}
                          disabled={!canCheckIn(item) || !!checkedInMap[item.id]}
                          title={!canCheckIn(item) ? `Check-in opens at ${item.checkIn ? format(new Date(item.checkIn), 'PPpp') : 'N/A'}` : (checkedInMap[item.id] ? 'Already checked in' : 'Check-in')}
                        >
                          {checkedInMap[item.id] ? 'Checked-in' : 'Check-in'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedSchedule.length}</span> of{' '}
          <span className="font-medium">{schedule.length}</span> results
        </div>
        <div className="flex-1 flex justify-end">
          <button
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => window.print()}
          >
            Print Schedule
          </button>
        </div>
      </div>
      {/* View Details Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title={selectedItem ? selectedItem.title : 'Details'}
        maxWidth="max-w-2xl"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Date</div>
                <div className="text-sm font-medium text-gray-900">{formatDate(selectedItem.date)} {formatTime(selectedItem.date)}</div>
              </div>
              {selectedItem.checkIn && (
                <div>
                  <div className="text-sm text-gray-500">Check-in</div>
                  <div className="text-sm font-medium text-gray-900">{formatTime(selectedItem.checkIn)}</div>
                </div>
              )}
              {selectedItem.duration && (
                <div>
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="text-sm font-medium text-gray-900">{selectedItem.duration}</div>
                </div>
              )}
              {selectedItem.location && (
                <div>
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="text-sm font-medium text-gray-900">{selectedItem.location}</div>
                </div>
              )}
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <div className="text-sm font-medium text-gray-900">{selectedItem.status}</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Details</div>
              <div className="text-sm text-gray-900">{selectedItem.description}</div>
            </div>
            <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
              {selectedItem.type === 'flight' && (
                <Button
                  onClick={() => handleCheckIn(selectedItem)}
                  disabled={!canCheckIn(selectedItem) || !!checkedInMap[selectedItem.id]}
                  className={!canCheckIn(selectedItem) || !!checkedInMap[selectedItem.id] ? 'bg-gray-300 cursor-not-allowed' : ''}
                >
                  {checkedInMap[selectedItem.id] ? 'Checked-in' : 'Check-in'}
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowViewModal(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmployeeSchedule;
