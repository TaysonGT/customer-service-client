// File: src/features/tickets/TicketDetails.tsx
import React, { useState } from 'react';
import { 
  FiAlertCircle, FiUser, FiMail, FiPhone, 
  FiClock, FiTag, FiMessageSquare, FiPaperclip 
} from 'react-icons/fi';
import { motion } from 'framer-motion';

interface TicketDetailsProps {
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

const TicketDetails: React.FC<TicketDetailsProps> = ({ client }) => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('open');
  const [priority, setPriority] = useState('high');

  const ticket = {
    id: 'TKT-1001',
    subject: 'Payment failed for order #12345',
    description: 'Customer reports payment failure when trying to complete purchase. Error message shows "Payment declined"',
    createdAt: '2023-06-15 14:30',
    updatedAt: '2023-06-15 15:45',
    category: 'Billing',
    attachments: ['error_screenshot.png', 'payment_log.pdf']
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold">{ticket.subject}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 text-xs rounded-full ${
                status === 'open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {status === 'open' ? 'Open' : 'Closed'}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                priority === 'high' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {priority === 'high' ? 'High Priority' : 'Normal Priority'}
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FiClock size={14} />
              Created: {ticket.createdAt}
            </span>
            <span className="flex items-center gap-1 mt-1">
              <FiClock size={14} />
              Updated: {ticket.updatedAt}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-700">{ticket.description}</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-2">Conversation</h3>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Support Agent</span>
                    <span>2 hours ago</span>
                  </div>
                  <p>We've identified the issue with your payment method. Please try updating your card details.</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>{client.name}</span>
                    <span>1 hour ago</span>
                  </div>
                  <p>I've updated my card but still getting the same error message.</p>
                </div>
              </div>

              <div className="mt-4">
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Type your response..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="flex justify-between items-center mt-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <FiPaperclip />
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-2">Customer Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FiUser className="text-gray-400" />
                  <span>{client.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMail className="text-gray-400" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="text-gray-400" />
                  <span>{client.phone}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-2">Ticket Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="flex items-center gap-1">
                    <FiTag className="text-gray-400" />
                    {ticket.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority:</span>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="px-2 py-1 text-xs rounded border border-gray-300"
                  >
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-2 py-1 text-xs rounded border border-gray-300"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-2">Attachments</h3>
              {ticket.attachments.length > 0 ? (
                <div className="space-y-2">
                  {ticket.attachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                      <FiPaperclip className="text-gray-400" />
                      <span className="text-sm">{file}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No attachments</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;