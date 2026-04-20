"use client";

import { Link } from "next-view-transitions";
import { Button } from "@workspace/ui/components/button";
import { motion } from "motion/react";

const revealUp = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
} as const;

export function PricingSection() {
  return (
    <section id="pricing" className="py-10 border-y border-neutral-300 border-dashed relative">
      <motion.div
        variants={revealUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="flex relative flex-col gap-3 max-w-xl px-7 pt-40"
      >
        <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-emerald-800 font-serif">
          Pricing that scales with your business
        </h2>
        <p className="text-sm md:text-base text-neutral-600 tracking-tight pl-1">
          Flexible plans to build, deploy, and manage AI-powered customer
          support, designed to grow with your team as demand increases.
        </p>
        <Button
          asChild
          size="lg"
          className="rounded-full bg-emerald-800 px-6 border-[1.5px] border-emerald-700 hover:bg-emerald-700 w-fit mt-2"
        >
          <Link href="/pricing">Explore Pricing</Link>
        </Button>
      </motion.div>

      <motion.div
        variants={revealUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.12 }}
        className="absolute top-10 right-10 md:top-15 md:right-23 flex flex-col gap-4 justify-center items-end"
      >
        <div className="">
          <p className="text-xs md:text-sm text-neutral-400 tracking-tight">
            Starts from
          </p>
          <p className="text-8xl md:text-9xl font-bold tracking-tighter font-mono opacity-10">
            $9
          </p>
          <p className="text-xs md:text-sm text-neutral-400 text-end tracking-tight">
            per month
          </p>
        </div>
      </motion.div>
    </section>
  );
}
