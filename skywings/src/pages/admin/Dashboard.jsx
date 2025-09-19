import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpIcon,
  ArrowDownIcon,
  UsersIcon,
  TicketIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon,
  TagIcon,
  UserPlusIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';
import { format, subDays, subMonths, isToday, isThisMonth } from 'date-fns';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import Button from '../../components/ui/buttons/Button';
import Card from '../../components/common/Card';
import Tabs from '../../components/ui/Tabs';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    newCustomers: 0,
    flightOccupancy: 0,
    bookingsTrend: 'up',
    revenueTrend: 'up',
    customersTrend: 'up',
    occupancyTrend: 'up'
  });

  // Mock data - in a real app, this would come from an API
  const mockData = {
    bookings: {
      total: 1242,
      today: 42,
      thisMonth: 876,
      trend: 'up',
      data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56]
    },
    revenue: {
      total: 125000,
      today: 5250,
      thisMonth: 98750,
      trend: 'up',
      data: [12500, 19000, 15000, 25000, 18000, 22000, 30000, 25000, 28000, 21000, 32000, 38000]
    },
    customers: {
      total: 842,
      newToday: 12,
      newThisMonth: 156,
      trend: 'up',
      data: [50, 45, 60, 55, 70, 65, 80, 75, 90, 85, 100, 120]
    },
    flights: {
      total: 48,
      today: 6,
      thisMonth: 42,
      occupancy: 78,
      trend: 'up',
      data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 78]
    },
    recentBookings: [
      { id: 'BK1001', customer: 'John Doe', flight: 'SW456', date: new Date(), amount: 450.00, status: 'confirmed' },
      { id: 'BK1002', customer: 'Jane Smith', flight: 'SW123', date: subDays(new Date(), 1), amount: 320.00, status: 'confirmed' },
      { id: 'BK1003', customer: 'Robert Johnson', flight: 'SW789', date: subDays(new Date(), 1), amount: 520.00, status: 'pending' },
      { id: 'BK1004', customer: 'Emily Davis', flight: 'SW101', date: subDays(new Date(), 2), amount: 275.00, status: 'cancelled' },
      { id: 'BK1005', customer: 'Michael Wilson', flight: 'SW202', date: subDays(new Date(), 3), amount: 380.00, status: 'confirmed' },
    ],
    upcomingFlights: [
      { id: 'FL456', from: 'JFK', to: 'LAX', departure: addDays(new Date(), 1), seats: 45, status: 'on_time' },
      { id: 'FL123', from: 'LAX', to: 'ORD', departure: addDays(new Date(), 1), seats: 18, status: 'on_time' },
      { id: 'FL789', from: 'ORD', to: 'MIA', departure: addDays(new Date(), 2), seats: 32, status: 'on_time' },
      { id: 'FL101', from: 'SFO', to: 'SEA', departure: addDays(new Date(), 2), seats: 12, status: 'delayed' },
      { id: 'FL202', from: 'DFW', to: 'ATL', departure: addDays(new Date(), 3), seats: 56, status: 'on_time' },
    ]
  };

  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real app, you would fetch this data from your API
        // const response = await fetch('/api/admin/dashboard');
        // const data = await response.json();
        // setStats(data);
        
        // Using mock data for now
        setTimeout(() => {
          setStats({
            totalBookings: mockData.bookings.total,
            totalRevenue: mockData.revenue.total,
            newCustomers: mockData.customers.total,
            flightOccupancy: mockData.flights.occupancy,
            bookingsTrend: mockData.bookings.trend,
            revenueTrend: mockData.revenue.trend,
            customersTrend: mockData.customers.trend,
            occupancyTrend: mockData.flights.trend
          });
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  // Chart data
  const getChartData = () => {
    const labels = Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(new Date(), 11 - i);
      return format(date, 'MMM');
    });

    return {
      labels,
      datasets: [
        {
          label: 'Bookings',
          data: mockData.bookings.data,
          backgroundColor: 'rgba(79, 70, 229, 0.2)',
          borderColor: 'rgba(79, 70, 229, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        },
        {
          label: 'Revenue',
          data: mockData.revenue.data.map(val => val / 1000),
          borderColor: 'rgba(16, 185, 129, 1)',
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          yAxisID: 'y1'
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Number of Bookings'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Revenue (in $1000s)'
        },
        grid: {
          drawOnChartArea: false
        },
        // Removes the right y-axis line
        gridLines: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label === 'Revenue') {
              label += `: $${(context.parsed.y * 1000).toLocaleString()}`;
            } else {
              label += `: ${context.parsed.y}`;
            }
            return label;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  const StatCard = ({ title, value, icon: Icon, trend, change, loading }) => {
    return (
      <Card className="h-full">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {loading ? (
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mt-2"></div>
            ) : (
              <p className="text-2xl font-semibold text-gray-900">
                {title.includes('Revenue') ? `$${value.toLocaleString()}` : value}
                {title === 'Flight Occupancy' && '%'}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${getStatCardBgColor(title)}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        {!loading && change !== undefined && (
          <div className="mt-4 flex items-center">
            <span className={`inline-flex items-center text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? (
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
              )}
              {change}%
            </span>
            <span className="ml-2 text-sm text-gray-500">vs last period</span>
          </div>
        )}
      </Card>
    );
  };

  const getStatCardBgColor = (title) => {
    switch (title) {
      case 'Total Bookings':
        return 'bg-indigo-500';
      case 'Total Revenue':
        return 'bg-green-500';
      case 'New Customers':
        return 'bg-blue-500';
      case 'Flight Occupancy':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'on_time':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your airline today.
          </p>
        </div>
        <div className="mt-4 md:mt-0
        ">
          <Tabs
            tabs={[
              { id: 'day', name: 'Today' },
              { id: 'week', name: 'This Week' },
              { id: 'month', name: 'This Month' },
              { id: 'year', name: 'This Year' }
            ]}
            selectedTab={timeRange}
            onChange={setTimeRange}
            variant="pills"
            size="sm"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Bookings" 
          value={stats.totalBookings} 
          icon={TicketIcon} 
          trend={stats.bookingsTrend}
          change={12.5}
          loading={loading}
        />
        <StatCard 
          title="Total Revenue" 
          value={stats.totalRevenue} 
          icon={CurrencyDollarIcon} 
          trend={stats.revenueTrend}
          change={8.3}
          loading={loading}
        />
        <StatCard 
          title="New Customers" 
          value={stats.newCustomers} 
          icon={UsersIcon} 
          trend={stats.customersTrend}
          change={5.7}
          loading={loading}
        />
        <StatCard 
          title="Flight Occupancy" 
          value={stats.flightOccupancy} 
          icon={ChartBarIcon} 
          trend={stats.occupancyTrend}
          change={3.2}
          loading={loading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Bookings & Revenue</h3>
              <p className="mt-1 text-sm text-gray-500">Overview of bookings and revenue over time</p>
            </div>
            <div className="p-4 h-80">
              <Line data={getChartData()} options={chartOptions} />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Quick Stats</h3>
            </div>
            <div className="p-4">
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-500">Bookings Today</dt>
                  <dd className="text-sm font-medium text-gray-900">{mockData.bookings.today}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-500">Revenue Today</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatCurrency(mockData.revenue.today)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-500">New Customers Today</dt>
                  <dd className="text-sm font-medium text-gray-900">{mockData.customers.newToday}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-500">Flights Today</dt>
                  <dd className="text-sm font-medium text-gray-900">{mockData.flights.today}</dd>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm font-medium text-gray-500">Monthly Target</dt>
                    <dd className="text-sm font-medium text-gray-900">$150,000</dd>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(mockData.revenue.thisMonth / 150000) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <span>${mockData.revenue.thisMonth.toLocaleString()}</span>
                    <span>${(150000 - mockData.revenue.thisMonth).toLocaleString()} to go</span>
                  </div>
                </div>
              </dl>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card>
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Bookings</h3>
            <Button as={Link} to="/admin/bookings" variant="text" size="sm">
              View all
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockData.recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      <Link to={`/admin/bookings/${booking.id}`} className="hover:underline">
                        {booking.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(booking.date, 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(booking.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Upcoming Flights */}
        <Card>
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Upcoming Flights</h3>
            <Button as={Link} to="/admin/flights" variant="text" size="sm">
              View all
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Flight
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departure
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seats
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockData.upcomingFlights.map((flight) => (
                  <tr key={flight.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      <Link to={`/admin/flights/${flight.id}`} className="hover:underline">
                        {flight.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {flight.from} → {flight.to}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(flight.departure, 'MMM d, h:mm a')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {flight.seats} / 200
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        getStatusBadge(flight.status)
                      }`}>
                        {flight.status === 'on_time' ? 'On Time' : 'Delayed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button as={Link} to="/admin/flights/new" variant="outline" className="justify-start">
              <PlusIcon className="h-5 w-5 mr-2 text-gray-400" />
              Add New Flight
            </Button>
            <Button as={Link} to="/admin/promotions/new" variant="outline" className="justify-start">
              <TagIcon className="h-5 w-5 mr-2 text-gray-400" />
              Create Promotion
            </Button>
            <Button as={Link} to="/admin/users/new" variant="outline" className="justify-start">
              <UserPlusIcon className="h-5 w-5 mr-2 text-gray-400" />
              Add Staff Member
            </Button>
            <Button as={Link} to="/admin/reports" variant="outline" className="justify-start">
              <DocumentChartBarIcon className="h-5 w-5 mr-2 text-gray-400" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to add days to a date
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export default AdminDashboard;
