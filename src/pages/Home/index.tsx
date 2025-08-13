import React, { useEffect, useRef, useState } from 'react'
import { IChat } from '../../types/types'
import ChatBoxFixed from '../../features/chat/ChatBoxFixed'
import ChatListItem from '../../features/chat/ChatsListItem'
import { FaServicestack } from 'react-icons/fa'
import DataManager from '../../features/files/SidebarDataManager'
import { useAxiosAuth } from '../../hooks/useAxiosAuth'
import toast from 'react-hot-toast'

const HomePage: React.FC = ()=>{
  const [selectedChat, setSelectedChat] = useState<IChat|null>(null)
  const [chats, setChats] = useState<IChat[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const containerRef = useRef<HTMLDivElement>(null);
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
      if (e.key === 'Escape') setSelectedChat(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div ref={containerRef} className={`relative flex h-full bg-white	`}>
      {isLoading?
        <div className='h-full w-full flex flex-col gap-6 justify-center items-center'>
            <p className='text-xl'>Please wait...</p>
        </div>
        :
        <>
          <title>Haus | Dashboard</title>
          <div className='flex-1/5 overflow-hidden flex flex-col h-full select-none border-r border-gray-200 z-2'>
            <h1 className='h-20 flex items-center text-2xl px-6 border-b border-gray-200'>Chats</h1>
            <div className='flex flex-col gap-1 overflow-hidden w-full grow overflow-y-auto p-2
              [&::-webkit-scrollbar]:w-0.5
              [&::-webkit-scrollbar-thumb]:!h-0.5
              [&::-webkit-scrollbar-thumb]:bg-gray-200 
              [&::-webkit-scrollbar-thumb]:rounded-full
              hover:[&::-webkit-scrollbar-thumb]:bg-gray-400'>
              {chats.map((chat, i)=>
                <ChatListItem key={i} {... {chat, setChat:(chat:IChat|null)=>setSelectedChat(chat), selectedChat}} />
              )}
            
            </div>
          </div>
          <div className='flex-3/5 min-w-0'>
            {selectedChat?
              <ChatBoxFixed {... {chat: selectedChat, unsetChat:()=>setSelectedChat(null)}}/>
              :
              <div className='w-full h-full flex flex-col gap-2 justify-center items-center text-center'>
                <FaServicestack className='text-[92px]'/>
                <p className='text-xl'>Customer Service</p>
                <p className='text-xs text-gray-700'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, excepturi?</p>
              </div>
            }
          </div>
          <div className='flex-1/5 flex flex-col border-l border-gray-200'>
            <DataManager {... {selectedChat}}/>
          </div>
        </>
      }
    </div>
  )
}

export default HomePage