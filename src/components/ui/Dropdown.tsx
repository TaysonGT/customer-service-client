// File: src/components/ui/Dropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items?: DropdownItem[];
  position?: 'left' | 'right';
  align?: 'top' | 'bottom';
}

export const Dropdown: React.FC<React.PropsWithChildren<DropdownProps>> = ({ 
  trigger, 
  // items,
  position = 'right',
  children,
  align = 'bottom'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      <div
        className={`absolute z-50 mt-2 ${
          position === 'right' ? 'right-0' : 'left-0'
        } ${
          align === 'top' ? 'bottom-full mb-2' : ''
        } ${
          isOpen? 'opacity-100 pointer-events-auto translate-y-0 scale-100':'opacity-0 pointer-events-none translate-y-4 scale-95'
        }
        w-64 duration-200 ease-in-out rounded-sm shadow-lg bg-white ring-1 ring-gray-300`}
      >
        <div className="py-1">
          {children}
        </div>
      </div>
      {/* <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`absolute z-50 mt-2 ${
              position === 'right' ? 'right-0' : 'left-0'
            } ${
              align === 'top' ? 'bottom-full mb-2' : ''
            } w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5`}
          >
            <div className="py-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </div>
  );
};