"use client";

import { useWidgetInitialization } from "@/hooks/useWidgetSettings";
import { useWidgetScreenStore } from "@/store/useWidgetScreenStore";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { IconLoader } from "@workspace/ui/components/icons";
import { useEffect, useState } from "react";

export const LoadingScreen = ({ workspaceId }: { workspaceId: string }) => {
  const [isReady, setIsReady] = useState(false); // tracks if localStorage was checked
  const [customerId, setCustomerId] = useState<string>("");
  const { setCurrentScreen } = useWidgetScreenStore();
  const { setWorkspace } = useWorkspaceStore();

  useEffect(() => {
    const stored = localStorage.getItem("customerId") ?? "";
    setCustomerId(stored);
    setIsReady(true); // now we know localStorage was checked
  }, []);

  const { data, isLoading, isError } = useWidgetInitialization(
    workspaceId,
    customerId,
    {
      enabled: isReady, // only run query after localStorage check is done
    }
  );

  useEffect(() => {
    if (!isReady || isLoading || !data) return;

    if(data.workspace) {
      setWorkspace(data.workspace);
    }

    if (!data.session?.active) {
      localStorage.removeItem("customerId");
      setCurrentScreen("home");
      return;
    }
    
    
    if (data.session.active && data.session.customerId) {
      localStorage.setItem("customerId", data.session.customerId);
      setCurrentScreen("chat");
    }
  }, [isReady, isLoading, data, setCurrentScreen]);


  return (
    <div className="flex flex-col items-center justify-center w-full h-full py-6">
      <IconLoader size="32px" className="animate-spin text-gray-600" />
      <p className="text-sm text-gray-500 mt-3">Loading…</p>
    </div>
  );
};
