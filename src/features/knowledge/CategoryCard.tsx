// File: src/features/knowledge/CategoryCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  description: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ icon, title, count, description }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-lg border border-gray-200 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-xs text-gray-400">{count} articles</span>
        <span className="text-xs text-blue-600 hover:text-blue-800">View all</span>
      </div>
    </motion.div>
  );
};

export default CategoryCard;