import { useState, useEffect } from 'react';
import { BellIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import useAuth from '../../hooks/useAuth';
import customerService from '../../services/customerService';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call to get user notifications
      // const data = await customerService.getNotifications(user.id);
      
      // Mock data for demonstration
      const mockNotifications = [
        {
          id: 1,
          type: 'booking',
          title: 'Booking Confirmed',
          message: 'Your flight from JFK to LAX has been confirmed.',
          isRead: false,
          date: new Date(Date.now() - 3600000), // 1 hour ago
          icon: CheckCircleIcon,
          iconColor: 'text-green-500',
        },
        {
          id: 2,
          type: 'promotion',
          title: 'Special Offer',
          message: 'Get 20% off your next booking with code FLY20.',
          isRead: false,
          date: new Date(Date.now() - 86400000), // 1 day ago
          icon: InformationCircleIcon,
          iconColor: 'text-blue-500',
        },
        {
          id: 3,
          type: 'alert',
          title: 'Check-in Reminder',
          message: 'Check-in for your upcoming flight is now open.',
          isRead: true,
          date: new Date(Date.now() - 172800000), // 2 days ago
          icon: ExclamationCircleIcon,
          iconColor: 'text-yellow-500',
        },
      ];
      
      setNotifications(mockNotifications);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
    // In a real app, this would be an API call to mark the notification as read
    // await customerService.markNotificationAsRead(user.id, id);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      isRead: true
    })));
    // In a real app, this would be an API call to mark all notifications as read
    // await customerService.markAllNotificationsAsRead(user.id);
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    // In a real app, this would be an API call to delete the notification
    // await customerService.deleteNotification(user.id, id);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <XMarkIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {notifications.length > 0 && unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={markAllAsRead}
            className="text-sm"
          >
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
          <p className="mt-1 text-sm text-gray-500">You don't have any notifications yet.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <li key={notification.id} className={!notification.isRead ? 'bg-blue-50' : ''}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 ${notification.iconColor} mr-3`}>
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-500">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(notification.date)}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        {!notification.isRead && (
                          <button
                            type="button"
                            onClick={() => markAsRead(notification.id)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteNotification(notification.id)}
                          className="ml-2 text-sm text-gray-400 hover:text-gray-500"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;
