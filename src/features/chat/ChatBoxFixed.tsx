import { useEffect, useRef, useState, useCallback, memo } from 'react';
import EmojiPickerBox from './EmojiPicker';
import { useChatMessages } from '../../hooks/useChatMessages';
import MessageInput from './MessageInput';
import MessageGroup from './MessageGroup';
import ChatHeader from './ChatHeader';
import { useAuth } from '../../context/AuthContext';
import { IChat } from '../../types/types';
import { MdArrowDownward } from 'react-icons/md';
import Loader from '../../components/Loader';
import { useTypingStatus } from '../../hooks/useTypingStatus';
import { AnimatePresence, motion } from 'framer-motion';

const ChatBoxFixed = ({ chat, unsetChat }: { chat: IChat; unsetChat?: () => void }) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [playingAudio, setPlayingAudio] = useState<string|null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const prevScrollHeightRef = useRef(0);
  const isScrollingRef = useRef(false);
  
  const { currentUser } = useAuth();
  const { groups, sendMessage, participants, loadMore, hasMore, isLoading } = useChatMessages({ chatId: chat.id });
  const { typingUsers, setTyping } = useTypingStatus(chat.id, {
    id: currentUser!.id,
  });
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const handleTyping = useCallback(() => {
    setTyping(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setTyping(false);
    }, 2000);
  }, [setTyping]);

  const handleScroll = useCallback(() => {
    if (chatContainerRef.current && !isScrollingRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      scrollPositionRef.current = scrollTop;
      prevScrollHeightRef.current = scrollHeight;
      setIsAtBottom(scrollHeight - scrollTop <= clientHeight + 5);
    }
  }, []);

  useEffect(() => {
    if (!chatContainerRef.current) return;

    const container = chatContainerRef.current;
    const wasAtBottom = scrollPositionRef.current >= 
      prevScrollHeightRef.current - container.clientHeight - 5;

    if (wasAtBottom) {
      isScrollingRef.current = true;
      container.scrollTop = container.scrollHeight;
      setTimeout(() => isScrollingRef.current = false, 100);
    }
  }, [groups]);

  const loadMoreMessages = useCallback(async () => {
    if (!chatContainerRef.current || isLoading) return;
    
    const container = chatContainerRef.current;
    const wasAtTop = container.scrollTop === 0;
    const prevHeight = container.scrollHeight;
    const prevScrollPos = container.scrollTop;
    
    await loadMore();
    
    requestAnimationFrame(() => {
      if (!chatContainerRef.current) return;
      
      const container = chatContainerRef.current;
      const heightDiff = container.scrollHeight - prevHeight;
      
      if (wasAtTop) {
        container.scrollTop = heightDiff - 10;
      } else {
        container.scrollTop = prevScrollPos + heightDiff;
      }
    });
  }, [loadMore, isLoading]);

  const handleScrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      isScrollingRef.current = true;
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setTimeout(() => {
        isScrollingRef.current = false;
        setIsAtBottom(true);
      }, 500);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        setTyping(false);
        clearTimeout(timeoutRef.current);
      }
    };
  }, [setTyping]);

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      <ChatHeader 
        {...{participants, chat, unsetChat, typingUsers, fixed: true, isLoading, initial:!hasMore}}
        className="border-b border-gray-200 shadow-soft"
      />

      <div className="grow flex flex-col min-h-0 relative">
        <div 
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto min-h-0 p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >
          {hasMore && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <button
                onClick={loadMoreMessages}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
              >
                {isLoading ? 'Loading...' : 'Load older messages'}
              </button>
            </motion.div>
          )}

          {(!isLoading&&groups.length<1) && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 mb-6 text-gray-300">
                <svg 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Start a conversation
              </h3>
              <p className="text-gray-400 max-w-md">
                Send your first message or say hello to get things started
              </p>
            </div>
          )}

          {(isLoading&&participants.length<1) && (
            <div className="absolute inset-0 bg-white/20 flex items-center justify-center z-1">
              <Loader size={30} thickness={6} />
            </div>
          )}

          {groups.map((group, index) => (
            <div key={`${group.senderId}-${index}`} className="space-y-2">
              {((new Date(group.timestamp).getDate() !== new Date(groups[index-1]?.timestamp).getDate()) || (index === 0)) && (
                <div className="relative flex items-center my-4">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-xs text-gray-500 font-medium">
                    {getFormattedDate(group.timestamp)}
                  </span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>
              )}
              <MessageGroup 
                group={group}
                isCurrentUser={group.senderId === currentUser?.id}
                setAudio={(id: string|null)=>setPlayingAudio(id)}
                audio={playingAudio}
              />
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <AnimatePresence>
          {!isAtBottom && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={handleScrollToBottom}
              className="absolute right-6 bottom-20 z-10 rounded-full p-2 bg-white shadow-md hover:bg-gray-100 transition-all"
              aria-label="Scroll to bottom"
              whileHover={{ scale: 1.05 }}
            >
              <MdArrowDownward className="text-xl text-gray-600" />
            </motion.button>
          )}
        </AnimatePresence>

        <MessageInput
          onSend={({content, type, meta}) => sendMessage({content, type, messagesEndRef, meta})}
          handleTyping={handleTyping}
          setShowEmoji={setShowEmoji}
          showEmoji={showEmoji}
          className="border-t border-gray-200 bg-white"
        />

        {showEmoji && (
          <EmojiPickerBox 
            onSelect={(emoji) => {
              const input = document.querySelector('textarea');
              if (input) {
                const start = input.selectionStart;
                const end = input.selectionEnd;
                input.value = input.value.substring(0, start) + emoji + input.value.substring(end);
                input.selectionStart = input.selectionEnd = start + emoji.length;
                input.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }}
            setIsOpen={setShowEmoji}
          />
        )}
      </div>
    </div>
  );
};

function getFormattedDate(timestamp: string | number | Date) {
  const date = new Date(timestamp)
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  
  const dateStart = new Date(date);
  dateStart.setHours(0, 0, 0, 0);
  
  const diffTime = todayStart.getTime() - dateStart.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    // Within this week
    return date.toLocaleDateString(undefined, { weekday: 'long' });
  } else {
    // Older than a week
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}

export default memo(ChatBoxFixed);