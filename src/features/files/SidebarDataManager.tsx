import React, { useEffect, useState } from 'react';
import FileBox from './FileBox';
import { IChat } from '../../types/types';
import { useAxiosAuth } from '../../hooks/useAxiosAuth';
import { IoDocumentText, IoImagesOutline, IoDocumentTextOutline, IoPeopleOutline, IoFolderOpenOutline } from 'react-icons/io5';
import Loader from '../../components/Loader';
import supabase from '../../lib/supabase';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {Avatar} from '../../components/ui';

interface Props {
  selectedChat: IChat | null;
}

export interface IAccount {
  username: string;
  email: string;
  password: string;
}

export interface FileMetadata {
  id: string;
  path: string;
  name: string;
  size: number;
  type: string;
  signedUrl: string;
  createdAt?: string;
}

const sectorOptions = [
  { value: 'all', label: 'All Files', icon: IoFolderOpenOutline },
  { value: 'documents', label: 'Documents', icon: IoDocumentTextOutline },
  { value: 'images', label: 'Images', icon: IoImagesOutline },
  { value: 'accounts', label: 'Accounts', icon: IoPeopleOutline }
];

const SidebarDataManager: React.FC<Props> = ({ selectedChat }) => {
  const api = useAxiosAuth();
  const [documents, setDocuments] = useState<FileMetadata[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [images, setImages] = useState<FileMetadata[]>([]);
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [sector, setSector] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selectedChat) return;

        const clientId = selectedChat?.users?.find(p => p.clientProfile)?.id;
        if (!clientId) throw new Error('No client provided');

        setIsLoading(true);

        const { data } = await api.get(`/data/all/${clientId}`);
        setAccounts(data.accounts);

        // Process images and documents in parallel
        const [imagesWithUrls, docsWithUrls] = await Promise.all([
          Promise.all(
            data.images.map(async (img: FileMetadata) => {
              const { data: signedUrl } = await supabase.storage
                .from('clients_data')
                .createSignedUrl(img.path, 3600);
              return { ...img, signedUrl: signedUrl?.signedUrl || '' };
            })
          ),
          Promise.all(
            data.documents.map(async (doc: FileMetadata) => {
              const { data: signedUrl } = await supabase.storage
                .from('clients_data')
                .createSignedUrl(doc.path, 3600);
              return { ...doc, signedUrl: signedUrl?.signedUrl || '' };
            })
          )
        ]);

        setDocuments(docsWithUrls.filter(doc => doc.signedUrl));
        setImages(imagesWithUrls.filter(img => img.signedUrl));
      } catch (error) {
        toast.error('Failed to load client data');
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedChat, api]);

  const renderEmptyState = (message: string) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-8 text-gray-400"
    >
      <IoDocumentText className="text-4xl mb-2" />
      <p className="text-sm">{message}</p>
    </motion.div>
  );

  const renderData = () => {
    switch (sector) {
      case 'accounts':
        return accounts.length > 0 ? (
          <div className="space-y-3 p-2">
            {accounts.map((account, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-white rounded-lg shadow-xs border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <Avatar size="sm" />
                  <div className="overflow-hidden">
                    <p className="font-medium text-gray-900 truncate">{account.email}</p>
                    <p className="text-xs text-gray-500 truncate">{account.username}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : renderEmptyState('No accounts found');

      case 'all':
        const allFiles = [...documents, ...images];
        return allFiles.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 p-2">
            {allFiles.map((file, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FileBox file={file} />
              </motion.div>
            ))}
          </div>
        ) : renderEmptyState('No files found');

      case 'documents':
        return documents.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 p-2">
            {documents.map((doc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FileBox file={doc} />
              </motion.div>
            ))}
          </div>
        ) : renderEmptyState('No documents found');

      case 'images':
        return images.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 p-2">
            {images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FileBox file={img} />
              </motion.div>
            ))}
          </div>
        ) : renderEmptyState('No images found');

      default:
        return renderEmptyState('Invalid selection');
    }
  };

  return (
  <div className="relative h-full flex flex-col bg-gray-50 border-l border-gray-200">
    {isLoading ? (
      <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/80">
        <Loader size={30} thickness={6} />
      </div>
    ) : selectedChat ? (
      <>
        {/* Header with lower z-index */}
        <div className="p-4 border-b border-gray-200 relative z-10">
          <h2 className="text-lg font-semibold text-gray-900">Client Data</h2>
          <p className="text-xs text-gray-500 mt-1">
            {selectedChat.users?.find(p => p.clientProfile)?.firstname}'s files
          </p>
        </div>

        {/* Navigation buttons with lower z-index */}
        <div className="p-3 border-b border-gray-200 relative z-10">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {sectorOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSector(option.value)}
                className={`flex items-center justify-center gap-1 flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  sector === option.value
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <option.icon className="text-base" />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-2 relative z-0">
          <AnimatePresence mode="wait">
            {renderData()}
          </AnimatePresence>
        </div>
      </>
    ) : (
      renderEmptyState('Select a chat to view files')
    )}
  </div>
  );
};

export default SidebarDataManager;