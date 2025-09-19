import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  ClockIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { Card } from '../../components/ui';

export default function Reports() {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  
  // Mock data - replace with API calls
  const [reportData, setReportData] = useState({
    revenue: {
      current: 125000,
      previous: 98000,
      trend: 'up',
      data: [65, 59, 80, 81, 56, 55, 40, 60, 75, 80, 90, 100]
    },
    bookings: {
      current: 245,
      previous: 198,
      trend: 'up',
      data: [12, 19, 3, 5, 2, 3, 15, 20, 25, 30, 35, 40]
    },
    loadFactor: {
      current: 78,
      previous: 72,
      trend: 'up',
      data: [50, 45, 60, 70, 65, 75, 80, 78, 85, 82, 88, 90]
    },
    onTimePerformance: {
      current: 92,
      previous: 88,
      trend: 'up',
      data: [85, 78, 90, 82, 88, 85, 90, 92, 95, 92, 94, 96]
    }
  });

  useEffect(() => {
    // Simulate API call
    const fetchReportData = async () => {
      try {
        // In a real app, you would fetch this data from your API
        // const response = await fetch(`/api/airline/reports?range=${timeRange}`);
        // const data = await response.json();
        // setReportData(data);
        
        // Simulate loading
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching report data:', error);
        setLoading(false);
      }
    };

    fetchReportData();
  }, [timeRange]);

  const StatCard = ({ title, value, icon: Icon, trend, percentage, loading }) => {
    if (loading) {
      return (
        <Card className="p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        </Card>
      );
    }

    return (
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {title.includes('Revenue') ? `$${value.toLocaleString()}` : value}{title === 'Load Factor' || title === 'On-Time Performance' ? '%' : ''}
            </p>
            <div className={`mt-2 flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? (
                <ArrowUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-1" />
              )}
              {percentage}% from last {timeRange}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-blue-50">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </Card>
    );
  };

  const TimeRangeSelector = () => (
    <div className="flex space-x-2">
      {['day', 'week', 'month', 'year'].map((range) => (
        <button
          key={range}
          onClick={() => setTimeRange(range)}
          className={`px-3 py-1 text-sm rounded-md ${
            timeRange === range
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {range.charAt(0).toUpperCase() + range.slice(1)}
        </button>
      ))}
    </div>
  );

  // Simple chart component (in a real app, you'd use a charting library like Chart.js or Recharts)
  const SimpleChart = ({ data, color = 'blue' }) => {
    const maxValue = Math.max(...data);
    
    return (
      <div className="flex items-end h-24 mt-4 space-x-1">
        {data.map((value, index) => {
          const height = (value / maxValue) * 100;
          return (
            <div
              key={index}
              className={`flex-1 bg-${color}-200 rounded-t-sm`}
              style={{ height: `${height}%` }}
            ></div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded w-16"></div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Airline Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Key performance indicators and insights for your airline
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <TimeRangeSelector />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={reportData.revenue.current}
          icon={CurrencyDollarIcon}
          trend={reportData.revenue.trend}
          percentage={Math.round(((reportData.revenue.current - reportData.revenue.previous) / reportData.revenue.previous) * 100)}
          loading={loading}
        />
        <StatCard
          title="Bookings"
          value={reportData.bookings.current}
          icon={UserGroupIcon}
          trend={reportData.bookings.trend}
          percentage={Math.round(((reportData.bookings.current - reportData.bookings.previous) / reportData.bookings.previous) * 100)}
          loading={loading}
        />
        <StatCard
          title="Load Factor"
          value={reportData.loadFactor.current}
          icon={ChartBarIcon}
          trend={reportData.loadFactor.trend}
          percentage={Math.round(((reportData.loadFactor.current - reportData.loadFactor.previous) / reportData.loadFactor.previous) * 100)}
          loading={loading}
        />
        <StatCard
          title="On-Time Performance"
          value={reportData.onTimePerformance.current}
          icon={ClockIcon}
          trend={reportData.onTimePerformance.trend}
          percentage={Math.round(((reportData.onTimePerformance.current - reportData.onTimePerformance.previous) / reportData.onTimePerformance.previous) * 100)}
          loading={loading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Revenue</h3>
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="h-4 w-4 mr-1" />
              Last 12 months
            </div>
          </div>
          <SimpleChart data={reportData.revenue.data} color="blue" />
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Bookings</h3>
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="h-4 w-4 mr-1" />
              Last 12 months
            </div>
          </div>
          <SimpleChart data={reportData.bookings.data} color="green" />
        </Card>
      </div>

      {/* Additional Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Routes</h3>
          <div className="space-y-4">
            {[
              { route: 'JFK → LAX', passengers: 1245, revenue: '$245,670' },
              { route: 'ORD → MIA', passengers: 987, revenue: '$187,530' },
              { route: 'SFO → SEA', passengers: 856, revenue: '$165,420' },
              { route: 'DFW → ATL', passengers: 732, revenue: '$142,890' },
              { route: 'LAX → ORD', passengers: 689, revenue: '$132,450' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="font-medium">{item.route}</div>
                <div className="text-sm text-gray-500">
                  {item.passengers.toLocaleString()} passengers • {item.revenue}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Aircraft Utilization</h3>
          <div className="space-y-4">
            {[
              { aircraft: 'Boeing 737-800', utilization: '78%', flights: 45 },
              { aircraft: 'Airbus A320', utilization: '85%', flights: 38 },
              { aircraft: 'Boeing 787-9', utilization: '72%', flights: 28 },
              { aircraft: 'Airbus A350', utilization: '68%', flights: 22 },
              { aircraft: 'Embraer E175', utilization: '82%', flights: 36 },
            ].map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.aircraft}</span>
                  <span className="text-gray-500">{item.utilization}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: item.utilization }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500">{item.flights} flights this month</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
