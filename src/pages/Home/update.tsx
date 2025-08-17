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
  
  const [unassignedCount, setUnassignedCount] = useState(12);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Navigation */}
      <div className="w-20 md:w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold hidden md:block">ClientHub</h1>
          <div className="md:hidden flex justify-center">
            <FiMessageSquare className="text-2xl text-blue-600" />
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <Tabs vertical value={activeTab} onChange={setActiveTab}>
            <Tab 
              value="chats" 
              icon={<FiMessageSquare />} 
              label="Chats" 
              badge={23}
            />
            <Tab 
              value="tickets" 
              icon={<FiInbox />} 
              label="Tickets"
              badge={unassignedCount}
            />
            <Tab 
              value="clients" 
              icon={<FiUsers />} 
              label="Clients" 
            />
            <Tab 
              value="knowledge" 
              icon={<FiHelpCircle />} 
              label="Knowledge Base" 
            />
            <Tab 
              value="closed" 
              icon={<FiArchive />} 
              label="Closed Tickets" 
            />
          </Tabs>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <Button icon={<FiSettings />} variant="ghost" fullWidth>
            Settings
          </Button>
        </div>
      </div>

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