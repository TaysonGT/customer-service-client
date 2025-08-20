import { FiDownload, FiPlus, FiGrid, FiList, FiSearch } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { Button, Card } from '../../components/ui';
import FileGrid from './FileGrid';
import FileTable from './FileTable';
import DarkBackground from '../../components/DarkBackground';
import UploadFile from './UploadFile';
import { useAxiosAuth } from '../../hooks/useAxiosAuth';
import { useAuth } from '../../context/AuthContext';
import { IAccount } from './SidebarDataManager';
import supabase from '../../lib/supabase';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

export interface FileItem {
  id: string;
  name: string;
  type: 'image' | 'document' | 'other';
  size: number;
  uploaded_at: string;
  path: string;
  signedUrl: string;
}

const FileDisplay = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showUpload, setShowUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<FileItem[]>([])
  const [accounts, setAccounts] = useState<IAccount[]>([])
  const api = useAxiosAuth()
  const {currentUser} = useAuth()

  useEffect(()=>{
    const fetchData = async () => {
      try {
        if (!currentUser) return;

        const clientId = currentUser.id;
        if (!clientId) throw new Error('No client provided');

        setIsLoading(true);

        const { data } = await api.get(`/data/all/${clientId}`);
        setAccounts(data.accounts)

        // Process images and documents in parallel
        const filesWithUrls = await Promise.all(
            [...data.images, ...data.documents].map(async (file: FileItem) => {
                const { data: signedUrl } = await supabase.storage
                .from('clients_data')
                .createSignedUrl(file.path, 3600);
                return { ...file, signedUrl: signedUrl?.signedUrl || '' };
        }))
            
        setFiles(filesWithUrls.filter(file=> file.signedUrl));

        } catch (error) {
            toast.error('Failed to load client data');
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
  }, []);
    

  const data:FileItem[] = files.length>0? files: [
    { id: '1', name: 'invoice.pdf', type: 'document', size: 2400000, uploaded_at: '2023-06-15', path: '', signedUrl: '' },
    { id: '2', name: 'profile.jpg', type: 'image', size: 1200000, uploaded_at: '2023-06-14', path: '', signedUrl: '' },
    { id: '3', name: 'contract.docx', type: 'document', size: 3100000, uploaded_at: '2023-06-10', path: '', signedUrl: '' },
    { id: '4', name: 'screenshot.png', type: 'image', size: 800000, uploaded_at: '2023-06-08', path: '', signedUrl: '' },
  ];
  return (
    <Card rounded="lg" shadow="lg" className="overflow-hidden">
      {showUpload&&
      <>
        <DarkBackground {...{show: showUpload, cancel: ()=>setShowUpload(false)}}/>
        <UploadFile {...{cancel: ()=>setShowUpload(false)}}/>
      </>
      }
      {/* Header with advanced controls */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-800">Files & Documents</h3>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={`${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={() => setViewMode('grid')}
              icon={<FiGrid />}
            />
            <Button
              variant="ghost"
              size="sm"
              className={`${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : ''}`}
              onClick={() => setViewMode('table')}
              icon={<FiList />}
            />
            <div className="hidden sm:flex gap-2">
              <Button variant="outline" size="sm" icon={<FiDownload />}>
                Export
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                icon={<FiPlus />}
                onClick={() => setShowUpload(true)}
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced File Display */}
      <div className="p-4">
        
        {isLoading?
          <div className='flex justify-center py-10'>
            <Loader size={30} thickness={6} />
          </div>
        :viewMode === 'grid' ? (
          <FileGrid {...{files, isLoading}} />
        ) : (
          <FileTable {...{files, isLoading}} />
        )}
      </div>

      {/* Mobile Floating Action Button */}
      <div className="sm:hidden fixed bottom-6 right-6">
        <Button
          variant="primary"
          size="lg"
          className="rounded-full shadow-lg"
          icon={<FiPlus className="text-xl" />}
          onClick={() => setShowUpload(true)}
        />
      </div>
    </Card>
  );
};

export default FileDisplay