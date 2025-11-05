"use client";

import {
  fetchCurrentUser,
  loginUser,
  loginWithGoogle,
  logoutUser,
  registerUser,
} from "@/lib/api/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTransitionRouter } from "next-view-transitions";
import { toast } from "sonner";

export function useSession() {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchCurrentUser,
    retry: false,
    gcTime: 5 * 60 * 1000,
  });
}

export function useSignupUser() {
  const queryClient = useQueryClient();
  const router = useTransitionRouter();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(`Registration error: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useTransitionRouter();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.user);
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(`Login error: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}

export function useGoogleLoginMutation() {
  const queryClient = useQueryClient();
  const router = useTransitionRouter();

  return useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      router.push('/dashboard');
    },
    onError: (error) => {
      toast.error(`Google Login error: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      toast.error(`Logout error: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}
