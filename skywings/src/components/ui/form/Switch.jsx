import React from 'react';

// A simple Switch built on top of a checkbox input
const Switch = ({ id, name, checked, onChange, className = '', ...props }) => {
  return (
    <label htmlFor={id || name} className={`inline-flex items-center cursor-pointer ${className}`}>
      <input
        id={id || name}
        name={name}
        type="checkbox"
        className="sr-only peer"
        checked={!!checked}
        onChange={onChange}
        {...props}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-300 peer-checked:bg-blue-600 transition-colors"></div>
      <div className="-ml-9 w-5 h-5 bg-white rounded-full border border-gray-300 peer-checked:translate-x-5 transition-transform"></div>
    </label>
  );
};

export default Switch;
