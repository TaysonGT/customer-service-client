import supabase from '../lib/supabase';
import axios from 'axios';
import { setLastLoginRole } from '../utils/auth.utils';
import { ICurrentUser } from '../types/types';

export async function login(username: string, password: string, role: "client" | "support_agent"|"admin") {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  const response = await axios.post(`/auth/username-resolve/${role}`, { username })
  .catch(error => {throw new Error(error.response?.data?.error || 'Failed to resolve username')});
  

  const email = response.data.email;
    
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  const user = data.user;

  if(role==="client"){
    const { data: userData, error: userError } = await supabase
      .from('clients')
      .select('id, firstname, lastname, email, avatarUrl')
      .eq('email', user.email)
      .single();
  
    if (userError) throw new Error(userError.message);
    const safeUser:ICurrentUser = { ...userData, role };
    setLastLoginRole('client')
    return { safeUser, session: data.session };
  }else{
    const { data: userData, error: userError } = await supabase
      .from('support_agents')
      .select('id, firstname, lastname, email, avatarUrl')
      .eq('email', user.email)
      .single();
  
    if (userError) throw new Error(userError.message);
    const safeUser:ICurrentUser = { ...userData, role };
    setLastLoginRole('support_agent')
    return { safeUser, session: data.session };
  }
  
}

export async function register(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}
