import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { AdminRole, UserRole } from '../types/types';
import { getLastLoginRole } from '../utils/auth.utils';

const RedirectRoute = () => {
    const location = useLocation();
    const { currentUser, isLoading } = useAuth()
    
    if(isLoading){
        return (
          <div className='h-screen w-screen flex flex-col gap-6 justify-center items-center'>
            <Loader size={60} thickness={10}/>
            <p className='text-xl'>Please wait...</p>
          </div>
        )
    }
    if(currentUser?.role==='client') 
        return <Navigate to="/client" replace state={{from: location}} />
    if(Object.values({...AdminRole, CLIENT: 'client'}).includes(currentUser?.role as UserRole)) 
        return <Navigate to="/support" replace state={{from: location}} />
    
    if(!currentUser){
      return getLastLoginRole() === 'support'?
        <Navigate to='/auth/login/support' replace state={{from: location}} />
        : <Navigate to='/auth/login/client' replace state={{from: location}} />
    }
}

export default RedirectRoute