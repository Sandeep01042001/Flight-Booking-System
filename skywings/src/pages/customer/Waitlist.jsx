import { useState, useEffect } from 'react';
import { ClockIcon, CheckCircleIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import useAuth from '../../hooks/useAuth';
import customerService from '../../services/customerService';

const Waitlist = () => {
  const { user } = useAuth();
  const [waitlistItems, setWaitlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    maxPrice: '',
    notes: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetchWaitlist();
    }
  }, [user]);

  const fetchWaitlist = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call to get user's waitlist items
      // const data = await customerService.getWaitlistItems(user.id);
      
      // Mock data for demonstration
      const mockWaitlistItems = [
        {
          id: 1,
          origin: 'JFK',
          destination: 'LAX',
          departureDate: '2025-10-15',
          maxPrice: 500,
          status: 'active',
          createdAt: new Date(Date.now() - 86400000), // 1 day ago
          notes: 'Looking for a direct flight'
        },
        {
          id: 2,
          origin: 'SFO',
          destination: 'ORD',
          departureDate: '2025-11-01',
          maxPrice: 300,
          status: 'fulfilled',
          fulfilledAt: new Date(Date.now() - 3600000), // 1 hour ago
          createdAt: new Date(Date.now() - 259200000), // 3 days ago
          notes: 'Flexible with dates'
        },
      ];
      
      setWaitlistItems(mockWaitlistItems);
    } catch (err) {
      console.error('Error fetching waitlist:', err);
      setError('Failed to load waitlist. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.origin || !formData.destination || !formData.departureDate) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      // In a real app, this would be an API call to add to waitlist
      // const newItem = await customerService.addToWaitlist(user.id, formData);
      
      // Mock response
      const newItem = {
        id: Date.now(),
        ...formData,
        status: 'active',
        createdAt: new Date()
      };
      
      setWaitlistItems([newItem, ...waitlistItems]);
      
      // Reset form
      setFormData({
        origin: '',
        destination: '',
        departureDate: '',
        maxPrice: '',
        notes: ''
      });
      
      // Show success message
      // In a real app, you might use a toast notification here
      alert('Successfully added to waitlist!');
      
    } catch (err) {
      console.error('Error adding to waitlist:', err);
      setError('Failed to add to waitlist. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const removeFromWaitlist = async (id) => {
    if (!window.confirm('Are you sure you want to remove this from your waitlist?')) {
      return;
    }
    
    try {
      // In a real app, this would be an API call to remove from waitlist
      // await customerService.removeFromWaitlist(user.id, id);
      
      // Update local state
      setWaitlistItems(waitlistItems.filter(item => item.id !== id));
      
    } catch (err) {
      console.error('Error removing from waitlist:', err);
      setError('Failed to remove from waitlist. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Flight Waitlist</h1>
        <p className="text-gray-600">Get notified when flights matching your criteria become available</p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add to Waitlist</h2>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XMarkIcon className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
                  From (Airport Code) *
                </label>
                <input
                  type="text"
                  id="origin"
                  name="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., JFK"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                  To (Airport Code) *
                </label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., LAX"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Departure Date *
                </label>
                <input
                  type="date"
                  id="departureDate"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Price (optional)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="maxPrice"
                    name="maxPrice"
                    value={formData.maxPrice}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-2 pl-7"
                    placeholder="0.00"
                    min="0"
                    step="1"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes (optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                value={formData.notes}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                placeholder="Any specific preferences or requirements?"
              />
            </div>
            
            <div className="pt-2">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Adding...
                  </>
                ) : 'Add to Waitlist'}
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Your Waitlist Items</h2>
        
        {waitlistItems.length === 0 ? (
          <div className="text-center py-12 bg-white shadow sm:rounded-lg">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No waitlist items</h3>
            <p className="mt-1 text-sm text-gray-500">Add flights to your waitlist to get notified when they become available.</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {waitlistItems.map((item) => (
                <li key={item.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          item.status === 'fulfilled' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {item.status === 'fulfilled' ? (
                            <CheckCircleIcon className="h-6 w-6" />
                          ) : (
                            <ClockIcon className="h-6 w-6" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              {item.origin} → {item.destination}
                            </p>
                            {item.status === 'fulfilled' && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Fulfilled
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(item.departureDate)}
                            {item.maxPrice && ` • Max $${item.maxPrice}`}
                            {item.notes && ` • ${item.notes}`}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Added {formatTimeAgo(item.createdAt)}
                            {item.fulfilledAt && ` • Fulfilled ${formatTimeAgo(item.fulfilledAt)}`}
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0
                      ">
                        <button
                          type="button"
                          onClick={() => removeFromWaitlist(item.id)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Waitlist;
