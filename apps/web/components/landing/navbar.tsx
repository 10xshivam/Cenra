import Image from "next/image";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

export const Navbar = () => {
  return (
    <header className=" border border-neutral-300/80 px-4 py-3  backdrop-blur-3xl border-b fixed top-0 left-0 right-0 z-50 ">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-1">
        <div className="flex items-center gap-1">
          <Image src="/cenra-logo.svg" alt="Cenra" width={36} height={36} />
          <span className="text-xl font-semibold tracking-tight text-emerald-800 font-serif">
            Cenra
          </span>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-neutral-600 md:flex">
          <a
            href="#why-cenra"
            className="transition-colors hover:text-neutral-900"
          >
            Why Cenra
          </a>
          <a
            href="#setup"
            className="transition-colors hover:text-neutral-900"
          >
            Setup
          </a>
          <a
            href="#pricing"
            className="transition-colors hover:text-neutral-900"
          >
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            className="hidden text-neutral-600 hover:bg-neutral-100 md:inline-flex"
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-emerald-800 px-5 text-white hover:bg-emerald-900 "
          >
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};


