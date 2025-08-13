import React from 'react';
import { motion } from 'framer-motion';

interface AdminStatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
}

const AdminStatsCard: React.FC<AdminStatsCardProps> = ({ title, value, icon, change }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white p-4 rounded-lg shadow-xs border border-gray-200"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          {icon}
        </div>
      </div>
      <p className={`text-xs mt-3 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {change} {isPositive ? '↑' : '↓'} from yesterday
      </p>
    </motion.div>
  );
};

export default AdminStatsCard;