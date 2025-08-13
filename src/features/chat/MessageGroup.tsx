import { IMessageGroup } from '../../types/types';
import { memo } from 'react'
import Message from './Message';


// Memoized MessageGroup Component
const MessageGroup = memo(({ 
  group,
  isCurrentUser
}: { 
  group: IMessageGroup;
  isCurrentUser: boolean;
}) => {
  const groupClass = isCurrentUser 
    ? 'items-start' 
    : 'items-end';

  return (
    group.senderInfo?
    <div className={`p-2 px-3 flex items-start gap-2 ${!isCurrentUser? 'flex-row-reverse': '' }`}>
      {group.showHeader && (
        <div className='flex-none h-8 w-8 rounded-full overflow-hidden border-[1px] border-secondary-text'>
          <img
            src={group.senderInfo.avatarUrl||'/src/assets/imgs/1.webp'}
            className={`w-full h-full object-cover rounded-full`}
            alt="User avatar"
          />
        </div>
      )}
      <div className={`flex flex-col gap-0.5 grow ${groupClass}`}>
        <div className={`text-xs ${isCurrentUser ? 'text-primary-text' : 'text-emerald-800'} font-semibold`}>
          {group.senderInfo.firstname} {group.senderInfo.lastname}
        </div>
        {group.messages.map((message, i) => (
          <Message key={i} {...{message, isCurrentUser, i}}/>
        ))}
        <span className={`text-xs text-gray-700`}>
          {new Date(group.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
        </span>
      </div>
    </div>
  
  :
  <div>null</div>)
});


export default MessageGroup