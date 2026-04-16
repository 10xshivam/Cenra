"use client";

import {
  fetchCurrentUser,
  loginUser,
  loginWithGoogle,
  logoutUser,
  registerUser,
  updateUser,
} from "@/lib/api/auth";
import { useUserStore } from "@/store/useUserStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSession() {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchCurrentUser,
    retry: false,
    gcTime: 5 * 60 * 1000,
  });
}

export const useSignupUser = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (user) => {
      setUser({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
      queryClient.setQueryData(["user"], user);
      router.push("/get-started");
    },
    onError: (error) => {
      toast.error(
        `Registration error: ${error instanceof Error ? error.message : String(error)}`
      );
    },
  });
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (user) => {
      setUser({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
      queryClient.setQueryData(["user"], user);
      router.push("/get-started");
    },
    onError: (error) => {
      toast.error(
        `Login error: ${error instanceof Error ? error.message : String(error)}`
      );
    },
  });
}

export const useGoogleLoginMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  return useMutation({
    mutationFn: loginWithGoogle,
    onSuccess: (user) => {
      setUser({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });
      queryClient.setQueryData(["user"], user);
      router.push("/get-started");
    },
    onError: (error) => {
      toast.error(
        `Google Login error: ${error instanceof Error ? error.message : String(error)}`
      );
    },
  });
}

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearUser = useUserStore((s) => s.clearUser);

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      clearUser();
      queryClient.removeQueries({ queryKey: ["user"] });
      router.push("/login");
    },
    onError: (error) => {
      toast.error(
        `Logout error: ${error instanceof Error ? error.message : String(error)}`
      );
    },
  });
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const setUser = useUserStore((s) => s.setUser);

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (user) => {
      if (user) {
        setUser({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName });
        queryClient.setQueryData(["user"], user);
      }
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error instanceof Error ? error.message : String(error)}`);
    },
  });
};
