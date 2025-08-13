import { useState, useCallback, useRef } from 'react';
import { FileMetadata } from './SidebarDataManager';
import { FiFile, FiImage, FiLink, FiDownload, FiEye } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { saveAs } from 'file-saver';
import { createPortal } from 'react-dom';
import { TooltipText } from '../../components/TooltipText';

const FileBox = ({ file }: { file: FileMetadata }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    if(textRef.current){
      const rect = textRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left,
        y: rect.top - 5 // 5px above the text
      });
    }
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleDownload = useCallback(async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(file.signedUrl);
      const blob = await response.blob();
      saveAs(blob, file.name);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  }, [file]);

  const handlePreview = () => {
    if (file.type === 'image') {
      window.open(file.signedUrl, '_blank');
    }
  };

  return (
    <div className="relative">
      <motion.div
        ref={textRef}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="h-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-file-id={file.id}
      >
        <div
          className="flex flex-col gap-2 p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-300 transition-colors shadow-xs hover:shadow-sm h-full"
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          <div className="aspect-square flex justify-center items-center bg-gray-50 rounded-md overflow-hidden">
            {file.type === 'document' ? (
              <FiFile className="text-3xl text-gray-400" />
            ) : (
              <img 
                src={file.signedUrl} 
                alt={file.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </div>
          
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-gray-700 truncate">{file.name}</p>
            <p className="text-xs text-gray-400">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>

          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center gap-2"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(file.signedUrl);
                  }}
                  className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  title="Copy link"
                >
                  <FiLink size={14} />
                </button>
                {file.type === 'image' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview();
                    }}
                    className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    title="Preview"
                  >
                    <FiEye size={14} />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                  disabled={isDownloading}
                  className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  title="Download"
                >
                  <FiDownload size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Tooltip outside the overflow container */}
      {/* <AnimatePresence> */}
        {showTooltip&& createPortal(
            <TooltipText {...{text: file.name, position}} />,
            document.body
        )}
      {/* </AnimatePresence> */}
    </div>
  );
};

export default FileBox;