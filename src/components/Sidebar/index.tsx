import React, { useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  RiCustomerServiceFill, 
  RiDatabase2Line, 
  RiFeedbackFill, 
  RiHomeOfficeFill, 
  RiMenuLine, 
  RiToolsFill,
  RiLogoutBoxRLine,
  RiSettings3Line
} from "react-icons/ri";
import { MdPerson2 } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { FaServicestack } from 'react-icons/fa';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { motion, AnimatePresence } from 'framer-motion';
import {Avatar} from '../ui';
import { FiHelpCircle, FiInbox, FiMessageSquare, FiUsers } from 'react-icons/fi';

const otherLinks = [
  {
    name: "Dashboard",
    path: "/support",
    icon: <RiHomeOfficeFill/>
  },
  {
    name: "My Data",
    path: "/support/my-data",
    icon: <RiDatabase2Line/>
  },
  {
    name: "Agents",
    path: "/support/agents",
    icon: <RiCustomerServiceFill/>
  },
  {
    name: "Customers",
    path: "/support/customers",
    icon: <MdPerson2/>,
  },
  {
    name: "Sections",
    path: "/support/sections",
    icon: <RiToolsFill/>
  },
  {
    name: "Reports",
    path: "/support/reports",
    icon: <RiFeedbackFill/>
  },
]

const supportLinks = [
    {
        path: '/support/chats',
        name: 'Chats',
        icon: <FiMessageSquare />,
    },
    {
        path: '/support/tickets',
        name: 'Tickets',
        icon: <FiInbox />,
    },
    {
        path: '/support/clients',
        name: 'Clients',
        icon: <FiUsers />,
    },
    {
        path: '/support/knowledge',
        name: 'Knowledge Base',
        icon: <FiHelpCircle />,
    },
  ]

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logoutUser: logout } = useAuth();
  const [expand, setExpand] = useState<boolean>(false);
  const [links, setLinks] = useState<typeof supportLinks>(currentUser?.role==='support'? supportLinks: otherLinks);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const showBtnRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  useOutsideClick(sidebarRef, () => setExpand(false), [showBtnRef]);
  useOutsideClick(profileMenuRef, () => setShowProfileMenu(false));

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <motion.div 
      ref={sidebarRef}
      initial={{ width: expand ? 240 : 80 }}
      animate={{ width: expand ? 240 : 80 }}
      className="flex flex-col pb-6 bg-white text-primary-text h-screen fixed z-[99] border-r border-gray-200 shadow-sm hover:shadow-md transition-all"
    >
      {/* Menu Toggle Button */}
      <div 
        ref={showBtnRef} 
        onClick={() => setExpand(prev => !prev)} 
        className="self-start text-2xl px-6 py-6 cursor-pointer duration-150 hover:text-accent"
      >
        <RiMenuLine className={`transition-transform ${expand ? 'rotate-90' : ''}`} />
      </div>

      {/* Logo/Brand Section */}
      <div className='h-24 w-full flex bg-gray-50 justify-center py-4 px-6 mb-6 border-b border-gray-200'>
        <div className='flex items-center justify-start grow'>
          <FaServicestack className='text-4xl p-1 text-accent'/>
          <motion.div 
            initial={{ opacity: expand ? 1 : 0, width: expand ? 'auto' : 0 }}
            animate={{ opacity: expand ? 1 : 0, width: expand ? 'auto' : 0 }}
            className="overflow-hidden"
          >
            <h1 className='ml-2 text-xl font-bold whitespace-nowrap text-gray-800'>Haus</h1>
          </motion.div>
        </div>
      </div>

      {/* Navigation Links */}
      <ul className='flex flex-col gap-1 text-md justify-center px-3'>
        {links.map((link, i) => (
          <motion.li
            key={i}
            whileHover={{ scale: 1.02 }}
            className={`
              relative select-none z-[9] cursor-pointer py-2 
              rounded-lg group/secondary 
              ${location.pathname.includes(link.path.replace('/support/','')) ? 'bg-blue-50 text-accent' : 'hover:bg-gray-50'}
            `}
          >
            <Link 
              className='flex items-center duration-150 text-sm overflow-hidden' 
              to={link.path}
            >
              <div className={`
                w-10 flex items-center justify-center shrink-0
                text-xl duration-100 mx-1 aspect-square rounded-lg
                ${location.pathname.includes(link.path.replace('/support/','')) ? 'bg-accent text-white' : 'text-gray-600 group-hover/secondary:text-accent'}
              `}>
                {link.icon}
              </div>

              <motion.div 
                initial={{ opacity: expand ? 1 : 0, width: expand ? 'auto' : 0 }}
                animate={{ opacity: expand ? 1 : 0, width: expand ? 'auto' : 0 }}
                className="overflow-hidden"
              >
                <p className='ml-2 text-gray-700 font-medium text-nowrap'>{link.name}</p>
              </motion.div>
            </Link>
          </motion.li>
        ))}
      </ul>

      {/* Profile Section */}
      <div className='mt-auto px-3 pt-4 border-t border-gray-200 text-nowrap whitespace-nowrap'>
        <div 
          className='relative flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer'
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          ref={profileMenuRef}
        >
          <Avatar 
            src={currentUser?.avatarUrl} 
            alt={currentUser?.firstname} 
            size="sm"
            className="shrink-0"
          />
          
          <motion.div
            initial={{ opacity: expand ? 1 : 0, width: expand ? 'auto' : 0 }}
            animate={{ opacity: expand ? 1 : 0, width: expand ? 'auto' : 0 }}
            className="overflow-hidden"
          >
            <p className='text-sm font-medium text-gray-700'>
              {currentUser?.firstname} {currentUser?.lastname}
            </p>
            <p className='text-xs text-gray-500 truncate'>
              {currentUser?.email}
            </p>
          </motion.div>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 bottom-full mb-2 bg-white rounded-lg shadow-md border border-gray-200 z-10 p-2"
              >
                <Link
                  to="/settings"
                  className="flex items-center gap-3 pr-10 p-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <RiSettings3Line className="text-lg" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 pr-10 p-2 text-sm text-red-600 hover:bg-gray-50 w-full"
                >
                  <RiLogoutBoxRLine className="text-lg" />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar