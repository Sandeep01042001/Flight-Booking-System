import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const AirlineHome = () => {
  const { user } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to Your Airline Portal</h1>
          <p className="text-xl mb-8">Manage your airline operations efficiently</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Link 
              to="/airline/flights"
              className="bg-white text-indigo-700 px-6 py-4 rounded-lg shadow-lg hover:bg-indigo-50 transition-colors"
            >
              <h3 className="font-bold text-lg mb-2">Manage Flights</h3>
              <p className="text-sm">View and manage your flight schedules</p>
            </Link>
            
            <Link 
              to="/airline/aircrafts"
              className="bg-white text-indigo-700 px-6 py-4 rounded-lg shadow-lg hover:bg-indigo-50 transition-colors"
            >
              <h3 className="font-bold text-lg mb-2">Aircraft Management</h3>
              <p className="text-sm">Manage your fleet and aircraft details</p>
            </Link>
            
            <Link 
              to="/airline/employees"
              className="bg-white text-indigo-700 px-6 py-4 rounded-lg shadow-lg hover:bg-indigo-50 transition-colors"
            >
              <h3 className="font-bold text-lg mb-2">Crew Management</h3>
              <p className="text-sm">Manage your airline staff and crew</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-8">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Scheduled Flights</h3>
            <p className="text-3xl font-bold">24</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Active Aircraft</h3>
            <p className="text-3xl font-bold">12</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Crew Members</h3>
            <p className="text-3xl font-bold">85</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">On-time Performance</h3>
            <p className="text-3xl font-bold">94%</p>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Recent Activities</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {[1, 2, 3].map((item) => (
              <li key={item} className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Flight #{100 + item} has been updated</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AirlineHome;
