// File: src/components/ui/Loader.tsx
import React from 'react';

interface LoaderProps {
  size?: number;
  thickness?: number;
  color?: string;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ 
  size = 24, 
  thickness = 4,
  color = 'currentColor',
  className = ''
}) => {
  return (
    <div className={`inline-block ${className}`}>
      <svg
        className="animate-spin"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={thickness}
        strokeLinecap="round"
      >
        <path d="M12 2v4m0 12v4m-8-8H2M22 12h-4" />
        <circle cx="12" cy="12" r="8" opacity="0.3" />
      </svg>
    </div>
  );
};