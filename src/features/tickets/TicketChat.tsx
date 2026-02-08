import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StatusBadge, Button, Avatar } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { createAxiosAuthInstance } from '../../services/axiosAuth';
import toast from 'react-hot-toast';
import { TicketType, TicketStatus, AdminRole } from '../../types/types';
import ChatBoxFixed from '../chat/ChatBoxFixed';
import { AttachmentList } from './AttachmentList';
import Loader from '../../components/Loader';
import { useChatMessages } from '../../hooks/useChatMessages';

export const TicketChat = ({ withHeader }: { withHeader?: boolean }) => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<TicketType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAction, setIsLoadingAction] = useState<string | null>(null);
  const [showAddAttachment, setShowAddAttachment] = useState(false)

  const api = createAxiosAuthInstance();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { groups, sendMessage, participants, loadMore, hasMore, isLoading: isChatLoading } = useChatMessages({ chatId: ticket?.chat?.id });

  const refetch = async()=>{
    setIsLoading(true)
    await api.get(`/tickets/${ticketId}`)
    .then(({data})=>{
      if(!data.success) return toast.error(data.message)
      setTicket(data.ticket)
    }).finally(()=>setIsLoading(false))
  }

  const handleClose = async () => {
    setIsLoadingAction('close');
    try {
      await api.put(`/tickets/${ticketId}/close`);
      toast.success('Ticket closed successfully');
      navigate('/support/tickets');
    } catch (error) {
      toast.error('Failed to close ticket');
    } finally {
      setIsLoadingAction(null);
    }
  };

  useEffect(() => {
    refetch();
  }, [ticketId]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader size={30} thickness={8} />
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
    <div className="h-full w-full bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left sidebar - Ticket info */}
        <div className="w-full lg:w-1/3 xl:w-1/4 flex flex-col bg-white border-r border-gray-200 py-8 px-2">
          <div className="mb-6 px-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold text-gray-700">#TKT-{ticket.id.toString().padStart(6, '0')}</h2>
              <StatusBadge status={ticket.status} priority={ticket.priority} />
            </div>
            <p className="text-sm text-gray-500">
              Created {new Date(ticket.createdAt).toLocaleDateString()}
            </p>
          </div>

          {ticket.isUrgent && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800 font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Marked as urgent
              </p>
            </div>
          )}

          <div className="space-y-6 grow min-h-0 overflow-y-auto px-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Requester</h3>
              <div className="flex items-center">
                <Avatar
                  src={ticket.requester?.avatarUrl}
                  alt={ticket.requester?.firstname || 'User'}
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {ticket.requester?.firstname} {ticket.requester?.lastname}
                  </p>
                  <p className="text-xs text-gray-500">{ticket.requester?.email}</p>
                  {ticket.requester?.clientProfile?.company && (
                    <p className="text-xs text-gray-500">{ticket.requester.clientProfile.company}</p>
                  )}
                </div>
              </div>
            </div>

            {ticket.assignee && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Assignee</h3>
                <div className="flex items-center">
                  <Avatar
                    src={ticket.assignee.avatarUrl}
                    alt={ticket.assignee.firstname}
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {ticket.assignee.firstname} {ticket.assignee.lastname}
                    </p>
                    <p className="text-xs text-gray-500">{ticket.assignee.email}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Details</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs text-gray-500">Category</dt>
                  <dd className="text-sm text-gray-900">{ticket.category}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Created</dt>
                  <dd className="text-sm text-gray-900">{new Date(ticket.createdAt).toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Last Updated</dt>
                  <dd className="text-sm text-gray-900">{new Date(ticket.updatedAt).toLocaleString()}</dd>
                </div>
                {ticket.resolvedAt && (
                  <div>
                    <dt className="text-xs text-gray-500">Resolved</dt>
                    <dd className="text-sm text-gray-900">{new Date(ticket.resolvedAt).toLocaleString()}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <div className='w-full flex justify-between items-center mb-2'>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Attachments</h3>
                <Button 
                  onClick={()=>setShowAddAttachment(true)}
                  variant="outline" size='sm'>
                    Add
                </Button>
              </div>
              <AttachmentList {...{ticketId: ticket.id, onClose: ()=>setShowAddAttachment(false), showAddAttachment}} />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" fullWidth>
                  Edit Ticket
                </Button>
                <Button variant="outline" size="sm" fullWidth>
                  Add Note
                </Button>
                {Object.values(AdminRole).includes(currentUser?.role as AdminRole) && ticket.status !== TicketStatus.CLOSED && (
                  <Button
                    onClick={handleClose}
                    variant="danger"
                    size="sm"
                    disabled={isLoadingAction === 'close'}
                    fullWidth
                  >
                    {isLoadingAction === 'close' ? 'Closing...' : 'Close Ticket'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Tab content */}
          <div className="flex-1 overflow-auto">
              <div className="h-full">
                {ticket.chat ? (
                  <ChatBoxFixed {...{
                    chat:ticket.chat,
                    groups, sendMessage, participants, loadMore, hasMore, isLoading: isChatLoading
                  }} />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Chat not started yet</h3>
                      {Object.values(AdminRole).includes(currentUser?.role as AdminRole)? 
                        <>
                          <p className="mt-1 text-sm text-gray-500">Start a conversation about this ticket.</p>
                          <div className="mt-6">
                            <Button variant="primary">
                              Start Chat
                            </Button>
                          </div>
                        </>
                        :
                        <p className="mt-1 text-sm text-gray-500">An agent will be with you in a moment.</p>
                      }
                    </div>
                  </div>
                )}
              </div>
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketChat;