import Image from "next/image";
import Link from "next/link";

const footerGroups = [
  {
    title: "Product",
    links: [
      { label: "Chat Widget", href: "#features" },
      { label: "Knowledge Sources", href: "#workflow" },
      { label: "Operations", href: "#operations" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Get Started", href: "/signup" },
      { label: "Login", href: "/login" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Cenra", href: "#features" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
] as const;

export function FooterSection() {
  return (
    <footer className="border-t border-neutral-300/80 py-12 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-md">
          <div className="flex items-center gap-3">
            <Image
              src="/cenra-logo.svg"
              alt="Cenra"
              width={40}
              height={40}
              className="rounded-full border border-neutral-300 bg-white p-1"
            />
            <span className="text-2xl font-semibold tracking-tight text-emerald-900">
              Cenra
            </span>
          </div>
          <p className="mt-4 text-sm leading-6 text-neutral-600">
            Cenra turns your docs, website content, and business knowledge into
            an AI support agent with memory, grounded answers, and operational
            visibility for your team.
          </p>
          <p className="mt-6 text-xs font-medium uppercase tracking-[0.22em] text-neutral-400">
            AI support that feels informed, fast, and human.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
                {group.title}
              </h3>
              <div className="flex flex-col gap-2.5 text-sm text-neutral-600">
                {group.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="transition-colors hover:text-neutral-900"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
