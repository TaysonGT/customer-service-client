import React, { useEffect, useState } from 'react'

interface Props{
    show: boolean;
    hide: ()=>void;
    ref: React.RefObject<HTMLDivElement|null>
}

type notification = {
    id: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    imgUrl?:string;
}

const NotificationsDropdown:React.FC<Props> = ({show, hide, ref}) => {
    const [notifications, setNotifications] = useState<notification[]>([])
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(()=>{
        const fetchNotifications = async()=> {
            setIsLoading(true)
            setNotifications([
                {id: '1', message: 'New ticket created by John Doe, ticket created by John Doe', isRead: false, createdAt: '2024-10-01T10:00:00Z'},
                {id: '2', message: 'Ticket updated by Jane Smith', isRead: false, createdAt: '2024-10-01T11:30:00Z'},
                {id: '3', message: 'New comment on ticket #123', isRead: true, createdAt: '2024-09-30T15:45:00Z'},
            ])
        }
        show&&fetchNotifications()
        .finally(()=>
            setTimeout(()=>setIsLoading(false),1000)
        )
    },[show])

  return (
    <div ref={ref} className={`absolute z-200 mt-2 p-4 right-0 bg-white overflow-hidden flex flex-col w-85 text-nowrap text-gray-700 rounded-lg border-gray-200 border scale-y-95 opacity-0 top-[80%] left-1/2 -translate-x-1/2  shadow-lg text-sm duration-200 ${show? 'pointer-events-auto opacity-100 top-[100%] scale-y-100 origin-top':'pointer-events-none'} `}>
        <div className='flex items-center pb-2 border-b border-gray-200 justify-between flex-wrap gap-x-6 gap-y-2 mb-2'>
            <p className="font-medium text-base">Notifications</p>
            <span className='p-1 px-2 rounded-lg bg-indigo-500 text-white text-sm'>2 unread messages</span>
        </div>
        <div className='w-full flex flex-col max-h-80 overflow-y-auto'>
            {
                isLoading?
                [...Array(3)].map((_,idx)=>
                <div
                key={idx}
                className="py-3 px-2 rounded-lg"
                >
                    <div className="flex w-full overflow-hidden justify-between items-start">
                        {/* Left side - Avatar and text */}
                        <div className="flex w-full items-start gap-3">
                        <div className="relative w-10 h-10 shrink-0">
                            <div className="relative w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent animate-[shimmer_1.5s_infinite]" />
                            </div>
                        </div>
                        
                        <div className='grow min-w-0 space-y-2'>
                            <div className="flex flex-col gap-2">
                            <div className="relative h-4 w-24 rounded-md bg-gray-200 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent animate-[shimmer_1.5s_infinite]" />
                            </div>
                            <div className="relative h-2.5 w-34 rounded-md bg-gray-200 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent animate-[shimmer_1.5s_infinite]" />
                            </div>
                            </div>
                            
                            <div className="relative h-3 w-full rounded-md bg-gray-200 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent animate-[shimmer_1.5s_infinite]" />
                            </div>
                        </div>
                        </div>
                        
                        {/* Right side - Time and indicator */}
                        <div className="flex flex-col items-end shrink-0 pl-2 space-y-2">
                        <div className="relative h-3 w-10 rounded-md bg-gray-200 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent animate-[shimmer_1.5s_infinite]" />
                        </div>
                        <div className="relative w-2.5 h-2.5 rounded-full bg-gray-200 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent animate-[shimmer_1.5s_infinite]" />
                        </div>
                        </div>
                    </div>
                </div>):
                notifications.length>0?
                    notifications.map((notif)=>(
                        <div key={notif.id} className={`flex p-3 px-4 w-full text-wrap rounded-lg 
                            ${notif.isRead? 'border-transparent bg-white':'border-accent bg-gray-50' } 
                            mb-2 hover:bg-gray-100 cursor-pointer`} onClick={()=>{
                            // Handle notification click
                            console.log(`Notification ${notif.id} clicked`)
                            hide();
                        }}>
                            <div className='grow'>
                                <p className="text-sm line-clamp-3">{notif.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{new Date(notif.createdAt).toLocaleString(undefined, {hour: '2-digit', minute: '2-digit'})}, {new Date(notif.createdAt).toLocaleDateString('en-US')}</p>
                            </div>
                            <div className='w-6 flex items-center justify-center'>
                                {!notif.isRead&&<span className='w-3 h-3 rounded-full bg-indigo-400'/>}
                            </div>
                        </div>
                    ))
                :
                <p className="text-sm text-gray-600">No new notifications</p>
            }
        </div>
    </div>
  )
}

export default NotificationsDropdown