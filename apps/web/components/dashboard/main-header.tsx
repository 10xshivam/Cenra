"use client";

import { getAllItems } from "@/constants/sidebar.constants";
import { useSession } from "@/hooks/useAuth";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "@workspace/ui/components/breadcrumb";
import { BellIcon, UserFilledIcon } from "@workspace/ui/components/icons";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { usePathname } from "next/navigation";

export const MainHeader = () => {
  const pathname = usePathname();
  const { data: user, isPending } = useSession();

  const allItems = getAllItems();
  const pageTitle = allItems.find((item) => item.url === pathname)?.title;
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
            <BreadcrumbItem className="hidden md:block">
              {pageTitle}
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
            {isPending ? "Loading..." : user.firstName + " " + user.lastName}
          </span>
        </div>
      </div>
    </header>
  );
};
