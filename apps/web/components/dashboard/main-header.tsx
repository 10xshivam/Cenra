"use client";

import { useSession } from "@/hooks/useAuth";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@workspace/ui/components/breadcrumb";
import { BellIcon, UserFilledIcon } from "@workspace/ui/components/icons";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";

export const MainHeader = () => {
  const { data: user, isPending } = useSession();
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
              <BreadcrumbLink
                href="#"
                className="text-emerald-950/60 hover:text-emerald-950"
              >
                Dashboard
              </BreadcrumbLink>
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
        <div className="flex items-center cursor-pointer">
          <div className="rounded-full p-1.5  bg-emerald-950/5">
            <UserFilledIcon />
          </div>
          <span className="ml-2 text-sm text-emerald-950/60 hover:text-emerald-950 tracking-tight font-medium">
            {isPending ? "-- --" : user.firstName + " " + user.lastName}
          </span>
        </div>
      </div>
    </header>
  );
};
