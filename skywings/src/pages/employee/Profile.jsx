import React, { useState, useEffect } from 'react';
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  IdentificationIcon, 
  BriefcaseIcon, 
  CalendarIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  MapPinIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Card, Button, Input, Select } from '../../components/ui';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Pilot',
    email: 'john.pilot@skywings.com',
    phone: '+1 (555) 123-4567',
    employeeId: 'EMP-78901',
    position: 'Senior Captain',
    department: 'Flight Operations',
    hireDate: '2020-06-15',
    address: '123 Aviation Way, Apt 4B',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States',
    emergencyContact: {
      name: 'Sarah Johnson',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543'
    },
    certifications: [
      { id: 1, name: 'ATP License', expiryDate: '2025-12-31' },
      { id: 2, name: 'First Aid', expiryDate: '2024-06-30' },
      { id: 3, name: 'CRM', expiryDate: '2024-12-31' }
    ]
  });

  const [formData, setFormData] = useState({ ...profile });

  useEffect(() => {
    // Simulate API call to fetch profile data
    const fetchProfile = async () => {
      try {
        // const response = await fetch('/api/employee/profile');
        // const data = await response.json();
        // setProfile(data);
        // setFormData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested emergencyContact fields
    if (name.startsWith('emergencyContact.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Simulate API call to save profile
    setIsLoading(true);
    
    setTimeout(() => {
      setProfile(formData);
      setIsEditing(false);
      setIsLoading(false);
      // Show success message
    }, 1000);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderField = (label, value, Icon, name, type = 'text', options = null) => {
    if (isEditing) {
      if (type === 'select' && options) {
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <Select
              name={name}
              value={formData[name]}
              onChange={handleInputChange}
              options={options}
              className="w-full"
            />
          </div>
        );
      }
      
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <Input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
      );
    }

    return (
      <div className="flex items-start mb-4">
        <div className="flex-shrink-0 h-6 w-6 text-gray-400">
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-sm text-gray-900">{value || 'Not provided'}</p>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and update your personal and professional information
          </p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="mt-4 md:mt-0"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <XMarkIcon className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <UserCircleIcon className="h-6 w-6 text-gray-400 mr-2" />
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField('First Name', profile.firstName, UserCircleIcon, 'firstName')}
              {renderField('Last Name', profile.lastName, UserCircleIcon, 'lastName')}
              {renderField('Email', profile.email, EnvelopeIcon, 'email', 'email')}
              {renderField('Phone', profile.phone, PhoneIcon, 'phone', 'tel')}
              {renderField('Employee ID', profile.employeeId, IdentificationIcon, 'employeeId')}
              {renderField('Position', profile.position, BriefcaseIcon, 'position')}
              {renderField('Department', profile.department, BriefcaseIcon, 'department', 'select', [
                { value: 'Flight Operations', label: 'Flight Operations' },
                { value: 'Cabin Crew', label: 'Cabin Crew' },
                { value: 'Maintenance', label: 'Maintenance' },
                { value: 'Ground Staff', label: 'Ground Staff' },
                { value: 'Management', label: 'Management' },
              ])}
              {renderField('Hire Date', formatDate(profile.hireDate), CalendarIcon, 'hireDate', 'date')}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <MapPinIcon className="h-6 w-6 text-gray-400 mr-2" />
              Address
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField('Address', profile.address, MapPinIcon, 'address')}
              {renderField('City', profile.city, MapPinIcon, 'city')}
              {renderField('State/Province', profile.state, MapPinIcon, 'state')}
              {renderField('Postal Code', profile.postalCode, MapPinIcon, 'postalCode')}
              {renderField('Country', profile.country, MapPinIcon, 'country', 'select', [
                { value: 'United States', label: 'United States' },
                { value: 'Canada', label: 'Canada' },
                { value: 'United Kingdom', label: 'United Kingdom' },
                { value: 'Australia', label: 'Australia' },
                { value: 'Other', label: 'Other' },
              ])}
            </div>
          </Card>
        </div>

        {/* Right Column - Emergency Contact & Certifications */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Emergency Contact
            </h2>
            
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <Input
                      type="text"
                      name="emergencyContact.name"
                      value={formData.emergencyContact.name}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                    <Input
                      type="text"
                      name="emergencyContact.relationship"
                      value={formData.emergencyContact.relationship}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <Input
                      type="tel"
                      name="emergencyContact.phone"
                      value={formData.emergencyContact.phone}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-gray-400">
                      <UserCircleIcon className="h-6 w-6" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="text-sm text-gray-900">{profile.emergencyContact.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-gray-400">
                      <UserCircleIcon className="h-6 w-6" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Relationship</p>
                      <p className="text-sm text-gray-900">{profile.emergencyContact.relationship}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 text-gray-400">
                      <PhoneIcon className="h-6 w-6" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-sm text-gray-900">{profile.emergencyContact.phone}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Certifications
            </h2>
            
            <div className="space-y-4">
              {profile.certifications.map((cert) => (
                <div key={cert.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{cert.name}</h4>
                      <p className="text-sm text-gray-500">
                        Expires: {formatDate(cert.expiryDate)}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  {new Date(cert.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) && (
                    <p className="mt-1 text-xs text-yellow-600">
                      Expiring soon. Please renew.
                    </p>
                  )}
                </div>
              ))}
              
              <Button
                variant="outline"
                className="w-full mt-4 border-dashed border-gray-300 text-gray-600 hover:bg-gray-50"
                onClick={() => {
                  // Handle add new certification
                }}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
