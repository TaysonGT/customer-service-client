import { useState } from "react";
import ChatList from "../../features/chat/ChatList"
import { IChat } from "../../types/types";
import ChatBoxFixed from "../../features/chat/ChatBoxFixed";
import { FaServicestack } from "react-icons/fa";

const ChatSector = ()=>{
    const [selectedChat, setSelectedChat] = useState<IChat|null>(null);
    return (
        <>
            <div className="w-full md:w-80 border-r border-gray-200 flex flex-col">
                <ChatList 
                    onSelect={setSelectedChat}
                    selected={selectedChat}
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
    )
}

export default ChatSector