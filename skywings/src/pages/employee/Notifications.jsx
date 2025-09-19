import React, { useState, useEffect, Fragment } from 'react';
import { 
  BellIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
  ClockIcon,
  CheckIcon,
  TrashIcon,
  FunnelIcon,
  ArrowPathIcon,
  UserCircleIcon,
  EnvelopeIcon,
  StarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { format, parseISO, isToday, isYesterday, isThisWeek } from 'date-fns';
import { showSuccess, showError } from '../../components/common/ToastHandler';

const notificationTypes = {
  info: {
    icon: InformationCircleIcon,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  success: {
    icon: CheckCircleIcon,
    iconColor: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  warning: {
    icon: ExclamationCircleIcon,
    iconColor: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
  },
  error: {
    icon: ExclamationCircleIcon,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  schedule: {
    icon: ClockIcon,
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  announcement: {
    icon: EnvelopeIcon,
    iconColor: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
  },
  important: {
    icon: StarIcon,
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-50',
  },
  crew: {
    icon: UserGroupIcon,
    iconColor: 'text-cyan-500',
    bgColor: 'bg-cyan-50',
  },
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());
  const [selectMode, setSelectMode] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const data = await employeeService.getNotifications();
      
      // Mock data
      const mockNotifications = [
        {
          id: '1',
          title: 'Flight Assignment',
          message: 'You have been assigned to Flight SKY123 from JFK to LAX on September 20, 2025.',
          type: 'schedule',
          timestamp: '2025-09-15T09:30:00',
          read: false,
          action: {
            text: 'View Details',
            url: '/employee/flights/FL123',
          },
        },
        {
          id: '2',
          title: 'Schedule Update',
          message: 'Your flight SKY456 on September 22, 2025 has been rescheduled to 2:30 PM.',
          type: 'warning',
          timestamp: '2025-09-14T15:45:00',
          read: false,
        },
        {
          id: '3',
          title: 'Training Completed',
          message: 'You have successfully completed the Emergency Procedures Training.',
          type: 'success',
          timestamp: '2025-09-13T11:20:00',
          read: true,
        },
        {
          id: '4',
          title: 'New Policy Update',
          message: 'Please review the updated safety protocols in the employee handbook.',
          type: 'info',
          timestamp: '2025-09-10T14:10:00',
          read: true,
        },
        {
          id: '5',
          title: 'Check-in Reminder',
          message: 'Don\'t forget to check in for your flight SKY789 1 hour before departure.',
          type: 'info',
          timestamp: '2025-09-09T08:30:00',
          read: true,
        },
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      // In a real app, this would be an API call
      // await employeeService.markNotificationAsRead(id);
      
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
      
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to update notification');
    }
  };

  const markSelectedAsRead = () => {
    try {
      // Mark selected notifications as read
      const updatedNotifications = notifications.map(notification =>
        selectedIds.includes(notification.id) 
          ? { ...notification, read: true, readAt: new Date().toISOString() }
          : notification
      );
      setNotifications(updatedNotifications);
      setSelectedIds([]);
      showSuccess('Marked as read');
      setSelectMode(false);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      showError('Failed to update notifications');
    }
  };

  const deleteSelected = () => {
    try {
      // Delete selected notifications
      const remainingNotifications = notifications.filter(
        notification => !selectedIds.includes(notification.id)
      );
      setNotifications(remainingNotifications);
      setSelectedIds([]);
      showSuccess('Notification(s) deleted');
    } catch (error) {
      console.error('Error deleting notifications:', error);
      showError('Failed to delete notifications');
    }
  };

  const toggleSelectNotification = (id, isSelected) => {
    const newSelection = new Set(selectedNotifications);
    if (isSelected) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedNotifications(newSelection);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const groupNotificationsByDate = (notifications) => {
    const today = [];
    const yesterday = [];
    const thisWeek = [];
    const older = [];
    
    const now = new Date();
    
    notifications.forEach(notification => {
      const date = new Date(notification.timestamp);
      
      if (isToday(date)) {
        today.push(notification);
      } else if (isYesterday(date)) {
        yesterday.push(notification);
      } else if (isThisWeek(date, { weekStartsOn: 1 })) {
        thisWeek.push(notification);
      } else {
        older.push(notification);
      }
    });
    
    return [
      { title: 'Today', items: today },
      { title: 'Yesterday', items: yesterday },
      { title: 'This Week', items: thisWeek },
      { title: 'Older', items: older },
    ].filter(group => group.items.length > 0);
  };

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return format(date, 'MMM d, yyyy');
  };

  const NotificationItem = ({ notification }) => {
    const Icon = notificationTypes[notification.type]?.icon || InformationCircleIcon;
    const iconColor = notificationTypes[notification.type]?.iconColor || 'text-gray-400';
    const bgColor = notificationTypes[notification.type]?.bgColor || 'bg-gray-50';
    
    return (
      <div 
        className={`relative p-4 border-b border-gray-100 hover:bg-gray-50 ${
          !notification.read ? 'bg-blue-50' : 'bg-white'
        }`}
      >
        {selectMode ? (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedNotifications.has(notification.id)}
              onChange={(e) => toggleSelectNotification(notification.id, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="ml-3 flex-1">
              <div className="flex items-center">
                <Icon className={`h-5 w-5 ${iconColor} mr-2`} />
                <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
              </div>
              <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
              <p className="mt-1 text-xs text-gray-400">
                {format(parseISO(notification.timestamp), 'MMM d, yyyy • h:mm a')}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex">
            <div className={`flex-shrink-0 ${bgColor} rounded-full p-1.5`}>
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                <div className="flex space-x-2">
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(notification.timestamp)}
                  </span>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                      title="Mark as read"
                    >
                      <CheckIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
              {notification.action && (
                <div className="mt-2">
                  <a
                    href={notification.action.url}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    {notification.action.text} →
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
          <p className="mt-2 text-sm text-gray-700">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread ${unreadCount === 1 ? 'notification' : 'notifications'}`
              : 'You\'re all caught up!'}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {selectMode ? (
            <>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={markSelectedAsRead}
                disabled={selectedNotifications.size === 0}
              >
                <CheckIcon className="-ml-1 mr-2 h-4 w-4" />
                Mark as read
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={deleteSelected}
                disabled={selectedNotifications.size === 0}
              >
                <TrashIcon className="-ml-1 mr-2 h-4 w-4" />
                Delete
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => {
                  setSelectMode(false);
                  setSelectedNotifications(new Set());
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <div className="flex space-x-3">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => setSelectMode(true)}
              >
                Select
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={fetchNotifications}
              >
                <ArrowPathIcon className={`-ml-1 mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
            filter === 'all' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          type="button"
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
            filter === 'unread' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setFilter('unread')}
        >
          Unread
        </button>
        {Object.entries(notificationTypes).map(([type, { icon: Icon, iconColor }]) => (
          <button
            key={type}
            type="button"
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
              filter === type 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setFilter(type)}
          >
            <Icon className={`-ml-1 mr-1 h-4 w-4 ${iconColor}`} />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-md">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? 'You don\'t have any notifications yet.'
                : `No ${filter} notifications found.`}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {groupedNotifications.map((group, groupIndex) => (
              <Fragment key={groupIndex}>
                <li className="bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500">
                  {group.title}
                </li>
                {group.items.map((notification) => (
                  <li key={notification.id}>
                    <NotificationItem notification={notification} />
                  </li>
                ))}
              </Fragment>
            ))}
          </ul>
        )}
      </div>

      {/* Mark all as read button */}
      {!selectMode && unreadCount > 0 && (
        <div className="mt-4 text-right">
          <button
            type="button"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
            onClick={async () => {
              try {
                // In a real app, this would be an API call
                // await employeeService.markAllNotificationsAsRead();
                
                setNotifications(notifications.map(n => ({ ...n, read: true })));
                setUnreadCount(0);
                toast.success('All notifications marked as read');
              } catch (error) {
                console.error('Error marking all as read:', error);
                toast.error('Failed to mark all as read');
              }
            }}
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
