import { forwardRef, ReactNode, ElementType } from 'react';
import { twMerge } from 'tailwind-merge';

const Card = forwardRef(({ 
  children, 
  className = '',
  padding = 'p-6',
  rounded = 'rounded-lg',
  shadow = 'shadow',
  hover = 'hover:shadow-md',
  bg = 'bg-white',
  border = 'border border-gray-200',
  ...props 
}, ref) => {
  const baseClasses = twMerge(
    'transition-all duration-200',
    padding,
    rounded,
    shadow,
    hover,
    bg,
    border,
    className
  );

  return (
    <div 
      ref={ref}
      className={baseClasses}
      {...props}
    >
      {children}
    </div>
  );
});

import PropTypes from 'prop-types';

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  padding: PropTypes.string,
  rounded: PropTypes.string,
  shadow: PropTypes.string,
  hover: PropTypes.string,
  bg: PropTypes.string,
  border: PropTypes.string,
};

// Header component for the card
const CardHeader = ({ 
  children, 
  className = '',
  withBorder = true,
  ...props 
}) => (
  <div 
    className={twMerge(
      'mb-4',
      withBorder && 'pb-4 border-b border-gray-100',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

CardHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  withBorder: PropTypes.bool,
};

// Title component for the card
const CardTitle = ({ 
  children, 
  className = '',
  as: Component = 'h3',
  ...props 
}) => (
  <Component 
    className={twMerge(
      'text-lg font-semibold text-gray-900',
      className
    )}
    {...props}
  >
    {children}
  </Component>
);

CardTitle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  as: PropTypes.elementType,
};

// Body component for the card
const CardBody = ({ 
  children, 
  className = '',
  ...props 
}) => (
  <div 
    className={twMerge('mb-4', className)}
    {...props}
  >
    {children}
  </div>
);

CardBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

// Footer component for the card
const CardFooter = ({ 
  children, 
  className = '',
  align = 'right',
  ...props 
}) => {
  const alignment = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }[align] || 'justify-end';

  return (
    <div 
      className={twMerge(
        'flex items-center mt-6 pt-4 border-t border-gray-100',
        alignment,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

CardFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right', 'between', 'around', 'evenly']),
};

// Attach sub-components to Card
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
