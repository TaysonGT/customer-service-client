import React, { createContext, useContext, useState, useEffect } from 'react';
import { IAuthContext, ICurrentUser } from '../types/types';
import supabase from '../lib/supabase';
import { login, logout } from '../services/authService';

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<ICurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loginUser = async (email: string, password: string, role: "client"|"support_agent"|"admin") => {
    const { safeUser } = await login(email, password, role)
    setCurrentUser(safeUser||null);
  };

  const logoutUser = async () => {
    await logout();
    setCurrentUser(null);
  };
  const getUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if(!user) {
      setCurrentUser(null)
    }else if (user?.email) {
      const { data, error } = await supabase
        .from(user.user_metadata.role==='client'? 'clients': 'support_agents')
        .select('id, firstname, lastname, email, avatarUrl')
        .eq('email', user.email)
        .single();
      if (!error) setCurrentUser({...data, role: user.user_metadata.role});
    }
    setIsLoading(false);
  };

  // Call this function whenever the user interacts with your app
  const updateLastSeen = async () => {
    if(!currentUser || currentUser?.role === 'admin') return;
    await supabase
      .from(currentUser?.role=='client'? 'clients' : 'support_agents')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('id', currentUser?.id);
  };

  // Example: Update on mount and every 30 seconds
  useEffect(()=>{
    getUserProfile();
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

