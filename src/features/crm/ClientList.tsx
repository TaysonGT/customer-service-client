import React, { useState } from 'react';
import { FiUser, FiCheckCircle, FiXCircle, FiPlus } from 'react-icons/fi';
import { IUser } from '../../types/types';
import { formatDate } from '../../utils/time';

interface ClientListProps {
  onSelect: (client: IUser|null) => void;
  clients: IUser[];
  showCreate: () => void
}

const ClientList: React.FC<ClientListProps> = ({ onSelect, showCreate, clients }) => {

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Clients</h2>
        <button
          onClick={showCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <FiPlus className="text-white" />
          New Client
        </button>
      </div>
      
      <div className="divide-y divide-gray-200">
        {clients.map(client => (
          <div 
            key={client.id}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onSelect(client)}
          >
            <div className="flex justify-between w-full overflow-hidden">
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  {client.avatarUrl ? (
                    <img src={client.avatarUrl} alt={client.username} className="w-full h-full rounded-full" />
                  ) : (
                    <FiUser className="text-blue-600" />
                  )}
                </div>
                <div className='w-full'>
                  <div className='flex items-start justify-between w-full'>
                    <p className="font-medium text-gray-900">
                      {client.firstname} {client.lastname}
                      {client.clientProfile?.status === 'vip' && (
                        <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">VIP</span>
                      )}
                    </p>
                    <div className="flex items-center shrink-0">
                      {client.clientProfile?.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 text-green-600">
                          <FiCheckCircle />
                          <span className="text-xs">Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600">
                          <FiXCircle />
                          <span className="text-xs">Inactive</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{client.email}</p>
                </div>
              </div>
            </div>
            {client.clientProfile?.company && (
              <div className="mt-1">
                <span className="text-xs text-gray-500">Company:</span>
                <span className="text-xs font-medium text-gray-700 ml-1">{client.clientProfile.company}</span>
              </div>
            )}
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">Last activity:</span>
              <span className="text-xs font-medium text-gray-700">{formatDate(client.lastSeenAt, {withTime:true})}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientList;