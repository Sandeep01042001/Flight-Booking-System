import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const Input = forwardRef(({
  id,
  name,
  type = 'text',
  label,
  helperText,
  error,
  className = '',
  labelClassName = '',
  containerClassName = '',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  leftAddon,
  rightAddon,
  fullWidth = true,
  ...props
}, ref) => {
  const inputClasses = twMerge(
    'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6',
    error ? 'ring-red-300 focus:ring-red-500' : 'focus:ring-blue-500',
    (LeftIcon || leftAddon) && 'pl-10',
    (RightIcon || rightAddon) && 'pr-10',
    props.disabled && 'opacity-50 cursor-not-allowed',
    className
  );

  const containerClasses = twMerge(
    'relative',
    fullWidth ? 'w-full' : 'w-auto',
    containerClassName
  );

  const renderAddon = (addon, position) => (
    <div className={`absolute inset-y-0 ${position}-0 flex items-center px-3 bg-gray-100 border border-gray-300 ${position === 'left' ? 'rounded-l-md border-r-0' : 'rounded-r-md border-l-0'}`}>
      <span className="text-gray-500 sm:text-sm">{addon}</span>
    </div>
  );

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor={id || name} className={`block text-sm font-medium leading-6 text-gray-900 mb-1 ${labelClassName}`}>
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      
      <div className="relative rounded-md shadow-sm">
        {leftAddon && renderAddon(leftAddon, 'left')}
        
        {LeftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <LeftIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        
        <input
          ref={ref}
          id={id || name}
          name={name}
          type={type}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-description` : undefined}
          {...props}
        />
        
        {RightIcon && !error && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <RightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
        
        {rightAddon && renderAddon(rightAddon, 'right')}
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

Input.displayName = 'Input';

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  containerClassName: PropTypes.string,
  leftIcon: PropTypes.elementType,
  rightIcon: PropTypes.elementType,
  leftAddon: PropTypes.node,
  rightAddon: PropTypes.node,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
};

export default Input;
