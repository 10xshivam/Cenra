import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type Workspace = {
  id: string;
  name: string;
  website: string | null;
};

type WorkspaceState = {
  workspace: Workspace | null;
  setWorkspace: (workspace: Workspace) => void;
  clearWorkspace: () => void;
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    immer((set) => ({
      workspace: null,

      setWorkspace: (workspace) =>
        set((state) => {
          state.workspace = workspace;
        }),

      clearWorkspace: () =>
        set((state) => {
          state.workspace = null;
        }),
    })),
    {
      name: "workspace-store",
      partialize: (state) => ({ workspace: state.workspace }),
    }
  )
);
