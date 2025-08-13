import { MdCheck, MdOutlineTimelapse } from 'react-icons/md';
import { IChatMessage } from '../../types/types';
import { RiCheckDoubleFill, RiErrorWarningFill } from 'react-icons/ri';
import { FaDownload, FaFileAlt, FaPlay } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import supabase from '../../lib/supabase';

const URL_REGEX = /(?:(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z]{2,}){1,}(?:\/[^\s]*)?|(?:[a-z0-9-]+\.(?:com|net|org|io|co|gov|edu|me|ly|app|dev|ai|sh|gl|fm|bit\.ly|mm\.co)[^\s]*))/gi;

// Memoized Message Component
const Message = ({ message, isCurrentUser, i }: { message: IChatMessage, isCurrentUser: boolean, i: number }) => {
  const [url, setUrl] = useState<string|null>(null)

  const messageClass = isCurrentUser
    ? 'bg-[#F4F6F6] mr-auto pl-6'
    : 'bg-emerald-800 text-white ml-auto';
  const headerClass = isCurrentUser
    ? 'rounded-tl-none'
    : 'rounded-tr-none';

    useEffect(()=>{
      if(message.type==='text') return;
      const getUrl = async()=>{
        if(!message.file) return;
        console.log(message.file.path)
        const {data:url} = await supabase.storage
          .from('chats_uploads')
          .createSignedUrl(message.file.path, 3600)
          setUrl(url?.signedUrl||null)
      }
      getUrl()
    },[])

  // Function to detect URLs and convert them to links
   const renderWithLinks = (text: string) => {
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = URL_REGEX.exec(text)) !== null) {
      // Add text before the URL
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Process the URL
      let url = match[0];
      let displayUrl = url;
      
      // Add https:// if it starts with www.
      if (url.startsWith('www.')) {
        url = `https://${url}`;
      }
      // Truncate long URLs for display
      else if (url.length > 30) {
        displayUrl = `${url.substring(0, 27)}...`;
      }
      
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={isCurrentUser ? 'text-blue-600 hover:underline' : 'text-blue-200 hover:underline'}
          onClick={(e) => e.stopPropagation()}
        >
          {displayUrl}
        </a>
      );
      
      lastIndex = URL_REGEX.lastIndex;
    }
    
    // Add remaining text after last URL
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };


   const renderMessageContent = () => {
    switch (message.type) {
      case 'audio':
        return (
          <div className="flex items-center gap-3 p-2">
            <button 
              onClick={() => {
                const audio = new Audio(url||undefined);
                audio.play();
              }}
              className="p-2 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200"
            >
              <FaPlay />
            </button>
            <span>Audio Message</span>
            <a 
              href={url||'#'} 
              download={`audio-${message.createdAt}.wav`}
              className="ml-auto p-2 text-gray-500 hover:text-blue-500"
            >
              <FaDownload />
            </a>
          </div>
        );

      case 'image':
        return (
          <div className="max-w-xs">
            <img 
              src={message.content} 
              alt="Sent image" 
              className="rounded-md max-h-60 object-contain"
              onClick={() => window.open(message.content, '_blank')}
            />
            <a 
              href={message.content} 
              download={`image-${message.createdAt}.jpg`}
              className="mt-2 inline-flex items-center text-sm text-blue-500 hover:underline"
            >
              <FaDownload className="mr-1" />
              Download
            </a>
          </div>
        );

      case 'document':
        return (
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <FaFileAlt className="text-2xl text-gray-500" />
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium">{message.file?.name || 'File'}</p>
              <p className="text-xs text-gray-500">{message.file?.size || ''}</p>
            </div>
            <a 
              href={message.content} 
              download={message.file?.name || `file-${message.createdAt}`}
              className="p-2 text-blue-500 hover:text-blue-700"
            >
              <FaDownload />
            </a>
          </div>
        );

      case 'text':
      default:
        const lines = message.content.split('\n');
        return (
          <p className="mt-1 min-w-10 flex flex-col">
            {lines.map((line, idx) => {
              const firstChar = line.trim()[0];
              const isArabic = firstChar ? /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(firstChar) : false;
              return (
                <span key={idx} dir={isArabic ? 'rtl' : 'ltr'} className={`whitespace-pre-wrap ${isArabic ? 'text-right' : 'text-left'}`}>
                  {renderWithLinks(line)}
                  {idx < lines.length - 1 && <br />}
                </span>
              );
            })}
          </p>
        );
    }
  };

  return (
    <div className={`p-2 z-0 rounded-md ${messageClass} ${i === 0 && headerClass} relative`}>
      {renderMessageContent()}
      {isCurrentUser && (
        message.status === "sending" ?
          <MdOutlineTimelapse className='bottom-2 left-1 text-secondary-text text-sm absolute' />
          :message.status === "seen" ?
            <RiCheckDoubleFill className='bottom-2 left-1 text-accent text-sm absolute' />
            : message.status === "delivered" ?
              <MdCheck className='bottom-2 left-1 text-secondary-text text-sm absolute' />
              : <RiErrorWarningFill className='bottom-2 left-1 text-red-500 text-sm absolute' />
      )}
    </div>
  );
};

export default Message;
