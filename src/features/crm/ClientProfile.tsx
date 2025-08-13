import React, { useState } from 'react';
import { Tabs, Tab, Badge, Button, Avatar } from '../../components/ui';
import { 
  FiUser, FiCreditCard, FiClock, FiShoppingBag, 
  FiMessageSquare, FiSettings 
} from 'react-icons/fi';
import { IUser } from '../../types/types';
import ClientOverview from './ClientOverview';
import InteractionHistory from './InteractionHistory';

const ClientProfile = ({ client }: {client: IUser}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="p-6 h-full flex flex-col">
      {/* Profile Header */}
      <div className="flex items-start gap-4 mb-6">
        <Avatar size="xl" />
        <div>
          <h2 className="text-xl font-semibold">{client.firstname}</h2>
          <p className="text-gray-600">{client.email}</p>
          <div className="flex gap-2 mt-2">
            <Badge>VIP Client</Badge>
            <Badge variant="success">Active</Badge>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline">Message</Button>
          <Button variant="primary">Create Ticket</Button>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tab value="overview" icon={<FiUser />} label="Overview" />
        <Tab value="history" icon={<FiClock />} label="History" />
        <Tab value="orders" icon={<FiShoppingBag />} label="Orders" />
        <Tab value="conversations" icon={<FiMessageSquare />} label="Conversations" />
        <Tab value="billing" icon={<FiCreditCard />} label="Billing" />
        <Tab value="settings" icon={<FiSettings />} label="Settings" />
      </Tabs>
      
      {/* Tab Content */}
      <div className="flex-1 overflow-auto mt-4">
        {activeTab === 'overview' && <ClientOverview client={client} />}
        {activeTab === 'history' && <InteractionHistory client={client} />}
        {/* Other tabs... */}
      </div>
    </div>
  );
};

export default ClientProfile