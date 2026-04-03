import Image from "next/image";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { HeroIllustration } from "./hero-illustration";

export const supportFlow = [
  {
    query: "How many pricing plans do you offer?",
    reply:
      "We offer two plans: Starter and Pro, designed to scale with your needs.",
  },
  {
    query: "Do you offer a free trial?",
    reply:
      "We currently do not offer a free trial.",
  },
  {
    query: "Can I customize the chat widget?",
    reply:
      "Yes, you can customize the widget to match your brand and product experience.",
  },
  // {
  //   query: "How do I train the AI on my data?",
  //   reply:
  //     "You can add your website or upload docs and FAQs to train Cenra.",
  // },
  // {
  //   query: "Can I take over conversations from the AI?",
  //   reply:
  //     "Yes, you can step in anytime and manage conversations from the inbox.",
  // },
  // {
  //   query: "Does Cenra support React or Next.js?",
  //   reply:
  //     "Yes, Cenra integrates easily with HTML, React, Next.js, and more.",
  // },
];

export const HeroSection = () => {
  return (
    <section className="grid grid-cols-1 divide-y divide-neutral-200 divide-dashed border-b border-neutral-200">
      <div className="flex flex-col gap-6 items-center justify-center pt-40 pb-20">
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
      </div>
      <div className="w-full grid grid-cols-3 divide-x divide-dashed divide-neutral-200">
        <div className="flex justify-center items-center flex-col gap-3">
          
          {supportFlow.map((item, index) => (
            <div
              key={index}
              className="flex px-3 py-2 border-[1.5px] border-neutral-200 rounded-xl font-semibold text-xs text-neutral-500"
            >
              {item.query}
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center pt-16 pb-20 px-10">
          <HeroIllustration className="block h-auto w-full max-w-[400px] rounded-md" />
        </div>
         <div className="flex justify-center items-center flex-col gap-3">
          {supportFlow.map((item, index) => (
            <div
              key={index}
              className="flex px-4 py-3 bg-emerald-700 text-white font-semibold rounded-2xl text-xs max-w-2xs"
            >
              {item.reply}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
