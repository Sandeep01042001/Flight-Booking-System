import React from 'react';

const Loader = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 border-blue-500`}></div>
    </div>
  );
};

export const PageLoader = () => (
  <div className="flex h-screen items-center justify-center">
    <Loader size="xl" />
  </div>
);

export const ButtonLoader = () => (
  <div className="flex items-center">
    <Loader size="sm" className="mr-2" />
    <span>Processing...</span>
  </div>
);

export default Loader;
