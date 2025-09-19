import React from 'react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  // Mock data for upcoming flights
  const upcomingFlights = [
    { id: 1, flightNumber: 'SW123', from: 'New York (JFK)', to: 'London (LHR)', date: '2023-11-15', time: '09:30' },
    { id: 2, flightNumber: 'SW456', from: 'London (LHR)', to: 'New York (JFK)', date: '2023-11-22', time: '15:45' },
  ];

  // Mock data for recent bookings
  const recentBookings = [
    { id: 1, bookingRef: 'BK123456', flight: 'SW123', date: '2023-11-15', status: 'Confirmed' },
    { id: 2, bookingRef: 'BK789012', flight: 'SW456', date: '2023-11-22', status: 'Confirmed' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, John!</h1>
        <p className="mt-2 text-sm text-gray-600">Here's what's happening with your flights today.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Flights</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{upcomingFlights.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/customer/flights" className="font-medium text-indigo-600 hover:text-indigo-500">
                View all flights
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Recent Bookings</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{recentBookings.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/customer/bookings" className="font-medium text-indigo-600 hover:text-indigo-500">
                View all bookings
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Miles Balance</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">12,500</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/customer/rewards" className="font-medium text-indigo-600 hover:text-indigo-500">
                View rewards
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Account Status</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">Gold Member</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/customer/profile" className="font-medium text-indigo-600 hover:text-indigo-500">
                View profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Flights */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Flights</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Your scheduled flights in the next 30 days.</p>
        </div>
        <div className="bg-white overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {upcomingFlights.length > 0 ? (
              upcomingFlights.map((flight) => (
                <li key={flight.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-indigo-600">{flight.flightNumber}</div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {flight.from} → {flight.to}
                        </div>
                        <div className="text-sm text-gray-500">
                          {flight.date} at {flight.time}
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <Link
                        to={`/customer/flights/${flight.id}`}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                No upcoming flights found. <Link to="/flights" className="text-indigo-600 hover:text-indigo-500">Book a flight</Link>
              </li>
            )}
          </ul>
        </div>
        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <Link
            to="/flights"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Book a Flight
          </Link>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Bookings</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Your most recent flight bookings.</p>
        </div>
        <div className="bg-white overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <li key={booking.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-indigo-600">{booking.bookingRef}</div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Flight {booking.flight}
                        </div>
                        <div className="text-sm text-gray-500">
                          Booked on {booking.date} • <span className="text-green-600">{booking.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <Link
                        to={`/customer/bookings/${booking.id}`}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        View Booking
                      </Link>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                No recent bookings found. <Link to="/flights" className="text-indigo-600 hover:text-indigo-500">Book a flight</Link>
              </li>
            )}
          </ul>
        </div>
        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <Link
            to="/customer/bookings"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View All Bookings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
