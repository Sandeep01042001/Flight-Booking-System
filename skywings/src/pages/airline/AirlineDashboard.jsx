import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ClockIcon,
  UserGroupIcon,
  PaperAirplaneIcon,
  ChartBarIcon,
  CalendarIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import airlineService from '../../services/airlineService';
import { toast } from 'react-toastify';

// Navigation items
const navigation = [
  { name: 'Dashboard', href: '.', icon: HomeIcon },
  { name: 'Flights', href: 'flights', icon: PaperAirplaneIcon },
  { name: 'Aircrafts', href: 'aircrafts', icon: ClockIcon },
  { name: 'Employees', href: 'employees', icon: UserGroupIcon },
  { name: 'Schedule', href: 'schedule', icon: CalendarIcon },
  { name: 'Reports', href: 'reports', icon: ChartBarIcon },
  { name: 'Settings', href: 'settings', icon: Cog6ToothIcon },
];

// Dashboard Stats Component
const DashboardStats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
          <PaperAirplaneIcon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">Total Flights</h3>
          <p className="text-2xl font-semibold text-gray-900">{stats?.totalFlights || 0}</p>
          <p className="text-sm text-green-600">+{stats?.activeFlights || 0} active</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-green-100 text-green-600">
          <UserGroupIcon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">Employees</h3>
          <p className="text-2xl font-semibold text-gray-900">{stats?.totalEmployees || 0}</p>
          <p className="text-sm text-green-600">+{stats?.availableEmployees || 0} available</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
          <ClockIcon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">Aircrafts</h3>
          <p className="text-2xl font-semibold text-gray-900">{stats?.totalAircrafts || 0}</p>
          <p className="text-sm text-yellow-600">{stats?.maintenanceAircrafts || 0} in maintenance</p>
        </div>
      </div>
    </div>
    
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
          <ChartBarIcon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">Occupancy Rate</h3>
          <p className="text-2xl font-semibold text-gray-900">{stats?.occupancyRate || 0}%</p>
          <p className="text-sm text-gray-500">Last 30 days</p>
        </div>
      </div>
    </div>
  </div>
);

const AirlineDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get active tab from URL
  const activeTab = navigation.find(
    (item) => location.pathname.endsWith(item.href) || 
             (item.href === '.' && location.pathname.endsWith('/airline'))
  )?.name || 'Dashboard';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, this would fetch actual data
        // const data = await airlineService.getDashboardStats(airlineId);
        
        // Mock data for demonstration
        const mockStats = {
          totalFlights: 128,
          activeFlights: 24,
          totalEmployees: 245,
          availableEmployees: 187,
          totalAircrafts: 42,
          maintenanceAircrafts: 3,
          occupancyRate: 78.5,
        };
        
        setStats(mockStats);
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
            <h1 className="text-xl font-bold">Airline Dashboard</h1>
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
                />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-white lg:pb-4">
        <div className="flex h-16 flex-shrink-0 items-center px-6 bg-blue-600">
          <h1 className="text-xl font-bold text-white">Airline Dashboard</h1>
        </div>
        <nav className="mt-5 flex-1 space-y-1 px-2">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.href)}
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
              />
              {item.name}
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
            <div className="ml-4 flex items-center lg:ml-6">
              {/* Add notification and profile dropdowns here */}
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

export default AirlineDashboard;
