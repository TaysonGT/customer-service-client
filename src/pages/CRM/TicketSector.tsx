// File: src/pages/SupportTickets.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiPlus, FiClock, FiUser, FiAlertCircle, FiCheckCircle, FiMessageSquare, FiEye } from 'react-icons/fi';
import { TicketType, TicketStatus, TicketPriority } from '../../types/types';
import { createAxiosAuthInstance } from '../../services/axiosAuth';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { Button, Modal } from '../../components/ui';

  // Mock data - replace with API calls
  const mockTickets: TicketType[] = [
    {
      id: '1',
      subject: 'Website login issues',
      description: 'Users cannot login to the website',
      status: TicketStatus.OPEN,
      priority: TicketPriority.HIGH,
      category: 'Technical Issues',
      isUrgent: true,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:45:00Z',
      attachments: [],
      requester: {
        id: 'user-001',
        username: 'johndoe',
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        gender: 'male',
        categoryId: 'cat-001',
        supportId: 'sup-001',
        phone: '+1234567890',
        lastSeenAt: '2024-01-15T14:30:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        countryCode: 'US'
      },
      chat: {
        id: 'chat-001',
        title: 'Website Login Issues',
        description: 'Login problems discussion',
        ended: false,
        status: 'active',
        users: [],
        startedAt: '2024-01-15T10:35:00Z',
        updatedAt: '2024-01-15T14:40:00Z',
        unread_messages: [
          {
            id: 'msg-001',
            chatId: 'chat-001',
            type: 'text',
            senderId: 'user-001',
            senderType: 'client',
            content: 'Any updates?',
            createdAt: '2024-01-15T14:40:00Z',
            status: 'delivered'
          }
        ]
      }
    },
    {
      id: '2',
      subject: 'Payment processing failed',
      description: 'Credit card payment not working',
      status: TicketStatus.IN_PROGRESS,
      priority: TicketPriority.CRITICAL,
      category: 'Billing',
      isUrgent: true,
      createdAt: '2024-01-15T09:15:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
      attachments: [],
      requester: {
        id: 'user-002',
        username: 'sarahw',
        firstname: 'Sarah',
        lastname: 'Wilson',
        email: 'sarah@example.com',
        gender: 'female',
        categoryId: 'cat-002',
        supportId: 'sup-002',
        phone: '+1987654321',
        lastSeenAt: '2024-01-15T14:20:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        countryCode: 'US'
      }
    }
  ];

