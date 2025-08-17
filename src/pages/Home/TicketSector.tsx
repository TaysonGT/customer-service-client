import { useEffect, useState } from "react";
import TicketList from "../../features/tickets/TicketList";
import TicketDetails from "../../features/tickets/TicketDetails";
import { TicketType } from "../../types/types";
import { FaServicestack } from "react-icons/fa";
import { useAxiosAuth } from "../../hooks/useAxiosAuth";
import toast from "react-hot-toast";
import { mockTickets } from "./mockData";

const TicketSector = ()=>{
    const [selectedTicket, setSelectedTicket] = useState<TicketType|null>(null);
    const [myTicketsCount, setMyTicketsCount] = useState(8);
    const [tickets, setTickets] = useState<TicketType[]>([]);
    const [isLoading, setIsLoading] = useState(true)
    
    const api = useAxiosAuth()

    const refetch = async()=>{
        setTickets(mockTickets)
        // setIsLoading(true)
        // await api.get('clients')
        // .then(({data})=>{
        //     !data.success? toast.error(data.message)
        //         :setTickets(data.clients)
        // })
        setIsLoading(false)
    }

    useEffect(()=>{
        refetch()
    },[])

    return(
        <>
            <div className="w-full md:w-80 border-r border-gray-200 flex flex-col">         
                <TicketList onSelect={setSelectedTicket} tickets={tickets} />
            </div>
            <div className="flex-1 flex flex-col min-w-0">
            {(selectedTicket)?
                <TicketDetails {...{ticket: selectedTicket, onUpdate: refetch}} />
                :
                <div className='w-full h-full flex flex-col gap-2 justify-center items-center text-center'>
                    <FaServicestack className='text-[92px]'/>
                    <p className='text-xl'>Customer Service</p>
                    <p className='text-xs text-gray-700'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, excepturi?</p>
                </div>
            }
            </div>
        </>
    )
}

export default TicketSector