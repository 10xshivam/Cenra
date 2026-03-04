import { axiosInstance } from '@/lib/axios';
import { loginSchema } from '@/schemas/loginSchema';
import { signupSchema } from '@/schemas/signupSchema';
import { z } from "zod";

export const fetchCurrentUser = async () => {
  const { data } = await axiosInstance.get('/auth/user');
  return data.user;
};

export const registerUser = async (payload: z.infer<typeof signupSchema>) => {
  const { data } = await axiosInstance.post('/auth/register', payload);
  return data.user;
};

export const loginUser = async (credentials: z.infer<typeof loginSchema>) => {
  const { data } = await axiosInstance.post('/auth/login', credentials);
  return data.user;
};

export const loginWithGoogle = async (code: string) => {
  const { data } = await axiosInstance.post(
    `auth/google`,
    { code }
  );
  return data.user;
};

export const logoutUser = async () => {
  const { data } = await axiosInstance.post('/auth/logout');
  return data.message;
};

export const updateUser = async (payload: { firstName: string; lastName: string; email?: string }) => {
  const { data } = await axiosInstance.patch('/auth/user', payload);
  return data.user;
};

