import React, { createContext, useContext, useState, useEffect } from 'react';
import { IAuthContext, ICurrentUser } from '../types/types';
import supabase from '../lib/supabase';
import { login, logout } from '../services/authService';
import { createAxiosAuthInstance } from '../services/axiosAuth';
import toast from 'react-hot-toast';

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<ICurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const logoutUser = async () => {
    await logout();
    setCurrentUser(null);
  };

  const api = createAxiosAuthInstance({
    onUnauthorized: logoutUser
  })

  const loginUser = async (email: string, password: string, role: "client"|"support") => {
    await login(email, password, role)
    .then(({userData})=>{
      setCurrentUser(userData||null)
    })
  };

  const getUserData = async () => {
    const {data} = await supabase.auth.getSession()
    if(!data.session?.user) {
      setIsLoading(false)
      return
    };
    api.get('/auth/user/me')
    .then(({data})=>{
      setCurrentUser(data.user)
    }).catch(()=>logout())
    .finally(()=>setIsLoading(false))
  };

  // Call this function whenever the user interacts with your app
  const updateLastSeen = async () => {
    if(!currentUser || currentUser?.role === 'admin') return;

    await api.patch('/auth/seen')
    .then(({data})=>!data.success&& toast.error(data.message))
  };

  // Example: Update on mount and every 30 seconds
  useEffect(()=>{
    // Add this to your app to verify the values
    console.log('PROD mode:', import.meta.env.PROD);
    console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);
    console.log('Final baseURL:', import.meta.env.PROD 
      ? import.meta.env.VITE_BACKEND_URL 
      : '/api');
    getUserData();
  },[])

  useEffect(()=>{
    updateLastSeen();
    const interval = setInterval(updateLastSeen, 30000);
    return () => clearInterval(interval);
  }, [currentUser])

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        loginUser,
        logoutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

