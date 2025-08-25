import { useEffect, useState } from "react";
import ChatList from "../../features/chat/ChatList"
import { IChat } from "../../types/types";
import ChatBoxFixed from "../../features/chat/ChatBoxFixed";
import { FaServicestack } from "react-icons/fa";
import { useAxiosAuth } from "../../hooks/useAxiosAuth";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";

const ChatSector = ()=>{
    const [selectedChat, setSelectedChat] = useState<IChat|null>(null);
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

    return (
        isLoading? (
            <div className="w-full h-full flex justify-center items-center">
                <Loader size={30} thickness={6} />
            </div>
        ):
        chats.length>0?
        <>
            <div className="w-full md:w-80 border-r border-gray-200 flex flex-col">
                <ChatList 
                    onSelect={setSelectedChat}
                    selected={selectedChat}
                    chats={chats}
                />
            </div>
            <div className="flex-1 flex flex-col min-w-0">
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
        </>
        :<div className="w-full h-full flex justify-center items-center">
            <p className='text-gray-400'>No chats found</p>
        </div>
    )
}

export default ChatSector