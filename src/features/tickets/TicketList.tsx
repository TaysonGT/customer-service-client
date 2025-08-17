import { Badge, Avatar } from '../../components/ui';
import { TicketType } from '../../types/types';

interface TicketListProps {
  tickets: TicketType[];
  onSelect: (ticket: TicketType) => void;
  selectedTicketId?: string;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, onSelect, selectedTicketId }) => {
  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'primary';
      default: return 'default';
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {tickets?.map(ticket => (
        <div 
          key={ticket.id}
          className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedTicketId === ticket.id ? 'bg-blue-50' : ''}`}
          onClick={() => onSelect(ticket)}
        >
          <div className="flex justify-between">
            <div className="flex items-center gap-3">
              <Avatar 
                size="sm" 
                src={ticket.requester.avatarUrl}
                alt={`${ticket.requester.firstname} ${ticket.requester.lastname}`}
              />
              <div>
                <p className="font-medium">{ticket.subject}</p>
                <p className="text-sm text-gray-600">
                  {ticket.requester.firstname} {ticket.requester.lastname}
                </p>
              </div>
            </div>
            <Badge variant={getPriorityBadgeVariant(ticket.priority)}>
              {ticket.priority}
            </Badge>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">
              {new Date(ticket.updatedAt).toLocaleDateString()}
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                ticket.status === 'open' ? 'bg-red-100 text-red-800' : 
                ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {ticket.status.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketList;