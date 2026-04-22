"use client";

import {
  getNotifications,
  getUnreadNotificationsCount,
  markNotificationRead,
  type NotificationItem,
} from "@/lib/api/notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const NOTIFICATIONS_QUERY_KEY = "notifications";
const UNREAD_NOTIFICATIONS_COUNT_QUERY_KEY = "notifications-unread-count";

export const useNotifications = (workspaceId: string) => {
  return useQuery({
    queryKey: [NOTIFICATIONS_QUERY_KEY, workspaceId],
    queryFn: () => getNotifications(workspaceId),
    enabled: !!workspaceId,
    retry: false,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 10000,
  });
};

export const useUnreadNotificationsCount = (workspaceId: string) => {
  return useQuery({
    queryKey: [UNREAD_NOTIFICATIONS_COUNT_QUERY_KEY, workspaceId],
    queryFn: () => getUnreadNotificationsCount(workspaceId),
    enabled: !!workspaceId,
    retry: false,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 10000,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      notificationId,
    }: {
      workspaceId: string;
      notificationId: string;
    }) => markNotificationRead(workspaceId, notificationId),
    onMutate: async ({ workspaceId, notificationId }) => {
      await queryClient.cancelQueries({
        queryKey: [NOTIFICATIONS_QUERY_KEY, workspaceId],
      });
      await queryClient.cancelQueries({
        queryKey: [UNREAD_NOTIFICATIONS_COUNT_QUERY_KEY, workspaceId],
      });

      const previousNotifications = queryClient.getQueryData<{
        notifications: NotificationItem[];
      }>([NOTIFICATIONS_QUERY_KEY, workspaceId]);
      const previousUnreadCount = queryClient.getQueryData<{ count: number }>([
        UNREAD_NOTIFICATIONS_COUNT_QUERY_KEY,
        workspaceId,
      ]);

      const wasUnread = previousNotifications?.notifications.some(
        (notification) =>
          notification.id === notificationId && !notification.isRead,
      );

      queryClient.setQueryData<{ notifications: NotificationItem[] }>(
        [NOTIFICATIONS_QUERY_KEY, workspaceId],
        (current) => {
          if (!current) {
            return current;
          }

          return {
            notifications: current.notifications.map((notification) =>
              notification.id === notificationId
                ? { ...notification, isRead: true }
                : notification,
            ),
          };
        },
      );

      if (wasUnread) {
        queryClient.setQueryData<{ count: number }>(
          [UNREAD_NOTIFICATIONS_COUNT_QUERY_KEY, workspaceId],
          (current) => ({
            count: Math.max((current?.count ?? 0) - 1, 0),
          }),
        );
      }

      return {
        workspaceId,
        previousNotifications,
        previousUnreadCount,
      };
    },
    onError: (error, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          [NOTIFICATIONS_QUERY_KEY, context.workspaceId],
          context.previousNotifications,
        );
      }

      if (context?.previousUnreadCount) {
        queryClient.setQueryData(
          [UNREAD_NOTIFICATIONS_COUNT_QUERY_KEY, context.workspaceId],
          context.previousUnreadCount,
        );
      }

      toast.error(
        `Failed to mark notification as read: ${error instanceof Error ? error.message : String(error)}`,
      );
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: [NOTIFICATIONS_QUERY_KEY, variables.workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          UNREAD_NOTIFICATIONS_COUNT_QUERY_KEY,
          variables.workspaceId,
        ],
      });
    },
  });
};
