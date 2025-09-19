import React from 'react';
import PropTypes from 'prop-types';

const Card = ({
  children,
  className = '',
  padding = 'p-6',
  shadow = 'shadow',
  rounded = 'rounded-lg',
  hoverEffect = false,
  border = false,
  ...props
}) => {
  const baseClasses = [
    'bg-white',
    rounded,
    shadow,
    border && 'border border-gray-200',
    hoverEffect && 'transition-all duration-200 hover:shadow-md',
    padding,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
};

Card.Header = ({ children, className = '', border = true, padding = 'px-6 py-4' }) => (
  <div 
    className={`${border ? 'border-b border-gray-200' : ''} ${padding} ${className}`}
  >
    {children}
  </div>
);

Card.Body = ({ children, className = '', padding = 'p-6' }) => (
  <div className={`${padding} ${className}`}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', border = true, padding = 'px-6 py-4' }) => (
  <div 
    className={`${border ? 'border-t border-gray-200' : ''} ${padding} bg-gray-50 ${className}`}
  >
    {children}
  </div>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  padding: PropTypes.string,
  shadow: PropTypes.string,
  rounded: PropTypes.string,
  hoverEffect: PropTypes.bool,
  border: PropTypes.bool,
};

Card.Header.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  border: PropTypes.bool,
  padding: PropTypes.string,
};

Card.Body.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  padding: PropTypes.string,
};

Card.Footer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  border: PropTypes.bool,
  padding: PropTypes.string,
};

export default Card;
