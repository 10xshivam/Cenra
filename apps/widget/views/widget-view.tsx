"use client";

import { useEffect } from "react";
import { ChatScreen } from "@/screens/chat-screen";
import { ErrorScreen } from "@/screens/error-screen";
import { HomeScreen } from "@/screens/home-screen";
import { LoadingScreen } from "@/screens/loading-screen";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { useWidgetScreenStore } from "@/store/useWidgetScreenStore";
import { WidgetScreen } from "@/types/widget";
import { useTheme } from "next-themes";
import { CSSProperties } from "react";
import { JSX } from "react/jsx-dev-runtime";

export const WidgetView = ({ workspaceId }: { workspaceId: string }) => {
  const { currentScreen, setCurrentScreen } = useWidgetScreenStore();
  const { workspace } = useWorkspaceStore();
  const { setTheme } = useTheme();

  useEffect(() => {
    setCurrentScreen("loading");
  }, [workspaceId, setCurrentScreen]);

  useEffect(() => {
    setTheme(workspace?.themeMode === "dark" ? "dark" : "light");
  }, [workspace?.themeMode, setTheme]);

  useEffect(() => {
    if (workspace?.themeColor) {
      window.parent.postMessage(
        { type: "theme_update", payload: { color: workspace.themeColor } },
        "*"
      );
    }
  }, [workspace?.themeColor]);

  const screenComponents: Record<WidgetScreen, JSX.Element> = {
    loading: <LoadingScreen workspaceId={workspaceId} />,
    home: <HomeScreen />,
    chat: <ChatScreen />,
    error: <ErrorScreen />,
  };

  const widgetAccentColor = workspace?.themeColor ?? "#047857";
  const widgetStyles = {
    "--widget-theme-color": widgetAccentColor,
  } as CSSProperties;

  return (
    <div
      className="h-full w-full rounded-3xl shadow-sm relative bg-neutral-50 dark:bg-neutral-900 transition-colors"
      style={widgetStyles}
    >
      {screenComponents[currentScreen]}
    </div>
  );
};
