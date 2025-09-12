import React from 'react';
import * as FormPrimitive from '@radix-ui/react-form';
import { cn } from '@/lib/utils';

const Form = FormPrimitive.Root;
const FormField = FormPrimitive.Field;

const FormItem = React.forwardRef(({ className, ...props }, ref) => (
  <FormPrimitive.Field
    ref={ref}
    className={cn('space-y-2', className)}
    {...props}
  />
));
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef(({ className, ...props }, ref) => (
  <FormPrimitive.Label
    ref={ref}
    className={cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  />
));
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef((props, ref) => (
  <FormPrimitive.Control ref={ref} {...props} />
));
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-500 dark:text-gray-400', className)}
    {...props}
  />
));
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => (
  <FormPrimitive.Message
    ref={ref}
    className={cn('text-sm font-medium text-red-500 dark:text-red-900', className)}
    {...props}
  >
    {children}
  </FormPrimitive.Message>
));
FormMessage.displayName = 'FormMessage';

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
};
