import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
import { ExclamationCircleIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';

const Select = forwardRef(({
  id,
  name,
  label,
  options = [],
  placeholder = 'Select an option',
  helperText,
  error,
  className = '',
  labelClassName = '',
  containerClassName = '',
  fullWidth = true,
  ...props
}, ref) => {
  const selectClasses = twMerge(
    'block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6',
    error ? 'ring-red-300 focus:ring-red-500' : 'focus:ring-blue-500',
    props.disabled && 'opacity-50 cursor-not-allowed',
    className
  );

  const containerClasses = twMerge(
    'relative',
    fullWidth ? 'w-full' : 'w-auto',
    containerClassName
  );

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={id || name} className={`block text-sm font-medium leading-6 text-gray-900 mb-1 ${labelClassName}`}>
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          id={id || name}
          name={name}
          className={selectClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-description` : undefined}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => {
            if (typeof option === 'string') {
              return (
                <option key={option} value={option}>
                  {option}
                </option>
              );
            }
            return (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            );
          })}
        </select>
        
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          {error ? (
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          ) : (
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          )}
        </div>
      </div>
      
      {error ? (
        <p className="mt-1 text-sm text-red-600" id={`${name}-error`}>
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1 text-sm text-gray-500" id={`${name}-description`}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';

Select.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })),
  ]).isRequired,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  containerClassName: PropTypes.string,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

export default Select;
