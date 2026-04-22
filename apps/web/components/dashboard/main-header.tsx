"use client";

import { SIDEBAR_ITEMS } from "@/constants/sidebar.constants";
import { useLogout } from "@/hooks/useAuth";
import {
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationsCount,
} from "@/hooks/useNotification";
import { findPathInSidebar } from "@/lib/nav";
import { useUserStore } from "@/store/useUserStore";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { formatDistanceToNow } from "date-fns";
import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  BellIcon,
  LogoutIcon,
  UserFilledIcon,
} from "@workspace/ui/components/icons";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";

export const MainHeader = () => {
  const pathname = usePathname();
  const router = useTransitionRouter();
  const { user } = useUserStore();
  const { workspace } = useWorkspaceStore();
  const logout = useLogout();
  const markNotificationReadMutation = useMarkNotificationRead();
  const workspaceId = workspace?.id ?? "";
  const { data: notificationsData } = useNotifications(workspaceId);
  const { data: unreadCountData } = useUnreadNotificationsCount(workspaceId);

  const breadcrumbPath = findPathInSidebar(SIDEBAR_ITEMS, pathname) ?? [];
  const notifications = (notificationsData?.notifications ?? []).filter(
    (notification) => !notification.isRead,
  );
  const unreadCount = unreadCountData?.count ?? 0;

  const handleNotificationClick = (
    notificationId: string,
    conversationId: string,
    isRead: boolean,
  ) => {
    if (workspaceId && !isRead) {
      markNotificationReadMutation.mutate({
        workspaceId,
        notificationId,
      });
    }

    router.push(`/inbox/${conversationId}`);
  };

  const getCustomerLabel = (customer: {
    name: string | null;
    email: string | null;
  }) => customer.name || customer.email || "Unknown customer";

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 backdrop-blur-sm rounded-lg justify-between bg-neutral-500/10 hover:bg-neutral-500/10 border-b-4 border-neutral-500/15 hover:border-neutral-600/15 transition-colors duration-300 text-neutral-500 hover:text-emerald-700">
      <div className="flex h-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4 bg-neutral-300"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbPath.slice(0, -1).map((item) => (
              <React.Fragment key={item.url}>
                <BreadcrumbItem className="hidden md:block">
                  {item.title}
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </React.Fragment>
            ))}

            <BreadcrumbItem>
              {breadcrumbPath.at(-1)?.title ?? "Dashboard"}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="px-4 flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="relative rounded-full p-1.5 text-neutral-400 hover:text-emerald-800 transition-colors duration-300 cursor-pointer"
            >
              <BellIcon className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 min-w-3 rounded-full bg-emerald-700 px-1.5 py-0.5 text-[9px] font-semibold leading-none text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 p-1 shadow-none rounded-xl border border-neutral-300 bg-neutral-100"
          >
            <div className="shadow-sm rounded-lg bg-white p-1">
              <DropdownMenuLabel className="flex items-center justify-between text-neutral-700">
                <span className="font-medium tracking-tight">Notifications</span>
                <span className="text-xs text-neutral-500">{unreadCount} unread</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="cursor-pointer items-start rounded-lg px-3 py-3 focus:bg-neutral-100"
                    onClick={() =>
                      handleNotificationClick(
                        notification.id,
                        notification.conversationId,
                        notification.isRead,
                      )
                    }
                  >
                    <div className="flex w-full items-start gap-3">
                      <span
                        className="mt-1 size-2 rounded-full bg-emerald-600"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm leading-none font-semibold text-neutral-800">
                            {getCustomerLabel(notification.customer)}
                          </p>
                          <span className="shrink-0 text-[11px] text-neutral-400">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-700 tracking-tight">{notification.title}</p>
                        <p className="line-clamp-1 text-xs text-neutral-500">
                          {notification.customer.email ?? notification.description}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-3 py-6 text-center text-sm text-neutral-500">
                  No notifications yet.
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="rounded-full p-1.5 bg-neutral-500/10 text-neutral-500 hover:text-emerald-800 transition-colors duration-300 cursor-pointer">
              <UserFilledIcon />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 p-1 shadow-none rounded-xl border border-neutral-300 bg-neutral-100 "
          >
            <div className="shadow-sm rounded-lg bg-white p-1">
              <DropdownMenuLabel className="font-normal flex items-center gap-2">
                <div className="rounded-full p-1.5 bg-neutral-500/10 text-neutral-500 hover:text-emerald-800 transition-colors duration-300 cursor-pointer">
                  <UserFilledIcon className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium leading-none tracking-tight text-neutral-700">
                    {user ? `${user.firstName} ${user.lastName}` : "User"}
                  </p>
                  <p className="text-xs leading-none text-neutral-500">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-1.5 justify-center"
                onClick={() => logout.mutate()}
              >
                <span className="font-medium tracking-tight">Logout</span>
                <LogoutIcon className="size-3.5 text-red-600" />
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
