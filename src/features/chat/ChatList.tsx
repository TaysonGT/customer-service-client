import React, { useEffect } from 'react';
import { IChat } from '../../types/types';
import ChatListItem from './ChatListItem';

interface ChatListProps {
  onSelect: (chat: IChat|null) => void;
  selected: IChat|null;
  chats: IChat[];
}

const ChatList: React.FC<ChatListProps> = ({ onSelect, selected, chats }) => {

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onSelect(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="divide-y divide-gray-200 bg-white h-full overflow-y-auto">
      {chats.map((chat, i) => (
        <ChatListItem key={i} {...{chat, setChat: onSelect, selectedChat: selected}} />
      ))}
    </div>
  );
};

export default ChatList;