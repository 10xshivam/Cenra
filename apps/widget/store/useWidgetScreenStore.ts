import { WidgetScreen } from '@/types/widget';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type WidgetScreenState = {
  currentScreen: WidgetScreen;
  setScreen: (screen: WidgetScreen) => void;
  reset: () => void;
};

// Create the store
export const useWidgetScreenStore = create<WidgetScreenState>()(
  persist(
    immer((set) => ({
    currentScreen: "loading",
    setScreen: (screen) =>
      set((state) => {
        state.currentScreen = screen;
      }),
    reset: () =>
      set((state) => {
        state.currentScreen = "loading";
      }),
  })),
    {
      name: 'widget-screen-store', // localStorage key
      // You can also customize storage (sessionStorage, etc.)
      // storage: createJSONStorage(() => sessionStorage),
    }
  )
);

