import React, { useState, useCallback } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { FiUploadCloud, FiFile } from 'react-icons/fi';
import supabase from '../../lib/supabase';
import toast from 'react-hot-toast';
import { useAxiosAuth } from '../../hooks/useAxiosAuth';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../components/Loader';

interface Props {
  cancel: () => void;
  onUploadSuccess?: () => void;
}

const UploadFile: React.FC<Props> = ({ cancel, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<'document' | 'image'>('image');
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const api = useAxiosAuth();

  const isImageFile = useCallback((file: File) => {
    const imageMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/avif',
      'image/apng',
      'image/bmp'
    ];
    return imageMimes.includes(file.type.toLowerCase());
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const uploadHandler = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    };

    if (!isImageFile(selectedFile) && uploadType === 'image') {
      toast.error('The selected file is not an image');
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Unauthenticated access');
      }

      const filePath = `${user.user_metadata.id}/${uploadType === 'image' ? 'images' : 'documents'}/${Date.now()}-${selectedFile.name}`;

      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('clients_data')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const response = await api.post(`/data/${uploadType}s/client`, {
        bucket: 'clients_data',
        name: selectedFile.name,
        type: uploadType,
        path: uploadData.path,
        size: selectedFile.size
      });

      if (response.data.success) {
        toast.success('File uploaded successfully');
        onUploadSuccess?.();
        cancel();
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload file');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed z-103 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Upload File</h2>
            <button
              onClick={cancel}
              className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              <RiCloseLine className="text-2xl" />
            </button>
          </div>

          <div className="mb-4 flex rounded-lg overflow-hidden bg-gray-50">
            {(['image', 'document'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setUploadType(type)}
                className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                  uploadType === type
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                disabled={isLoading}
              >
                {type === 'image' ? 'Image' : 'Document'}
              </button>
            ))}
          </div>

          <input
            type="file"
            className="hidden"
            disabled={isLoading}
            id="file-upload"
            onChange={handleFileChange}
            accept={uploadType === 'image' ? 'image/*' : '*'}
          />
          <label
            htmlFor="file-upload"
            className={`block w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="h-full flex flex-col items-center justify-center p-4">
              {selectedFile ? (
                <>
                  <FiFile className="w-10 h-10 text-blue-500 mb-2" />
                  <p className="text-sm font-medium text-gray-700 text-center truncate max-w-full">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(selectedFile.size /( 1024 * 1024)).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                  >
                    Change file
                  </button>
                </>
              ) : (
                <>
                  <FiUploadCloud className="w-10 h-10 text-blue-500 mb-2" />
                  <p className="text-sm text-gray-600 text-center">
                    <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {uploadType === 'image' 
                      ? 'JPG, PNG, WEBP (max. 5MB)' 
                      : 'PDF, DOC, XLS (max. 10MB)'}
                  </p>
                </>
              )}
            </div>
          </label>

          <div className="mt-4 flex gap-3">
            <button
              onClick={cancel}
              className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={uploadHandler}
              disabled={!selectedFile || isLoading}
              className={`flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-75' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <Loader size={16} thickness={2} className="text-white" />
                  Uploading...
                </>
              ) : (
                'Upload'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UploadFile;