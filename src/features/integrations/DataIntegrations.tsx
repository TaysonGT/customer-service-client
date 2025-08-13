// File: src/features/integrations/DataIntegrations.tsx
import React, { useState } from 'react';
import { FiShoppingBag, FiCreditCard, FiMail, FiCheck, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';

const DataIntegrations = () => {
  const [integrations, setIntegrations] = useState([
    { id: 1, name: 'Shopify', icon: <FiShoppingBag />, connected: true },
    { id: 2, name: 'Stripe', icon: <FiCreditCard />, connected: false },
    { id: 3, name: 'Mailchimp', icon: <FiMail />, connected: true },
  ]);

  const availableIntegrations = [
    { id: 4, name: 'Zapier', icon: <FiPlus /> },
    { id: 5, name: 'QuickBooks', icon: <FiPlus /> },
    { id: 6, name: 'HubSpot', icon: <FiPlus /> },
  ];

  const toggleIntegration = (id: number) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { ...integration, connected: !integration.connected } 
        : integration
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Active Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.filter(i => i.connected).map(integration => (
            <motion.div
              key={integration.id}
              whileHover={{ y: -5 }}
              className="p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    {integration.icon}
                  </div>
                  <span className="font-medium">{integration.name}</span>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  Connected
                </span>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => toggleIntegration(integration.id)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Disconnect
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Available Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableIntegrations.map(integration => (
            <motion.div
              key={integration.id}
              whileHover={{ y: -5 }}
              className="p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                    {integration.icon}
                  </div>
                  <span className="font-medium">{integration.name}</span>
                </div>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Connect
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataIntegrations;