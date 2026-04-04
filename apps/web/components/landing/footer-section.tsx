import { IconCopyright } from "@tabler/icons-react";
import Image from "next/image";
import { Link } from "next-view-transitions";

const footerGroups = [
  {
    title: "Product",
    links: [
      { label: "Why Cenra", href: "#why-cenra" },
      { label: "Setup", href: "#setup" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Get Started", href: "/signup" },
      { label: "Login", href: "/login" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms & Conditions", href: "#" },
    ],
  },
  {
    title: "Socials",
    links: [
      { label: "Github", href: "https://github.com/10xshivam/cenra" },
      { label: "LinkedIn", href: "https://linkedin.com/in/10xshivam" },
      { label: "X.com", href: "https://x.com/10xshivam" },
    ],
  },
] as const;

export function FooterSection() {
  return (
    <footer className="grid-cols-1 divide-y divide-neutral-300 divide-dashed grid">
      <div className="grid grid-cols-1 max-md:divide-y md:grid-cols-3 md:divide-x divide-neutral-300 divide-dashed">
        <div className="flex flex-col p-7 md:p-10">
          <span className="text-3xl font-semibold tracking-tight text-emerald-800 font-serif mb-0.5">
            Cenra
          </span>
          <p className="text-xs text-neutral-500 font-medium tracking-tight">
            Designed & Developed by{" "}
            <Link
              href="https://x.com/in/10xshivam"
              target="_top"
              // rel="noopener noreferrer"
              className="text-neutral-400 font-medium"
            >
              @10xshivam
            </Link>
          </p>
          <p className="text-xs text-neutral-400 flex items-center mt-0.5 tracking-tight">
            <IconCopyright className="size-3.5" strokeWidth={2} />
            2026. All rights reserved.
          </p>
        </div>

        <div className="grid grid-cols-4 col-span-2 divide-x divide-neutral-300 divide-dashed">
          {footerGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-1.5 p-4 md:p-10">
              <h3 className="text-sm md:text-base font-semibold text-emerald-800 font-serif">
                {group.title}
              </h3>
              <div className="flex flex-col gap-1 text-xs md:text-sm text-neutral-500">
                {group.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="transition-colors hover:text-neutral-900 tracking-tight"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className=" flex pt-10 items-center justify-center grayscale opacity-10">
        <Image
          alt="Cenra Logo"
          height={40}
          width={40}
          src="/cenra-logo.svg"
          className="size-30 md:size-80 "
        />
        <h4 className="font-serif text-7xl md:text-[12rem] font-medium tracking-tight">
          Cenra
        </h4>
      </div>
    </footer>
  );
}

