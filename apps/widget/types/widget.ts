export type DefaultSuggestions = {
  suggestion1: string | null;
  suggestion2: string | null;
  suggestion3: string | null;
};

export type WidgetSectionItem = {
  title: string;
  description?: string;
  linkLabel: string;
  linkUrl: string;
};

export type WidgetSection = {
  enabled: boolean;
  title: string;
  items: WidgetSectionItem[];
};

export type Workspace = {
  id: string;
  name?: string;
  brandName?: string | null;
  companyLogoUrl?: string | null;
  greetMessage?: string | null;
  themeMode?: "light" | "dark" | null;
  gradientFrom?: string | null;
  themeColor?: string | null;
  defaultSuggestions?: DefaultSuggestions | null;
  whatsNewSection?: WidgetSection | null;
  featuredArticlesSection?: WidgetSection | null;
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
  | "error";


