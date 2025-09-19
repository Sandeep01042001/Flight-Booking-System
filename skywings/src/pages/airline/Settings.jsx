import React, { useState, useEffect } from 'react';
import { 
  Cog6ToothIcon, 
  BuildingOfficeIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Card, Button, Modal, Input, Select, Textarea, Switch } from '../../components/ui';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    airlineName: 'SkyWings Airlines',
    iataCode: 'SW',
    icaoCode: 'SWA',
    contactEmail: 'contact@skywings.com',
    phoneNumber: '+1 (555) 123-4567',
    website: 'https://skywings.com',
    address: '123 Aviation Way, Suite 100',
    city: 'New York',
    state: 'NY',
    country: 'United States',
    postalCode: '10001',
    timezone: 'America/New_York',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    notifications: {
      email: true,
      sms: true,
      push: false,
    },
    maintenanceMode: false,
    locations: [
      { id: 1, code: 'JFK', name: 'John F. Kennedy International Airport', isPrimary: true },
      { id: 2, code: 'LAX', name: 'Los Angeles International Airport', isPrimary: false },
      { id: 3, code: 'ORD', name: "O'Hare International Airport", isPrimary: false },
    ]
  });

  const [formData, setFormData] = useState({ ...settings });
  const [editingLocation, setEditingLocation] = useState(null);

  useEffect(() => {
    // In a real app, you would fetch settings from an API
    // fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // If the checkbox is for notifications, update nested object
      if (['email', 'sms', 'push'].includes(name)) {
        setFormData(prev => ({
          ...prev,
          notifications: {
            ...prev.notifications,
            [name]: checked
          }
        }));
      } else {
        // Otherwise treat it as a top-level boolean (e.g., maintenanceMode)
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSettings(formData);
      setIsSaving(false);
      // Show success message
    }, 1000);
  };

  const handleAddLocation = (location) => {
    const newLocation = {
      ...location,
      id: settings.locations.length + 1,
      isPrimary: settings.locations.length === 0 // First location is primary by default
    };
    
    setSettings(prev => ({
      ...prev,
      locations: [...prev.locations, newLocation]
    }));
    
    setShowModal(false);
    setEditingLocation(null);
  };

  const handleUpdateLocation = (updatedLocation) => {
    setSettings(prev => ({
      ...prev,
      locations: prev.locations.map(loc => 
        loc.id === updatedLocation.id ? updatedLocation : loc
      )
    }));
    
    setShowModal(false);
    setEditingLocation(null);
  };

  const handleDeleteLocation = (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      setSettings(prev => ({
        ...prev,
        locations: prev.locations.filter(loc => loc.id !== id)
      }));
    }
  };

  const setAsPrimary = (id) => {
    setSettings(prev => ({
      ...prev,
      locations: prev.locations.map(loc => ({
        ...loc,
        isPrimary: loc.id === id
      }))
    }));
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
    { id: 'locations', name: 'Locations', icon: MapPinIcon },
    { id: 'notifications', name: 'Notifications', icon: EnvelopeIcon },
  ];

  const LocationForm = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState(initialData || {
      code: '',
      name: '',
      address: '',
      isPrimary: false
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Airport Code (IATA)</label>
            <Input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
              placeholder="e.g., JFK"
              required
              maxLength="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., John F. Kennedy International Airport"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <Textarea
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            rows={3}
            placeholder="Full address of the location"
          />
        </div>
        
        {!initialData?.isPrimary && (
          <div className="flex items-center">
            <Switch
              id="isPrimary"
              checked={formData.isPrimary}
              onChange={(e) => setFormData({...formData, isPrimary: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="isPrimary" className="text-sm text-gray-700">
              Set as primary location
            </label>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {initialData ? 'Update' : 'Add'} Location
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Airline Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your airline's settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
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
        {activeTab === 'general' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Airline Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Airline Name</label>
                  <Input
                    type="text"
                    name="airlineName"
                    value={formData.airlineName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IATA Code</label>
                    <Input
                      type="text"
                      name="iataCode"
                      value={formData.iataCode}
                      onChange={handleInputChange}
                      maxLength="2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ICAO Code</label>
                    <Input
                      type="text"
                      name="icaoCode"
                      value={formData.icaoCode}
                      onChange={handleInputChange}
                      maxLength="3"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <Input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <Input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <Input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Address</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                    <Input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <Input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <Select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    options={[
                      { value: 'United States', label: 'United States' },
                      { value: 'Canada', label: 'Canada' },
                      { value: 'United Kingdom', label: 'United Kingdom' },
                      { value: 'Australia', label: 'Australia' },
                      { value: 'Germany', label: 'Germany' },
                      { value: 'France', label: 'France' },
                      { value: 'Japan', label: 'Japan' },
                      { value: 'China', label: 'China' },
                      { value: 'India', label: 'India' },
                      { value: 'Brazil', label: 'Brazil' },
                    ]}
                    required
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Preferences</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                  <Select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    options={[
                      { value: 'America/New_York', label: 'Eastern Time (ET)' },
                      { value: 'America/Chicago', label: 'Central Time (CT)' },
                      { value: 'America/Denver', label: 'Mountain Time (MT)' },
                      { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                      { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
                      { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
                      { value: 'UTC', label: 'UTC' },
                      { value: 'Europe/London', label: 'London (GMT)' },
                      { value: 'Europe/Paris', label: 'Paris (CET)' },
                      { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
                    ]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <Select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    options={[
                      { value: 'USD', label: 'US Dollar (USD)' },
                      { value: 'EUR', label: 'Euro (EUR)' },
                      { value: 'GBP', label: 'British Pound (GBP)' },
                      { value: 'JPY', label: 'Japanese Yen (JPY)' },
                      { value: 'CAD', label: 'Canadian Dollar (CAD)' },
                      { value: 'AUD', label: 'Australian Dollar (AUD)' },
                      { value: 'CNY', label: 'Chinese Yuan (CNY)' },
                      { value: 'INR', label: 'Indian Rupee (INR)' },
                      { value: 'BRL', label: 'Brazilian Real (BRL)' },
                    ]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                  <Select
                    name="dateFormat"
                    value={formData.dateFormat}
                    onChange={handleInputChange}
                    options={[
                      { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                      { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                      { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                      { value: 'MM-DD-YYYY', label: 'MM-DD-YYYY' },
                      { value: 'DD MMM YYYY', label: 'DD MMM YYYY' },
                    ]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Format</label>
                  <div className="space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="timeFormat"
                        value="12h"
                        checked={formData.timeFormat === '12h'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">12-hour (2:30 PM)</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="timeFormat"
                        value="24h"
                        checked={formData.timeFormat === '24h'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">24-hour (14:30)</span>
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}

        {activeTab === 'locations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Airport Locations</h3>
              <Button
                onClick={() => {
                  setEditingLocation(null);
                  setShowModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </div>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {settings.locations.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                          No locations found. Add your first location to get started.
                        </td>
                      </tr>
                    ) : (
                      settings.locations.map((location) => (
                        <tr key={location.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {location.code}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {location.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {location.isPrimary ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Primary
                              </span>
                            ) : (
                              <button
                                onClick={() => setAsPrimary(location.id)}
                                className="text-xs text-blue-600 hover:text-blue-900"
                              >
                                Set as Primary
                              </button>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => {
                                setEditingLocation(location);
                                setShowModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                              title="Edit"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            {!location.isPrimary && (
                              <button
                                onClick={() => handleDeleteLocation(location.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'notifications' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    name="email"
                    checked={formData.notifications.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
                    <p className="text-sm text-gray-500">Receive notifications via text message</p>
                  </div>
                  <Switch
                    name="sms"
                    checked={formData.notifications.sms}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                    <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                  </div>
                  <Switch
                    name="push"
                    checked={formData.notifications.push}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">System Status</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Maintenance Mode</h4>
                  <p className="text-sm text-gray-500">
                    When enabled, only administrators can access the system
                  </p>
                </div>
                <Switch
                  name="maintenanceMode"
                  checked={formData.maintenanceMode}
                  onChange={handleInputChange}
                />
              </div>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Add/Edit Location Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingLocation(null);
        }}
        title={`${editingLocation ? 'Edit' : 'Add'} Location`}
      >
        <LocationForm
          initialData={editingLocation}
          onSave={editingLocation ? handleUpdateLocation : handleAddLocation}
          onCancel={() => {
            setShowModal(false);
            setEditingLocation(null);
          }}
        />
      </Modal>
    </div>
  );
}
