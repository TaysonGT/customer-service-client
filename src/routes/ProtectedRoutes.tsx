import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getLastLoginRole } from '../utils/auth.utils';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import { AdminRole } from '../types/types';

const ProtectedRoutes = ({roles}:{roles:string[]}) => {
  const {currentUser, isLoading, logoutUser} = useAuth()
  const location = useLocation()

  if(isLoading){
    return (
      <div className='h-screen w-screen flex flex-col gap-6 justify-center items-center'>
        <Loader size={60} thickness={10}/>
        <p className='text-xl'>Please wait...</p>
      </div>
    )
  }

  if(currentUser === null){
    return getLastLoginRole() === 'support'?
      <Navigate to='/auth/login/support' replace state={{from: location}} />
      : <Navigate to='/auth/login/client' replace state={{from: location}} />
  }

  const isAdmin = Object.values(AdminRole).includes(currentUser?.role as AdminRole)
  const isClient = currentUser?.role === 'client'
  
  if(!isAdmin&&!isClient){
    return(
      <div className='w-screen h-screen flex flex-col gap-2 justify-center items-center text-6xl text-red-500'>
        <h1 className='font-bold'>User record Error</h1>
        <p className='text-2xl'>Please contact support!</p>
        <button onClick={logoutUser} className='text-base py-2 px-4 text-white bg-blue-500 font-semibold hover:bg-blue-300 duration-100 rounded-sm mt-4'>Logout</button>
      </div>
    )
  }
  
  if(roles.includes(currentUser.role)){
    return(
      <div className='relative w-screen h-screen flex flex-col'> 
        <Navbar />
        {isAdmin&& <Sidebar />}
        <div className={`${isAdmin? 'pl-20' : 'overflow-hidden'} grow flex min-h-0`}>
          <Outlet/>
        </div>
      </div> 
    )
  }
  
  return(
    <div className='w-screen h-screen flex flex-col justify-center items-center text-6xl text-red-500'>
      <h1 className='font-bold'>Unauthorized!</h1>
      <p className='text-xl'>You have no access to this page!</p>
      <Link to={'/'} className='text-base py-2 px-4 text-white bg-blue-500 font-semibold hover:bg-blue-300 duration-100 rounded-sm mt-6'>Redirect to home page</Link>
    </div>
  ) 
}
export default ProtectedRoutes