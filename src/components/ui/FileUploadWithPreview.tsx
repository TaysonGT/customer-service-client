import React, { useState, useRef, useCallback } from 'react';
import { FiUploadCloud, FiX, FiPlus } from 'react-icons/fi';

interface FileWithPreview {
  file: File;
  preview: string;
  id: string;
}

interface FileUploadWithPreviewProps {
  onFilesChange?: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string;
  name?: string;
}

export const FileUploadWithPreview: React.FC<FileUploadWithPreviewProps> = ({
  onFilesChange,
  maxFiles = 5,
  maxSize = 10,
  acceptedTypes = 'image/*,.pdf,.doc,.docx',
  name = 'attachments'
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generatePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        // For non-image files, use appropriate icons
        const icon = getFileIcon(file.type);
        resolve(icon);
      }
    });
  };

  const getFileIcon = (fileType: string): string => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('doc')) return '📝';
    if (fileType.includes('sheet') || fileType.includes('excel')) return '📊';
    return '📎';
  };

  const handleFiles = useCallback(async (newFiles: FileList) => {
    setIsLoading(true);
    
    try {
      const validFiles: File[] = [];
      
      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        
        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
          alert(`File ${file.name} exceeds the maximum size of ${maxSize}MB`);
          continue;
        }
        
        // Check if we've reached max files
        if (files.length + validFiles.length >= maxFiles) {
          alert(`Maximum ${maxFiles} files allowed`);
          break;
        }
        
        validFiles.push(file);
      }

      if (validFiles.length === 0) {
        setIsLoading(false);
        return;
      }

      // Generate previews for all valid files
      const filesWithPreviews = await Promise.all(
        validFiles.map(async (file) => ({
          file,
          preview: await generatePreview(file),
          id: Math.random().toString(36).substr(2, 9)
        }))
      );

      const updatedFiles = [...files, ...filesWithPreviews];
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles.map(f => f.file));
    } catch (error) {
      alert('Failed to process files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [files, maxFiles, maxSize, onFilesChange]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = ''; // Reset input to allow selecting same files again
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Only set dragging to false if we're leaving the drop zone
    const rect = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX <= rect.left ||
      e.clientX >= rect.right ||
      e.clientY <= rect.top ||
      e.clientY >= rect.bottom
    ) {
      setIsDragging(false);
    }
  };

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles.map(f => f.file));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-3 w-full overflow-hidden">
      {/* File Upload Area */}
      <div
        className={`mt-1 border-2 border-dashed rounded-md transition-colors ${
          isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="px-6 pt-5 pb-6">
          {files.length === 0 ? (
            <>
              <input
                type="file"
                className="hidden"
                disabled={isLoading}
                ref={fileInputRef}
                id={`file-upload-${name}`}
                onChange={handleFileInputChange}
                accept={acceptedTypes}
                multiple
              />
              <label
                htmlFor={`file-upload-${name}`}
                className="block w-full h-40 rounded-lg cursor-pointer transition-colors"
              >
                <div className="h-full flex flex-col items-center justify-center p-4">
                  <FiUploadCloud className="w-10 h-10 text-blue-500 mb-2" />
                  <p className="text-sm text-gray-600 text-center">
                    <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG, PDF up to {maxSize}MB each • Max {maxFiles} files
                  </p>
                  {isLoading && (
                    <div className="mt-2 w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
              </label>
            </>
          ) : (
            // Files preview state
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 max-h-40 overflow-y-auto overflow-x-hidden p-1">
                {files.map((fileWithPreview) => (
                  <div
                    key={fileWithPreview.id}
                    className="relative group border rounded-md p-2 hover:bg-gray-50 transition-colors"
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => removeFile(fileWithPreview.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                      style={{ width: '24px', height: '24px' }}
                      type="button"
                    >
                      <FiX className="w-3 h-3 mx-auto" />
                    </button>

                    {/* File preview */}
                    {fileWithPreview.preview.startsWith('data:image') ? (
                      <img
                        src={fileWithPreview.preview}
                        alt={fileWithPreview.file.name}
                        className="w-full h-16 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-16 flex items-center justify-center text-2xl bg-gray-100 rounded-md">
                        {fileWithPreview.preview}
                      </div>
                    )}

                    {/* File info */}
                    <div className="mt-2 text-xs text-center">
                      <p className="font-medium text-gray-900 truncate">
                        {fileWithPreview.file.name}
                      </p>
                      <p className="text-gray-500">
                        {formatFileSize(fileWithPreview.file.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add more files button */}
              {files.length < maxFiles && (
                <div className="text-center pt-2 border-t">
                  <label className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 cursor-pointer">
                    <FiPlus className="w-4 h-4 mr-1" />
                    Add more files
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="sr-only"
                      multiple
                      accept={acceptedTypes}
                      onChange={handleFileInputChange}
                    />
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Files counter */}
      {files.length > 0 && (
        <p className="text-xs text-gray-500 text-right">
          {files.length} of {maxFiles} files
        </p>
      )}
    </div>
  );
};