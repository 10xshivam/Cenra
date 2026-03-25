import Image from "next/image";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="flex justify-center items-center gap-10 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:pt-40">
      <div className="flex flex-col gap-6 items-center justify-center">
        {/* <div className="flex w-fit items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-emerald-800 shadow font-serif">
          <Sparkles className="size-3.5" />
          Proudly Open Source
        </div> */}

        <div className="flex flex-col gap-5 items-center justify-center">
          <h1 className="max-w-5xl text-5xl text-center font-medium tracking-tight text-emerald-800 md:text-6xl font-serif leading-[1.09]">
            AI support agent that actually understands your business
          </h1>
          <p className="max-w-lg text-base leading-snug text-center text-neutral-600 md:text-base tracking-tight ">
            Transform your product knowledge into an AI agent that answers
            instantly and intelligently.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-emerald-800 px-6 text-white hover:bg-emerald-900"
          >
            <Link href="/signup">
              Get Started
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-neutral-300 bg-white/80 px-6 text-neutral-700 hover:bg-white"
          >
            <Link href="/pricing">View Demo</Link>
          </Button>
        </div>
        <div className="border-[1.5px] border-neutral-200 mt-6 rounded-md p-1.5 bg-neutral-100">
          <Image
            src="/image.png"
            alt="Cenra AI Agent Demo"
            width={1100}
            height={800}
            className="block rounded-md shadow-md"
          />
        </div>
      </div>
    </section>
  );
};
