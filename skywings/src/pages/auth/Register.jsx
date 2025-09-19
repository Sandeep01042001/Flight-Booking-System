import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/buttons/Button';
import Input from '../../components/ui/form/Input';
import Select from '../../components/ui/form/Select';

// Role options for registration
const ROLE_OPTIONS = [
  { value: 'customer', label: 'Customer', icon: '👤' },
  { value: 'employee', label: 'Employee', icon: '👨‍✈️' },
  { value: 'airline', label: 'Airline Admin', icon: '✈️' },
];

// Employee position options
const EMPLOYEE_POSITIONS = [
  { value: 'pilot', label: 'Pilot' },
  { value: 'flight_attendant', label: 'Flight Attendant' },
  { value: 'ground_staff', label: 'Ground Staff' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'customer_service', label: 'Customer Service' },
  { value: 'other', label: 'Other' },
];

// Airline types
const AIRLINE_TYPES = [
  { value: 'commercial', label: 'Commercial Airline' },
  { value: 'cargo', label: 'Cargo Airline' },
  { value: 'charter', label: 'Charter Airline' },
  { value: 'regional', label: 'Regional Airline' },
];

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get role from URL query params or default to customer
  const searchParams = new URLSearchParams(location.search);
  const defaultRole = searchParams.get('role') || 'customer';
  
  const [userType, setUserType] = useState(defaultRole);

  const formik = useFormik({
    validateOnMount: true,
    enableReinitialize: true,
    initialValues: {
      // Common fields
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      acceptTerms: false,
      role: defaultRole,
      
      // Employee specific
      employeeId: '',
      position: '',
      hireDate: '',
      department: '',
      
      // Airline specific
      airlineName: '',
      airlineCode: '',
      airlineType: '',
      iataCode: '',
      icaoCode: '',
      
      // Address
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    },
    validationSchema: Yup.object().shape({
      // Common fields
      firstName: Yup.string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters'),
      lastName: Yup.string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required')
        .test('email-domain', 'Invalid email domain for selected role', function(value) {
          if (!value || !this.parent.role) return true;
          
          if (this.parent.role === 'employee' && !value.endsWith('@skywings.com')) {
            return this.createError({
              message: 'Employee email must be a SkyWings email'
            });
          }
          
          if (this.parent.role === 'airline' && !value.endsWith('@airline.com')) {
            return this.createError({
              message: 'Airline admin email must be an airline domain'
            });
          }
          
          return true;
        }),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        )
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
      phone: Yup.string()
        .matches(/^[0-9]{10,15}$/, 'Phone number must be between 10-15 digits')
        .required('Phone number is required'),
      dateOfBirth: Yup.date()
        .max(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000), 'You must be at least 18 years old')
        .required('Date of birth is required'),
      gender: Yup.string()
        .oneOf(['male', 'female', 'other', 'prefer-not-to-say'], 'Please select a valid gender')
        .required('Gender is required'),
      acceptTerms: Yup.boolean()
        .oneOf([true], 'You must accept the terms and conditions')
        .required('You must accept the terms and conditions'),
      role: Yup.string()
        .required('Role is required'),
      
      // Employee fields (conditionally required)
      employeeId: Yup.string().when('role', {
        is: 'employee',
        then: Yup.string().required('Employee ID is required'),
        otherwise: Yup.string()
      }),
      position: Yup.string().when('role', {
        is: 'employee',
        then: Yup.string().required('Position is required'),
        otherwise: Yup.string()
      }),
      hireDate: Yup.date().when('role', {
        is: 'employee',
        then: Yup.date()
          .required('Hire date is required')
          .max(new Date(), 'Hire date cannot be in the future'),
        otherwise: Yup.date()
      }),
      
      // Airline fields (conditionally required)
      airlineName: Yup.string().when('role', {
        is: 'airline',
        then: Yup.string()
          .required('Airline name is required')
          .min(2, 'Airline name must be at least 2 characters'),
        otherwise: Yup.string()
      }),
      airlineCode: Yup.string().when('role', {
        is: 'airline',
        then: Yup.string()
          .required('Airline code is required')
          .max(3, 'Airline code must be 2-3 characters'),
        otherwise: Yup.string()
      }),
      airlineType: Yup.string().when('role', {
        is: 'airline',
        then: Yup.string()
          .required('Airline type is required'),
        otherwise: Yup.string()
      }),
      iataCode: Yup.string().when('role', {
        is: 'airline',
        then: Yup.string()
          .required('IATA code is required')
          .length(2, 'IATA code must be exactly 2 characters')
          .matches(/^[A-Z0-9]+$/, 'IATA code must be alphanumeric and uppercase'),
        otherwise: Yup.string()
      }),
      icaoCode: Yup.string().when('role', {
        is: 'airline',
        then: Yup.string()
          .required('ICAO code is required')
          .length(3, 'ICAO code must be exactly 3 characters')
          .matches(/^[A-Z0-9]+$/, 'ICAO code must be alphanumeric and uppercase'),
        otherwise: Yup.string()
      })
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setLoading(true);
        
        // Prepare user data based on role
        const { confirmPassword, acceptTerms, ...userData } = values;
        userData.role = userType; // Explicitly set the role from state
        
        // Add role-specific data
        if (userType === 'employee') {
          userData.employeeDetails = {
            employeeId: values.employeeId,
            position: values.position,
            hireDate: values.hireDate,
            department: values.department
          };
        } else if (userType === 'airline') {
          // Ensure all required airline fields are present
          if (!values.airlineName || !values.airlineCode || !values.airlineType || !values.iataCode || !values.icaoCode) {
            throw new Error('Please fill in all required airline information');
          }
          
          userData.airlineDetails = {
            name: values.airlineName,
            code: values.airlineCode,
            type: values.airlineType,
            iataCode: values.iataCode,
            icaoCode: values.icaoCode
          };
        }
        
        // Add address
        userData.address = {
          street: values.address,
          city: values.city,
          state: values.state,
          country: values.country,
          postalCode: values.postalCode
        };
        
        // Set the role
        userData.role = userType;
        
        // Call register API
        const result = await register(userData);
        
        // Handle the response based on user type and registration result
        if (userType === 'airline') {
          if (result.requiresApproval) {
            toast.success('Registration submitted for approval. You will receive an email once your account is approved.');
            navigate('/login', { 
              state: { 
                message: 'Registration submitted for approval. You will receive an email once your account is approved.'
              } 
            });
          } else {
            // This case should not normally happen for airline registration
            toast.success('Registration successful! You can now log in.');
            navigate('/login', { 
              state: { 
                message: 'Registration successful! Please log in to continue.'
              } 
            });
          }
        } else {
          const successMessage = userType === 'customer' 
            ? 'Registration successful! Please check your email to verify your account.' 
            : 'Your account is pending approval.';
            
          toast.success(successMessage);
          
          // Redirect based on user type
          const redirectPath = userType === 'customer' ? '/login' : `/${userType}/login`;
          navigate(redirectPath, { 
            state: { 
              message: successMessage 
            } 
          });
        }
        
      } catch (error) {
        console.error('Registration error:', error);
        toast.error(error.message || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  // Handle role change
  const handleRoleChange = (role) => {
    setUserType(role);
    formik.setFieldValue('role', role);
    // Reset role-specific fields when changing roles
    if (role === 'employee') {
      formik.setValues({
        ...formik.values,
        employeeId: '',
        position: '',
        hireDate: '',
        department: '',
        role: 'employee'
      });
    } else if (role === 'airline') {
      formik.setValues({
        ...formik.values,
        airlineName: '',
        airlineCode: '',
        airlineType: '',
        iataCode: '',
        icaoCode: '',
        role: 'airline'
      });
    } else {
      formik.setFieldValue('role', 'customer');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Create your {userType} account
          </h2>
          
          {/* Role Selection */}
          <div className="mt-6">
            <div className="flex rounded-md shadow-sm">
              {ROLE_OPTIONS.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => handleRoleChange(role.value)}
                  className={`flex-1 py-2 px-4 border ${
                    userType === role.value 
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  } text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  <span className="text-lg mr-2">{role.icon}</span>
                  {role.label}
                </button>
              ))}
            </div>
          </div>
          
          <form className="space-y-6 mt-6" onSubmit={formik.handleSubmit}>
            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  label="First name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.firstName && formik.errors.firstName}
                  required
                />
              </div>
              
              <div>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  label="Last name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lastName && formik.errors.lastName}
                  required
                />
              </div>
              
              <div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  label="Email address"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && formik.errors.email}
                  required
                  placeholder={
                    userType === 'employee' 
                      ? 'user@skywings.com' 
                      : userType === 'airline' 
                        ? 'user@airline.com' 
                        : 'user@example.com'
                  }
                />
              </div>
              
              <div>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  label="Phone number"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && formik.errors.phone}
                  required
                  placeholder="1234567890"
                />
              </div>
              
              <div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  label="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && formik.errors.password}
                  required
                  helpText="At least 8 characters with uppercase, lowercase, number, and special character"
                />
              </div>
              
              <div>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  label="Confirm password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  required
                />
              </div>
              
              <div>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  label="Date of birth"
                  value={formik.values.dateOfBirth}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                    formik.touched.gender && formik.errors.gender
                      ? 'border-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                  } rounded-md`}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                {formik.touched.gender && formik.errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.gender}</p>
                )}
              </div>
            </div>
            
            {/* Role-Specific Fields */}
            {userType === 'employee' && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Employee Information</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <Input
                      id="employeeId"
                      name="employeeId"
                      type="text"
                      label="Employee ID"
                      value={formik.values.employeeId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.employeeId && formik.errors.employeeId}
                      required
                      placeholder="EMP-12345"
                    />
                  </div>
                  
                  <div>
                    <Select
                      id="position"
                      name="position"
                      label="Position"
                      value={formik.values.position}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.position && formik.errors.position}
                      required
                    >
                      <option value="">Select position</option>
                      {EMPLOYEE_POSITIONS.map((pos) => (
                        <option key={pos.value} value={pos.value}>
                          {pos.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  
                  <div>
                    <Input
                      id="hireDate"
                      name="hireDate"
                      type="date"
                      label="Hire date"
                      value={formik.values.hireDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.hireDate && formik.errors.hireDate}
                      required
                    />
                  </div>
                  
                  <div>
                    <Input
                      id="department"
                      name="department"
                      type="text"
                      label="Department"
                      value={formik.values.department}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.department && formik.errors.department}
                      placeholder="e.g., Flight Operations, Customer Service"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {userType === 'airline' && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Airline Information</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Input
                      id="airlineName"
                      name="airlineName"
                      type="text"
                      label="Airline Name"
                      value={formik.values.airlineName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.airlineName && formik.errors.airlineName}
                      required
                      placeholder="e.g., SkyWings Airlines"
                    />
                  </div>
                  
                  <div>
                    <Input
                      id="airlineCode"
                      name="airlineCode"
                      type="text"
                      label="Airline Code"
                      value={formik.values.airlineCode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.airlineCode && formik.errors.airlineCode}
                      required
                      placeholder="e.g., SW"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="airlineType" className="block text-sm font-medium text-gray-700 mb-1">
                      Airline Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="airlineType"
                      name="airlineType"
                      value={formik.values.airlineType || ''}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                        formik.touched.airlineType && formik.errors.airlineType
                          ? 'border-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                      } rounded-md`}
                      required
                    >
                      <option value="">Select airline type</option>
                      {AIRLINE_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {formik.touched.airlineType && formik.errors.airlineType && (
                      <p className="mt-1 text-sm text-red-600">{formik.errors.airlineType}</p>
                    )}
                  </div>
                  
                  <div>
                    <Input
                      id="iataCode"
                      name="iataCode"
                      type="text"
                      label="IATA Code"
                      value={formik.values.iataCode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.iataCode && formik.errors.iataCode}
                      required
                      placeholder="e.g., SW"
                      maxLength={2}
                      className="uppercase"
                    />
                  </div>
                  
                  <div>
                    <Input
                      id="icaoCode"
                      name="icaoCode"
                      type="text"
                      label="ICAO Code"
                      value={formik.values.icaoCode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.icaoCode && formik.errors.icaoCode}
                      required
                      placeholder="e.g., SWG"
                      maxLength={3}
                      className="uppercase"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Address Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    autoComplete="street-address"
                    label="Street address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.address && formik.errors.address}
                    required
                  />
                </div>
                
                <div>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="address-level2"
                    label="City"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.city && formik.errors.city}
                    required
                  />
                </div>
                
                <div>
                  <Input
                    id="state"
                    name="state"
                    type="text"
                    autoComplete="address-level1"
                    label="State / Province"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.state && formik.errors.state}
                    required
                  />
                </div>
                
                <div>
                  <Input
                    id="country"
                    name="country"
                    type="text"
                    autoComplete="country-name"
                    label="Country"
                    value={formik.values.country}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.country && formik.errors.country}
                    required
                  />
                </div>
                
                <div>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    autoComplete="postal-code"
                    label="ZIP / Postal code"
                    value={formik.values.postalCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.postalCode && formik.errors.postalCode}
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Terms and Conditions */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={formik.values.acceptTerms}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="acceptTerms" className="font-medium text-gray-700">
                    I agree to the{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">
                      Privacy Policy
                    </a>
                  </label>
                  <p className="text-gray-500">
                    By creating an account, you agree to our terms and conditions.
                  </p>
                  {formik.touched.acceptTerms && formik.errors.acceptTerms && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.acceptTerms}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${!formik.isValid || loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                loading={loading}
                disabled={!formik.isValid || loading}
              >
                {loading ? 'Creating Account...' : `Sign up as ${userType === 'customer' ? 'Customer' : userType === 'employee' ? 'Employee' : 'Airline Admin'}`}
              </Button>
              
              <p className="mt-3 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  to={userType === 'customer' ? '/login' : `/${userType}/login`} 
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
