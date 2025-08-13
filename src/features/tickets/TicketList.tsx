import { Badge, Avatar, Card } from '../../components/ui';

export type TicketType = {
    id: string;
    subject: string;
    client: {
        name: string;
        email: string;
    };
    status: string;
    priority: string;
    assignedTo: string;
    lastUpdated: string;
    unread: boolean;
}

const TicketList = ({ onSelect }:{onSelect:(ticket: TicketType)=>void}) => {
  const tickets = [
    { 
      id: 'TKT-1001',
      subject: 'Payment failed for order #12345',
      client: { name: 'Alex Johnson', email: 'alex@example.com' },
      status: 'open',
      priority: 'high',
      assignedTo: 'You',
      lastUpdated: '2 hours ago',
      unread: true
    },
    // More tickets...
  ];

  return (
    <div className="divide-y divide-gray-200">
      {tickets.map(ticket => (
        <div 
          key={ticket.id}
          className="p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => onSelect(ticket)}
        >
          <div className="flex justify-between">
            <div className="flex items-center gap-3">
              <Avatar size="sm" />
              <div>
                <p className="font-medium">{ticket.client.name}</p>
                <p className="text-sm text-gray-600">{ticket.subject}</p>
              </div>
            </div>
            <Badge variant={ticket.priority === 'high' ? 'danger' : 'warning'}>
              {ticket.priority}
            </Badge>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">{ticket.lastUpdated}</span>
            {ticket.unread && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketList