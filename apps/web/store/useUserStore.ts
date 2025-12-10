import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

type UserState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    immer((set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set((state) => {
          state.user = user;
          state.isAuthenticated = true;
        }),

      clearUser: () =>
        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
        }),
    })),
    {
      name: "user-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
