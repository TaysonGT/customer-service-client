import axios from 'axios';
import supabase from '../lib/supabase';

export const createAxiosAuthInstance = (options?: {
  onUnauthorized?: () => Promise<void>; // Optional callback for 401 errors
}) => {
  const instance = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.PROD? import.meta.env.VITE_BACKEND_URL : '/api',
  });

  // Request interceptor (adds Supabase token)
  instance.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => Promise.reject(error));

  // Response interceptor (handles 401 errors)
  instance.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;
      if (err.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        if (options?.onUnauthorized) {
          await options.onUnauthorized(); // e.g., logout logic
        }
      }
      return Promise.reject(err);
    }
  );

  return instance;
};