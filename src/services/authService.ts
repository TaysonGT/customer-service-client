import supabase from '../lib/supabase';
import axios from 'axios';
import { setLastLoginRole } from '../utils/auth.utils';
import { createAxiosAuthInstance } from './axiosAuth';

export async function login(username: string, password: string, role: "client" | "support") {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  const api = createAxiosAuthInstance()

  const {data: resolvedData} = await axios.post(`/auth/username-resolve/${role}`, { username })
  .catch(error => {throw new Error(error.response?.data?.error || 'Failed to resolve username')});
  

  const email = resolvedData.email;
    
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  
  setLastLoginRole(role)
  const {data: userData} = await api.get(`/auth/user/me`)

  if (!userData.success) throw new Error(userData.message);
  
  return { userData: userData.user , session: data.session }
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
