import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { showSuccess, showError } from '../../components/common/ToastHandler';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/buttons/Button';
import Input from '../../components/ui/form/Input';

// Role options for the login form
const ROLE_OPTIONS = [
  { value: 'customer', label: 'Customer', icon: '👤' },
  { value: 'employee', label: 'Employee', icon: '👨‍✈️' },
  { value: 'airline', label: 'Airline Admin', icon: '✈️' },
];

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [selectedRole, setSelectedRole] = useState('customer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
      role: 'customer',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const { email, password } = values;
        
        // useAuth handles role-based redirection (admin/airline/employee/customer)
        const result = await login(email, password);
        
        if (result.success) {
          showSuccess('Login successful!');
          const role = result.user?.role;
          if (role === 'airline') {
            navigate('/airline/dashboard', { replace: true });
          } else if (role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
          } else if (['employee', 'pilot', 'flight_attendant', 'crew'].includes(role)) {
            navigate('/employee', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        } else {
          showError(result.message || 'Login failed. Please check your credentials.');
        }
      } catch (error) {
        console.error('Login error:', error);
        showError('An error occurred during login. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    formik.setFieldValue('role', role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your {selectedRole} account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Role Selection */}
        <div className="mt-6">
          <div className="flex rounded-md shadow-sm">
            {ROLE_OPTIONS.map((role) => (
              <button
                key={role.value}
                type="button"
                onClick={() => handleRoleChange(role.value)}
                className={`flex-1 py-2 px-4 border ${
                  selectedRole === role.value 
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
        
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                label="Email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && formik.errors.email}
              />
            </div>
            <div className="mb-4">
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                label="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && formik.errors.password}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Sign in
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign in with Google</span>
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
              </svg>
            </button>

            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Sign in with Microsoft</span>
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 21 21">
                <path d="M11.5 10.5h-10V21h10v-10.5zM21 10.5h-10V21h10v-10.5zM11.5 0h-10v10.5h10V0zM21 0h-10v10.5h10V0z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>
            Don't have an account?{' '}
            <Link
              to={
                selectedRole === 'customer' 
                  ? '/register' 
                  : selectedRole === 'employee' 
                    ? '/employee/register' 
                    : '/airline/register'
              }
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Create {selectedRole === 'customer' ? 'customer' : selectedRole === 'employee' ? 'employee' : 'airline admin'} account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
