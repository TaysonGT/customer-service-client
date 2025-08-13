import { useState } from 'react';
import { Tabs, Tab, Button } from '../../components/ui';
import { 
  FiMessageSquare, FiUsers, FiInbox, FiArchive, 
  FiHelpCircle, FiSettings, FiPlus 
} from 'react-icons/fi';
import ChatList from '../../features/chat/ChatList';
import ChatBox from '../../features/chat/ChatBoxFixed';
import ClientProfile from '../../features/crm/ClientProfile';
import KnowledgeBase from '../../features/knowledge/KnowledgeBase';
import TicketList from '../../features/tickets/TicketList';
import TicketDetails from '../../features/tickets/TicketDetails';
import ClientList from '../../features/crm/ClientList';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [unassignedCount, setUnassignedCount] = useState(12);
  const [myTicketsCount, setMyTicketsCount] = useState(8);

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
          {/* Left Panel - List View */}
          <div className="w-full md:w-80 border-r border-gray-200 flex flex-col">
            {activeTab === 'chats' && (
              <ChatList 
                onSelect={setSelectedChat} 
                selected={selectedChat}
              />
            )}
            
            {activeTab === 'tickets' && (
              <TicketList 
                onSelect={(ticket) => {
                  setSelectedChat(null);
                  setSelectedClient(ticket.client);
                }} 
              />
            )}
            
            {activeTab === 'clients' && (
              <ClientList onSelect={setSelectedClient} />
            )}
          </div>
          
          {/* Right Panel - Detail View */}
          <div className="flex-1 flex flex-col min-w-0">
            {activeTab === 'chats' && selectedChat && (
              <ChatBox chat={selectedChat} />
            )}
            
            {activeTab === 'tickets' && selectedClient && (
              <TicketDetails client={selectedClient} />
            )}
            
            {activeTab === 'clients' && selectedClient && (
              <ClientProfile client={selectedClient} />
            )}
            
            {activeTab === 'knowledge' && (
              <KnowledgeBase />
            )}
            
            {!selectedChat && !selectedClient && activeTab !== 'knowledge' && (
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
    </div>
  );
};

export default HomePage;