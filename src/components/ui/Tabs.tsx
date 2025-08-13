// File: src/components/ui/Tabs.tsx
import React, { Children, useState } from 'react';

interface TabProps {
  value: string;
  icon?: React.ReactNode;
  label: string;
  badge?: number;
  children?: React.ReactNode;
}

interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  vertical?: boolean;
  children: React.ReactElement<TabProps>[];
}

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};

export const Tabs: React.FC<TabsProps> = ({ 
  value, 
  onChange, 
  vertical = false, 
  children 
}) => {
  const [activeTab, setActiveTab] = useState(value);

  const handleClick = (tabValue: string) => {
    setActiveTab(tabValue);
    onChange(tabValue);
  };

  return (
    <div className={`flex ${vertical ? 'flex-col' : 'flex-row'} gap-1`}>
      {Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        
        return (
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === child.props.value
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={() => handleClick(child.props.value)}
          >
            {child.props.icon && <span>{child.props.icon}</span>}
            <span>{child.props.label}</span>
            {child.props.badge && child.props.badge > 0 && (
              <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                {child.props.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};