// File: src/features/knowledge/ArticleItem.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface ArticleItemProps {
  title: string;
  views: number;
}

const ArticleItem: React.FC<ArticleItemProps> = ({ title, views }) => {
  return (
    <motion.div
      whileHover={{ x: 5 }}
      className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
    >
      <h4 className="font-medium text-gray-800">{title}</h4>
      <span className="text-xs text-gray-500">{views.toLocaleString()} views</span>
    </motion.div>
  );
};

export default ArticleItem;