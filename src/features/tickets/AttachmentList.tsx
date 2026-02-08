// File: src/components/ui/AttachmentList.tsx
import React, { useEffect, useState } from 'react';
import { IFile } from '../../types/types';
import { FiImage, FiMusic, FiFileText, FiPaperclip } from 'react-icons/fi';
import { Button, FileUploadWithPreview, Modal } from '../../components/ui';
import { createAxiosAuthInstance } from '../../services/axiosAuth';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import supabase from '../../lib/supabase';
import { getFileType } from '../../utils/file.utils';
import { useAuth } from '../../context/AuthContext';
import { MdPreview } from 'react-icons/md';
import { IoEye } from 'react-icons/io5';
import ImagePreview from '../../components/ImagePreview';
import { FaRegEye } from 'react-icons/fa6';
import { GiBleedingEye } from "react-icons/gi";

interface AttachmentListProps {
  className?: string;
  showAddAttachment?: boolean;
  onClose?: ()=>void;
  ticketId: string;
}

export const AttachmentList: React.FC<AttachmentListProps> = ({
  className = '',
  ticketId,
  showAddAttachment,
  onClose
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [attachments, setAttachments] = useState<IFile[]>([])
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>('')
  const [previewAlt, setPreviewAlt] = useState<string>('')

  const {currentUser} = useAuth()

  const api = createAxiosAuthInstance()
  const refetch = async()=>{
    setIsLoading(true)
    await api.get(`/tickets/${ticketId}/attachments`)
    .then(({data})=>{
      if(!data.success) throw new Error(data.message)
      setAttachments(data.attachments)
    }).catch(error=>{
      toast.error(error.message)
    })
    setIsLoading(false)
  }

  useEffect(()=>{
    refetch()
  },[ticketId])

  const uploadFile = async(file: File, uploadType: string)=>{
    const filePath = `${ticketId}/${Date.now()}-${file.name}`;

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('ticket_attachments')
      .upload(filePath, file, {
        metadata: {
          ticket_id: ticketId.toString(),
          uploaded_by: currentUser?.id
        }
      });

    if (uploadError) {
      throw new Error(uploadError.message)
    };

    const {data} = await api.post(`/tickets/${ticketId}/attachments`, {attachment:
      {
        bucket: 'ticket_attachments',
        name: file.name,
        type: uploadType,
        path: uploadData.path,
        size: file.size
      }
    });

    if(!data.success) throw new Error('Error uploading files')

    return data
  }

  const handleUpload = async()=>{
    try {
      if(uploadFiles.length === 0) throw new Error('Please select a file');
      
      setIsUploading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Unauthenticated access');
      }
      
      for(const file of uploadFiles){
        const type = getFileType(file.name)
        await uploadFile(file, type)
        .then((data)=>
          !data.success&& toast.error(data.message)
        )
      }
      onClose&& onClose();
      toast.success('Files uploaded successfully!')
      refetch()
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  }

  const getFileIcon = (type: IFile['type']) => {
    switch (type) {
      case 'image':
        return <FiImage className="w-4 h-4" />;
      case 'audio':
        return <FiMusic className="w-4 h-4" />;
      case 'document':
        return <FiFileText className="w-4 h-4" />;
      default:
        return <FiPaperclip className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      {showPreview&&<ImagePreview src={previewImage} alt={previewAlt} show={showPreview} onClose={() => setShowPreview(false)} type={'ticket_attachment'} />}
      
      {isLoading?
        <div className='w-full relative flex items-center justify-center py-2'>
          <Loader size={30} thickness={6} />
        </div>
      :attachments.length?
      <div className="space-y-2 max-h-50 overflow-y-auto">
        {attachments.map((file, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-2 bg-gray-50 rounded-md hover:bg-gray-100"
          >
            <span className="text-lg">{getFileIcon(file.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(file.size)} • {file.type}
              </p>
            </div>
            <button onClick={()=>{
              setPreviewImage(file.path);setPreviewAlt(file.name);setShowPreview(true)}} className='flex gap-1.5 items-center text-xs text-blue-600 hover:underline p-2 px-3'>
              <FaRegEye className='text-lg'/>
              Preview
            </button>
          </div>
        ))}
      </div>
      :<div>
        <p className="text-sm text-gray-500">No attachments found.</p>
      </div>
      }
      {/* <FileTable {...{ files: attachments, isLoading: false }} /> */}
      {showAddAttachment&&
      <>
        <Modal {...{isOpen: showAddAttachment, onClose: ()=>onClose&& onClose(), title: 'Add Attachment'}} size='md'>
          <FileUploadWithPreview {...{onFilesChange: (files)=>setUploadFiles(files)}} />
          <div className='flex mt-4 gap-4'>
            <Button variant='outline' size='sm' fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button variant='primary' size='sm' fullWidth disabled={isUploading} onClick={handleUpload}>
              {isUploading? 
                <div className='flex gap-2 items-center'><Loader size={16} thickness={2} color='white'/> Uploading...</div>
                : 'Upload'
              }
            </Button>
          </div>
        </Modal>
      </>
      }
    </div>
  );
};