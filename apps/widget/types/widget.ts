export type DefaultSuggestions = {
  suggestion1: string | null;
  suggestion2: string | null;
  suggestion3: string | null;
};

export type Workspace = {
  id: string;
  name: string;
  greetMessage: string;
  defaultSuggestions: DefaultSuggestions;
};

export type WidgetSession = {
  active: boolean;
  customerId?: string;
};

export type WidgetInitResponse = {
  workspace?: Workspace;
  session?: WidgetSession;
};

export type WidgetScreen =
  | "home"
  | "loading"
  | "chat"
  | "error"


