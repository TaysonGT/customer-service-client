// File: src/pages/ClientPortal.tsx
import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, Input, Tabs, Tab } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import TicketSector from './sectors/TicketSector';
import { createAxiosAuthInstance } from '../../services/axiosAuth';
import toast from 'react-hot-toast';
import { TicketType } from '../../types/types';

const knowledgeBaseArticles = [
  {
    id: 1,
    title: 'How to reset your password',
    category: 'Account',
    views: 1245,
    helpful: 92
  },
  {
    id: 2,
    title: 'Understanding your invoice',
    category: 'Billing',
    views: 876,
    helpful: 85
  },
  {
    id: 3,
    title: 'Troubleshooting connection issues',
    category: 'Technical',
    views: 1567,
    helpful: 94
  }
];


const ClientPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tickets');
  // const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true)
  const [tickets, setTickets] = useState<TicketType[]>([])
  const [openTickets, setOpenTickets] = useState<TicketType[]>([])
  const [resolvedTickets, setResolvedTickets] = useState<TicketType[]>([])
  // const [filteredTickets, setFilteredTickets] = useState<TicketType[]>([])
  
  const api = createAxiosAuthInstance()
  
  const {currentUser} = useAuth()
  
  const refetch = async()=>{
    setIsLoading(true)
    await api.get('/tickets/client')
    .then(({data}:{data:{tickets:TicketType[], success: boolean, message:string}})=>{
      if(!data.success) {
        toast.error(data.message)
        return
      }
      setTickets(data.tickets)
      // setFilteredTickets(
      //   data.tickets.filter(ticket => 
      //     ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      //     ticket.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      //     ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
      //   )
      // )
      setOpenTickets(data.tickets.filter(t => t.status === 'open' || t.status === 'in_progress'))
      setResolvedTickets(data.tickets.filter(t => t.status === 'resolved' || t.status === 'closed'))
    })
    setIsLoading(false)
  }

  useEffect(() => {
    refetch()
  }, [])

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Support Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search tickets or articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
            <Avatar size="sm" src={'/src/assets/imgs/1.webp'} alt="User profile" />
          </div>
        </div>
      </header> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">Welcome back, {currentUser?.firstname}!</h2>
          <p className="text-gray-600">How can we help you today?</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{openTickets.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{resolvedTickets.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Response Time</p>
                <p className="text-2xl font-bold text-gray-900">2.4 hours</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main content with tabs */}
        <Card className="overflow-hidden">
          <div className="border-b border-gray-200">
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tab value="tickets" label="My Tickets" badge={openTickets.length} />
              <Tab value="knowledge" label="Knowledge Base" />
              <Tab value="services" label="Services" />
            </Tabs>
          </div>

          <div className="p-6">
            {activeTab === 'tickets' && <TicketSector {...{onAction: refetch, isLoading, tickets}} />}

            {activeTab === 'knowledge' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Knowledge Base</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {knowledgeBaseArticles.map(article => (
                    <Card key={article.id} className="p-5 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="outline">{article.category}</Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {article.views}
                        </div>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">{article.title}</h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        {article.helpful}% found this helpful
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Service Catalog</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start mb-4">
                      <div className="bg-blue-100 p-3 rounded-lg mr-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Billing Support</h4>
                        <p className="text-sm text-gray-600 mt-1">Questions about invoices, payments, or subscriptions</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Request Help</Button>
                  </Card>

                  <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start mb-4">
                      <div className="bg-green-100 p-3 rounded-lg mr-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Account Management</h4>
                        <p className="text-sm text-gray-600 mt-1">Update profile, reset password, or manage permissions</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Request Help</Button>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </Card>
      </main>

    </div>
  );
};

export default ClientPortal;