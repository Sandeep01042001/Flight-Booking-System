import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppProvider, useApp } from './context/AppContext';
import Loader from './components/common/Loader';
import ErrorBoundary from './components/common/ErrorBoundary';
import ToastHandler from './components/common/ToastHandler';

// Layouts
const MainLayout = lazy(() => import('./layouts/MainLayout'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AirlineLayout = lazy(() => import('./layouts/AirlineLayout'));

// Public Pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const FlightSearch = lazy(() => import('./pages/flight/FlightSearch'));
const FlightDetails = lazy(() => import('./pages/flight/FlightDetails'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const BookingConfirmation = lazy(() => import('./pages/booking/BookingConfirmation'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const EmployeeRegister = lazy(() => import('./pages/auth/EmployeeRegister'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const Error404 = lazy(() => import('./pages/Error404'));

// Customer Pages
const CustomerDashboard = lazy(() => import('./pages/customer/Dashboard'));
const CustomerBookings = lazy(() => import('./pages/customer/Bookings'));
const CustomerProfile = lazy(() => import('./pages/customer/Profile'));
const CustomerNotifications = lazy(() => import('./pages/customer/Notifications'));
const CustomerPaymentMethods = lazy(() => import('./pages/customer/PaymentMethods'));
// Booking Pages (public / semi-protected)
const SeatSelection = lazy(() => import('./pages/SeatSelection'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminFlights = lazy(() => import('./pages/admin/Flights'));
const AdminBookings = lazy(() => import('./pages/admin/Bookings'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminAirlines = lazy(() => import('./pages/admin/Airlines'));
const AdminAirports = lazy(() => import('./pages/admin/Airports'));
const AdminReports = lazy(() => import('./pages/admin/Reports'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));

// Airline Pages
const AirlineHome = lazy(() => import('./pages/airline/AirlineHome'));
const AirlineDashboard = lazy(() => import('./pages/airline/AirlineDashboard'));
const AirlineFlights = lazy(() => import('./pages/airline/ManageFlights'));
const AirlineAircrafts = lazy(() => import('./pages/airline/ManageAircrafts'));
const AirlineEmployees = lazy(() => import('./pages/airline/ManageEmployees'));
const AirlineSchedule = lazy(() => import('./pages/airline/ManageSchedule'));
const AirlineReports = lazy(() => import('./pages/airline/Reports'));
const AirlineSettings = lazy(() => import('./pages/airline/Settings'));

// Employee Pages
const EmployeeHome = lazy(() => import('./pages/employee/EmployeeHome'));
const EmployeeDashboard = lazy(() => import('./pages/employee/EmployeeDashboard'));
const EmployeeFlights = lazy(() => import('./pages/employee/FlightAssignments'));
const EmployeeSchedule = lazy(() => import('./pages/employee/EmployeeSchedule'));
const EmployeeNotifications = lazy(() => import('./pages/employee/Notifications'));
const EmployeeProfile = lazy(() => import('./pages/employee/Profile'));
const EmployeeSettings = lazy(() => import('./pages/employee/Settings'));

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading, isAdmin, isEmployee } = useApp();
  
  if (loading) {
    return <Loader fullScreen />;
  }

  if (!isAuthenticated) {
    // Store the intended URL before redirecting to login
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  // Handle role-based access
  if (requiredRole) {
    // If requiredRole is an array, check if user's role is in the array
    if (Array.isArray(requiredRole)) {
      if (!requiredRole.includes(user.role)) {
        toast.error('You do not have permission to access this page');
        // Redirect to appropriate dashboard based on user role
        return <Navigate to={getDashboardPath(user.role)} replace />;
      }
    } 
    // If requiredRole is a string, check for exact match
    else if (user.role !== requiredRole) {
      toast.error('You do not have permission to access this page');
      return <Navigate to={getDashboardPath(user.role)} replace />;
    }
  }
  
  // Helper function to get dashboard path based on role
  function getDashboardPath(role) {
    switch(role) {
      case 'admin':
        return '/admin/dashboard';
      case 'employee':
      case 'pilot':
      case 'flight_attendant':
      case 'crew':
        return '/employee';
      case 'customer':
        return '/dashboard';
      default:
        return '/';
    }
  }

  return children;
};

// Main App Component
function App() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <div className="App">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <ToastHandler />
          
          <Suspense fallback={<Loader fullScreen />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="flights" element={<FlightSearch />} />
              <Route path="flights/:id" element={<FlightDetails />} />
              <Route 
                path="flights/:id/seats" 
                element={
                  <ProtectedRoute requiredRole="customer">
                    <SeatSelection />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="payment" 
                element={
                  <ProtectedRoute requiredRole="customer">
                    <PaymentPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="booking/confirmation/:id" element={<BookingConfirmation />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="employee/register" element={<EmployeeRegister />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password/:token" element={<ResetPassword />} />
              
              {/* Customer Routes */}
              <Route 
                path="dashboard" 
                element={
                  <ProtectedRoute requiredRole="customer">
                    <CustomerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="my-bookings" 
                element={
                  <ProtectedRoute>
                    <CustomerBookings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="profile" 
                element={
                  <ProtectedRoute>
                    <CustomerProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="notifications" 
                element={
                  <ProtectedRoute requiredRole="customer">
                    <CustomerNotifications />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="payment-methods" 
                element={
                  <ProtectedRoute requiredRole="customer">
                    <CustomerPaymentMethods />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="airline-dashboard" 
                element={
                  <ProtectedRoute requiredRole="airline">
                    <AirlineHome />
                  </ProtectedRoute>
                } 
              />
              {/* 404 Route */}
              <Route path="*" element={<Error404 />} />
            </Route>
            
            {/* Airline Admin Routes */}
            <Route 
              path="airline" 
              element={
                <ProtectedRoute requiredRole="airline">
                  <AirlineLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AirlineHome />} />
              <Route path="dashboard" element={<AirlineDashboard />} />
              <Route path="flights" element={<AirlineFlights />} />
              <Route path="aircrafts" element={<AirlineAircrafts />} />
              <Route path="employees" element={<AirlineEmployees />} />
              <Route path="schedule" element={<AirlineSchedule />} />
              <Route path="reports" element={<AirlineReports />} />
              <Route path="settings" element={<AirlineSettings />} />
              <Route path="*" element={<Navigate to="/airline" replace />} />
            </Route>
            
            {/* Admin Routes */}
            <Route 
              path="admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="flights" element={<AdminFlights />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="airlines" element={<AdminAirlines />} />
              <Route path="airports" element={<AdminAirports />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Airline Routes */}
            <Route 
              path="airline" 
              element={
                <ProtectedRoute requiredRole="airline">
                  <AdminLayout type="airline" />
                </ProtectedRoute>
              }
            >
              <Route 
                index
                element={
                  <Navigate to="/airline/dashboard" replace />
                }
              />
              <Route 
                path="dashboard" 
                element={
                  <ProtectedRoute requiredRole="airline">
                    <AirlineHome />
                  </ProtectedRoute>
                } 
              />
              <Route path="flights" element={<AirlineFlights />} />
              <Route path="aircrafts" element={<AirlineAircrafts />} />
              <Route path="employees" element={<AirlineEmployees />} />
              <Route path="schedule" element={<AirlineSchedule />} />
              <Route path="reports" element={<AirlineReports />} />
              <Route path="settings" element={<AirlineSettings />} />
            </Route>

            {/* Employee Routes */}
            <Route 
              path="employee" 
              element={
                <ProtectedRoute requiredRole={['employee', 'pilot', 'flight_attendant', 'crew']}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<EmployeeHome />} />
              <Route path="dashboard" element={<EmployeeHome />} />
              <Route path="flights" element={<EmployeeFlights />} />
              <Route path="schedule" element={<EmployeeSchedule />} />
              <Route path="notifications" element={<EmployeeNotifications />} />
              <Route path="profile" element={<EmployeeProfile />} />
              <Route path="settings" element={<EmployeeSettings />} />
            </Route>
          </Routes>
          </Suspense>
        </div>
      </ErrorBoundary>
    </AppProvider>
  );
}

export default App;
