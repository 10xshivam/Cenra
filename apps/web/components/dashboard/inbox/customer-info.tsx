"use client";

import { useCustomerInfo } from "@/hooks/useCustomer";
import { getAvatarColors } from "@/lib/getAvatarColors";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import {
  CalendarCheck,
  CalendarX,
  ChromeIcon,
  Clock,
  Cloud,
  Globe,
  Link,
  MapPin,
} from "lucide-react";
import { useParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { formatExpiryTime, formatTime } from "@/lib/formatTime";
import { CustomerDetailsSkeleton } from "@/skeletons/customerDetailsSkeleton";

export type CustomerInfo = {
  id: string;
  workspaceId: string;
  name: string;
  email: string;
  metadata: {
    ip: string;
    os: string;
    isp: string;
    city: string;
    browser: string;
    country: string;
    language: string;
    timezone: string;
    localTime: string;
    currentUrl: string;
  };
  expiresAt: string;
  createdAt: string;
};

export const CustomerInfo = () => {
  const params = useParams();
  const { workspace } = useWorkspaceStore();
  const conversationId = params.conversationId as string;
  const { data, isLoading } = useCustomerInfo(workspace?.id as string, conversationId);
  const customer: CustomerInfo = data?.customer ?? {};

  if (isLoading) {
    return <CustomerDetailsSkeleton />;
  }

  return (
    <div className="w-full h-full flex flex-col p-4 gap-4">
      <div className="flex items-center gap-2.5 border-b-3 border-neutral-300/40 py-4 bg-neutral-500/10 rounded-xl flex-col">
        <div
          className={`rounded-full size-14 text-lg font-bold border ${getAvatarColors(conversationId)} flex justify-center items-center`}
        >
          {customer?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col items-center">
          <span className="font-semibold text-xl tracking-tight text-neutral-700">
            {customer.name}
          </span>
          <span className="tracking-tight text-sm line-clamp-1 text-neutral-500 hover:underline font-medium cursor-pointer">
            {customer?.email}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Accordion type="single" collapsible>
          <AccordionItem
            value="item-1"
            className="ring ring-neutral-300 rounded-lg border-neutral-300 overflow-hidden"
          >
            <AccordionTrigger className="border-box hover:no-underline py-2 bg-neutral-300/20 rounded-md tracking-tight font-medium px-3 text-neutral-700">
              Visitor Device
            </AccordionTrigger>
            <AccordionContent className="p-3 flex flex-col gap-2 text-sm ">
              <span className="flex items-center gap-1 text-xs font-medium text-neutral-600">
                <ChromeIcon
                  className="size-4 text-neutral-700"
                  strokeWidth={2.5}
                />{" "}
                {customer?.metadata?.browser} on {customer?.metadata?.os}
              </span>
              <span className="flex items-start gap-1 text-xs font-medium text-neutral-600">
                <Cloud className="size-4 text-neutral-700" strokeWidth={2.5} />
                {customer?.metadata?.ip}:{customer?.metadata?.isp}
              </span>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="ring ring-neutral-300 rounded-lg border-neutral-300 overflow-hidden">
            <AccordionTrigger className="border-box hover:no-underline py-2 bg-neutral-300/20 rounded-md tracking-tight font-medium px-3 text-neutral-700">
              Main Information
            </AccordionTrigger>
            <AccordionContent className="p-3 flex flex-col gap-2.5 text-sm">
              <span className="flex items-center gap-1 text-xs font-medium text-neutral-600">
                <MapPin
                  className="size-4.5 text-neutral-700"
                  strokeWidth={2.5}
                />
                {customer?.metadata?.city}, {customer?.metadata?.country}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-neutral-600">
                <Clock className="size-4 text-neutral-700" strokeWidth={2.5} />
                {customer?.metadata?.localTime}, {customer?.metadata?.timezone}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-neutral-600">
                <Globe className="size-4 text-neutral-700" strokeWidth={2.5} />
                {customer?.metadata?.language}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-neutral-600 truncate">
                <Link className="size-4 text-neutral-700" strokeWidth={2.5} />
                <p className="truncate max-w-60">{customer?.metadata?.currentUrl}</p>
              </span>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="ring ring-neutral-300 rounded-lg border-neutral-300 overflow-hidden">
            <AccordionTrigger className="border-box hover:no-underline py-2 bg-neutral-300/20 rounded-md tracking-tight font-medium px-3 text-neutral-700">
              Session Details
            </AccordionTrigger>
            <AccordionContent className="p-3 flex justify-between items-center gap-2 text-sm">
              <span className="flex items-center gap-1 text-xs font-medium text-neutral-600">
                <CalendarCheck
                  className="size-4 text-neutral-700"
                  strokeWidth={2.5}
                />
                Created {formatTime(customer?.createdAt)} ago
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-neutral-600">
                <CalendarX
                  className="size-4 text-neutral-700"
                  strokeWidth={2.5}
                />
                {customer?.expiresAt
                  ? `${formatExpiryTime(customer?.expiresAt)}`
                  : "No expiration set"}
              </span>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
