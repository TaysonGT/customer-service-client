import React, { useState, useEffect } from 'react';
import { 
  FiMessageSquare, FiUsers, FiSearch, FiAlertCircle, 
  FiMic, FiMicOff, FiEye, FiArchive 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import {Avatar} from '../../components/ui';

interface Chat {
  id: string;
  client: {
    id: string;
    name: string;
    avatar: string;
  };
  agent: {
    id: string;
    name: string;
    avatar: string;
    status: 'online' | 'offline' | 'away';
  };
  startedAt: string;
  duration: string;
  status: 'active' | 'waiting' | 'ended';
  unreadMessages: number;
  flags: string[];
}

const LiveChatMonitor = ({ data }: { data: Chat[] }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredChats = data.filter(chat => {
    const matchesSearch = chat.client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         chat.agent.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || chat.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const refreshChats = () => {
    setIsRefreshing(true);
    // Simulate API refresh
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleJoinChat = (chatId: string) => {
    console.log(`Joining chat ${chatId} as admin observer`);
    setIsWatching(true);
  };

  const handleEndChat = (chatId: string) => {
    console.log(`Force ending chat ${chatId}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Live Chats</h2>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {data.filter(c => c.status === 'active').length} Active
          </span>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {['all', 'active', 'waiting', 'ended'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 text-sm rounded-md ${
                  activeFilter === filter ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
          
          <button 
            onClick={refreshChats}
            className={`p-2 rounded-lg ${isRefreshing ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            disabled={isRefreshing}
          >
            <FiArchive className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="divide-y divide-gray-200">
        {filteredChats.map(chat => (
          !chat.agent?
          <div>huh</div>
          :
          <div key={chat.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <Avatar src={chat.client.avatar} alt={chat.client.name} size="md" />
                  <span className="text-xs mt-1 text-gray-500">Client</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-6 h-px bg-gray-300 my-3"></div>
                  <div className={`w-2 h-2 rounded-full ${
                    chat.agent.status === 'online' ? 'bg-green-500' :
                    chat.agent.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}></div>
                  <div className="w-6 h-px bg-gray-300 my-3"></div>
                </div>
                
                <div className="flex flex-col items-center">
                  <Avatar src={chat.agent.avatar} alt={chat.agent.name} size="md" />
                  <span className="text-xs mt-1 text-gray-500">Agent</span>
                </div>
                
                <div className="ml-4">
                  <h3 className="font-medium">
                    {chat.client.name} ↔ {chat.agent.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">Started: {chat.startedAt}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">Duration: {chat.duration}</span>
                  </div>
                  {chat.flags.length > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <FiAlertCircle className="text-yellow-500" />
                      <span className="text-xs text-yellow-600">
                        {chat.flags.length} flag{chat.flags.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleJoinChat(chat.id)}
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                  title="Monitor chat"
                >
                  <FiEye />
                </button>
                <button 
                  onClick={() => handleEndChat(chat.id)}
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                  title="End chat"
                >
                  <FiMicOff />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Monitoring Modal */}
      <AnimatePresence>
        {isWatching && selectedChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[80vh] flex flex-col"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium">
                  Monitoring: {selectedChat.client.name} ↔ {selectedChat.agent.name}
                </h3>
                <button 
                  onClick={() => setIsWatching(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                  {/* Chat messages would be rendered here */}
                  <div className="text-center text-gray-400 py-8">
                    <FiMessageSquare className="mx-auto text-2xl mb-2" />
                    <p>Live chat monitoring view</p>
                    <p className="text-sm">Messages will appear here in real-time</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Admin Controls:</span>
                  <button className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded hover:bg-red-100">
                    End Chat
                  </button>
                  <button className="px-3 py-1 bg-yellow-50 text-yellow-600 text-sm rounded hover:bg-yellow-100">
                    Flag Conversation
                  </button>
                  <button className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded hover:bg-blue-100">
                    Take Over
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveChatMonitor;