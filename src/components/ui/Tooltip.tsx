// File: src/components/ui/Tooltip.tsx
import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  text: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  children: React.ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  text, 
  position = 'top',
  children 
}) => {
  const [show, setShow] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show && tooltipRef.current && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;
      
      switch (position) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.right + 8;
          break;
        case 'bottom':
          top = triggerRect.bottom + 8;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.left - tooltipRect.width - 8;
          break;
      }
      
      tooltipRef.current.style.top = `${top}px`;
      tooltipRef.current.style.left = `${left}px`;
    }
  }, [show, position]);

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      
      {show && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap`}
        >
          {text}
          <div 
            className={`absolute w-0 h-0 border-4 border-transparent ${
              position === 'top' 
                ? 'border-t-gray-900 top-full left-1/2 -translate-x-1/2' 
                : position === 'right'
                ? 'border-r-gray-900 right-full top-1/2 -translate-y-1/2'
                : position === 'bottom'
                ? 'border-b-gray-900 bottom-full left-1/2 -translate-x-1/2'
                : 'border-l-gray-900 left-full top-1/2 -translate-y-1/2'
            }`}
          />
        </div>
      )}
    </div>
  );
};