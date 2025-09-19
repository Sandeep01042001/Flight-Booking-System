import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/buttons/Button';
import Input from '../../components/ui/form/Input';
import Select from '../../components/ui/form/Select';

const EmployeeRegister = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      employeeId: '',
      department: '',
      position: '',
      hireDate: new Date().toISOString().split('T')[0],
      role: 'employee',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .required('Phone number is required'),
      employeeId: Yup.string().required('Employee ID is required'),
      department: Yup.string().required('Department is required'),
      position: Yup.string().required('Position is required'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const { confirmPassword, ...employeeData } = values;
        await register({ ...employeeData, role: 'employee' });
        toast.success('Registration successful! Please login with your credentials.');
        navigate('/login');
      } catch (error) {
        console.error('Registration error:', error);
        toast.error(error.message || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  const departments = [
    'Flight Operations',
    'Cabin Crew',
    'Ground Staff',
    'Maintenance',
    'Customer Service',
    'Management',
  ];

  const positions = [
    'Pilot',
    'Co-Pilot',
    'Flight Attendant',
    'Cabin Crew',
    'Ground Staff',
    'Maintenance Engineer',
    'Customer Service Agent',
    'Supervisor',
    'Manager',
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Employee Registration
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
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
                  label="Last name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lastName && formik.errors.lastName}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email address"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && formik.errors.email}
                  required
                />
              </div>

              <div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && formik.errors.password}
                  required
                />
              </div>

              <div>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
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
                  id="employeeId"
                  name="employeeId"
                  type="text"
                  label="Employee ID"
                  value={formik.values.employeeId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.employeeId && formik.errors.employeeId}
                  required
                />
              </div>

              <div>
                <Select
                  id="department"
                  name="department"
                  label="Department"
                  value={formik.values.department}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.department && formik.errors.department}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Select
                  id="position"
                  name="position"
                  label="Position"
                  value={formik.values.position}
                  onChange={(e) => {
                    // Update role based on position
                    const position = e.target.value;
                    let role = 'employee';
                    
                    if (['Pilot', 'Co-Pilot', 'Flight Attendant', 'Cabin Crew'].includes(position)) {
                      role = position.toLowerCase().replace('-', '_');
                    }
                    
                    formik.setFieldValue('position', position);
                    formik.setFieldValue('role', role);
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.position && formik.errors.position}
                  required
                >
                  <option value="">Select Position</option>
                  {positions.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  label="Phone number"
                  placeholder="1234567890"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && formik.errors.phone}
                  required
                />
              </div>

              <div>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  label="Date of Birth"
                  value={formik.values.dateOfBirth}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <Select
                  id="gender"
                  name="gender"
                  label="Gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.gender && formik.errors.gender}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </Select>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeRegister;
