import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WidgetSessionStore {
  customerId: string | null;
  conversationId: string | null;
  setCustomerId: (id: string | null) => void;
  setConversationId: (id: string | null) => void;
  setSession: (session: { customerId: string | null; conversationId: string | null }) => void;
}

export const useWidgetSessionStore = create<WidgetSessionStore>()(
  persist(
    (set) => ({
      customerId: null,
      conversationId: null,
      setCustomerId: (id) => set({ customerId: id }),
      setConversationId: (id) => set({ conversationId: id }),
      setSession: (session) => set({ ...session }),
    }),
    {
      name: "widget-session", // localStorage key
    }
  )
);

