// File: src/components/ui/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'sm' | 'md' | 'lg' | 'none';
  border?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  rounded = 'md',
  shadow = 'md',
  border = true
}) => {
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };

  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
    none: ''
  };

  return (
    <div 
      className={`bg-white ${roundedClasses[rounded]} ${
        shadowClasses[shadow]
      } ${border ? 'border border-gray-200' : ''} ${className}`}
    >
      {children}
    </div>
  );
};