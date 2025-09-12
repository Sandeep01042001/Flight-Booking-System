import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';

// Layouts
import MainLayout from './layouts/MainLayout';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Flights = lazy(() => import('./pages/flights/Flights'));
const FlightDetails = lazy(() => import('./pages/flights/FlightDetails'));
const Booking = lazy(() => import('./pages/booking/Booking'));
const BookingHistory = lazy(() => import('./pages/booking/BookingHistory'));
const BookingConfirmation = lazy(() => import('./pages/booking/BookingConfirmation'));
const Payment = lazy(() => import('./pages/booking/Payment'));
const CheckIn = lazy(() => import('./pages/booking/CheckIn'));
const BoardingPass = lazy(() => import('./pages/booking/BoardingPass'));
const Profile = lazy(() => import('./pages/user/Profile'));
const NotFound = lazy(() => import('./pages/errors/NotFound'));

// Auth pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const EmployeeDashboard = lazy(() => import('./pages/employee/Dashboard'));

// Components
import Navigation from './components/ui/Navbar';
import Footer from './components/ui/Footer';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Main App Component
const App = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <Toaster />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes location={location} key={location.pathname}>
                <Route element={<MainLayout />}>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/flights" element={<Flights />} />
                  <Route path="/flights/:id" element={<FlightDetails />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/booking/confirmation" element={<BookingConfirmation />} />
                  <Route path="/bookings" element={<BookingHistory />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/checkin" element={<CheckIn />} />
                  <Route path="/boarding-pass" element={<BoardingPass />} />
                  <Route path="/profile" element={<Profile />} />
                  
                  {/* Auth routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Admin routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/flights" element={<div>Flight Management</div>} />
                  
                  {/* Employee routes */}
                  <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                  <Route path="/employee/checkin" element={<div>Passenger Check-in</div>} />
                  
                  {/* Error pages */}
                  <Route path="/404" element={<NotFound />} />
                  
                  {/* Redirect unknown routes to 404 */}
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Route>
              </Routes>
            </Suspense>
          </AnimatePresence>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;
