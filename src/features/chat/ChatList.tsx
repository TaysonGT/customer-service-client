import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAxiosAuth } from '../../hooks/useAxiosAuth';
import { IChat } from '../../types/types';
import toast from 'react-hot-toast';
import ChatListItem from './ChatListItem';

interface ChatListProps {
  onSelect: (chat: IChat|null) => void;
  selected: IChat|null;
}

const ChatList: React.FC<ChatListProps> = ({ onSelect, selected }) => {
  const [chats, setChats] = useState<IChat[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const api = useAxiosAuth()
  
  useEffect(()=>{
    api.get('/chats/me')
    .then(({data})=>{
      data.success?
        setChats(data.chats)
      :toast.error(data.message)
    }).catch(()=>toast.error('Error occured when loading chats'))
    .finally(()=> setIsLoading(false))
  },[])

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSelect(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="divide-y divide-gray-200 bg-white h-full overflow-y-auto">
      {isLoading?
      [...Array(20)].map((_,i)=>
        <motion.div
          key={i}
          className="p-4 rounded-lg border-l-4 border-transparent"
        >
          <div className="flex w-full overflow-hidden justify-between items-start">
            {/* Left side - Avatar and text */}
            <div className="flex w-full items-start gap-3">
              <div className="relative w-10 h-10 shrink-0">
                <div className="relative w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent animate-[shimmer_1.5s_infinite]" />
                </div>
              </div>
              
              <div className='grow min-w-0 space-y-2'>
                <div className="flex flex-col gap-2">
                  <div className="relative h-4 w-24 rounded-md bg-gray-200 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent animate-[shimmer_1.5s_infinite]" />
                  </div>
                  <div className="relative h-2.5 w-34 rounded-md bg-gray-200 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent animate-[shimmer_1.5s_infinite]" />
                  </div>
                </div>
                
                <div className="relative h-3 w-full rounded-md bg-gray-200 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent animate-[shimmer_1.5s_infinite]" />
                </div>
              </div>
            </div>
            
            {/* Right side - Time and indicator */}
            <div className="flex flex-col items-end shrink-0 pl-2 space-y-2">
              <div className="relative h-3 w-10 rounded-md bg-gray-200 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent animate-[shimmer_1.5s_infinite]" />
              </div>
              <div className="relative w-2.5 h-2.5 rounded-full bg-gray-200 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent animate-[shimmer_1.5s_infinite]" />
              </div>
            </div>
          </div>
          
          {/* Status bar */}
          <div className="flex justify-between items-center mt-3 pt-3">
            <div className="flex gap-1.5">
              <div className="relative h-5 w-16 rounded-full bg-gray-200 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent animate-[shimmer_1.5s_infinite]" />
              </div>
              <div className="relative h-5 w-12 rounded-full bg-gray-200 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent animate-[shimmer_1.5s_infinite]" />
              </div>
            </div>
            <div className="relative h-3 w-10 rounded-md bg-gray-200 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent animate-[shimmer_1.5s_infinite]" />
            </div>
          </div>
        </motion.div>
      ):chats.map((chat, i) => (
        <ChatListItem key={i} {...{chat, setChat: onSelect, selectedChat: selected}} />
      ))}
    </div>
  );
};

export default ChatList;