import { useState } from "react";
import TicketList, { TicketType } from "../../features/tickets/TicketList";
import TicketDetails from "../../features/tickets/TicketDetails";
import { IUser } from "../../types/types";
import { FaServicestack } from "react-icons/fa";
import KnowledgeBase from "../../features/knowledge/KnowledgeBase";

const KnowledgeSector = ()=>{
    const [selectedTicket, setSelectedTicket] = useState<TicketType|null>(null);
    const [selectedClient, setSelectedClient] = useState<IUser|null>(null);
    return(
        <div className="flex-1 flex flex-col min-w-0">
            <KnowledgeBase />
        </div>
    )
}

export default KnowledgeSector