import React, { useState } from 'react';
import { 
  FiUser, FiUserX, FiUserCheck, FiSearch, 
  FiFilter, FiEdit2, FiEye, FiMoreVertical 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import {Avatar} from '../../components/ui';

interface User {
  id: string;
  avatar: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'client';
  status: 'active' | 'suspended' | 'banned';
  lastActive: string;
}

const UserManagementTable = ({ data }: { data: User[] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState<string | null>(null);

  const filteredUsers = data?.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRoleChange = (userId: string, newRole: User['role']) => {
    // API call to update user role
    console.log(`Changing role for user ${userId} to ${newRole}`);
  };

  const handleStatusChange = (userId: string, newStatus: User['status']) => {
    // API call to update user status
    console.log(`Changing status for user ${userId} to ${newStatus}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select 
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="agent">Agents</option>
            <option value="client">Clients</option>
          </select>
          
          <select 
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar src={user.avatar} alt={user.name} size="sm" className="mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
                    className={`text-sm px-2 py-1 rounded border ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                      user.role === 'agent' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      'bg-gray-100 text-gray-800 border-gray-200'
                    }`}
                  >
                    <option value="admin">Admin</option>
                    <option value="agent">Agent</option>
                    <option value="client">Client</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user.id, e.target.value as User['status'])}
                    className={`text-sm px-2 py-1 rounded border ${
                      user.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                      user.status === 'suspended' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      'bg-red-100 text-red-800 border-red-200'
                    }`}
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="banned">Banned</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastActive}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <button 
                    onClick={() => setShowUserMenu(showUserMenu === user.id ? null : user.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiMoreVertical />
                  </button>
                  
                  <AnimatePresence>
                    {showUserMenu === user.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                      >
                        <div className="py-1">
                          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <FiEye className="mr-2" /> View Profile
                          </button>
                          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <FiEdit2 className="mr-2" /> Edit
                          </button>
                          {user.status === 'active' ? (
                            <button 
                              className="flex items-center w-full px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100"
                              onClick={() => handleStatusChange(user.id, 'suspended')}
                            >
                              <FiUserX className="mr-2" /> Suspend
                            </button>
                          ) : (
                            <button 
                              className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                              onClick={() => handleStatusChange(user.id, 'active')}
                            >
                              <FiUserCheck className="mr-2" /> Activate
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination would go here */}
    </div>
  );
};

export default UserManagementTable;