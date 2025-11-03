import { axiosInstance } from '@/lib/axios';

export const fetchCurrentUser = async () => {
  const { data } = await axiosInstance.get('/auth/user');
  return data.user;
};

export const registerUser = async (payload: { name: string; email: string; password: string }) => {
  const { data } = await axiosInstance.post('/auth/register', payload);
  return data.user;
};

export const loginUser = async (credentials: { email: string; password: string }) => {
  const { data } = await axiosInstance.post('/auth/login', credentials);
  return data.user;
};

export const loginWithGoogle = async (code: string) => {
    const {data } = await axiosInstance.post(
      `auth/google`,
      { code }
    );
    return data.user;
};

export const logoutUser = async () => {
  const { data } = await axiosInstance.post('/auth/logout');
  return data.message; 
};
