import React, { useEffect, useRef, useState } from 'react'
import { IChat, IUser } from '../../types/types'
import { TooltipText } from '../../components/TooltipText';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { useChatMessages } from '../../hooks/useChatMessages';
import { getTypingText, useTypingStatus } from '../../hooks/useTypingStatus';
import { motion } from 'framer-motion';
import { Avatar } from '../../components/ui';

interface Props {
    chat: IChat, 
    setChat: (chat:IChat|null)=>void, 
    selectedChat: IChat|null
}

const ChatListItem:React.FC<Props> = ({chat, setChat, selectedChat}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [lastVisibleText, setLastVisibleText] = useState<string>('')
  const textRef = useRef<HTMLDivElement>(null);
  const {currentUser} = useAuth()
  const { lastMessage, isLoading, unreadMessages } = useChatMessages({chatId:chat.id, updatesOnly:true, chat})
  const { typingUsers } = useTypingStatus(chat.id, currentUser, true)
  
  const client:IUser|null = chat.users.find(u=>u.clientProfile)||null

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

  useEffect(()=>{
    if(isLoading) return;
    setLastVisibleText(()=>{
      return lastMessage?
      lastMessage.senderId==currentUser?.id?
      `You:
      ${lastMessage.content}`
      :`${lastMessage.content}`
      : 'Start Chatting Now'
    })

  },[lastMessage, isLoading])

  return (
    (isLoading||!lastVisibleText)?(
    <div
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
    </div>
    )
    :
    <div
      ref={textRef}
      key={chat.id}
      className={`p-4 bg-white cursor-pointer rounded-lg transition-all ${
        selectedChat?.id === chat.id 
          ? 'bg-blue-50' 
          : 'hover:bg-gray-50'
      }`}
      onClick={() => {
        selectedChat?.id !== chat.id && setChat(null);
        setTimeout(() => setChat(chat), 0);
      }}
      onMouseOver={handleMouseEnter}
      onMouseOut={handleMouseLeave}
    >
      {showTooltip && createPortal(
        <TooltipText {...{text: lastVisibleText, position}} />,
        document.body
      )}
      
      <div className="flex w-full overflow-hidden justify-between items-start">
        {/* Left side - Avatar and text */}
        <div className="flex w-full items-start gap-3">
          <div className="relative h-full aspect-square shrink-0">
            <div className=" h-full w-full rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
              <Avatar {...{src: client?.avatarUrl, alt: client?.firstname}} />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
              client? new Date(client.lastSeenAt).getTime() > new Date().getTime() - 5 * 60 *1000 ? 'bg-green-500' :
              'bg-yellow-500' : 'bg-gray-400'
            }`}></div>
          </div>
          
          <div className='grow min-w-0 space-y-1'>
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col grow min-w-0">
                <h3 className="font-medium text-gray-900">{client?.firstname} {client?.lastname}</h3>
                <span className="text-xs text-gray-500">{client?.email}</span>
              </div>
              <div className="flex flex-col items-end shrink-0 pl-2">
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(chat.lastMessage?.createdAt || chat.startedAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                </span>
              </div>
            </div>
            <div className='w-full flex items-center gap-1'>
              {typingUsers.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1 grow"
                >
                  <span className="flex space-x-[2px]">
                    <span className="inline-block w-1 h-1 rounded-full bg-blue-500 animate-bounce" 
                      style={{ animationDelay: '0ms' }} />
                    <span className="inline-block w-1 h-1 rounded-full bg-blue-500 animate-bounce" 
                      style={{ animationDelay: '150ms' }} />
                    <span className="inline-block w-1 h-1 rounded-full bg-blue-500 animate-bounce" 
                      style={{ animationDelay: '300ms' }} />
                  </span>
                  <span className='text-sm text-gray-600'>{getTypingText(typingUsers, chat)}</span>
                </motion.div>
              ) : (
                <p className="text-sm truncate text-gray-600 grow">
                  {lastVisibleText}
                </p>
              )}
              {unreadMessages.length > 0 && (
                <span className="h-4 aspect-square rounded-full bg-blue-500 flex items-center shrink-0 justify-center text-white text-xs">
                  {unreadMessages.length > 99 ? '+99' : unreadMessages.length}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Right side - Time and indicator */}
        <div className="flex flex-col items-end shrink-0">
          
        </div>
      </div>
      
      {/* Status bar */}
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            chat.status === 'active' ? 'bg-green-100 text-green-800' : 
            chat.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-gray-100 text-gray-800'
          }`}>
            {chat.status?.charAt(0).toUpperCase() + chat.status?.slice(1)}
          </span>
          {/* {chat.tags?.length > 0 && ( */}
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
              #Wireless
            </span>
          {/* )} */}
        </div>
        <span className="text-xs text-gray-500">
          {/* {chat.channel === 'email' ? '📧 Email' : 
          chat.channel === 'web' ? '🌐 Web' : 
          chat.channel === 'phone' ? '📞 Phone' :  */}
          '💬 Chat'
          {/* } */}
        </span>
      </div>
    </div>
    )
}

export default ChatListItem