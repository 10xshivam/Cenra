import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionStore {
  customerId: string | null;
  setCustomerId: (id: string | null) => void;
}

export const useWidgetSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      customerId: null,
      setCustomerId: (id) => set({ customerId: id }),
    }),
    { name: "widget-session" }
  )
);
