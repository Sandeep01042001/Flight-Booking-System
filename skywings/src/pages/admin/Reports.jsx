import { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  CalendarIcon,
  ArrowDownTrayIcon as DocumentDownloadIcon,
  FunnelIcon as FilterIcon,
  ArrowPathIcon as RefreshIcon,
  ArrowDownIcon as ArrowSmDownIcon,
  ArrowUpIcon as ArrowSmUpIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  TicketIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { format, subDays, subMonths, isWithinInterval, parseISO } from 'date-fns';
import { toast } from 'react-toastify';

export default function AdminReports() {
  // Ensure all required Chart.js components are registered (including Pie's ArcElement)
  ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );
  // State for report data and filters
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: subMonths(new Date(), 1),
    end: new Date()
  });
  const [reportType, setReportType] = useState('revenue');
  const [timeFrame, setTimeFrame] = useState('daily');
  
  // Mock data generation
  const generateMockData = () => {
    const days = Math.ceil((dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24)) + 1;
    const data = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(dateRange.start);
      date.setDate(date.getDate() + i);
      
      data.push({
        date: format(date, 'yyyy-MM-dd'),
        revenue: Math.floor(Math.random() * 10000) + 5000,
        bookings: Math.floor(Math.random() * 50) + 20,
        passengers: Math.floor(Math.random() * 200) + 50,
        flights: Math.floor(Math.random() * 15) + 5,
        cancellationRate: Math.random() * 0.2, // 0-20%
        loadFactor: 0.6 + Math.random() * 0.4 // 60-100%
      });
    }
    
    return data;
  };
  
  const [reportData, setReportData] = useState([]);
  
  // Load report data
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setReportData(generateMockData());
      setLoading(false);
    }, 800);
  }, [dateRange, reportType, timeFrame]);
  
  // Chart data preparation
  const getChartData = () => {
    const labels = reportData.map(item => format(new Date(item.date), 'MMM d'));
    
    if (reportType === 'revenue') {
      return {
        labels,
        datasets: [
          {
            label: 'Revenue ($)',
            data: reportData.map(item => item.revenue),
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.3,
            fill: true
          }
        ]
      };
    } else if (reportType === 'bookings') {
      return {
        labels,
        datasets: [
          {
            label: 'Number of Bookings',
            data: reportData.map(item => item.bookings),
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1
          }
        ]
      };
    } else if (reportType === 'passengers') {
      return {
        labels,
        datasets: [
          {
            label: 'Passengers',
            data: reportData.map(item => item.passengers),
            borderColor: 'rgba(245, 158, 11, 1)',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            tension: 0.3,
            fill: true
          }
        ]
      };
    }
    
    return { labels: [], datasets: [] };
  };
  
  // Calculate summary metrics
  const getSummary = () => {
    if (reportData.length === 0) return {};
    
    const totalRevenue = reportData.reduce((sum, item) => sum + item.revenue, 0);
    const totalBookings = reportData.reduce((sum, item) => sum + item.bookings, 0);
    const totalPassengers = reportData.reduce((sum, item) => sum + item.passengers, 0);
    const avgLoadFactor = reportData.reduce((sum, item) => sum + item.loadFactor, 0) / reportData.length;
    const avgCancellationRate = reportData.reduce((sum, item) => sum + item.cancellationRate, 0) / reportData.length;
    
    return {
      totalRevenue,
      totalBookings,
      totalPassengers,
      avgLoadFactor: avgLoadFactor * 100, // Convert to percentage
      avgCancellationRate: avgCancellationRate * 100, // Convert to percentage
      revenueChange: 5.2, // Mock change percentage
      bookingChange: 2.8, // Mock change percentage
      passengerChange: 7.1 // Mock change percentage
    };
  };
  
  const summary = getSummary();
  const chartData = getChartData();
  
  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };
  
  // Handle date range change
  const handleDateRangeChange = (range) => {
    const now = new Date();
    switch (range) {
      case '7d':
        setDateRange({
          start: subDays(now, 7),
          end: now
        });
        break;
      case '30d':
        setDateRange({
          start: subDays(now, 30),
          end: now
        });
        break;
      case '90d':
        setDateRange({
          start: subDays(now, 90),
          end: now
        });
        break;
      default:
        break;
    }
  };
  
  // Export report
  const exportReport = () => {
    toast.success('Exporting report data...');
    // In a real app, this would generate and download a CSV/PDF
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track and analyze your flight booking performance
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            type="button"
            onClick={exportReport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <DocumentDownloadIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Export
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              id="report-type"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="revenue">Revenue</option>
              <option value="bookings">Bookings</option>
              <option value="passengers">Passengers</option>
              <option value="flights">Flights</option>
              <option value="cancellations">Cancellations</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label htmlFor="time-frame" className="block text-sm font-medium text-gray-700 mb-1">
              Time Frame
            </label>
            <select
              id="time-frame"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => handleDateRangeChange('7d')}
                className={`px-3 py-1.5 text-sm rounded-md ${dateRange.start.getTime() === subDays(new Date(), 7).getTime() ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                7D
              </button>
              <button
                type="button"
                onClick={() => handleDateRangeChange('30d')}
                className={`px-3 py-1.5 text-sm rounded-md ${dateRange.start.getTime() === subDays(new Date(), 30).getTime() ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                30D
              </button>
              <button
                type="button"
                onClick={() => handleDateRangeChange('90d')}
                className={`px-3 py-1.5 text-sm rounded-md ${dateRange.start.getTime() === subDays(new Date(), 90).getTime() ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                90D
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
              >
                <CalendarIcon className="h-4 w-4 mr-1" />
                Custom
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {/* Revenue Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <CurrencyDollarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      ${summary.totalRevenue?.toLocaleString() || '0'}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${summary.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {summary.revenueChange >= 0 ? (
                        <ArrowSmUpIcon className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                      ) : (
                        <ArrowSmDownIcon className="self-center flex-shrink-0 h-5 w-5 text-red-500" />
                      )}
                      <span className="sr-only">
                        {summary.revenueChange >= 0 ? 'Increased' : 'Decreased'} by
                      </span>
                      {Math.abs(summary.revenueChange)}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bookings Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <TicketIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {summary.totalBookings?.toLocaleString() || '0'}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${summary.bookingChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {summary.bookingChange >= 0 ? (
                        <ArrowSmUpIcon className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                      ) : (
                        <ArrowSmDownIcon className="self-center flex-shrink-0 h-5 w-5 text-red-500" />
                      )}
                      <span className="sr-only">
                        {summary.bookingChange >= 0 ? 'Increased' : 'Decreased'} by
                      </span>
                      {Math.abs(summary.bookingChange)}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        {/* Passengers Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Passengers</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {summary.totalPassengers?.toLocaleString() || '0'}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${summary.passengerChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {summary.passengerChange >= 0 ? (
                        <ArrowSmUpIcon className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                      ) : (
                        <ArrowSmDownIcon className="self-center flex-shrink-0 h-5 w-5 text-red-500" />
                      )}
                      <span className="sr-only">
                        {summary.passengerChange >= 0 ? 'Increased' : 'Decreased'} by
                      </span>
                      {Math.abs(summary.passengerChange)}%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        {/* Load Factor Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg. Load Factor</dt>
                  <dd>
                    <div className="text-2xl font-semibold text-gray-900">
                      {summary.avgLoadFactor ? summary.avgLoadFactor.toFixed(1) : '0'}%
                    </div>
                  </dd>
                </dl>
                <div className="mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${summary.avgLoadFactor || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Chart */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            {reportType === 'revenue' && 'Revenue Overview'}
            {reportType === 'bookings' && 'Bookings Overview'}
            {reportType === 'passengers' && 'Passenger Volume'}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {format(dateRange.start, 'MMM d, yyyy')} - {format(dateRange.end, 'MMM d, yyyy')}
            </span>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setReportData(generateMockData());
                  setLoading(false);
                  toast.success('Report data refreshed');
                }, 500);
              }}
              className="p-1 text-gray-400 hover:text-gray-500"
              title="Refresh data"
            >
              <RefreshIcon className="h-5 w-5" />
              <span className="sr-only">Refresh</span>
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="h-80">
            <Line
              key={`line-${reportType}`}
              data={chartData}
              options={chartOptions}
            />
          </div>
        )}
      </div>
      
      {/* Additional Metrics */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Top Routes */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Routes</h3>
          <div className="space-y-4">
            {[
              { from: 'JFK', to: 'LAX', bookings: 1245, revenue: 124500 },
              { from: 'LAX', to: 'ORD', bookings: 987, revenue: 87650 },
              { from: 'ORD', to: 'DFW', bookings: 856, revenue: 76540 },
              { from: 'DFW', to: 'DEN', bookings: 765, revenue: 65430 },
              { from: 'DEN', to: 'SFO', bookings: 654, revenue: 54320 },
            ].map((route, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">{route.from}</span>
                    <span className="mx-2 text-gray-400">→</span>
                    <span className="font-medium text-gray-900">{route.to}</span>
                  </div>
                  <div className="text-sm text-gray-500">{route.bookings} bookings</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">${route.revenue.toLocaleString()}</div>
                  <div className="text-sm text-green-600">+{Math.floor(Math.random() * 15) + 5}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Cancellation Rate */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cancellation Rate</h3>
          <div className="h-48 flex items-center justify-center mb-4">
            <div className="relative w-40 h-40">
              <Pie
                key={`pie-cancel-${dateRange.start.getTime()}-${dateRange.end.getTime()}`}
                data={{
                  labels: ['Completed', 'Cancelled'],
                  datasets: [
                    {
                      data: [100 - summary.avgCancellationRate, summary.avgCancellationRate],
                      backgroundColor: ['#10B981', '#EF4444'],
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{Number(summary.avgCancellationRate ?? 0).toFixed(1)}%</div>
                  <div className="text-sm text-gray-500">Avg. Cancellation</div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">This Period</span>
              <span className="font-medium">{Number(summary.avgCancellationRate ?? 0).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Last Period</span>
              <span className="font-medium">{Number(((summary.avgCancellationRate ?? 0) * 1.2)).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Change</span>
              <span className="text-green-600 font-medium">-{Number(((summary.avgCancellationRate ?? 0) * 0.2)).toFixed(1)}%</span>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'New booking', details: 'JFK to LAX', time: '2 min ago', user: 'John D.' },
              { action: 'Flight delay', details: 'Flight #SW123', time: '1 hour ago', user: 'System' },
              { action: 'New user registered', details: 'sarah@example.com', time: '3 hours ago', user: 'System' },
              { action: 'Payment processed', details: 'Booking #45678', time: '5 hours ago', user: 'System' },
              { action: 'New route added', details: 'SFO to SEA', time: '1 day ago', user: 'Admin' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 h-2 w-2 mt-1.5 rounded-full bg-blue-500"></div>
                <div className="ml-3 flex-1">
                  <div className="text-sm text-gray-900">
                    <span className="font-medium">{activity.action}</span>{' '}
                    <span className="text-gray-500">{activity.details}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {activity.time} • {activity.user}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
