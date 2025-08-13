import React from 'react';
import { FiUser, FiMail, FiPhone, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  lastActivity: string;
  value: string;
}

interface ClientDatabaseProps {
  viewMode: 'grid' | 'table';
}

const ClientDatabase: React.FC<ClientDatabaseProps> = ({ viewMode }) => {
  const clients: Client[] = [
    { id: '1', name: 'Alex Johnson', email: 'alex@example.com', phone: '(555) 123-4567', status: 'active', lastActivity: '2 hours ago', value: '$1,245' },
    { id: '2', name: 'Sarah Williams', email: 'sarah@company.com', phone: '(555) 987-6543', status: 'active', lastActivity: '1 day ago', value: '$890' },
    { id: '3', name: 'Mike Thompson', email: 'mike.t@mail.com', phone: '(555) 456-7890', status: 'inactive', lastActivity: '2 weeks ago', value: '$2,100' },
  ];

  return viewMode === 'grid' ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map(client => (
        <motion.div
          key={client.id}
          whileHover={{ y: -5 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <FiUser size={20} />
            </div>
            <div>
              <h3 className="font-medium">{client.name}</h3>
              <p className="text-sm text-gray-500">{client.email}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span className={`flex items-center gap-1 ${
                client.status === 'active' ? 'text-green-600' : 'text-red-600'
              }`}>
                {client.status === 'active' ? (
                  <FiCheckCircle size={14} />
                ) : (
                  <FiXCircle size={14} />
                )}
                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone:</span>
              <span>{client.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Activity:</span>
              <span>{client.lastActivity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Client Value:</span>
              <span className="font-medium">{client.value}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map(client => (
            <tr key={client.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <FiUser size={16} />
                  </div>
                  <div>
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-gray-500">{client.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {client.phone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {client.lastActivity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {client.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientDatabase;