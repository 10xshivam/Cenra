import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Types
type DefaultSuggestions = {
  suggestion1: string | null;
  suggestion2: string | null;
  suggestion3: string | null;
};

type Workspace = {
  id: string;
  name: string;
  greetMessage: string;
  defaultSuggestions: DefaultSuggestions;
};

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

// Create the store
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
      name: 'workspace-store', // localStorage key
    }
  )
);
