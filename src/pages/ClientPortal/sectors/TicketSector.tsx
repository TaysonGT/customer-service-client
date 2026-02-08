import { useState } from 'react'
import { Button, Badge, Modal } from '../../../components/ui'
import { TicketType } from '../../../types/types'
import CreateTicketModal from '../../../features/tickets/CreateTicketModal'
import { BadgeVariant } from '../../../components/ui/Badge'
import Loader from '../../../components/Loader'
import { Link } from 'react-router'


const statusVariantMap = {
  'open': 'default',
  'in_progress': 'primary',
  'resolved': 'success',
  'closed': 'outline',
  'on_hold': 'outline'
};

const priorityColorMap = {
  'low': 'text-green-600',
  'medium': 'text-yellow-600',
  'high': 'text-orange-600',
  'urgent': 'text-red-600',
  'critical': 'text-purple-600'
};

interface Props {
  tickets: TicketType[];
  isLoading: boolean;
  onAction: ()=>void
}

const TicketSector:React.FC<Props> = ({tickets, onAction, isLoading}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return isLoading?
    (
      <div className='py-10 flex justify-center'>
        <Loader size={40} thickness={6}/>
      </div>
    )
    :
    (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Your Support Requests</h3>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            New Ticket
          </Button>
        </div>
  
        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new support ticket.</p>
            <div className="mt-6">
              <Button onClick={() => setIsCreateModalOpen(true)}>
                New Ticket
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map(ticket => (
              <div key={ticket.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${priorityColorMap[ticket.priority]}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {ticket.subject}
                      </p>
                      {ticket.chat?.unread_messages && ticket.chat.unread_messages.length > 0 && (
                        <Badge variant="primary" className="ml-2">
                          {ticket.chat?.unread_messages.length} new
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <span>#{ticket.id}</span>
                      <span className="mx-2">•</span>
                      <span>{ticket.category}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={statusVariantMap[ticket.status] as BadgeVariant}>
                    {ticket.status.replace('-', ' ')}
                  </Badge>
                  <Link to={`/tickets/${ticket.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Create Ticket Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Ticket"
          size="lg"
        >
          <CreateTicketModal {...{onAction, setShow: setIsCreateModalOpen}} />
        </Modal>
      </div>
    )
}

export default TicketSector