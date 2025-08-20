import { TicketType } from '../../types/types';
import TicketListItem from './TicketListItem';

interface TicketListProps {
  tickets: TicketType[];
  onSelect: (ticket: TicketType) => void;
  selectedTicketId?: string;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, onSelect, selectedTicketId }) => {

  return (
    <div className="divide-y divide-gray-200">
      {tickets?.map(ticket => (
        <TicketListItem key={ticket.id} {...{ticket, onSelect, selectedTicketId}} />
      ))}
    </div>
  );
};

export default TicketList;