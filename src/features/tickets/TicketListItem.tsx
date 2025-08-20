import React, { useRef, useState } from 'react'
import { Avatar, Badge } from '../../components/ui';
import { TicketType } from '../../types/types';
import { createPortal } from 'react-dom';
import { TooltipText } from '../../components/TooltipText';

interface Props {
    onSelect: (ticket: TicketType) => void;
    ticket: TicketType;
    selectedTicketId?: string;
}

const TicketListItem:React.FC<Props> = ({onSelect, ticket, selectedTicketId}) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const textRef = useRef<HTMLDivElement>(null);
    
  const handleMouseEnter = () => {
    if(textRef.current){
      const rect = textRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left,
        y: rect.top - 5 // 5px above the text
      });
    }
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

    const getPriorityBadgeVariant = (priority: string) => {
        switch (priority) {
            case 'critical': return 'danger';
            case 'high': return 'warning';
            case 'medium': return 'primary';
            default: return 'default';
        }
    };
  return (
    <div 
        className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedTicketId === ticket.id ? 'bg-blue-50' : ''}`}
        onClick={() => onSelect(ticket)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={textRef}
    >
        {showTooltip && createPortal(
            <TooltipText text={ticket.subject} position={position} />,
            document.body
        )}
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-3 w-full overflow-hidden">
                <Avatar 
                size="sm" 
                src={ticket.requester.avatarUrl}
                alt={`${ticket.requester.firstname} ${ticket.requester.lastname}`}
                />
                <div className='grow min-w-0'>
                <p className="font-medium w-full truncate">{ticket.subject}</p>
                <p className="text-sm text-gray-600">
                    {ticket.requester.firstname} {ticket.requester.lastname}
                </p>
                </div>
            </div>
            <Badge variant={getPriorityBadgeVariant(ticket.priority)} className=''>
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
  )
}

export default TicketListItem