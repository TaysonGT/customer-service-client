import { IMessageGroup } from '../../types/types';
import { memo } from 'react'
import Message from './Message';
import { Avatar } from '../../components/ui';


// Memoized MessageGroup Component
const MessageGroup = memo(({ 
  group,
  isCurrentUser,
  audio,
  setAudio
}: { 
  group: IMessageGroup;
  isCurrentUser: boolean;
  audio: string|null;
  setAudio: (id: string|null)=>void;
}) => {
  const groupClass = isCurrentUser 
    ? 'items-start' 
    : 'items-end';

  return (
    group.senderInfo?
    <div className={`p-2 px-3 flex items-start gap-2 ${!isCurrentUser? 'flex-row-reverse': '' }`}>
      {group.showHeader && (
          <Avatar
            src={group.senderInfo.avatarUrl}
            alt="User avatar"
            size='sm'
          />
      )}
      <div className={`flex flex-col gap-0.5 grow ${groupClass}`}>
        <div className={`text-xs ${isCurrentUser ? 'text-primary-text' : 'text-emerald-800'} font-semibold`}>
          {group.senderInfo.firstname} {group.senderInfo.lastname}
        </div>
        {group.messages.map((message, i) => (
          <Message key={i} {...{message, isCurrentUser, audio, setAudio, i}}/>
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