export type WidgetMessage = {
  role: string;
  content: string;
  createdAt: string;
};

export interface RecentInfo {
  lastMessage: string;
  lastMessageAt: string;
}