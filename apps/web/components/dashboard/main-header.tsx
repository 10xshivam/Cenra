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
import { LogoutIcon, UserFilledIcon } from "@workspace/ui/components/icons";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { useLogout } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import React from "react";

export const MainHeader = () => {
  const pathname = usePathname();
  const { user } = useUserStore();
  const logout = useLogout();

  const breadcrumbPath = findPathInSidebar(SIDEBAR_ITEMS, pathname) ?? [];
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
            <div className="rounded-full p-1.5 bg-neutral-500/10 text-neutral-500 hover:text-emerald-800 transition-colors duration-300 cursor-pointer">
              <UserFilledIcon />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-1 shadow-none rounded-xl border border-neutral-300 bg-neutral-100 ">
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
