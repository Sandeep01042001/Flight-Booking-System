import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ClockIcon,
  BellIcon,
  UserGroupIcon,
  PaperAirplaneIcon,
  CalendarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Button from '../../components/ui/buttons/Button';
import useAuth from '../../hooks/useAuth';

// Navigation items
const navigation = [
  { name: 'Dashboard', href: '.', icon: HomeIcon },
  { name: 'My Schedule', href: 'schedule', icon: CalendarIcon },
  { name: 'Flight Assignments', href: 'flights', icon: PaperAirplaneIcon },
  { name: 'Notifications', href: 'notifications', icon: BellIcon },
  { name: 'Profile', href: 'profile', icon: UserCircleIcon },
  { name: 'Settings', href: 'settings', icon: Cog6ToothIcon },
];

// Dashboard Stats Component
const DashboardStats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
          <PaperAirplaneIcon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">Upcoming Flights</h3>
          <p className="text-2xl font-semibold text-gray-900">{stats?.upcomingFlights || 0}</p>
          <p className="text-sm text-gray-500">Next 7 days</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-green-100 text-green-600">
          <ClockIcon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">Hours This Month</h3>
          <p className="text-2xl font-semibold text-gray-900">{stats?.hoursThisMonth || 0}</p>
          <p className="text-sm text-gray-500">of {stats?.maxMonthlyHours || 100} max</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
          <BellIcon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">Unread Notifications</h3>
          <p className="text-2xl font-semibold text-gray-900">{stats?.unreadNotifications || 0}</p>
          <p className="text-sm text-gray-500">Last updated just now</p>
        </div>
      </div>
    </div>
  </div>
);

const EmployeeDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Get active tab from URL
  const activeTab = navigation.find(
    (item) => location.pathname.endsWith(item.href) || 
             (item.href === '.' && location.pathname.endsWith('/employee'))
  )?.name || 'Dashboard';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, this would fetch actual data
        // const data = await employeeService.getDashboardStats();
        
        // Mock data for demonstration
        const mockStats = {
          upcomingFlights: 3,
          hoursThisMonth: 65,
          maxMonthlyHours: 100,
          unreadNotifications: 2,
          recentFlights: [],
          upcomingSchedule: []
        };
        
        setStats(mockStats);
        setUnreadCount(mockStats.unreadNotifications);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
          <div className="flex items-center justify-between h-16 px-4 bg-blue-600 text-white">
            <h1 className="text-xl font-bold">Crew Portal</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-5 px-2 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.href);
                  setSidebarOpen(false);
                  
                  // Mark notifications as read when navigating to notifications
                  if (item.name === 'Notifications' && unreadCount > 0) {
                    // In a real app, this would be an API call
                    // await employeeService.markNotificationsAsRead();
                    setUnreadCount(0);
                  }
                }}
                className={`${
                  activeTab === item.name
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
              >
                <item.icon
                  className={`${
                    activeTab === item.name ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  } mr-3 h-6 w-6`}
                  aria-hidden="true"
                />
                {item.name}
                {item.name === 'Notifications' && unreadCount > 0 && (
                  <span className="ml-auto inline-block py-0.5 px-2.5 text-xs leading-none text-center whitespace-nowrap align-baseline font-bold bg-red-500 text-white rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white lg:pb-4">
        <div className="flex h-16 flex-shrink-0 items-center px-6 bg-blue-600">
          <h1 className="text-xl font-bold text-white">Crew Portal</h1>
        </div>
        <nav className="mt-5 flex-1 space-y-1 px-2">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={async () => {
                navigate(item.href);
                
                // Mark notifications as read when navigating to notifications
                if (item.name === 'Notifications' && unreadCount > 0) {
                  // In a real app, this would be an API call
                  // await employeeService.markNotificationsAsRead();
                  setUnreadCount(0);
                }
              }}
              className={`${
                activeTab === item.name
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
            >
              <item.icon
                className={`${
                  activeTab === item.name ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                } mr-3 h-6 w-6`}
                aria-hidden="true"
              />
              {item.name}
              {item.name === 'Notifications' && unreadCount > 0 && (
                <span className="ml-auto inline-block py-0.5 px-2.5 text-xs leading-none text-center whitespace-nowrap align-baseline font-bold bg-red-500 text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              <h2 className="self-center text-xl font-semibold text-gray-900">{activeTab}</h2>
            </div>
            <div className="ml-4 flex items-center lg:ml-6 space-x-3">
              <button
                type="button"
                className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative"
                onClick={() => {
                  navigate('notifications');
                  if (unreadCount > 0) {
                    // In a real app, this would be an API call
                    // await employeeService.markNotificationsAsRead();
                    setUnreadCount(0);
                  }
                }}
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white">
                    <span className="sr-only">{unreadCount} unread notifications</span>
                  </span>
                )}
              </button>
              <Button size="sm" variant="secondary" onClick={logout}>Logout</Button>
              
              {/* Profile dropdown */}
              <div className="relative ml-4">
                <button
                  type="button"
                  className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  id="user-menu-button"
                  onClick={() => navigate('profile')}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                    <UserCircleIcon className="h-6 w-6" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {activeTab === 'Dashboard' && stats && <DashboardStats stats={stats} />}
              <Outlet />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
