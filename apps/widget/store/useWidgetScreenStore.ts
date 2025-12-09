import { WidgetScreen } from '@/types/widget';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type WidgetScreenState = {
  currentScreen: WidgetScreen;
  setCurrentScreen: (screen: WidgetScreen) => void;
  reset: () => void;
};

export const useWidgetScreenStore = create<WidgetScreenState>()(
  persist(
    immer((set) => ({
    currentScreen: "loading",
    setCurrentScreen: (screen) =>
      set((state) => {
        state.currentScreen = screen;
      }),
    reset: () =>
      set((state) => {
        state.currentScreen = "loading";
      }),
  })),
    {
      name: 'widget-screen-store',
    }
  )
);

