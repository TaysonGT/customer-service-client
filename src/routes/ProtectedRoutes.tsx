import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { getLastLoginRole } from '../utils/auth.utils';
import Loader from '../components/Loader';
// import Navbar from '../components/Navbar';

const ProtectedRoutes = ({roles}:{roles:string[]}) => {
  const {currentUser, isLoading} = useAuth()
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
    return getLastLoginRole() === 'support_agent'?
      <Navigate to='/auth/login/support' replace state={{from: location}} />
      : <Navigate to='/auth/login/client' replace state={{from: location}} />
  }
  
  if(roles.includes(currentUser.role)){
    return(
      <div className='relative max-w-screen h-screen flex flex-col'> 
        {currentUser.role !== 'admin'&&
          <Sidebar />       
        }
        <div className={`${currentUser.role !== 'admin'&& 'pl-20'} grow min-h-0`}>
          <Outlet/>
        </div>
      </div> 
    )
  }else return(
    <div className='w-screen h-screen flex flex-col justify-center items-center text-6xl text-red-500'>
      <h1 className='font-bold'>Unauthorized!</h1>
      <p className='text-xl'>You have no access to this page!</p>
    </div>
  ) 
}
export default ProtectedRoutes