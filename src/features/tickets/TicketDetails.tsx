// File: src/features/tickets/TicketDetails.tsx
import React, { useState } from 'react';
import { 
  FiUser, FiMail, FiPhone, 
  FiClock, FiTag, FiPaperclip 
} from 'react-icons/fi';
import { IFile, TicketPriority, TicketStatus, TicketType } from '../../types/types';
import { AttachmentList } from './AttachmentList';

interface TicketDetailsProps {
  ticket: TicketType;
  onUpdate: (updatedTicket: TicketType) => void;
}

const TicketDetails: React.FC<TicketDetailsProps> = ({ ticket, onUpdate }) => {
  const [message, setMessage] = useState('');
  const [currentStatus, setCurrentStatus] = useState(ticket.status);
  const [currentPriority, setCurrentPriority] = useState(ticket.priority);
  const [attachments, setAttachments] = useState<IFile[]>([]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as TicketStatus;
    setCurrentStatus(newStatus);
    onUpdate({ ...ticket, status: newStatus });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPriority = e.target.value as TicketPriority;
    setCurrentPriority(newPriority);
    onUpdate({ ...ticket, priority: newPriority });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold">{ticket.subject}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 text-xs rounded-full ${
                currentStatus === 'open' ? 'bg-red-100 text-red-800' : 
                currentStatus === 'resolved' ? 'bg-green-100 text-green-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {currentStatus.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                currentPriority === 'high' ? 'bg-orange-100 text-orange-800' : 
                currentPriority === 'critical' ? 'bg-purple-100 text-purple-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {currentPriority.charAt(0).toUpperCase() + currentPriority.slice(1)} Priority
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FiClock size={14} />
              Created: {new Date(ticket.createdAt).toLocaleString()}
            </span>
            {ticket.resolvedAt && (
              <span className="flex items-center gap-1 mt-1">
                <FiClock size={14} />
                Resolved: {new Date(ticket.resolvedAt).toLocaleString()}
              </span>
            )}
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
                {/* Conversation history would go here */}
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
                  <span>{ticket.requester.firstname} {ticket.requester.lastname}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMail className="text-gray-400" />
                  <span>{ticket.requester.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="text-gray-400" />
                  <span>{ticket.requester.phone}</span>
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
                    {ticket.category || 'Uncategorized'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Priority:</span>
                  <select
                    value={currentPriority}
                    onChange={handlePriorityChange}
                    className="px-2 py-1 text-xs rounded border border-gray-300"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <select
                    value={currentStatus}
                    onChange={handleStatusChange}
                    className="px-2 py-1 text-xs rounded border border-gray-300"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="on_hold">On Hold</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                {ticket.assignee && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assigned To:</span>
                    <span>{ticket.assignee.firstname} {ticket.assignee.lastname}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <AttachmentList {...{ticketId: ticket.id}}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;