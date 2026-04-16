"use client";

import { useWorkspace } from "@/hooks/useWorkspace";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { useEffect } from "react";

export const WorkspaceSessionSync = () => {
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);
  const clearWorkspace = useWorkspaceStore((state) => state.clearWorkspace);
  const { data: workspace, isSuccess, isError } = useWorkspace();

  useEffect(() => {
    if (isSuccess && workspace) {
      setWorkspace({
        id: workspace.id,
        name: workspace.name,
        website: workspace.website,
      });
    }
  }, [isSuccess, setWorkspace, workspace]);

  useEffect(() => {
    if (isError) {
      clearWorkspace();
    }
  }, [clearWorkspace, isError]);

  return null;
};
