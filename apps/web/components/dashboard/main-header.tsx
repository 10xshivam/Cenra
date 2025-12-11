"use client";

import { findPathInSidebar } from "@/lib/nav";
import { SIDEBAR_ITEMS } from "@/constants/sidebar.constants";
import { useUserStore } from "@/store/useUserStore";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { BellIcon, UserFilledIcon } from "@workspace/ui/components/icons";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { usePathname } from "next/navigation";
import React from "react";

export const MainHeader = () => {
  const pathname = usePathname();
  const { user } = useUserStore();

  const breadcrumbPath = findPathInSidebar(SIDEBAR_ITEMS, pathname) ?? [];
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-border bg-background/80 backdrop-blur-sm border rounded-lg justify-between">
      <div className="flex h-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
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
        <BellIcon />
        <Separator
          orientation="vertical"
          className=" data-[orientation=vertical]:h-4"
        />
        <div className="group flex items-center cursor-pointer">
          <div className="rounded-full p-1.5  bg-neutral-500/10  text-neutral-500 group-hover:text-emerald-800 transition-colors duration-300">
            <UserFilledIcon />
          </div>
          <span className="ml-2 text-sm text-neutral-500 group-hover:text-emerald-800 tracking-tight font-medium">
            {user ? user.firstName + " " + user.lastName : "Loading..."}
          </span>
        </div>
      </div>
    </header>
  );
};
