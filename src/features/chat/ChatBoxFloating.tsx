import { useEffect, useRef, useState, useCallback, memo } from 'react';
import EmojiPickerBox from './EmojiPicker';
import supabase from '../../lib/supabase';
import { useChatMessages } from '../../hooks/useChatMessages';
import MessageInput from './MessageInput';
import MessageGroup from './MessageGroup';
import ChatHeader from './ChatHeader';
import { useAuth } from '../../context/AuthContext';
import months from '../../assets/months.json'
import { IChat, IChatMessage } from '../../types/types';
import toast from 'react-hot-toast';
import { MdArrowDownward } from 'react-icons/md';
import { v4 as uuidv4} from 'uuid'
import { groupMessages } from '../../utils/message.utils'
import Loader from '../../components/Loader';

// Main Chatbox Component
const ChatBoxFloating = ({ chat }: { chat: IChat }) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const prevScrollHeightRef = useRef(0);
  const isScrollingRef = useRef(false);
  
  const {currentUser} = useAuth()
  const { groups, setGroups, participants, loadMore, hasMore, isLoading } = useChatMessages(chat.id);

  // Track scroll position
  const handleScroll = useCallback(() => {
    if (chatContainerRef.current && !isScrollingRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      scrollPositionRef.current = scrollTop;
      prevScrollHeightRef.current = scrollHeight;
      setIsAtBottom(scrollHeight - scrollTop <= clientHeight + 5);
    }
  }, []);

  // New effect to handle scroll position after updates
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
  }, [groups])

  const loadMoreMessages = useCallback(async () => {
    if (!chatContainerRef.current) return;
    
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
        // Special handling for exact top position
        container.scrollTop = heightDiff - 1; // The magic -1px fix
      } else {
        // Normal behavior for other positions
        container.scrollTop = prevScrollPos + heightDiff;
      }
    });
  }, [loadMore]);
  
  const sendMessage = useCallback(async (content: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return toast.error('Authentication required');

    // Generate both IDs upfront
    const localId = `local-${Date.now()}`;
    const provisionalDbId = uuidv4(); // Generate real UUID on client

    const optimisticMessage: IChatMessage = {
      id: provisionalDbId,    // Use the same UUID we'll send to DB
      localId,               // Track our local reference
      content,
      chatId: chat.id,
      senderId: currentUser!.id,
      senderType: user.role as 'client'|'support_agent' || 'client',
      createdAt: new Date().toISOString(),
      status: 'sending'
    };
    
    // Add to UI immediately
    setGroups(prev =>{
      return  groupMessages([...prev.flatMap(g => g.messages), optimisticMessage],
        participants
      )
    });

    messagesEndRef.current?.scrollIntoView()

    try {
      // Send with the same UUID we used locally
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          id: provisionalDbId,  // Crucial: use same UUID
          content,
          chatId: chat.id,
          senderId: currentUser!.id,
          senderType: currentUser?.role || 'client',
          status: 'delivered'
        });

      if (error) throw error;

      // Update status optimistically
      setGroups(prev => prev.map(group => ({
        ...group,
        messages: group.messages.map(m => 
          m.localId === localId ? { ...m, status: 'delivered' } : m
        )
      })));

    } catch (error) {
      setGroups(prev => prev.map(group => ({
        ...group,
        messages: group.messages.map(m => 
          m.localId === localId ? { ...m, status: 'failed' } : m
        )
      })));
    }
  }, [chat, participants, currentUser?.role, groupMessages]);
  
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

  return (
    <div className="mx-auto w-[400px] rounded-md overflow-hidden shadow-hard relative">
      {/* Header */}
      <ChatHeader {... {participants, chat}} />

      {/* Chat Container */}
      <div className="h-[400px] bg-gray-100 text-sm flex flex-col">
        {/* Messages Area */}
        <div 
          ref={chatContainerRef} 
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-2 relative flex flex-col scrollbar-thin scrollbar-thumb-[#c1c1c1] scrollbar-track-transparent scrollbar-hover:scrollbar-thumb-[#a0a0a0] scrollbar-hover:scrollbar-w-2 scrollbar-hover: scrollbar-thumb-rounded-full"
        >
          {hasMore&&
            <div 
              className='text-xs bg-accent hover:bg-[#91bbff] duration-150 text-white text-center my-1 rounded-2xl py-2 px-4 self-center cursor-pointer'
              onClick={loadMoreMessages}
            >Show more messages</div>
          }
          {isLoading&&
            <div className='absolute top-0 left-0 w-full h-full bg-white/80 z-40 animate- duration-200 flex justify-center items-center'>
              <Loader size={30} thickness={6}/>
            </div>}
          {groups.map((group, index) => (
            <div key={index}>
            {((new Date(group.timestamp).getDate() !== new Date(groups[index-1]?.timestamp).getDate())||(index==0))&&
              <div key={`date-${group.senderId}-${index}`} className='text-xs text-secondary-text text-center mt-2 border-hover border-t pt-1'>{new Date(group.timestamp).getDate()} {months[new Date(group.timestamp).getMonth()].short} {new Date(group.timestamp).getFullYear()}</div>
            }
            <MessageGroup 
              key={`${group.senderId}-${index}`}
              group={group}
              isCurrentUser={group.senderId === currentUser?.id}
              />
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to Bottom Button (only shows when not at bottom) */}
        {!isAtBottom && (
          <button
            onClick={handleScrollToBottom}
            className="absolute right-6 bottom-18 z-10 rounded-full p-2 bg-white shadow-md hover:bg-gray-100 transition-colors cursor-pointer animate-appear"
            aria-label="Scroll to bottom"
          >
            <MdArrowDownward className="text-xl" />
          </button>
        )}

        {/* Input Area */}
        <MessageInput 
          onSend={sendMessage}
          showEmoji={showEmoji}
          setShowEmoji={setShowEmoji}
        />

        {/* Emoji Picker */}
        {showEmoji && (
          <EmojiPickerBox 
            onSelect={(emoji) => {
              const input = document.querySelector('textarea');
              if(input) input.value += emoji;
            }}
            setIsOpen={setShowEmoji}
          />
        )}
      </div>
    </div>
  );

};

export default memo(ChatBoxFloating);