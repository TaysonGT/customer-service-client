import { RiChat3Line, RiLogoutCircleRLine, RiNotification3Line, RiSearch2Line } from "react-icons/ri"
import { ICurrentUser } from "../../types/types"
import { MdArrowDropDown, MdSettings } from "react-icons/md"
import { FaRegUserCircle } from "react-icons/fa"
import { useRef, useState } from "react"
import { useOutsideClick } from "../../hooks/useOutsideClick"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router"

const Navbar = ({currentUser}:{currentUser:ICurrentUser}) => {
    const [showDrop, setShowDrop] = useState<boolean>(false)
    const dropDownRef = useRef<HTMLDivElement>(null)
    const menuBtnRef = useRef<HTMLDivElement>(null)
    const {logoutUser} = useAuth()
    
    const nav = useNavigate()
    useOutsideClick(dropDownRef, ()=>setShowDrop(false), [menuBtnRef])

  return (
    <div className='w-screen pl-27.75 py-4 bg-slate-50 z-[10] border-b border-gray-200'>
        <div className='flex justify-between items-center w-[90%] mx-auto'>
            <div className='relative'>
                <input className='p-2 px-4 bg-white rounded-3xl' placeholder='Search...' type="search" />
                <RiSearch2Line className="absolute top-1/2 -translate-y-1/2 right-6 cursor-pointer"/>
            </div>
            <div className="text-3xl flex items-center gap-4">
                <div className="relative hover:text-slate-100 duration-150 cursor-pointer">
                    <RiNotification3Line/>
                    <span className="absolute flex justify-center items-center -top-1.5 -left-1 h-5 w-5 rounded-full text-white bg-secondary-accent text-xs">0</span>
                </div>
                <RiChat3Line className="hover:text-slate-100 duration-150 cursor-pointer"/>
                <div className="relative ml-4">
                    <div className="border border-primary-text hover:bg-slate-100 duration-150 rounded-4xl p-2 px-3 cursor-pointer flex gap-2 items-center" 
                    ref={menuBtnRef} 
                    onClick={()=>setShowDrop(prev=>!prev)}>
                        <div className="border border-primary-text rounded-full h-8 w-8 overflow-hidden">
                            <img src={currentUser.avatarUrl||'/src/assets/imgs/1.webp'} alt="" className='h-full w-full'/>
                        </div>
                        <div className="text-sm border-l border-primary-text pl-2 gap-4 flex items-center">
                            <div>
                                <p>{currentUser.firstname} {currentUser.lastname}</p> 
                                <p className="text-[10px] text-accent">
                                    {currentUser.role.replace('_', ' ').split(' ').map(s=>s[0].toUpperCase()+s.slice(1).toLowerCase()+' ')}
                                </p>
                            </div>
                            <MdArrowDropDown className="text-xl"/>
                        </div>
                    </div>

                    <div className={`absolute z-1000 overflow-hidden rounded-lg p-2 border-gray-200 border scale-y-95 opacity-0 top-[80%] left-1/2 -translate-x-1/2 bg-white text-black shadow-lg text-sm duration-200 ${showDrop? 'pointer-events-auto opacity-100 top-[100%] scale-y-100 origin-top':'pointer-events-none'} `}>
                        <div ref={dropDownRef} className='flex flex-col w-40 text-nowrap text-xs text-gray-700'>
                            <div className='flex items-center gap-2 rounded-lg p-2 px-4 cursor-pointer duration-75 hover:bg-gray-50'>
                                <FaRegUserCircle className='text-lg'/> Profile
                            </div>
                            <div className='flex items-center gap-2 rounded-lg p-2 px-4 cursor-pointer duration-75 hover:bg-gray-50'>
                                <MdSettings className='text-lg'/> Settings
                            </div>
                            <div onClick={async()=>{
                                await logoutUser()
                                nav('/')
                            }} className='flex items-center gap-2 rounded-lg p-2 px-4 cursor-pointer text-red-500 duration-75 hover:bg-gray-100'>
                                <RiLogoutCircleRLine className='text-lg'/> Logout
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar