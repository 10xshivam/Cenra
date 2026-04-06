"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { landingSetupItems } from "./landing-data";

const revealUp = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
} as const;

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
} as const;

export function SetupSection() {
  const setupRows = Array.from(
    { length: Math.ceil(landingSetupItems.length / 2) },
    (_, index) => landingSetupItems.slice(index * 2, index * 2 + 2),
  );

  return (
    <section id="setup">
      <motion.div
        variants={revealUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="relative flex flex-col gap-2 md:gap-3 pb-10 px-7 md:pl-10 pt-40"
      >
        <Image
          alt="Cenra Logo"
          height={40}
          width={40}
          src="/cenra-logo.svg"
          className="absolute right-5 md:right-8 top-3 md:top-5 size-35 md:size-50 grayscale opacity-10"
        />
        <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tighter text-emerald-800">
          Setup in minutes
        </h2>
        <p className="max-w-xl text-sm md:text-base tracking-tight text-neutral-600">
          Set up your AI support agent by connecting your data, customizing the
          experience, and deploying it to your website.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
        className="grid border-t border-neutral-300 border-dashed divide-y divide-dashed divide-neutral-300 md:grid-cols-1"
      >
        {setupRows.map((row, rowIndex) => (
          <div
            key={`setup-row-${rowIndex}`}
            className="grid grid-cols-1 divide-dashed divide-neutral-300 max-md:divide-y lg:grid-cols-2 lg:divide-x"
          >
            {row.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={revealUp}
                  className="flex flex-col gap-1.5 p-8"
                >
                  <div className="flex size-12 items-center justify-center border text-emerald-800">
                    <Icon />
                  </div>
                  <h3 className="mt-2 text-xl font-medium tracking-tight text-emerald-800">
                    {item.title}
                  </h3>
                  <p className="text-sm tracking-tight text-neutral-600">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
