import React from 'react';

const Textarea = ({ className = '', ...props }) => {
  return (
    <textarea
      className={`block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${className}`}
      {...props}
    />
  );
};

export default Textarea;
