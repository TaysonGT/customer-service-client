// Updated `useAxiosAuth` hook (uses the standalone function)
import { useAuth } from '../context/AuthContext';
import { createAxiosAuthInstance } from '../services/axiosAuth';

export const useAxiosAuth = () => {
  const { currentUser, logoutUser } = useAuth();
  const axiosInstance = createAxiosAuthInstance({
    onUnauthorized: logoutUser, // Pass logout logic
  });
  return axiosInstance;
};