import { useEffect, useState } from 'react'
import { IChat } from '../../types/types'
import { useAxiosAuth } from '../../hooks/useAxiosAuth'

const ChatBubble = () => {
    const [chats, setChats] = useState<IChat[]>([])
    const [isLoading, setIsloading] = useState<boolean>(true)
    const [isActive, setIsActive] = useState<boolean>(false)
    const api = useAxiosAuth()

    useEffect(()=>{
        api.get('/chats/me')
        .then(({data})=>{
            setChats(data.chats)
            setIsloading(false)
        })
    },[])
    
  return (
    <div onClick={()=>setIsActive(true)} className='fixed bottom-2 right-6 bg-accent text-white hover:bg-[#6ea6ff] duration-150 rounded-4xl p-4 border cursor-pointer group/primary'>
        <div>My Chats</div>
        <div className={`absolute right-0 origin-bottom scale-y-95 pointer-events-none opacity-0 bottom-[80%] rounded bg-white text-black shadow-lg text-sm duration-400 w-[200px] ${isActive&& ' opacity-100 bottom-[105%] scale-y-100 pointer-events-auto'}`}>
            {chats.map((chat, i)=>
                <div key={i} className='relative not-last:border-b border-gray-400 text-nowrap group/secondary px-4 py-2 '>
                    <div className='flex items-center justify-between'>
                        <div className='font-bold'>{chat.title}</div>
                        <span className={`text-xs text-gray-700`}>{new Date(chat.lastMessage?.createdAt||chat.startedAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                    {chat.lastMessage?
                        <div className='flex gap-1 w-full text-gray-700'> 
                            <p className='flex gap-1'>
                                {chat.participants?.find(p=>p.id==chat.lastMessage!.senderId)?.firstname}
                                {chat.participants?.find(p=>p.id==chat.lastMessage!.senderId)?.lastname}:
                            </p>
                            <p className='flex items-center text-ellipsis grow'>
                                {chat.lastMessage.content}
                            </p>
                        </div>
                        :
                        <div className=''>{'Start Chatting Now!'}</div>
                    }
                </div>
            )}
        </div>
    </div>
  )
}

export default ChatBubble