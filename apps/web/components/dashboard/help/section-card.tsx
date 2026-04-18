import React from "react";

export const SectionCard = ({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl w-full p-1.5 bg-neutral-400/10 border border-dashed border-neutral-400">
    <div className="rounded-xl shadow-sm bg-white/70 p-6 space-y-5">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 size-12 rounded-lg bg-neutral-200/50 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-neutral-800">
            {title}
          </h2>
          <p className="text-sm text-neutral-500 tracking-tight">{description}</p>
        </div>
      </div>
      {children}
    </div>
  </div>
);
