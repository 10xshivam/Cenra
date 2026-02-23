import { axiosInstance } from "../axios";

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

export type WidgetSettings = {
  brandName: string;
  companyLogoUrl: string | null;
  greetMessage: string | null;
  themeMode: "light" | "dark";
  gradientFrom: string | null;
  themeColor: string | null;
  defaultSuggestions: {
    suggestion1: string | null;
    suggestion2: string | null;
    suggestion3: string | null;
  } | null;
  whatsNewSection: WidgetSection | null;
  featuredArticlesSection: WidgetSection | null;
};

export type WidgetSettingsPayload = Omit<
  WidgetSettings,
  "defaultSuggestions"
> & {
  defaultSuggestions?: WidgetSettings["defaultSuggestions"];
};

export const getWidgetSettings = async (workspaceId: string) => {
  const { data } = await axiosInstance.get(`/workspace/${workspaceId}/widget-setting`);
  return data.widgetSettings as WidgetSettings;
};

export const updateWidgetSettings = async (
  workspaceId: string,
  payload: WidgetSettingsPayload
) => {
  const { data } = await axiosInstance.post(
    `/workspace/${workspaceId}/widget-setting`,
    payload
  );
  return data as { message: string };
};
