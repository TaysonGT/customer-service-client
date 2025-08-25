import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, StatusBadge, Button, UserInfo } from '../../components/ui';
import { ChatStatus } from '../../features/chat/ChatStatus';
import { AttachmentList } from  '../../features/tickets/AttachmentList';
import { TicketType, TicketStatus, TicketPriority, AdminProfile, AdminRole, AdminStatus } from '../../types/types';
import { useAuth } from '../../context/AuthContext';
import { createAxiosAuthInstance } from '../../services/axiosAuth';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const mockTicket: TicketType = {
  id: '1',
  subject: 'Website login issues',
  description: 'Users are unable to login to the website. Getting 500 error when submitting login form. This started happening after the last deployment.',
  status: TicketStatus.IN_PROGRESS,
  priority: TicketPriority.HIGH,
  category: 'Technical Issues',
  isUrgent: true,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T14:45:00Z',
  attachments: [
    {
      id: '1',
      path: '/attachments/error-log.txt',
      bucket: 'tickets',
      name: 'error-log.txt',
      type: 'document',
      size: 1024,
      uploaded_at: new Date().toDateString()
    },
    {
      id: '2',
      path: '/attachments/screenshot.png',
      bucket: 'tickets',
      name: 'login-error.png',
      type: 'image',
      size: 204800,
      meta: { width: 800, height: 600 },
      uploaded_at: new Date().toDateString()
    }
  ],
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
    countryCode: 'US',
    clientProfile: {
      company: 'ABC Corporation',
      jobTitle: 'IT Manager',
      clientType: 'business',
      status: 'active',
      leadSource: 'website',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'USA'
      },
      socialProfiles: {
        twitter: 'johndoe',
        linkedin: 'johndoe'
      },
      preferences: {
        timezone: 'America/New_York',
        language: 'en',
        contactMethod: 'email',
        notificationPreferences: {
          marketing: false,
          productUpdates: true
        }
      }
    }
  },
  assignee: {
    id: 'user-002',
    username: 'janesmith',
    firstname: 'Jane',
    lastname: 'Smith',
    email: 'jane.smith@example.com',
    gender: 'female',
    categoryId: 'cat-002',
    supportId: 'sup-002',
    phone: '+1987654321',
    lastSeenAt: '2024-01-15T14:45:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    countryCode: 'US',
    adminProfile: {
      role: "support",
      status: 'active',
      title: 'Senior Support Specialist',
      permissions: {
        canManageTickets: true,
        canAccessChat: true,
        canViewReports: true
      },
      canManageAdmins: false
    } as AdminProfile
  },
  chat: {
    id: 'chat-001',
    title: 'Website Login Issues Discussion',
    description: 'Discussion about the ongoing login issues',
    ended: false,
    status: 'active',
    users: [
      {
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
        countryCode: 'US',
        clientProfile: {
          company: 'ABC Corporation',
          jobTitle: 'IT Manager',
          clientType: 'business',
          status: 'active',
          leadSource: 'website',
          address: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'USA'
          }
        }
      },
      {
        id: 'user-002',
        username: 'janesmith',
        firstname: 'Jane',
        lastname: 'Smith',
        email: 'jane.smith@example.com',
        gender: 'female',
        categoryId: 'cat-002',
        supportId: 'sup-002',
        phone: '+1987654321',
        lastSeenAt: '2024-01-15T14:45:00Z',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        countryCode: 'US',
        adminProfile: {
          role: "support" as AdminRole,
          status: 'active' as AdminStatus,
          title: 'Senior Support Specialist',
          permissions: {
            canManageTickets: true,
            canAccessChat: true,
            canViewReports: true
          },
          canManageAdmins: false
        }
      }
    ],
    startedAt: '2024-01-15T10:35:00Z',
    updatedAt: '2024-01-15T14:40:00Z',
    unread_messages: [
      {
        id: 'msg-003',
        content: 'Any updates on the fix?',
        type: 'text',
        
        senderId: 'user-001',
        chatId: 'chat-001',
        status: 'delivered',
        createdAt: '2024-01-15T14:40:00Z'
      }
    ],
    lastMessage: {
      id: 'msg-003',
      content: 'Any updates on the fix?',
      type: 'text',
      
      senderId: 'user-001',
      chatId: 'chat-001',
      status: 'delivered',
      createdAt: '2024-01-15T14:40:00Z'
    }
  }
};
export const TicketOverview = ({withHeader}:{withHeader?:boolean}) => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<TicketType>(); 
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAction, setIsLoadingAction] = useState<string|null>(null);

  const api = createAxiosAuthInstance()
  const { currentUser } = useAuth()
  const nav = useNavigate()


  const refetch = async()=>{
    setIsLoading(true)
    await api.get(`/tickets/${ticketId}`)
    .then(({data})=>{
      if(!data.success) return toast.error(data.message)
      setTicket(data.ticket)
    }).finally(()=>setIsLoading(false))
  }

  const handleClose = async()=>{
    await api.put(`/tickets/${ticketId}/close`)
    .then(({data})=>{
      if(data.success){
        toast.success(data.message)
        nav('/support/tickets')
      }else toast.error(data.message)
    })
    setIsLoadingAction(null)  
  }

  useEffect(()=>{
    refetch()
  },[ticketId])


  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader size={30} thickness={8}/>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-gray-500">Ticket not found</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gray-50 py-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {withHeader &&
          <div className="flex relative justify-center items-center mb-6">
            <Link
              to={currentUser?.role==='client'? '/client':'/support/tickets'}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium absolute left-0"
            >
              ← Back to {currentUser?.role==='client'? 'Home Page' : 'Tickets'}
            </Link>
            <h1 className='text-3xl font-semibold'>Ticket Details</h1>
          </div>
        }

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {ticket.subject}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Ticket #TKT-{ticket.id.toString().padStart(6, '0')} • Created {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={ticket.status} priority={ticket.priority} />
              </div>

              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700">{ticket.description}</p>
              </div>

              {ticket.isUrgent && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800 font-medium">
                    ⚠️ This ticket is marked as urgent
                  </p>
                </div>
              )}
            </Card>

            {/* Ticket Details */}
            <Card className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
                  <p className="text-sm text-gray-900">{ticket.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Created</h3>
                  <p className="text-sm text-gray-900">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Last Updated</h3>
                  <p className="text-sm text-gray-900">
                    {new Date(ticket.updatedAt).toLocaleString()}
                  </p>
                </div>
                {ticket.resolvedAt && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Resolved</h3>
                    <p className="text-sm text-gray-900">
                      {new Date(ticket.resolvedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Attachments */}
            <Card className="p-6">
              <AttachmentList ticketId={ticket.id} />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* People */}
            <Card className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">People</h2>
              <div className="space-y-4">
                {ticket.requester?
                  <UserInfo
                    user={ticket.requester}
                    label="Requester"
                  />
                  :
                  <p className='text-gray-500 text-sm'>Ticket has no requester</p>
                }
                {ticket.assignee && (
                  <UserInfo
                    user={ticket.assignee}
                    label="Assignee"
                  />
                )}
              </div>
            </Card>

            <Card className='p-2'>
              <ChatStatus
                chat={ticket.chat}
                ticketId={ticket.id}
              />
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
              <div className="space-y-3">
                {ticket.status === TicketStatus.OPEN&&
                  <Button variant="primary" fullWidth>
                    Edit Ticket
                  </Button>
                }
                <Button variant="outline" fullWidth>
                  Add Note
                </Button>
                {Object.values(AdminRole).includes(currentUser?.role as AdminRole) && ticket.status !== TicketStatus.CLOSED && (
                  <Button onClick={()=>{
                    setIsLoadingAction('close')
                    handleClose()
                  }} variant="danger" disabled={isLoadingAction==='close'} fullWidth>
                    {isLoadingAction==='close'? 'Closing Ticket...': 'Close Ticket'}
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketOverview;