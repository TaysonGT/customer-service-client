// File: src/features/files/FileGrid.tsx
import React from 'react';
import { FiFile, FiImage, FiDownload, FiMoreVertical } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui';
import { FileItem } from './FileDisplay';

interface FileGridProps {
  files?: FileItem[];
  isLoading: boolean;
}

const FileGrid: React.FC<FileGridProps> = ({ files = [], isLoading }) => {
  // Mock data if not provided
  const FileTypeIcons = {
    image: <FiImage className="text-2xl text-purple-600" />,
    document: <FiFile className="text-2xl text-blue-600" />,
    other: <FiFile className="text-2xl text-gray-600" />,
  };

  const FileTypeBadges = {
    image: 'bg-purple-100 text-purple-800',
    document: 'bg-blue-100 text-blue-800',
    other: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {isLoading?
      [...Array(4)].map((x,i)=>
      <motion.div
        key={i}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="p-4 flex flex-col">
          {/* Skeleton for file icon */}
          <div className="relative w-14 h-14 flex items-center justify-center rounded-lg mb-3 overflow-hidden bg-gray-300 dark:bg-gray-700">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/70 to-transparent animate-[shimmer_1.5s_infinite]"></div>
          </div>
          
          {/* Skeleton for file name */}
          <div className="relative h-4 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700 mb-2">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/70 to-transparent animate-[shimmer_1.5s_infinite]"></div>
          </div>
          
          {/* Skeleton for metadata row */}
          <div className="mt-2 flex justify-between items-center">
            <div className="relative h-3 w-16 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/70 to-transparent animate-[shimmer_1.5s_infinite]"></div>
            </div>
            <div className="relative h-3 w-16 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/70 to-transparent animate-[shimmer_1.5s_infinite]"></div>
            </div>
          </div>
          
          {/* Skeleton for action buttons */}
          <div className="mt-3 flex justify-end gap-1">
            <div className="relative w-8 h-8 rounded-md overflow-hidden bg-gray-300 dark:bg-gray-700">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/70 to-transparent animate-[shimmer_1.5s_infinite]"></div>
            </div>
            <div className="relative w-8 h-8 rounded-md overflow-hidden bg-gray-300 dark:bg-gray-700">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/70 to-transparent animate-[shimmer_1.5s_infinite]"></div>
            </div>
          </div>
        </div>
      </motion.div>
      )
      :files.map((file) => (
        <motion.div
          key={file.id}
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="p-4 flex flex-col">
            <div className={`w-14 h-14 flex items-center justify-center rounded-lg mb-3 ${FileTypeBadges[file.type]}`}>
              {FileTypeIcons[file.type]}
            </div>
            <h3 className="font-medium text-gray-900 text-sm truncate">
              {file.name}
            </h3>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-gray-500">{file.size}</span>
              <span className="text-xs text-gray-400">{formatDate(file.uploaded_at)}</span>
            </div>
            <div className="mt-3 flex justify-end gap-1">
              <Button variant="ghost" size="sm" icon={<FiDownload />} />
              <Button variant="ghost" size="sm" icon={<FiMoreVertical />} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FileGrid

// Helper function
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};