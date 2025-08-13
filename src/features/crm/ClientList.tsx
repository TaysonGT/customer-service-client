// File: src/features/crm/CustomerList.tsx
import React from 'react';
import { FiUser, FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface Client {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  lastPurchase: string;
}

interface ClientListProps {
  onSelect: (client: Client) => void;
}

const ClientList: React.FC<ClientListProps> = ({ onSelect }) => {
  const clients:Client[] = [
    { id: '1', name: 'Alex Johnson', email: 'alex@example.com', status: 'active', lastPurchase: '2 days ago' },
    { id: '2', name: 'Sarah Williams', email: 'sarah@company.com', status: 'active', lastPurchase: '1 week ago' },
    { id: '3', name: 'Mike Thompson', email: 'mike.t@mail.com', status: 'inactive', lastPurchase: '1 month ago' },
  ];

  return (
    <div className="divide-y divide-gray-200">
      {clients.map(client => (
        <div 
          key={client.id}
          className="p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => onSelect(client)}
        >
          <div className="flex justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <FiUser className="text-gray-500" />
              </div>
              <div>
                <p className="font-medium">{client.name}</p>
                <p className="text-sm text-gray-600">{client.email}</p>
              </div>
            </div>
            <div>
              {client.status === 'active' ? (
                <FiCheckCircle className="text-green-500" />
              ) : (
                <FiXCircle className="text-red-500" />
              )}
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">Last purchase:</span>
            <span className="text-xs text-gray-500">{client.lastPurchase}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientList;