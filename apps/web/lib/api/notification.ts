import { axiosInstance } from "../axios";

export type NotificationItem = {
  id: string;
  conversationId: string;
  type: string;
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
  customer: {
    name: string | null;
    email: string | null;
  };
};

export const getNotifications = async (workspaceId: string) => {
  const { data } = await axiosInstance.get<{
    notifications: NotificationItem[];
  }>(`/workspace/${workspaceId}/notifications`);

  return data;
};

export const getUnreadNotificationsCount = async (workspaceId: string) => {
  const { data } = await axiosInstance.get<{ count: number }>(
    `/workspace/${workspaceId}/notifications/unread-count`,
  );

  return data;
};

export const markNotificationRead = async (
  workspaceId: string,
  notificationId: string,
) => {
  const { data } = await axiosInstance.patch<{ success: boolean }>(
    `/workspace/${workspaceId}/notifications/${notificationId}/read`,
  );

  return data;
};
