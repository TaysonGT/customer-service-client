import { memo, useRef, useState } from 'react';
import { MdClose, MdInfoOutline, MdMoreVert, MdExitToApp } from 'react-icons/md';
import { IChat, IUser } from '../../types/types';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { TypingUser } from '../../hooks/useTypingStatus';
import { AnimatePresence, motion } from 'framer-motion';
import { Avatar } from '../../components/ui';
import DarkBackground from '../../components/DarkBackground';

interface Props {
  participants: IUser[]; 
  chat?: IChat; 
  isLoading: boolean;
  initial: boolean;
  className?: string; 
  unsetChat?: () => void; 
  typingUsers: TypingUser[];
  fixed?: boolean;
  onEndChat?: () => void;
}

const ChatHeader: React.FC<Props> = memo(({ 
  participants, 
  chat,
  isLoading,
  initial,
  className = '', 
  unsetChat, 
  typingUsers, 
  fixed = false,
  onEndChat
}) => {
  const [showDrop, setShowDrop] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  useOutsideClick(dropDownRef, () => setShowDrop(false), [menuBtnRef]);
  useOutsideClick(modalRef, () => setShowDetails(false));

  const getTypingText = () => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1) {
      const user = participants.find(p => p.id === typingUsers[0].id);
      return `${user?.firstname} is typing...`;
    }
    if (typingUsers.length === 2) {
      const names = typingUsers.map(user => 
        participants.find(p => p.id === user.id)?.firstname
      ).join(' and ');
      return `${names} are typing...`;
    }
    const names = typingUsers.slice(0, 2).map(user => 
      participants.find(p => p.id === user.id)?.firstname
    ).join(', ');
    return `${names} and ${typingUsers.length - 2} others are typing...`;
  };

  const handleChatDetails = () => {
    setShowDetails(true);
    setShowDrop(false);
  };

  const handleEndChat = () => {
    if (onEndChat) {
      onEndChat();
      setShowDrop(false);
    }
  };

  return (
    (isLoading&&initial)?(
    <div className={`${className} ${fixed ? 'h-20' : ''} px-6 bg-white flex items-center justify-between w-full`}>
      {/* Left side skeleton */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Back button skeleton (only shown when unsetChat exists) */}
        {unsetChat && (
          <div className="md:hidden p-1 rounded-full bg-gray-200 w-8 h-8"></div>
        )}
        
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar stack skeleton */}
          <div className="flex -space-x-2">
            <div className="relative w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent animate-[shimmer_1.5s_infinite]" />
            </div>
            <div className="relative w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent animate-[shimmer_1.5s_infinite]" />
            </div>
            <div className="relative w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent animate-[shimmer_1.5s_infinite]" />
            </div>
          </div>
          
          {/* Text content skeleton */}
          <div className="min-w-0 space-y-2">
            <div className="relative h-5 w-32 rounded-md bg-gray-200 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent animate-[shimmer_1.5s_infinite]" />
            </div>
            <div className="relative h-4 w-24 rounded-md bg-gray-200 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent animate-[shimmer_1.5s_infinite]" />
            </div>
          </div>
        </div>
      </div>

      {/* Right side skeleton */}
      <div className="flex items-center gap-2">
        {/* Menu button skeleton */}
        <div className="relative">
          <div className="p-2 rounded-full bg-gray-200 w-10 h-10"></div>
          
          {/* Dropdown menu skeleton (shown conditionally like original) */}
          <AnimatePresence>
            {showDrop && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-100"
              >
                <div className="p-1 space-y-1">
                  <div className="h-9 bg-gray-100 rounded"></div>
                  <div className="h-9 bg-gray-100 rounded"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
    ):
    <div className={`${className} ${fixed ? 'h-20' : ''} px-6 bg-white flex items-center justify-between w-full`}>
      <div className="flex items-center gap-4 min-w-0">
        {unsetChat && (
          <button 
            onClick={unsetChat}
            className="md:hidden p-1 rounded-full hover:bg-gray-100"
          >
            <MdClose className="text-xl text-gray-600" />
          </button>
        )}
        
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex -space-x-2">
            {participants.slice(0, 3).map((user, i) => (
              <Avatar 
                key={user.id} 
                src={user.avatarUrl} 
                alt={user.firstname}
                className={`w-10 h-10 ${i > 0 ? 'relative z-0' : ''}`}
              />
            ))}
          </div>
          
          <div className="min-w-0">
            <h1 className="text-lg font-semibold truncate text-gray-900">
              {chat?.title || participants.map(p => p.firstname).join(', ')}
            </h1>
            <div className="text-sm text-gray-500 truncate">
              {typingUsers.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1"
                >
                  <span className="flex space-x-[2px]">
                    <span className="inline-block w-1 h-1 rounded-full bg-blue-500 animate-bounce" 
                      style={{ animationDelay: '0ms' }} />
                    <span className="inline-block w-1 h-1 rounded-full bg-blue-500 animate-bounce" 
                      style={{ animationDelay: '150ms' }} />
                    <span className="inline-block w-1 h-1 rounded-full bg-blue-500 animate-bounce" 
                      style={{ animationDelay: '300ms' }} />
                  </span>
                  <span>{getTypingText()}</span>
                </motion.div>
              ) : (
                <span>{participants.length} participant{participants.length !== 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button 
            ref={menuBtnRef}
            onClick={() => setShowDrop(prev => !prev)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            aria-label="Chat options"
          >
            <MdMoreVert className="text-xl" />
          </button>

          <AnimatePresence>
            {showDrop && (
              <motion.div
                ref={dropDownRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-100"
              >
                <div className="p-1">
                  <button 
                    onClick={handleChatDetails}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <MdInfoOutline className="text-lg" />
                    <span>Chat details</span>
                  </button>
                  {onEndChat && (
                    <button 
                      onClick={handleEndChat}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <MdExitToApp className="text-lg" />
                      <span>End chat</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <>
            <DarkBackground {...{show: showDetails, cancel: ()=>setShowDetails(false)}} />
              
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden fixed inset-0 z-103 p-4 left-1/2 top-1/2 -translate-1/2"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Chat Details</h3>
                  <button 
                    onClick={() => setShowDetails(false)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <MdClose className="text-xl text-gray-600" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Participants</h4>
                    <div className="space-y-2">
                      {participants.map((participant) => (
                        <div key={participant.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                          <Avatar src={participant.avatarUrl} alt={participant.firstname} size="sm" />
                          <div>
                            <p className="font-medium text-gray-900">{participant.firstname} {participant.lastname}</p>
                            <p className="text-xs text-gray-500">{participant.role === 'client' ? 'Customer' : 'Support Agent'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {chat?.startedAt && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Created</h4>
                      <p className="text-sm text-gray-900">
                        {new Date(chat.startedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3 flex justify-end">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

export default ChatHeader;