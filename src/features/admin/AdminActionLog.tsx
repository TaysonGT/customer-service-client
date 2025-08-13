import React, { useState } from 'react';
import { 
  FiClock, FiUser, FiShield, FiEdit2, 
  FiTrash2, FiSearch, FiFilter, FiRefreshCw 
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import {Avatar} from '../../components/ui';

interface ActionLog {
  id: string;
  admin: {
    id: string;
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  targetType: 'user' | 'chat' | 'report' | 'ban';
  timestamp: string;
  details: string;
}

const AdminActionLog = ({ logs }: { logs?: ActionLog[] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data - in a real app this would come from props
  const data = logs || [
    {
      id: 'log1',
      admin: { id: 'admin1', name: 'Jane Doe', avatar: '' },
      action: 'Banned user',
      target: 'John Smith',
      targetType: 'user',
      timestamp: '2023-06-15 14:30:22',
      details: 'For repeated violations of community guidelines'
    },
    {
      id: 'log2',
      admin: { id: 'admin2', name: 'Admin User', avatar: '' },
      action: 'Resolved report',
      target: 'Report #4567',
      targetType: 'report',
      timestamp: '2023-06-15 13:45:10',
      details: 'Marked as resolved with warning issued'
    },
    {
      id: 'log3',
      admin: { id: 'admin1', name: 'Jane Doe', avatar: '' },
      action: 'Edited user',
      target: 'Sarah Johnson',
      targetType: 'user',
      timestamp: '2023-06-15 11:20:05',
      details: 'Changed user role from client to agent'
    },
    {
      id: 'log4',
      admin: { id: 'admin3', name: 'System Admin', avatar: '' },
      action: 'Force ended chat',
      target: 'Chat #8912',
      targetType: 'chat',
      timestamp: '2023-06-15 10:15:33',
      details: 'Due to inappropriate content'
    }
  ];

  const filteredLogs = data?.filter(log => {
    const matchesSearch = log.admin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = selectedAction === 'all' || log.action.toLowerCase().includes(selectedAction);
    return matchesSearch && matchesAction;
  });

  const refreshLogs = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Action Log</h2>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {data.length} Actions
          </span>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search actions..."
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select 
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
          >
            <option value="all">All Actions</option>
            <option value="ban">Bans</option>
            <option value="edit">Edits</option>
            <option value="resolve">Resolutions</option>
            <option value="end">Ended Chats</option>
          </select>
          
          <button 
            onClick={refreshLogs}
            className={`p-2 rounded-lg ${isRefreshing ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            disabled={isRefreshing}
          >
            <FiRefreshCw className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Log Table */}
      <div className="divide-y divide-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
        {filteredLogs?.map(log => (
          <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                {log.admin.avatar ? (
                  <Avatar src={log.admin.avatar} alt={log.admin.name} size="sm" />
                ) : (
                  <FiShield className="text-blue-600" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">
                    {log.admin.name} <span className="font-normal text-gray-500">performed</span> {log.action}
                  </h3>
                  <span className="text-xs text-gray-500">{log.timestamp}</span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">{log.targetType}:</span> {log.target}
                </p>
                
                <p className="text-sm text-gray-500 mt-2">{log.details}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminActionLog;