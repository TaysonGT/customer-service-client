// File: src/components/ui/Input.tsx
import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ 
  icon, 
  error = false,
  className = '',
  ...props 
}) => {
  return (
    <div className={`relative ${className}`}>
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {icon}
        </div>
      )}
      <input
        className={`w-full ${
          icon ? 'pl-10' : 'pl-3'
        } pr-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        {...props}
      />
    </div>
  );
};