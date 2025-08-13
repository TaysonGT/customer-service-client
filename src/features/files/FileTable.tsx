import { FiDownload, FiFile, FiImage, FiMoreVertical } from "react-icons/fi";
import { FileItem } from "./FileDisplay";
import { Button } from "../../components/ui";
import {motion} from 'framer-motion'

interface FileGridProps {
  files?: FileItem[];
  isLoading: boolean;
}

// Enhanced FileTable with better interactions
const FileTable:React.FC<FileGridProps> = ({ files = [], isLoading }) => {
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
    <div className="overflow-hidden rounded-lg border border-gray-100">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {isLoading? [...Array(4)].map((x,i)=>
          <motion.tr 
            key={i}
            whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.5)' }}
            className="transition-colors"
          >
            {/* File name column */}
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="relative w-10 h-10 rounded-lg mr-3 overflow-hidden bg-gray-300 dark:bg-gray-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/70 to-transparent animate-[shimmer_1.5s_infinite]" />
                </div>
                <div className="relative h-4 w-32 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/70 to-transparent animate-[shimmer_1.5s_infinite]" />
                </div>
              </div>
            </td>

            {/* File type column */}
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="relative h-6 w-16 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/70 to-transparent animate-[shimmer_1.5s_infinite]" />
              </div>
            </td>

            {/* Size column */}
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="relative h-4 w-12 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/70 to-transparent animate-[shimmer_1.5s_infinite]" />
              </div>
            </td>

            {/* Date column */}
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="relative h-4 w-16 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/70 to-transparent animate-[shimmer_1.5s_infinite]" />
              </div>
            </td>

            {/* Actions column */}
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex justify-end gap-1">
                <div className="relative w-8 h-8 rounded-md overflow-hidden bg-gray-300 dark:bg-gray-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/70 to-transparent animate-[shimmer_1.5s_infinite]" />
                </div>
                <div className="relative w-8 h-8 rounded-md overflow-hidden bg-gray-300 dark:bg-gray-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/70 to-transparent animate-[shimmer_1.5s_infinite]" />
                </div>
              </div>
            </td>
          </motion.tr>)
          :files.map((file) => (
            <motion.tr 
              key={file.id}
              whileHover={{ backgroundColor: 'rgba(243, 244, 246, 0.5)' }}
              className="transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-lg mr-3 ${FileTypeBadges[file.type]}`}>
                    {FileTypeIcons[file.type]}
                  </div>
                  <div className="text-sm font-medium text-gray-900">{file.name}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full capitalize ${FileTypeBadges[file.type]}`}>
                  {file.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {file.size}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(file.uploaded_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="sm" icon={<FiDownload />} />
                  <Button variant="ghost" size="sm" icon={<FiMoreVertical />} />
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Helper function
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export default FileTable;