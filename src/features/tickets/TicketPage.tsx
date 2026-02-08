import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, StatusBadge, Button, UserInfo } from '../../components/ui';
import { ChatStatus } from '../../features/chat/ChatStatus';
import { AttachmentList } from  '../../features/tickets/AttachmentList';
import { TicketType, TicketStatus, AdminRole } from '../../types/types';
import { useAuth } from '../../context/AuthContext';
import { createAxiosAuthInstance } from '../../services/axiosAuth';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

export const TicketPage = ({withHeader}:{withHeader?:boolean}) => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<TicketType>(); 
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAction, setIsLoadingAction] = useState<string|null>(null);
  const [showAddAttachment, setShowAddAttachment] = useState(false)


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
              <div className='w-full flex items-center justify-between mb-4'>
                <h3 className="font-medium">Attachments</h3>
                <Button variant='secondary' size='sm' onClick={()=>setShowAddAttachment(true)}>Add Attachment</Button>
              </div>
              <AttachmentList onClose={()=>setShowAddAttachment(false)} showAddAttachment={showAddAttachment} ticketId={ticket.id} />
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
                    <span className='text-sm'>Edit Ticket</span>
                  </Button>
                }
                <Button variant="outline" fullWidth>
                  <span className='text-sm'>Add Note</span>
                </Button>
                {Object.values(AdminRole).includes(currentUser?.role as AdminRole) && ticket.status !== TicketStatus.CLOSED && (
                  <Button onClick={()=>{
                    setIsLoadingAction('close')
                    handleClose()
                  }} variant="danger" disabled={isLoadingAction==='close'} fullWidth>
                    <span className='text-sm'>{isLoadingAction==='close'? 'Closing Ticket...': 'Close Ticket'}</span>
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

export default TicketPage;