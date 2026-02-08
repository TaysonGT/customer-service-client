import { useState } from "react";
import TicketList from "../../features/tickets/TicketList";
import { TicketType } from '../../types/types'
import { IUser } from "../../types/types";
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