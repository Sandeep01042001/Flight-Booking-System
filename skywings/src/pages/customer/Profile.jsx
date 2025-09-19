import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  CalendarIcon, 
  PencilIcon, 
  CheckIcon, 
  XMarkIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/buttons/Button';
import Input from '../../components/ui/form/Input';
import Select from '../../components/ui/form/Select';
import Card from '../../components/common/Card';
import useAuth from '../../hooks/useAuth';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Profile form
  const profileForm = useFormik({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      dateOfBirth: user?.dateOfBirth?.split('T')[0] || '',
      gender: user?.gender || '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .required('Phone number is required'),
      address: Yup.string().required('Address is required'),
      dateOfBirth: Yup.date()
        .max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), 'You must be at least 18 years old')
        .required('Date of birth is required'),
      gender: Yup.string()
        .oneOf(['male', 'female', 'other', 'prefer-not-to-say'], 'Please select a valid gender')
        .required('Gender is required'),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        await updateProfile(values);
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } catch (error) {
        console.error('Update profile error:', error);
        toast.error(error.message || 'Failed to update profile');
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Password form
  const passwordForm = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Current password is required'),
      newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        )
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Please confirm your new password'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsLoading(true);
        await changePassword(values.currentPassword, values.newPassword);
        toast.success('Password changed successfully');
        resetForm();
        setIsEditingPassword(false);
      } catch (error) {
        console.error('Change password error:', error);
        toast.error(error.message || 'Failed to change password');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleCancelEdit = () => {
    profileForm.resetForm();
    setIsEditing(false);
  };

  const handleCancelPasswordEdit = () => {
    passwordForm.resetForm();
    setIsEditingPassword(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-indigo-700 px-6 py-8 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-indigo-700 text-2xl font-bold">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0) || ''}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-indigo-200">{user?.email}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Member
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              {!isEditing && (
                <Button
                  variant="outline"
                  className="bg-white text-indigo-700 hover:bg-indigo-50"
                  onClick={() => setIsEditing(true)}
                >
                  <PencilIcon className="-ml-1 mr-2 h-5 w-5" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Information</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {isEditing ? (
                <form onSubmit={profileForm.handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        label="First name"
                        value={profileForm.values.firstName}
                        onChange={profileForm.handleChange}
                        onBlur={profileForm.handleBlur}
                        error={profileForm.touched.firstName && profileForm.errors.firstName}
                        required
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        label="Last name"
                        value={profileForm.values.lastName}
                        onChange={profileForm.handleChange}
                        onBlur={profileForm.handleBlur}
                        error={profileForm.touched.lastName && profileForm.errors.lastName}
                        required
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        label="Email address"
                        value={profileForm.values.email}
                        onChange={profileForm.handleChange}
                        onBlur={profileForm.handleBlur}
                        error={profileForm.touched.email && profileForm.errors.email}
                        required
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        label="Phone number"
                        value={profileForm.values.phone}
                        onChange={profileForm.handleChange}
                        onBlur={profileForm.handleBlur}
                        error={profileForm.touched.phone && profileForm.errors.phone}
                        required
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        autoComplete="street-address"
                        label="Address"
                        value={profileForm.values.address}
                        onChange={profileForm.handleChange}
                        onBlur={profileForm.handleBlur}
                        error={profileForm.touched.address && profileForm.errors.address}
                        required
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        label="Date of birth"
                        value={profileForm.values.dateOfBirth}
                        onChange={profileForm.handleChange}
                        onBlur={profileForm.handleBlur}
                        error={profileForm.touched.dateOfBirth && profileForm.errors.dateOfBirth}
                        max={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <Select
                        id="gender"
                        name="gender"
                        label="Gender"
                        value={profileForm.values.gender}
                        onChange={profileForm.handleChange}
                        onBlur={profileForm.handleBlur}
                        error={profileForm.touched.gender && profileForm.errors.gender}
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!profileForm.isValid || isLoading}
                      loading={isLoading}
                    >
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <p className="text-sm font-medium text-gray-500">First Name</p>
                      <p className="mt-1 text-sm text-gray-900">{user?.firstName || 'Not provided'}</p>
                    </div>

                    <div className="sm:col-span-3">
                      <p className="text-sm font-medium text-gray-500">Last Name</p>
                      <p className="mt-1 text-sm text-gray-900">{user?.lastName || 'Not provided'}</p>
                    </div>

                    <div className="sm:col-span-4">
                      <p className="text-sm font-medium text-gray-500">Email Address</p>
                      <p className="mt-1 text-sm text-gray-900">{user?.email || 'Not provided'}</p>
                    </div>

                    <div className="sm:col-span-4">
                      <p className="text-sm font-medium text-gray-500">Phone Number</p>
                      <p className="mt-1 text-sm text-gray-900">{user?.phone || 'Not provided'}</p>
                    </div>

                    <div className="sm:col-span-6">
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="mt-1 text-sm text-gray-900">{user?.address || 'Not provided'}</p>
                    </div>

                    <div className="sm:col-span-3">
                      <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
                      </p>
                    </div>

                    <div className="sm:col-span-3">
                      <p className="text-sm font-medium text-gray-500">Gender</p>
                      <p className="mt-1 text-sm text-gray-900 capitalize">
                        {user?.gender?.replace(/-/g, ' ') || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Password Section */}
          <Card>
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Password</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {isEditingPassword ? (
                <form onSubmit={passwordForm.handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      autoComplete="current-password"
                      label="Current Password"
                      value={passwordForm.values.currentPassword}
                      onChange={passwordForm.handleChange}
                      onBlur={passwordForm.handleBlur}
                      error={passwordForm.touched.currentPassword && passwordForm.errors.currentPassword}
                      required
                    />

                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      autoComplete="new-password"
                      label="New Password"
                      value={passwordForm.values.newPassword}
                      onChange={passwordForm.handleChange}
                      onBlur={passwordForm.handleBlur}
                      error={passwordForm.touched.newPassword && passwordForm.errors.newPassword}
                      required
                    />

                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      label="Confirm New Password"
                      value={passwordForm.values.confirmPassword}
                      onChange={passwordForm.handleChange}
                      onBlur={passwordForm.handleBlur}
                      error={passwordForm.touched.confirmPassword && passwordForm.errors.confirmPassword}
                      required
                    />

                    <div className="text-sm text-gray-500">
                      <p>Password must be at least 8 characters long and include:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>At least one uppercase letter</li>
                        <li>At least one lowercase letter</li>
                        <li>At least one number</li>
                        <li>At least one special character (e.g., !@#$%^&*)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelPasswordEdit}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!passwordForm.isValid || isLoading}
                      loading={isLoading}
                    >
                      Update Password
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-100 text-gray-600">
                      <LockClosedIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Password</p>
                      <p className="text-sm text-gray-500">Last changed {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingPassword(true)}
                  >
                    Change Password
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Account Status */}
        <div className="space-y-6">
          <Card>
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Account Status</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Account Created</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(user?.createdAt || new Date()).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Membership Status</p>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Email Verification</p>
                  <div className="mt-1">
                    {user?.emailVerified ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    ) : (
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mr-2">
                          Pending
                        </span>
                        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                          Resend Verification
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Phone Verification</p>
                  <div className="mt-1">
                    {user?.phoneVerified ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    ) : (
                      <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        Verify Phone Number
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Preferences</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive updates and promotions</p>
                  </div>
                  <button
                    type="button"
                    className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    role="switch"
                    aria-checked="true"
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    ></span>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-500">Flight updates and alerts</p>
                  </div>
                  <button
                    type="button"
                    className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-indigo-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    role="switch"
                    aria-checked="false"
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5"
                    ></span>
                  </button>
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    Manage Notifications
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Your profile is 75% complete. <a href="#" className="font-medium text-yellow-700 underline">Complete your profile</a> to get the best experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
