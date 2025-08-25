import { useState } from 'react';
import { Tabs, Tab, Button } from '../../components/ui';
import { 
  FiMessageSquare, FiUsers, FiInbox, FiArchive, 
  FiHelpCircle, FiSettings, FiPlus 
} from 'react-icons/fi';
import ChatSector from './ChatSector';
import TicketSector from './TicketSector';
import ClientSector from './ClientSector';
import KnowledgeSector from './KnowledgeSector';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('chats');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Navigation */}
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold capitalize">
            {activeTab === 'chats' && 'Active Conversations'}
            {activeTab === 'tickets' && 'Support Tickets'}
            {activeTab === 'clients' && 'Client Database'}
            {activeTab === 'knowledge' && 'Knowledge Base'}
            {activeTab === 'closed' && 'Closed Tickets'}
          </h2>
          
          {activeTab === 'tickets' && (
            <Button variant="primary" icon={<FiPlus />}>
              Create Ticket
            </Button>
          )}
        </div>
        
        <div className="flex-1 flex overflow-hidden">
            {activeTab === 'chats'&& (
              <ChatSector />
            )}
            
            {activeTab === 'tickets' &&(
              <TicketSector />
            )}
            
            {activeTab === 'clients' && (
              <ClientSector />
            )}
            {activeTab === 'knowledge' && (
              <KnowledgeSector />
            )}
            
            {!activeTab && (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center p-8">
                  <FiHelpCircle className="mx-auto text-4xl mb-4" />
                  <p className="text-lg">Select an item to view details</p>
                  <p className="text-sm mt-2">Or create a new ticket to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default HomePage;