import axios from 'axios';
import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import supabase from '../lib/supabase';

export const useAxiosAuth = () => {
  const { currentUser, logoutUser } = useAuth();

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      withCredentials: true,
      baseURL: '/api', 
    });

    instance.interceptors.request.use(async (config) => {
      const { data: { session } } = await supabase.auth.getSession();

      const token = session?.access_token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    }, (error) => {
      return Promise.reject(error);
    });

    instance.interceptors.response.use(
      res => res,
      async err => {
        const originalRequest = err.config;

        // Only retry once
        if (err.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          if (currentUser) {
            return instance(originalRequest);
          } else {
            logoutUser();
          }
        }

        return Promise.reject(err);
      }
    );

    return instance;
  }, [currentUser]);

  return axiosInstance;
};