const SupportTickets: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [tickets, setTickets] = useState<TicketType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const api = createAxiosAuthInstance()
  const [showStartChat, setShowStartChat] = useState<boolean>(true)
  const [selectedTicket, setSelectedTicket] = useState<TicketType|null>(null)
  const [loadingAction, setLoadingAction] = useState<string|null>(null)

  const refetch = async()=>{
    setIsLoading(true)
    await api.get('/tickets/support')
    .then(({data})=>{
      if(!data.success) return toast.error(data.message)
      setTickets(data.tickets)
    }).finally(()=> setIsLoading(false))
  }

  const handleStartChat = async()=>{
    if(!selectedTicket) return toast.error('Please select a ticket!');
    setLoadingAction('start_chat')
    await api.post(`/tickets/${selectedTicket.id}/chat`)
    .then(({data})=>{
      if(!data.success) return toast.error(data.message)
      toast.success(data.message)
      navigate(`/chats/${data.chat.id}`)
    }).finally(()=> setLoadingAction(null))
  }

  const onClickChat = async(ticket:TicketType)=>{
    setSelectedTicket(ticket)
    setShowStartChat(true)
  }

  useEffect(()=>{
    refetch()
  },[])

  const statusColors = {
    [TicketStatus.OPEN]: 'bg-gray-100 text-gray-800',
    [TicketStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
    [TicketStatus.ON_HOLD]: 'bg-yellow-100 text-yellow-800',
    [TicketStatus.RESOLVED]: 'bg-green-100 text-green-800',
    [TicketStatus.CLOSED]: 'bg-gray-100 text-gray-600 border border-gray-300'
  };

  const priorityColors = {
    [TicketPriority.LOW]: 'bg-gray-100 text-gray-800',
    [TicketPriority.MEDIUM]: 'bg-blue-100 text-blue-800',
    [TicketPriority.HIGH]: 'bg-orange-100 text-orange-800',
    [TicketPriority.CRITICAL]: 'bg-red-100 text-red-800'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || ticket.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getUnreadCount = (ticket: TicketType) => {
    return ticket.chat?.unread_messages?.length || 0;
  };

  return (
    <div className="h-full w-full bg-gray-50">
      <Modal isOpen={selectedTicket!==null&&showStartChat} onClose={()=>setShowStartChat(false)} size='sm' title='Start Chat'>
        <p className='text-wrap text-xl text-center'>There's no chat on ticket:</p>
        <p className='text-wrap text-base text-gray-800 font-semibold text-center'>#TKT-{selectedTicket?.id.toString().padStart(6,'0')}</p>
        <p className='mt-2 text-lg text-center font-semibold'>Do you want to open chatting for this ticket?</p>
        <div className='flex gap-4 mt-4'>
          <Button variant='outline' className='flex-1'>
            No
          </Button>
          <Button onClick={handleStartChat} disabled={loadingAction==='start_chat'} variant='primary' className='flex-1'>
            {loadingAction==='start_chat'?(<div className='flex gap-2 items-center'><Loader size={16} thickness={4} /> <p>Starting...</p></div>): 'Yes'}
          </Button>
        </div>
      </Modal>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ticket Management</h1>
            <p className="text-sm text-gray-600">Manage and resolve customer support tickets</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
            <FiPlus className="w-4 h-4" />
            New Ticket
          </button>
        </div>
      </div>
      <div className="p-6">
        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiSearch className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search tickets by subject or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md flex items-center gap-2 transition-colors">
              <FiFilter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {[
            { value: 'all', label: 'All Tickets', count: tickets.length },
            { value: TicketStatus.OPEN, label: 'Open', count: tickets.filter(t => t.status === TicketStatus.OPEN).length },
            { value: TicketStatus.IN_PROGRESS, label: 'In Progress', count: tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length },
            { value: TicketStatus.RESOLVED, label: 'Resolved', count: tickets.filter(t => t.status === TicketStatus.RESOLVED).length }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.value
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {
          isLoading?<div className='flex w-full justify-center py-6'>
            <Loader size={30} thickness={6}/>
          </div>
          :filteredTickets.length>0?
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <tr 
                    key={ticket.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              #{ticket.id}
                            </span>
                            {getUnreadCount(ticket) > 0 && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                {getUnreadCount(ticket)}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-900 font-medium">
                            {ticket.subject}
                          </div>
                          <div className="text-sm text-gray-500">
                            {ticket.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ticket.requester?
                        <div className="flex items-center">
                          <img
                            src={ticket.requester.avatarUrl}
                            alt={ticket.requester.firstname}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="ml-3 text-sm text-gray-900">
                            {ticket.requester.firstname} {ticket.requester.lastname}
                          </span>
                        </div>
                      :
                        <p className='text-sm text-gray-600'>Ticket has no requester</p>
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(ticket.updatedAt)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(ticket.updatedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/tickets/${ticket.id}`);
                          }}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                          title="View ticket"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            ticket.chat?
                            navigate(`/chats/${ticket.chat?.id}`)
                            : onClickChat(ticket)
                            
                          }}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                          title="Start chat"
                        >
                          <FiMessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          :(
            <div className="text-center py-12">
              <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search term' : 'No tickets match the current filters'}
              </p>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          {[
            { icon: FiClock, label: 'Open Tickets', value: '12', color: 'blue' },
            { icon: FiCheckCircle, label: 'Resolved Today', value: '8', color: 'green' },
            { icon: FiAlertCircle, label: 'High Priority', value: '3', color: 'orange' },
            { icon: FiUser, label: 'Avg. Response', value: '24m', color: 'purple' }
          ].map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 bg-${stat.color}-100 rounded-full flex items-center justify-center`}>
                    <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;