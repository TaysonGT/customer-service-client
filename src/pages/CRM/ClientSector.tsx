import { useEffect, useState } from "react";
import ClientList from "../../features/crm/ClientList";
import { IUser } from "../../types/types";
import { FaServicestack } from "react-icons/fa";
import ClientProfile from "../../features/crm/ClientProfile";
import NewClientForm, { IUserPayload } from "../../features/crm/NewClientForm";
import { Modal } from "../../components/ui";
import toast from "react-hot-toast";
import { Loader } from "../../components/ui/Loader";
import { useAxiosAuth } from "../../hooks/useAxiosAuth";

const ClientSector = ()=>{
    const [selectedClient, setSelectedClient] = useState<IUser|null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [clients, setClients] = useState<IUser[]>([]);
    const [isLoading, setIsLoading] = useState(true)

    const api = useAxiosAuth()

    const refetch = async()=>{
        // setClients(mockUsers)
        setIsLoading(true)
        await api.get('clients')
        .then(({data})=>{
            !data.success? toast.error(data.message)
                :setClients(data.clients)
        })
        setIsModalOpen(false)
        setIsLoading(false)
    }

    useEffect(()=>{
        refetch()
    },[])

    const handleNewClient = (newClient: IUserPayload) => {
        console.log(newClient)
        setIsLoading(true)
        api.post("/clients", newClient)
        .then(({data})=>{
            if(data.success){
                toast.success(data.message)
                refetch()
            }else toast.error(data.message)
        })
    };

    return (
        isLoading?(
            <div className="h-full w-full flex justify-center items-center">
                <Loader size={40} thickness={2}/>
            </div>
        ):
        <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Client">
                <NewClientForm 
                    onSubmit={(newClient)=>handleNewClient(newClient)} 
                    onCancel={() => setIsModalOpen(false)} 
                />
            </Modal>

            <div className="w-full md:w-80 border-r border-gray-200 flex flex-col">
                <ClientList 
                    clients={clients}
                    onSelect={setSelectedClient}
                    showCreate={()=>setIsModalOpen(true)}
                />
            </div>
            <div className="flex-1 flex flex-col min-w-0">
            {selectedClient?
                <ClientProfile client={selectedClient} />
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

export default ClientSector