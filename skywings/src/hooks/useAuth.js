import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import authService from '../services/authService';

const useAuth = () => {
  const {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isEmployee,
    login: contextLogin,
    logout: contextLogout,
    register: contextRegister,
    checkAuth,
  } = useApp();
  
  const navigate = useNavigate();
  const location = useLocation();

  // Enhanced login with role-based redirection
  const login = async (email, password) => {
    try {
      const result = await contextLogin(email, password);
      
      if (result.success && result.user) {
        // Redirect based on user role
        let redirectPath = '/';
        if (result.user.role === 'admin') {
          redirectPath = '/admin/dashboard';
        } else if (result.user.role === 'airline') {
          // Airline Admin should land on Airline Home (index of /airline)
          redirectPath = '/airline';
        } else if (['employee', 'pilot', 'flight_attendant', 'crew'].includes(result.user.role)) {
          redirectPath = '/employee';
        } else if (result.user.role === 'customer') {
          redirectPath = '/dashboard';
        }
        
        // Redirect to the requested page or role-specific dashboard
        // Handle both string and object shapes for state.from
        const fromState = location.state?.from;
        const from = typeof fromState === 'string' 
          ? fromState 
          : (fromState?.pathname || redirectPath);
        navigate(from, { replace: true });
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  // Enhanced register with redirection
  const register = async (userData) => {
    try {
      const result = await contextRegister(userData);
      if (result.success) {
        navigate('/login');
      }
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  // Logout with navigation
  const logout = useCallback(() => {
    contextLogout();
    navigate('/');
  }, [contextLogout, navigate]);

  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      const result = await authService.changePassword(user.id, currentPassword, newPassword);
      return { success: true, ...result };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isEmployee,
    login,
    logout,
    register,
    checkAuth,
    changePassword,
  };
};

export default useAuth;
