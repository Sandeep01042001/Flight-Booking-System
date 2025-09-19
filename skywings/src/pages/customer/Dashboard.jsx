import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon, TicketIcon, UserIcon, CreditCardIcon, BellIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/buttons/Button';
import Card from '../../components/common/Card';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    loyaltyPoints: 0,
    tier: 'Bronze',
  });

  useEffect(() => {
    // Simulate API call to fetch user data
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch this data from your API
        const mockUpcomingTrips = [
          {
            id: 'TRIP123',
            from: 'New York (JFK)',
            to: 'London (LHR)',
            date: '2023-11-15',
            time: '14:30',
            flightNumber: 'SW123',
            status: 'Confirmed',
            bookingRef: 'BK12345678',
          },
          {
            id: 'TRIP124',
            from: 'London (LHR)',
            to: 'Paris (CDG)',
            date: '2023-12-05',
            time: '09:15',
            flightNumber: 'SW456',
            status: 'Confirmed',
            bookingRef: 'BK12345679',
          },
        ];

        setUpcomingTrips(mockUpcomingTrips);
        setStats({
          totalTrips: 12,
          upcomingTrips: mockUpcomingTrips.length,
          loyaltyPoints: 1250,
          tier: calculateTier(1250),
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const calculateTier = (points) => {
    if (points >= 5000) return 'Platinum';
    if (points >= 2000) return 'Gold';
    if (points >= 500) return 'Silver';
    return 'Bronze';
  };

  const getTierColor = (tier) => {
    switch (tier.toLowerCase()) {
      case 'platinum':
        return 'bg-gray-800 text-white';
      case 'gold':
        return 'bg-yellow-500 text-white';
      case 'silver':
        return 'bg-gray-300 text-gray-800';
      default:
        return 'bg-amber-700 text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName || 'Guest'}!</h1>
            <p className="mt-1 text-gray-600">Here's what's happening with your trips today.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button as={Link} to="/flights" variant="primary">
              Book a Flight
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <TicketIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Trips</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalTrips}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Upcoming Trips</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.upcomingTrips}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Loyalty Points</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.loyaltyPoints}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${getTierColor(stats.tier)}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tier Status</p>
              <div className="flex items-center">
                <span className="text-2xl font-semibold text-gray-900 mr-2">{stats.tier}</span>
                <span className="text-sm text-gray-500">Member</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming Trips */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Upcoming Trips</h2>
            <Button as={Link} to="/my-bookings" variant="text" size="sm">
              View All
            </Button>
          </div>
        </div>
        
        {upcomingTrips.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {upcomingTrips.map((trip) => (
              <div key={trip.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <CalendarIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                          {trip.from} → {trip.to}
                        </h3>
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {trip.status}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {new Date(trip.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {trip.time}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <TicketIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {trip.flightNumber}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex-shrink-0">
                    <Button as={Link} to={{ pathname: '/my-bookings' }} state={{ focusBookingId: trip.bookingRef }} variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming trips</h3>
            <p className="mt-1 text-sm text-gray-500">Start by booking your next adventure!</p>
            <div className="mt-6">
              <Button as={Link} to="/flights" variant="primary">
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Book a Flight
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <Link to="/my-bookings" className="block p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">My Bookings</h3>
                <p className="mt-1 text-sm text-gray-500">View and manage your upcoming trips</p>
              </div>
            </div>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <Link to="/profile" className="block p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <UserIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Profile</h3>
                <p className="mt-1 text-sm text-gray-500">Update your personal information</p>
              </div>
            </div>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <Link to="/payment-methods" className="block p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <CreditCardIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
                <p className="mt-1 text-sm text-gray-500">Manage your saved payment options</p>
              </div>
            </div>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <Link to="/notifications" className="block p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <BellIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                <p className="mt-1 text-sm text-gray-500">View your alerts and updates</p>
              </div>
            </div>
          </Link>
        </Card>
      </div>

      {/* Travel Alerts */}
      <Card>
        <div className="p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Travel Alerts</h3>
              <div className="mt-2 text-sm text-gray-600">
                <p>
                  Due to current travel restrictions, some destinations may have entry requirements or be subject to quarantine measures. 
                  Please check the latest travel advisories before your trip.
                </p>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm">
                  View Travel Advisories
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
