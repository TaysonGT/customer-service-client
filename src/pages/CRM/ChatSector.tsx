import { useCallback, useEffect, useState } from "react";
import ChatList from "../../features/chat/ChatList"
import { IChat } from "../../types/types";
import ChatBoxFixed from "../../features/chat/ChatBoxFixed";
import { FaServicestack } from "react-icons/fa";
import { useAxiosAuth } from "../../hooks/useAxiosAuth";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { useSearchParams } from "react-router";
import SidebarDataManager from "../../features/files/SidebarDataManager";
import { useChatMessages } from "../../hooks/useChatMessages";

const ChatSector = ()=>{
    const [searchParams, setSearchParams] = useSearchParams()
    const [selectedChat, setSelectedChat] = useState<IChat|null>(null);
    const [chats, setChats] = useState<IChat[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [sideSector, setSideSector] = useState<'files'|'details'>('files')
    const api = useAxiosAuth()

    const { groups, fileMessages, sendMessage, participants, loadMore, hasMore, isLoading: isChatLoading } = useChatMessages({ chatId: selectedChat?.id });
    
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
        refetch()
    },[])

    useEffect(()=>{
        if(selectedChat?.id===searchParams.get('selected')) return;

        if(chats&&searchParams.get('selected')){
            setSelectedChat(chats.find((chat)=>chat.id===searchParams.get('selected'))||null)
        }
    },[searchParams, chats])
    
    const updateSelectedChat = useCallback((chat: IChat | null) => {
        setSelectedChat(chat);
        const params = new URLSearchParams();
        if (chat) {
        params.set('selected', chat.id);
        } else {
        params.delete('selected');
        }
        setSearchParams(params);
    }, [setSearchParams]);

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
                    onSelect={(chat)=>{
                        updateSelectedChat(chat)
                    }}
                    selected={selectedChat}
                    chats={chats}
                />
            </div>
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {selectedChat?
                <div className="w-full h-full flex">
                    <div className='flex-5 h-full'>
                        <ChatBoxFixed {... {
                            chat: selectedChat, 
                            unsetChat:()=>setSelectedChat(null),
                            groups, sendMessage, participants, loadMore, hasMore, isLoading: isChatLoading
                        }}/>
                    </div>
                    <div className='h-full flex-1'>
                        {/* <div className="flex items-center p-3 gap-3 border-b border-gray-200 w-full">
                            <button
                                onClick={() => setSideSector('files')}
                                className={`px-4 py-2 rounded-md ${sideSector === 'files' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                Files
                            </button>
                            <button
                                onClick={() => setSideSector('details')}
                                className={`px-4 py-2 rounded-md ${sideSector === 'details' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                Details
                            </button> */}
                        {/* </div> */}
                        <div className="p-4 border-b border-l border-gray-200 bg-white relative flex gap-3.5">
                            {/* <h2 className="text-lg font-semibold text-gray-900">Chat's Media</h2>
                            <h2 className="text-lg font-semibold text-gray-900">Ticket Details</h2> */}
                            <h2 className="text-lg font-semibold text-gray-900">Ticket Details</h2>
                            <div onClick={() => setSideSector(prev=>prev==='details'?'files':'details')} className={`bg-green-500/20 duration-200 cursor-pointer h-7 rounded-2xl flex w-14 relative`}><span className={`rounded-full w-5 h-5 absolute top-1/2 -translate-y-1/2 left-1 bg-green-500  ${sideSector==='details'?'left-1 translate-x-0':'translate-x-7'} duration-200`}/></div>
                            <h2 className="text-lg font-semibold text-gray-900">Chat Files</h2>
                            {/* <p className="text-xs text-gray-500 mt-1">
                                {user.firstname}'s files
                            </p> */}
                        </div>
                        <SidebarDataManager {...{
                            messages: fileMessages,
                            isChatLoading,
                            user: selectedChat.users?.find(p => p.clientProfile)
                        }}/>
                    </div>
                </div>
                    :
                <div className='w-full h-full flex flex-col gap-2 justify-center items-center text-center'>
                    <FaServicestack className='text-accent text-[92px]'/>
                    <p className='text-3xl font-bold'>Haus</p>
                    <p className='text-sm text-gray-700'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, excepturi?</p>
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