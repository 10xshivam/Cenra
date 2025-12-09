import { DefaultSuggestions, Workspace } from '@/types/widget';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type WorkspaceState = {
  workspace: Workspace | null;
  setWorkspace: (workspace: Workspace) => void;
  updateGreetMessage: (message: string) => void;
  updateSuggestions: (suggestions: Partial<DefaultSuggestions>) => void;
  reset: () => void;
};

const initialState: Pick<WorkspaceState, 'workspace'> = {
  workspace: null,
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    immer((set) => ({
      ...initialState,
      
      setWorkspace: (workspace) =>
        set((state) => {
          state.workspace = workspace;
        }),
        
      updateGreetMessage: (message) =>
        set((state) => {
          if (state.workspace) {
            state.workspace.greetMessage = message;
          }
        }),
        
      updateSuggestions: (suggestions) =>
        set((state) => {
          if (state.workspace) {
            state.workspace.defaultSuggestions = {
              ...state.workspace.defaultSuggestions,
              ...suggestions,
            };
          }
        }),
        
      reset: () =>
        set((state) => {
          state.workspace = null;
        }),
    })),
    {
      name: 'workspace-store',
    }
  )
);
