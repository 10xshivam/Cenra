"use client";

import { useWidgetSettings } from "@/hooks/useWidgetSettings";
import { ChatScreen } from "@/screens/chat-screen";
import { HomeScreen } from "@/screens/home-screen";
import { LoadingScreen } from "@/screens/loading-screen";
import { useWidgetScreenStore } from "@/store/useWidgetScreenStore";
import { WidgetScreen } from "@/types/widget";
import { useEffect } from "react";
import { JSX } from "react/jsx-dev-runtime";

export const WidgetView = ({ workspaceId }: { workspaceId: string }) => {
  const { data: workspaceSettings, isLoading } = useWidgetSettings(workspaceId);

  const currentScreen = useWidgetScreenStore((state) => state.currentScreen);
  const setCurrentScreen = useWidgetScreenStore((state) => state.setScreen);
  
  useEffect(() => {
    if (isLoading) {
      setCurrentScreen("loading");
    } else if (workspaceSettings) {
      setCurrentScreen("home");
    }
  }, [isLoading, workspaceSettings, setCurrentScreen]);

  const screenComponents: Record<WidgetScreen, JSX.Element> = {
    home: <HomeScreen workspaceSettings={workspaceSettings} />,
    loading: <LoadingScreen />,
    chat: <ChatScreen />
  };

  return (
    <div className="h-fit min-h-[700px] w-[410px] rounded-3xl border overflow-hidden relative bg-neutral-50 p-7">
      {screenComponents[currentScreen]}
    </div>
  );
};
