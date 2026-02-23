import { DefaultSuggestions, Workspace } from '@/types/widget';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const normalizeSuggestions = (value: unknown): DefaultSuggestions | null => {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  return {
    suggestion1: typeof v.suggestion1 === "string" ? v.suggestion1 : null,
    suggestion2: typeof v.suggestion2 === "string" ? v.suggestion2 : null,
    suggestion3: typeof v.suggestion3 === "string" ? v.suggestion3 : null,
  };
};

const normalizeSection = (value: unknown) => {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  const rawItems = Array.isArray(v.items) ? v.items : [];
  return {
    enabled: typeof v.enabled === "boolean" ? v.enabled : true,
    title: typeof v.title === "string" ? v.title : "",
    items: rawItems.map((raw) => {
      const item = (raw ?? {}) as Record<string, unknown>;
      return {
        title: typeof item.title === "string" ? item.title : "",
        description:
          typeof item.description === "string" ? item.description : undefined,
        linkLabel: typeof item.linkLabel === "string" ? item.linkLabel : "",
        linkUrl: typeof item.linkUrl === "string" ? item.linkUrl : "",
      };
    }),
  };
};

const normalizeWorkspace = (workspace: Workspace): Workspace => ({
  id: workspace.id,
  name: workspace.name ?? undefined,
  brandName: workspace.brandName ?? workspace.name ?? null,
  companyLogoUrl: workspace.companyLogoUrl ?? null,
  greetMessage: workspace.greetMessage ?? null,
  themeMode: workspace.themeMode ?? "light",
  gradientFrom: workspace.gradientFrom ?? "#052e2b",
  themeColor:
    workspace.themeColor ??
    (workspace as Workspace & { gradientTo?: string | null }).gradientTo ??
    "#047857",
  defaultSuggestions:
    normalizeSuggestions(workspace.defaultSuggestions) ?? null,
  whatsNewSection: normalizeSection(workspace.whatsNewSection),
  featuredArticlesSection: normalizeSection(workspace.featuredArticlesSection),
});

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
          state.workspace = normalizeWorkspace(workspace);
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
            const currentSuggestions = state.workspace.defaultSuggestions ?? {
              suggestion1: null,
              suggestion2: null,
              suggestion3: null,
            };
            state.workspace.defaultSuggestions = {
              ...currentSuggestions,
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
      version: 2,
      partialize: (state) => ({ workspace: state.workspace }),
      migrate: (persistedState) => {
        const state = persistedState as { workspace?: Workspace | null } | undefined;
        return {
          workspace: state?.workspace ? normalizeWorkspace(state.workspace) : null,
        } as Pick<WorkspaceState, "workspace">;
      },
      merge: (persistedState, currentState) => {
        const state = persistedState as { workspace?: Workspace | null } | undefined;
        return {
          ...(currentState as WorkspaceState),
          workspace: state?.workspace ? normalizeWorkspace(state.workspace) : null,
        };
      },
    }
  )
);
