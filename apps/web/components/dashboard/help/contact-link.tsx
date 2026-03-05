import React from "react";
import { IconExternalLink } from "@tabler/icons-react";

export const ContactLink = ({
  href,
  icon,
  label,
  handle,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  handle: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 p-3.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300 transition-all group"
  >
    <div className="flex-shrink-0 size-10 rounded-lg bg-neutral-100 group-hover:bg-neutral-200 transition-colors flex items-center justify-center text-neutral-700">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-neutral-800">{label}</p>
      <p className="text-xs text-neutral-500 truncate">{handle}</p>
    </div>
    <IconExternalLink className="size-5 text-neutral-400 group-hover:text-neutral-600 transition-colors flex-shrink-0" />
  </a>
);
