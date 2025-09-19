import React, { createContext, useContext, useState, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
  variant: 'underline' | 'pills';
  orientation: 'horizontal' | 'vertical';
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  children: ReactNode;
  defaultValue: string;
  variant?: 'underline' | 'pills';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Tabs = ({
  children,
  defaultValue,
  variant = 'underline',
  orientation = 'horizontal',
  className = '',
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, variant, orientation }}>
      <div 
        className={twMerge(
          orientation === 'vertical' ? 'flex' : 'block',
          className
        )}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};

interface TabListProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const TabList = ({ 
  children, 
  className = '',
  fullWidth = false 
}: TabListProps) => {
  const { variant, orientation } = useTabs();
  
  const baseClasses = twMerge(
    'flex',
    orientation === 'vertical' 
      ? 'flex-col border-r border-gray-200 pr-4 mr-4' 
      : 'border-b border-gray-200',
    variant === 'pills' && 'space-x-2',
    fullWidth && 'w-full',
    className
  );

  return (
    <div role="tablist" className={baseClasses}>
      {children}
    </div>
  );
};

interface TabProps {
  id: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
}

const Tab = ({ 
  id, 
  children, 
  className = '',
  disabled = false,
  icon,
  ...props 
}: TabProps & React.HTMLAttributes<HTMLButtonElement>) => {
  const { activeTab, setActiveTab, variant } = useTabs();
  const isActive = activeTab === id;

  const tabClasses = {
    base: 'px-4 py-2 text-sm font-medium flex items-center gap-2 focus:outline-none',
    default: 'text-gray-500 hover:text-gray-700',
    active: {
      underline: 'text-blue-600 border-b-2 border-blue-600',
      pills: 'bg-blue-100 text-blue-700 rounded-md',
    },
    disabled: 'opacity-50 cursor-not-allowed',
  };

  const buttonClasses = twMerge(
    tabClasses.base,
    isActive 
      ? variant === 'pills' 
        ? tabClasses.active.pills 
        : tabClasses.active.underline
      : tabClasses.default,
    disabled && tabClasses.disabled,
    className
  );

  return (
    <button
      role="tab"
      id={`tab-${id}`}
      aria-selected={isActive}
      aria-controls={`panel-${id}`}
      tabIndex={isActive ? 0 : -1}
      onClick={() => !disabled && setActiveTab(id)}
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="h-5 w-5">{icon}</span>}
      {children}
    </button>
  );
};

interface TabPanelProps {
  id: string;
  children: ReactNode;
  className?: string;
  unmountWhenInactive?: boolean;
}

const TabPanel = ({ 
  id, 
  children, 
  className = '',
  unmountWhenInactive = false,
  ...props 
}: TabPanelProps & React.HTMLAttributes<HTMLDivElement>) => {
  const { activeTab } = useTabs();
  const isActive = activeTab === id;

  if (unmountWhenInactive && !isActive) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      hidden={!isActive}
      className={twMerge('py-4', className)}
      {...props}
    >
      {isActive ? children : null}
    </div>
  );
};

// Hook to use tabs context
const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within a Tabs component');
  }
  return context;
};

// Attach sub-components to Tabs
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

export default Tabs;
