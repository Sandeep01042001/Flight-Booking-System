import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const ToastHandler = () => {
  const location = useLocation();

  // Handle route change to clear toasts
  useEffect(() => {
    return () => {
      // Clear all toasts when component unmounts or route changes
      toast.dismiss();
    };
  }, [location.pathname]);

  return null;
};

// Export toast functions for use throughout the app
export const showSuccess = (message) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });};

export const showError = (message) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });};

export const showInfo = (message) => {
  toast.info(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });};

export const showWarning = (message) => {
  toast.warning(message, {
    position: 'top-right',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });};

export default ToastHandler;
