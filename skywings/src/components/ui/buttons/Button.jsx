import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  leftIcon = null,
  rightIcon = null,
  onClick,
  type = 'button',
  as,
  to,
  href,
  ...props
}) => {
  const baseStyles = 'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    link: 'text-indigo-600 hover:text-indigo-800 bg-transparent hover:underline',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';
  const commonProps = {
    className: `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? disabledStyles : ''} ${className} relative`,
    onClick,
    ...(loading ? { 'aria-busy': 'true' } : {}),
    ...props,
  };

  const content = (
    <>
      {loading && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
      <span className={`inline-flex items-center ${loading ? 'ml-6' : ''}`}>
        {leftIcon && <span className="mr-2 inline-flex items-center">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="ml-2 inline-flex items-center">{rightIcon}</span>}
      </span>
    </>
  );

  // Render as Link if 'as' is Link or 'to' is provided
  if ((as === Link || typeof as === 'function') && to) {
    return (
      <Link to={to} {...commonProps} aria-disabled={disabled || loading} onClick={disabled || loading ? (e) => e.preventDefault() : onClick}>
        {content}
      </Link>
    );
  }

  // If 'to' is provided without 'as', default to Link
  if (to) {
    return (
      <Link to={to} {...commonProps} aria-disabled={disabled || loading} onClick={disabled || loading ? (e) => e.preventDefault() : onClick}>
        {content}
      </Link>
    );
  }

  // Render as anchor if 'as' === 'a' or href provided
  if ((as === 'a' || href) && href) {
    return (
      <a href={href} {...commonProps} aria-disabled={disabled || loading} onClick={disabled || loading ? (e) => e.preventDefault() : onClick}>
        {content}
      </a>
    );
  }

  // Default: render native button
  return (
    <button
      type={type}
      className={commonProps.className}
      disabled={disabled || loading}
      onClick={onClick}
      {...(loading ? { 'aria-busy': 'true' } : {})}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
