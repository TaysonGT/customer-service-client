import { RiLogoutCircleRLine, RiSearch2Line } from "react-icons/ri"
import { MdArrowDropDown, MdSettings } from "react-icons/md"
import { FaRegUserCircle, FaServicestack } from "react-icons/fa"
import { useEffect, useRef, useState } from "react"
import { useOutsideClick } from "../../hooks/useOutsideClick"
import { useAuth } from "../../context/AuthContext"
import { Link, useNavigate } from "react-router"
import { IoChatbubbleEllipsesOutline, IoNotificationsOutline } from "react-icons/io5"
import NotificationsDropdown from "./NotificationsDropdown"
import MessagesDropdown from "./MessagesDropdown"
import supabase from "../../lib/supabase"
import { useAxiosAuth } from "../../hooks/useAxiosAuth"
import { IChat, IChatMessage } from "../../types/types"

const Navbar = () => {
    const [showProfile, setShowProfile] = useState<boolean>(false)
    const [showNotifications, setShowNotifications] = useState<boolean>(false)
    const [showChat, setShowChat] = useState<boolean>(false)
    
    const [notifications, setNotifications] = useState(0)
    const [messages, setMessages] = useState(0)

    const [myChatIds, setMyChatIds] = useState<Set<string>>(new Set())

    const profileRef = useRef<HTMLDivElement>(null)
    const bellRef = useRef<HTMLDivElement>(null)
    const chatRef = useRef<HTMLDivElement>(null)

    const menuBtnRef = useRef<HTMLDivElement>(null)
    const bellBtnRef = useRef<HTMLDivElement>(null)
    const chatBtnRef = useRef<HTMLDivElement>(null)

    const {logoutUser, currentUser} = useAuth()
    const api = useAxiosAuth()
    
    const nav = useNavigate()
    useOutsideClick(profileRef, ()=>setShowProfile(false), [menuBtnRef])
    useOutsideClick(bellRef, ()=>setShowNotifications(false), [bellBtnRef])
    useOutsideClick(chatRef, ()=>setShowChat(false), [chatBtnRef])

    const fetchMyChats = async () => {
        try {
            const { data } = await api.get('/chats/me/unread')
            if (data?.success && Array.isArray(data.unreadChats)) {
                setMyChatIds(new Set(data.unreadChats.map((c: any) => c.id)))
                setMessages(data.unreadChats.filter((c:{unread_messages:number})=>c.unread_messages>0).length)
            }
        } catch (err) {
            console.error('Failed to fetch chats for notifications', err)
        }
    }

    useEffect(()=>{
        fetchMyChats()
    }, [currentUser?.id])

    useEffect(()=>{
        const channel = supabase
            .channel('chat_notifications')
            .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'chat_messages',
            },
            (payload) => {
                const newMsg = payload.new as IChatMessage
                const chatId = (newMsg as any).chatId || (newMsg as any).chat_id
                if (!chatId) return
                if (!myChatIds.has(chatId)) return // ignore messages for chats we're not in
                fetchMyChats()
            }
            )
            .subscribe();
            
        return ()=> {
            supabase.removeChannel(channel);
        }
    },[myChatIds])

  return (
    <div className='w-full py-4 bg-white z-[10] border-b border-gray-200'>
        <div className={`flex justify-between items-center ${currentUser?.role!=='client'&& 'pl-26'} px-16 mx-auto`}>
            <Link to={currentUser?.role==="client"?'/client':'/support'} className='flex items-end justify-start gap-2 px-4'>
                <FaServicestack className='text-4xl text-accent'/>
                <h1 className='text-xl font-bold whitespace-nowrap text-gray-800'>Haus</h1>
            </Link>
            <div className="text-2xl flex items-center gap-4">
                <div className='relative text-base mr-4'>
                    <input className='p-2 px-4 bg-slate-50 rounded-3xl' placeholder='Search...' type="search" />
                    <RiSearch2Line className="absolute top-1/2 -translate-y-1/2 right-6 cursor-pointer"/>
                </div>
                <div className="relative inline-block z-50">
                    <div ref={bellBtnRef} onClick={()=>setShowNotifications(prev=>!prev)} className="relative hover:text-accent duration-150 cursor-pointer">
                        <IoNotificationsOutline/>
                        {notifications>0&&<span className="absolute -top-1.5 -left-1 p-1.5 py-0.5 rounded-full text-white bg-accent text-xs">{notifications}</span>}
                    </div>
                    <NotificationsDropdown ref={bellRef} show={showNotifications} hide={()=>setShowNotifications(false)}/>
                </div>
                <div className="relative inline-block z-50">
                    <div ref={chatBtnRef} onClick={()=>setShowChat(prev=>!prev)} className="relative hover:text-accent duration-150 cursor-pointer">
                        <IoChatbubbleEllipsesOutline/>
                        {messages>0&&<span className="absolute -top-1.5 -left-1 p-1.5 py-0.5 rounded-full text-white bg-accent text-xs">{messages}</span>}
                    </div>
                    <MessagesDropdown {...{ref:chatRef,show:showChat, unread:messages, hide: ()=>setShowChat(false)}}/>
                </div>
                <div className="relative ml-4">
                    <div className="border border-primary-text hover:bg-slate-100 duration-150 rounded-4xl p-2 px-3 cursor-pointer flex gap-2 items-center" 
                    ref={menuBtnRef} 
                    onClick={()=>setShowProfile(prev=>!prev)}>
                        <div className="border border-primary-text rounded-full h-8 w-8 overflow-hidden">
                            <img src={currentUser?.avatarUrl||'/src/assets/imgs/1.webp'} alt="" className='h-full w-full'/>
                        </div>
                        <div className="text-sm border-l border-primary-text pl-2 gap-4 flex items-center">
                            <div>
                                <p>{currentUser?.firstname} {currentUser?.lastname}</p> 
                                <p className="text-[10px] text-accent">
                                    {currentUser?.role.replace('_', ' ').split(' ').map(s=>s[0].toUpperCase()+s.slice(1).toLowerCase()+' ')}
                                </p>
                            </div>
                            <MdArrowDropDown className="text-xl"/>
                        </div>
                    </div>

                    <div ref={profileRef} className={`absolute z-1000 overflow-hidden flex flex-col w-40 text-nowrap text-gray-700 rounded-lg p-2 border-gray-200 border scale-y-95 opacity-0 top-[80%] left-1/2 -translate-x-1/2 bg-white shadow-lg text-sm duration-200 ${showProfile? 'pointer-events-auto opacity-100 top-[100%] scale-y-100 origin-top':'pointer-events-none'} `}>
                        <Link to={`/profile/${currentUser?.id}`}
                        onClick={()=>setShowProfile(false)}
                        className='flex items-center gap-2 rounded-lg p-2 pl-3 cursor-pointer duration-75 hover:bg-gray-50'>
                            <FaRegUserCircle className='text-lg'/> Profile
                        </Link>
                        <Link to={'#'} 
                        onClick={()=>setShowProfile(false)}
                        className='flex items-center gap-2 rounded-lg p-2 pl-3 cursor-pointer duration-75 hover:bg-gray-50'>
                            <MdSettings className='text-lg'/> Settings
                        </Link>
                        <div onClick={async()=>{
                            await logoutUser()
                            setShowProfile(false)
                            nav('/')
                        }} className='flex items-center gap-2 rounded-lg p-2 pl-3 cursor-pointer text-red-500 duration-75 hover:bg-gray-100'>
                            <RiLogoutCircleRLine className='text-lg'/> Logout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar