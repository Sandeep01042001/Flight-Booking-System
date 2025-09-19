import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authService from '../services/authService';

// Initial state
const initialState = {
  user: null,
  loading: true,
  error: null,
  theme: 'light',
  notifications: [],
  cart: [],
  isAuthenticated: false,
  isAdmin: false,
  isEmployee: false,
};

// Action types
const SET_LOADING = 'SET_LOADING';
const SET_USER = 'SET_USER';
const SET_ERROR = 'SET_ERROR';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGOUT = 'LOGOUT';
const UPDATE_USER = 'UPDATE_USER';
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const CLEAR_CART = 'CLEAR_CART';
const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
const TOGGLE_THEME = 'TOGGLE_THEME';

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.payload };
      
    case SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isAdmin: action.payload?.role === 'admin',
        isEmployee: ['employee', 'pilot', 'flight_attendant', 'crew'].includes(action.payload?.role),
        loading: false,
      };
      
    case SET_ERROR:
      return { ...state, error: action.payload, loading: false };
      
    case LOGIN_SUCCESS: {
      const { user } = action.payload;
      return {
        ...state,
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
        isEmployee: ['pilot', 'flight_attendant', 'crew'].includes(user.role),
        loading: false,
        error: null,
      };
    }
      
    case LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isEmployee: false,
        loading: false,
        cart: [],
      };
      
    case UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
      
    case ADD_TO_CART:
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
      
    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter((_, index) => index !== action.payload),
      };
      
    case CLEAR_CART:
      return {
        ...state,
        cart: [],
      };
      
    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
      
    case REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
      
    case TOGGLE_THEME:
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return {
        ...state,
        theme: newTheme,
      };
      
    default:
      return state;
  }
};

// Create context
const AppContext = createContext(initialState);

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const navigate = useNavigate();
  // In-memory crew assignments: { id, flightId, employeeId, role, title, date, checkIn }
  const [assignments, setAssignments] = React.useState([]);

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load theme from localStorage
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme !== state.theme) {
          dispatch({ type: TOGGLE_THEME });
        }
        
        // Check if user is already logged in
        const token = localStorage.getItem('authToken');
        if (token) {
          const { user } = await authService.getCurrentUser();
          dispatch({ 
            type: LOGIN_SUCCESS, 
            payload: { user } 
          });
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        localStorage.removeItem('authToken');
      } finally {
        dispatch({ type: SET_LOADING, payload: false });
      }
    };
    
    initializeApp();
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      const { user, token } = await authService.login(email, password);
      
      dispatch({ 
        type: LOGIN_SUCCESS, 
        payload: { user } 
      });
      
      toast.success('Login successful!');
      return { 
        success: true, 
        user // Make sure to return the user object
      };
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: SET_ERROR, payload: error.message });
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      
      const { user, token } = await authService.register(userData);
      
      dispatch({ 
        type: LOGIN_SUCCESS, 
        payload: { user } 
      });
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      dispatch({ type: SET_ERROR, payload: error.message });
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: LOGOUT });
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  // Crew assignment helpers (App-level, not in reducer)
  const assignCrewToFlight = ({ flightId, crew, flightTitle, departureISO, checkInISO }) => {
    // crew: array of { employeeId, role, name }
    const items = crew.map(member => ({
      id: `asg_${Date.now()}_${member.employeeId}_${flightId}`,
      flightId,
      employeeId: member.employeeId,
      role: member.role,
      title: flightTitle,
      date: departureISO,
      checkIn: checkInISO,
    }));
    setAssignments(prev => {
      // Remove previous assignments for same flight and same employee to avoid duplicates
      const filtered = prev.filter(a => !(a.flightId === flightId && crew.some(c => c.employeeId === a.employeeId)));
      return [...filtered, ...items];
    });
    return items;
  };

  const unassignCrewFromFlight = ({ flightId, employeeIds }) => {
    setAssignments(prev => prev.filter(a => a.flightId !== flightId || !employeeIds.includes(a.employeeId)));
  };

  const getAssignmentsForEmployee = (employeeId) => assignments.filter(a => a.employeeId === employeeId);

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      const { user } = await authService.updateProfile(updates);
      dispatch({ 
        type: UPDATE_USER, 
        payload: user 
      });
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.message || 'Failed to update profile');
      return { success: false, error: error.message };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authService.changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully');
      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      toast.error(error.message || 'Failed to change password');
      return { success: false, error: error.message };
    }
  };

  // Add to cart
  const addToCart = (item) => {
    dispatch({ 
      type: ADD_TO_CART, 
      payload: item 
    });
    toast.success('Added to cart');
  };

  // Remove from cart
  const removeFromCart = (index) => {
    dispatch({ 
      type: REMOVE_FROM_CART, 
      payload: index 
    });
    toast.info('Removed from cart');
  };

  // Clear cart
  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  // Add notification
  const addNotification = (notification) => {
    const id = Date.now();
    dispatch({ 
      type: ADD_NOTIFICATION, 
      payload: { id, ...notification } 
    });
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      dispatch({ 
        type: REMOVE_NOTIFICATION, 
        payload: id 
      });
    }, 5000);
    
    return id;
  };

  // Remove notification
  const removeNotification = (id) => {
    dispatch({ 
      type: REMOVE_NOTIFICATION, 
      payload: id 
    });
  };

  // Toggle theme
  const toggleTheme = () => {
    dispatch({ type: TOGGLE_THEME });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        assignments,
        login,
        register,
        logout,
        assignCrewToFlight,
        unassignCrewFromFlight,
        getAssignmentsForEmployee,
        updateProfile,
        changePassword,
        addToCart,
        removeFromCart,
        clearCart,
        addNotification,
        removeNotification,
        toggleTheme,
      }}
    >
      <div className={`app ${state.theme}`} data-theme={state.theme}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

// Custom hook to use the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
