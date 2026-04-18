"use client";

import {
  ContactLink,
  BugReportDialog,
  FeatureRequestDialog,
  SectionCard,
} from "@/components/dashboard/help";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconBugFilled,
  IconBulbFilled,
  IconMessageChatbotFilled,
} from "@tabler/icons-react";

export const HelpAndSupportView = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-14 space-y-5">
      <div className="rounded-2xl w-full p-2 max-w-6xl h-fit bg-neutral-500/10 pb-6">
        <div className="flex flex-col gap-2 w-full h-full border border-neutral-300 rounded-xl p-5 bg-white/60">
          <span className="text-2xl font-semibold tracking-tight text-emerald-800">
            Help &amp; Support
          </span>
          <span className="text-sm text-neutral-500 tracking-tight leading-relaxed">
            Share feedback, report issues, or get in touch with the developer. Whether you want to suggest a new feature, report unexpected behavior, or simply ask for help using the platform, the options below allow you to quickly submit requests or connect directly with the developer.
          </span>
        </div>
      </div>

      <SectionCard
        icon={<IconBulbFilled className="size-7 text-amber-500" />}
        title="Request a Feature"
        description="Share ideas or improvements for the platform."
      >
        <FeatureRequestDialog />
      </SectionCard>

      <SectionCard
        icon={<IconBugFilled className="size-7 text-red-500" />}
        title="Report a Bug"
        description="Found an issue or unexpected behavior?"
      >
        <BugReportDialog />
      </SectionCard>

      <SectionCard
        icon={<IconMessageChatbotFilled className="size-7 text-emerald-700" />}
        title="Contact the Developer"
        description="Reach out for help or collaboration."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ContactLink
            href="https://x.com/10xshivam"
            icon={<IconBrandX className="size-4.5" />}
            label="X (Twitter)"
            handle="@10xshivam"
          />
          <ContactLink
            href="https://linkedin.com/in/10xshivam"
            icon={<IconBrandLinkedin className="size-4.5" />}
            label="LinkedIn"
            handle="10xshivam"
          />
          <ContactLink
            href="https://github.com/10xshivam"
            icon={<IconBrandGithub className="size-4.5" />}
            label="GitHub"
            handle="10xshivam"
          />
        </div>
      </SectionCard>
    </div>
  );
};
