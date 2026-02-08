import React, { useEffect, useState } from 'react';
import FileBox from './FileBox';
import { IChatMessage, IUser } from '../../types/types';
import { IoDocumentText, IoImagesOutline, IoDocumentTextOutline, IoFolderOpenOutline, IoMusicalNotes } from 'react-icons/io5';
import supabase from '../../lib/supabase';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../components/Loader';

interface Props {
  messages:IChatMessage[]
  isChatLoading: boolean;
  user?: IUser;
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
  uploaded_at: string;
}

const sectorOptions = [
  { value: 'all', label: 'All', icon: IoFolderOpenOutline },
  { value: 'documents', label: 'Documents', icon: IoDocumentTextOutline },
  { value: 'images', label: 'Images', icon: IoImagesOutline },
  { value: 'audio', label: 'Audio', icon: IoMusicalNotes }
];

const SidebarDataManager: React.FC<Props> = ({ messages, user, isChatLoading }) => {
  const [documents, setDocuments] = useState<FileMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState<FileMetadata[]>([]);
  const [audio, setAudio] = useState<FileMetadata[]>([]);
  const [sector, setSector] = useState<string>('all');

  const getLink = async(message:IChatMessage)=>{
    if(message.localId) return message.file?.path || ''

    const { data } = await supabase.storage
    .from('chats_uploads')
    .createSignedUrl(message.file!.path, 3600);

    return data?.signedUrl || '';
  }

  useEffect(() => {
    if(isChatLoading) return;
    const organizeFiles = async () => {
      try {
        const imagesWithUrls:FileMetadata[] = []
        const docsWithUrls:FileMetadata[] = []
        const audioWithUrls:FileMetadata[] = []

        await Promise.all(
          messages.map(async (message: IChatMessage) => {
            if(!message.file) return;
            const file = message.file;
            
            const filePath = await getLink(message);
            
            if(file.type==='document'){
              docsWithUrls.push({...file, path: filePath})
            }else if(file.type==='image'){
              imagesWithUrls.push({...file, path: filePath})
            }else if(file.type==='audio'){
              audioWithUrls.push({...file, path: filePath})
            }
          })
        )

        setAudio(audioWithUrls.filter(audio => audio.path).sort((a,b)=>b.uploaded_at.localeCompare(a.uploaded_at)));
        setDocuments(docsWithUrls.filter(doc => doc.path).sort((a,b)=>b.uploaded_at.localeCompare(a.uploaded_at)));
        setImages(imagesWithUrls.filter(img => img.path).sort((a,b)=>b.uploaded_at.localeCompare(a.uploaded_at)));

      } catch (error) {
        toast.error('Failed to load client data');
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    organizeFiles();
  }, [messages, isChatLoading]);

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
      case 'all':
        const allFiles = [...documents, ...images, ...audio];
        return allFiles.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 p-2">
            {allFiles.sort((a,b)=>b.uploaded_at.localeCompare(a.uploaded_at)).map((file, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <FileBox file={file} />
              </motion.div>
            ))}
          </div>
        ) : renderEmptyState('No files found')

      case 'audio':
        return audio.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 p-2">
            {audio.map((file, i) => (
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
    {
    // isLoading ? (
    //   <div className="absolute inset-0 flex items-center justify-center">
    //     <Loader size={30} thickness={6} />
    //   </div>
    // ) : 
    user ? (
      <>
        {/* Header with lower z-index */}
        {/* <div className="p-4 border-b border-gray-200 bg-white relative">
          <h2 className="text-lg font-semibold text-gray-900">Chat's Data</h2>
          <p className="text-xs text-gray-500 mt-1">
            {user.firstname}'s files
          </p>
        </div> */}

        {/* Navigation buttons with lower z-index */}
        <div className="p-3 border-b border-gray-200 relative">
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
          {isLoading?
          <div className='w-full h-full flex items-center justify-center'>
            <Loader size={30} thickness={6} />
          </div>
          :
          <AnimatePresence mode="wait">
            {renderData()}
          </AnimatePresence>}
        </div>
      </>
    ) : (
      renderEmptyState('Select a chat to view files')
    )}
  </div>
  );
};

export default SidebarDataManager;