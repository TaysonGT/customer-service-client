import { useAuth } from '../../context/AuthContext'
import { IChat } from '../../types/types'
import { Avatar } from '../ui'

const ChatItem = ({chat, onClick}:{chat:IChat, onClick?:()=>void}) => {
    const {currentUser} = useAuth()
    const chatUser = currentUser?.role==='client'? chat.ticket.assignee : chat.ticket.requester;
  return (
    <div
        key={chat.id}
        onClick={onClick}
        className={`p-2 flex w-full overflow-hidden justify-between items-start bg-white hover:bg-slate-50 cursor-pointer rounded-lg transition-all`}
    >
            
    {/* Left side - Avatar and text */}
    <div className="flex w-full items-start gap-3">
        <div className="relative h-full aspect-square shrink-0">
            <div className=" h-full w-full rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                <Avatar {...{src: chatUser?.avatarUrl, alt: chatUser?.firstname}} />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white 
            ${
                new Date(chatUser?.lastSeenAt||0).getTime() > new Date().getTime() - 5 * 60 *1000 ? 'bg-green-500' :
                'bg-yellow-500'
            }`}/>
        </div>
        
        <div className='grow min-w-0 space-y-1'>
            <div className="flex items-start justify-between w-full">
                <div className="flex flex-col grow min-w-0">
                <h3 className="font-medium text-gray-900">{chatUser?.firstname} {chatUser?.lastname}</h3>
                <span className="text-xs text-gray-500">{chatUser?.email}</span>
                </div>
                <div className="flex flex-col items-end shrink-0 pl-2">
                <span className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(chat.lastMessage?.createdAt || chat.startedAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                </span>
                </div>
            </div>
            <div className='w-full flex items-center gap-1'>
                <p className="text-sm truncate text-gray-600 grow">
                    {chat.lastMessage&& chat.lastMessage.senderId === currentUser?.id ? 'You: ' : ''}
                    {chat.lastMessage?.content || 'No messages yet.'}
                </p>
                {chat.unread_messages.length > 0 && (
                <span className="h-4 aspect-square rounded-full bg-blue-500 flex items-center shrink-0 justify-center text-white text-xs">
                    {chat.unread_messages.length > 99 ? '+99' : chat.unread_messages.length}
                </span>
                )}
            </div>
        </div>
    </div>                    
    </div>
  )
}

export default ChatItem