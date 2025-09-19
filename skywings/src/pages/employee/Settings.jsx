import React, { useState, useEffect } from 'react';
import { 
  Cog6ToothIcon, 
  LockClosedIcon, 
  BellIcon, 
  MoonIcon, 
  SunIcon, 
  DevicePhoneMobileIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Card, Button, Switch, Input, Select, Modal } from '../../components/ui';

export default function EmployeeSettings() {
  const [activeTab, setActiveTab] = useState('account');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      upcomingFlights: true,
      scheduleChanges: true,
      announcements: true,
      reminders: true,
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
      passwordLastChanged: '2024-01-15',
    },
    preferences: {
      theme: 'system',
      language: 'en-US',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
    },
    privacy: {
      profileVisibility: 'colleagues',
      showContactInfo: true,
      showCertifications: true,
    },
  });

  const [formData, setFormData] = useState({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // Simulate loading settings from API
    const fetchSettings = async () => {
      try {
        // const response = await fetch('/api/employee/settings');
        // const data = await response.json();
        // setSettings(data);
        // setFormData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setIsLoading(false);
      }
    };

    fetchSettings();
    
    // Check system preference for dark mode
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);
    
    const handleChange = (e) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener('change', handleChange);
    
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle nested settings
    const [section, field] = name.includes('.') ? name.split('.') : [null, name];
    
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call to save settings
      // await fetch('/api/employee/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      setSettings(formData);
      
      // Apply theme preference
      if (formData.preferences.theme === 'dark' || 
          (formData.preferences.theme === 'system' && isDarkMode)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Show success message
    } catch (error) {
      console.error('Error saving settings:', error);
      // Show error message
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    try {
      // Simulate API call to change password
      // await fetch('/api/employee/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     currentPassword: passwordData.currentPassword,
      //     newPassword: passwordData.newPassword
      //   })
      // });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordModal(false);
      
      // Show success message
    } catch (error) {
      console.error('Error changing password:', error);
      // Show error message
    }
  };

  const tabs = [
    { id: 'account', name: 'Account', icon: Cog6ToothIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: LockClosedIcon },
    { id: 'privacy', name: 'Privacy', icon: ShieldCheckIcon },
  ];

  const renderSettingSwitch = (label, description, name, section) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-200">
      <div className="flex-grow">
        <h4 className="text-sm font-medium text-gray-900">{label}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Switch
        name={section ? `${section}.${name}` : name}
        checked={section ? formData[section][name] : formData[name]}
        onChange={handleInputChange}
        className="ml-4 flex-shrink-0"
      />
    </div>
  );

  const renderSettingSelect = (label, name, options, section) => (
    <div className="py-4 border-b border-gray-200">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <Select
        name={section ? `${section}.${name}` : name}
        value={section ? formData[section][name] : formData[name]}
        onChange={handleInputChange}
        options={options}
        className="w-full max-w-xs"
      />
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5 inline-block mr-2 -mt-1" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pt-4">
        {activeTab === 'account' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Account Preferences</h3>
              
              {renderSettingSelect(
                'Theme',
                'theme',
                [
                  { value: 'system', label: 'System' },
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                ],
                'preferences'
              )}
              
              {renderSettingSelect(
                'Language',
                'language',
                [
                  { value: 'en-US', label: 'English (US)' },
                  { value: 'es-ES', label: 'Español' },
                  { value: 'fr-FR', label: 'Français' },
                  { value: 'de-DE', label: 'Deutsch' },
                  { value: 'ja-JP', label: '日本語' },
                ],
                'preferences'
              )}
              
              {renderSettingSelect(
                'Timezone',
                'timezone',
                [
                  { value: 'America/New_York', label: 'Eastern Time (ET)' },
                  { value: 'America/Chicago', label: 'Central Time (CT)' },
                  { value: 'America/Denver', label: 'Mountain Time (MT)' },
                  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                  { value: 'UTC', label: 'UTC' },
                ],
                'preferences'
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div>
                  {renderSettingSelect(
                    'Date Format',
                    'dateFormat',
                    [
                      { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                      { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                      { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                      { value: 'MMM D, YYYY', label: 'MMM D, YYYY' },
                    ],
                    'preferences'
                  )}
                </div>
                <div>
                  {renderSettingSelect(
                    'Time Format',
                    'timeFormat',
                    [
                      { value: '12h', label: '12-hour (2:30 PM)' },
                      { value: '24h', label: '24-hour (14:30)' },
                    ],
                    'preferences'
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h3>
              
              <div className="space-y-1">
                {renderSettingSwitch(
                  'Email Notifications',
                  'Receive notifications via email',
                  'email',
                  'notifications'
                )}
                
                {renderSettingSwitch(
                  'Push Notifications',
                  'Receive push notifications on your device',
                  'push',
                  'notifications'
                )}
                
                {renderSettingSwitch(
                  'SMS Notifications',
                  'Receive text message notifications',
                  'sms',
                  'notifications'
                )}
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Types</h3>
              
              <div className="space-y-1">
                {renderSettingSwitch(
                  'Upcoming Flights',
                  'Get reminders about your upcoming flights',
                  'upcomingFlights',
                  'notifications'
                )}
                
                {renderSettingSwitch(
                  'Schedule Changes',
                  'Be notified of any changes to your schedule',
                  'scheduleChanges',
                  'notifications'
                )}
                
                {renderSettingSwitch(
                  'Company Announcements',
                  'Receive important company-wide announcements',
                  'announcements',
                  'notifications'
                )}
                
                {renderSettingSwitch(
                  'Reminders',
                  'Get reminders for training, certifications, and more',
                  'reminders',
                  'notifications'
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Security</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Password</h4>
                    <p className="text-sm text-gray-500">
                      Last changed: {new Date(settings.security.passwordLastChanged).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowPasswordModal(true)}
                    variant="outline"
                    className="text-sm"
                  >
                    Change Password
                  </Button>
                </div>
                
                {renderSettingSwitch(
                  'Two-Factor Authentication',
                  'Add an extra layer of security to your account',
                  'twoFactorAuth',
                  'security'
                )}
                
                {renderSettingSwitch(
                  'Login Alerts',
                  'Get notified when someone logs into your account from a new device',
                  'loginAlerts',
                  'security'
                )}
                
                <div className="pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Active Sessions</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium">Chrome on Windows</p>
                          <p className="text-xs text-gray-500">New York, NY • Just now</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Current
                      </span>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium">Safari on iPhone</p>
                            <p className="text-xs text-gray-500">San Francisco, CA • 2 days ago</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs">
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Privacy Settings</h3>
              
              <div className="space-y-1">
                {renderSettingSelect(
                  'Profile Visibility',
                  'profileVisibility',
                  [
                    { value: 'public', label: 'Public' },
                    { value: 'colleagues', label: 'Colleagues Only' },
                    { value: 'private', label: 'Private' },
                  ],
                  'privacy'
                )}
                
                {renderSettingSwitch(
                  'Show Contact Information',
                  'Allow other employees to see your contact details',
                  'showContactInfo',
                  'privacy'
                )}
                
                {renderSettingSwitch(
                  'Show Certifications',
                  'Display your certifications on your profile',
                  'showCertifications',
                  'privacy'
                )}
              </div>
            </Card>
            
            <Card className="p-6 border border-red-200 bg-red-50">
              <h3 className="text-lg font-medium text-red-800 mb-3">Danger Zone</h3>
              <p className="text-sm text-red-700 mb-4">
                These actions are irreversible. Please proceed with caution.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Deactivate Account</h4>
                    <p className="text-sm text-red-700">
                      Temporarily deactivate your account. You can reactivate it later by logging in.
                    </p>
                  </div>
                  <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                    Deactivate
                  </Button>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-red-200">
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Delete Account</h4>
                    <p className="text-sm text-red-700">
                      Permanently delete your account and all associated data. This cannot be undone.
                    </p>
                  </div>
                  <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                    Delete Account
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <Input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <Input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              required
              minLength={8}
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 8 characters long
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <Input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              required
              className="w-full"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPasswordModal(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Update Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
