import { useState, useRef, ChangeEvent } from 'react';
import { FaFileAlt, FaImage, FaTimes } from 'react-icons/fa';
import { useOutsideClick } from '../../hooks/useOutsideClick';

type FileUploaderProps = {
  onFileSelect: (file: File) => void;
  onCancel: () => void;
  onClose: () => void;
};

const FileUploader = ({ onFileSelect, onCancel, onClose }: FileUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'image' | 'document' | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const uploadRef =  useRef<HTMLDivElement>(null);
  useOutsideClick(uploadRef, onClose)

   const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'image' | 'document') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileType(type);
      onFileSelect(file);
      // Reset the input to allow selecting the same file again
      e.target.value = '';
    }
  };

  const triggerFileInput = (type: 'image' | 'document') => {
    setFileType(type);
    if (type === 'image') {
      imageInputRef.current?.click();
    } else {
      documentInputRef.current?.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div ref={uploadRef} className="bg-white shadow-hard z-100 rounded-2xl p-3 flex flex-col gap-3 absolute bottom-full animate-slide-up">
      {!selectedFile ? (
        <div className="flex gap-3">
          <button
            onClick={() => triggerFileInput('image')}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-100 rounded-xl flex-1 hover:bg-gray-50 cursor-pointer"
          >
            <FaImage className="text-2xl text-blue-500" />
            <span className="text-sm">Image</span>
            <input
              type="file"
              ref={imageInputRef}
              onChange={(e)=>handleFileChange(e, 'image')}
              accept="image/*"
              className="hidden"
              />
          </button>
          <button
            onClick={() => triggerFileInput('document')}
            className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-100 rounded-xl flex-1 hover:bg-gray-50 cursor-pointer"
            >
            <FaFileAlt className="text-2xl text-blue-500" />
            <span className="text-sm">Document</span>
            <input
              type="file"
              ref={documentInputRef}
              onChange={(e)=>handleFileChange(e, 'document')}
              className="hidden"
            />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
            {fileType === 'image' ? (
            <div className="relative group">
                <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="w-32 h-full border object-contain rounded-lg bg-gray-200"
                />
                <button
                onClick={() => {
                    setSelectedFile(null);
                    onCancel();
                }}
                className="absolute top-2 right-2 p-2 bg-white/80 text-gray-700 rounded-full hover:bg-white hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                >
                <FaTimes />
                </button>
            </div>
            ) : (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                <div className="h-12 w-12 bg-blue-100 rounded-md flex items-center justify-center">
                <FaFileAlt className="text-xl text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-sm">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
                <button
                onClick={() => {
                    setSelectedFile(null);
                    onCancel();
                }}
                className="p-2 text-gray-500 hover:text-red-500"
                >
                <FaTimes />
                </button>
            </div>
            )}
            <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
                {fileType === 'image' ? 'Image' : 'Document'} • {formatFileSize(selectedFile.size)}
            </span>
            <button
                onClick={() => {
                setSelectedFile(null);
                onCancel();
                }}
                className="text-xs text-red-500 hover:text-red-700"
            >
                Remove
            </button>
            </div>
        </div>
        )}
    </div>
  );
};

export default FileUploader;