import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Flights', href: '/flights' },
    { name: 'My Bookings', href: isAuthenticated ? (user?.role === 'admin' ? '/admin/bookings' : '/my-bookings') : '/login', auth: true },
    { name: 'Admin', href: '/admin/dashboard', role: 'admin' },
  ];
  
  // Get user's dashboard URL based on role
  const getDashboardUrl = () => {
    if (!isAuthenticated) return '/login';
    switch(user?.role) {
      case 'admin': return '/admin/dashboard';
      case 'employee':
      case 'pilot':
      case 'flight_attendant':
      case 'crew':
        return '/employee/dashboard';
      case 'customer':
      default:
        return '/dashboard';
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                SkyWings
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation
                .filter(item => !item.auth || isAuthenticated)
                .filter(item => !item.role || user?.role === item.role)
                .map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                    {item.name}
                  </Link>
                ))}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="relative ml-3">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Hello, {user?.firstName || 'User'}
                  </span>
                  <Link
                    to={user?.role === 'admin' ? '/admin/profile' : 
                         ['employee', 'pilot', 'flight_attendant', 'crew'].includes(user?.role) ? '/employee/profile' : 
                         '/profile'}
                    className="rounded-full bg-gray-200 p-1 text-gray-500 hover:text-gray-700"
                  >
                    <span className="sr-only">Your profile</span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    to="/login"
                  >
                    Sign in
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    to="/register"
                  >
                    Sign up
                  </Button>
                </div>
                <div className="mt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    to="/employee/register"
                    className="w-full"
                  >
                    Employee Registration
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            {navigation
              .filter(item => !item.auth || isAuthenticated)
              .filter(item => !item.role || user?.role === item.role)
              .map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
          </div>
          <div className="border-t border-gray-200 pb-3 pt-4">
            {isAuthenticated ? (
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {user?.firstName?.[0] || 'U'}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {user?.email}
                  </div>
                </div>
                <div className="ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 px-4">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Button>
                <Button
                  variant="primary"
                  className="w-full justify-center"
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Button>
                <div className="relative mt-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="w-full justify-center mt-2"
                  to="/employee/register"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Employee Registration
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
