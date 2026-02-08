import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const AuthRoutes = () => {
    const location = useLocation();
    const { currentUser, isLoading } = useAuth()

    if(isLoading){
        return (
            <div className='h-screen w-screen flex justify-center items-center'>
                <Loader size={50} thickness={7}/>
            </div>
        )
    }
    
    if(currentUser){
        return <Navigate to="/"  replace state={{from: location}} />
    }
    
    return <Outlet />
}

export default AuthRoutes