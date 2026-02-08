import React, { useEffect, useState } from 'react'
import { IChat } from '../../types/types';
import { useAxiosAuth } from '../../hooks/useAxiosAuth';
import toast from 'react-hot-toast';
import ChatItem from './ChatItem';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';

interface Props{
    show: boolean;
    hide: ()=>void;
    ref: React.RefObject<HTMLDivElement|null>
    unread: number;
}

const MessagesDropdown:React.FC<Props> = ({show, ref, hide, unread}) => {
    const [chats, setChats] = useState<IChat[]>([])
    const [isLoading, setIsLoading] = useState(true)
    
    const api = useAxiosAuth()

    const nav = useNavigate()
    const {currentUser} = useAuth()

    const refetch = async()=>{
        setIsLoading(true)
        await api.get('/chats/me')
        .then(({data})=>{
            if(!data.success) return toast.error(data.message)
            setChats(data.chats)
        }).catch(()=>toast.error('Error occured when loading chats'))
        .finally(()=> setIsLoading(false))
    }

    useEffect(()=>{
        show&&refetch()
    },[show])

  return (
    <div ref={ref} className={`absolute z-200 mt-2 p-4 right-0 bg-white overflow-hidden flex flex-col w-85 text-nowrap text-gray-700 rounded-lg border-gray-200 border scale-y-95 opacity-0 top-[80%] left-1/2 -translate-x-1/2  shadow-lg text-sm duration-200 ${show? 'pointer-events-auto opacity-100 top-[100%] scale-y-100 origin-top':'pointer-events-none'} `}>
        <div className='flex items-center pb-2 border-b border-gray-200 justify-between flex-wrap gap-x-6 gap-y-2 mb-2'>
            <p className="font-medium text-base">Conversations</p>
            {unread>0&&<span className='p-1 px-2 rounded-lg bg-indigo-500 text-white text-sm'>{unread}</span>}
        </div>
        <div className='w-full flex flex-col max-h-80 overflow-y-auto'>
            {
                isLoading?
                [...Array(3)].map((_,idx)=>
                <div
                key={idx}
                className="py-3 px-2 rounded-lg"
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
                </div>):
                chats.length>0?
                    chats.map((chat)=>
                        <ChatItem onClick={()=>{
                            currentUser?.role==='client'? 
                            nav(`/tickets/${chat.ticket.id}/chat`)
                            : nav('/support/chats?selected='+chat.id);
                            hide();
                        }} key={chat.id} chat={chat}/>
                    )
                :
                <p className="text-sm text-gray-600">No messages...</p>
            }
        </div>
    </div>
  )
}

export default MessagesDropdown