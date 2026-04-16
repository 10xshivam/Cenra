"use client";

import { PRICING_PLANS, PLAN_COMPARISONS } from "@/constants/pricing.constants";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";

export const PricingView = () => {
  const router = useRouter();

  return (
     <div className="relative mx-auto flex w-full h-full max-w-7xl flex-col pt-6 sm:border-x border-dashed border-neutral-300 overflow-y-auto no-scrollbar bg-white/30">
      <ArrowLeft className="md:hidden absolute size-5 left-5 top-7 md:left-5 md:top-5 cursor-pointer text-neutral-400 hover:text-neutral-700 transition-colors" onClick={() => router.back()} />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 md:px-10">
        <header className="flex flex-col gap-4">
          <h2 className="text-3xl font-serif font-medium tracking-tighter text-emerald-800 md:text-5xl">
           Plans built for modern customer support
          </h2>
          <p className="max-w-2xl text-sm text-neutral-600 md:text-lg tracking-tight">
            Everything you need to run AI-powered support, from handling conversations to managing insights and workflows.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex h-full flex-col gap-6 border  px-6 py-8 transition-transform duration-300 hover:-translate-y-1 ${plan.highlight
                ? "border-emerald-700 bg-emerald-900 text-white "
                : "border-neutral-300 border-dashed bg-white/40 text-neutral-900"
                }`}
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-medium tracking-tight font-serif">{plan.name}</h2>
                <p
                  className={`text-sm ${plan.highlight ? "text-white/70" : "text-neutral-500"
                    }`}
                >
                  {plan.blurb}
                </p>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-semibold">{plan.price}</span>
                <span
                  className={`text-sm ${plan.highlight ? "text-white/70" : "text-neutral-500"
                    }`}
                >
                  {plan.cadence}
                </span>
              </div>
              <button
                className={`h-12 rounded-full px-6 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${plan.highlight
                  ? "bg-white text-neutral-900 hover:bg-neutral-100"
                  : "bg-emerald-800 text-white hover:bg-emerald-900"
                  }`}
                type="button"
                onClick={() => router.push("/get-started")}
                disabled={
                  plan.name === "Pro"
                }
              >
                {plan.name === "Pro"
                  ? "Coming Soon"
                    : plan.cta}
              </button>
              <div className="grid gap-2">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className={`flex items-center gap-3 text-sm ${plan.highlight ? "text-white/80" : "text-neutral-600"
                      }`}
                  >
                    <Check
                      strokeWidth={3}
                      className={`size-4 ${plan.highlight ? "text-white" : "text-emerald-600"
                        }`}
                    />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="border border-neutral-300 border-dashed bg-white/40 p-6">
          <div className="flex flex-col gap-2 pb-6">
            <h3 className="text-2xl font-medium font-serif text-neutral-900">
              Feature-by-feature comparison
            </h3>
            <p className="text-sm text-neutral-500">
              A quick scan of what each plan includes for your support stack.
            </p>
          </div>

          <div className="hidden grid-cols-[1.2fr_1fr_1fr] gap-4 md:grid">
            <div className="text-xs font-semibold uppercase text-neutral-500">
              Feature
            </div>
            <div className="text-xs font-semibold uppercase text-neutral-500">
              Starter
            </div>
            <div className="text-xs font-semibold uppercase text-neutral-500">
              Pro
            </div>

            {PLAN_COMPARISONS.map((row) => (
              <React.Fragment key={row.feature}>
                <div className="border-t border-neutral-200/70 py-3 text-sm font-medium text-neutral-800">
                  {row.feature}
                </div>
                <div className="border-t border-neutral-200/70 py-3 text-sm text-neutral-600">
                  {row.starter}
                </div>
                <div className="border-t border-neutral-200/70 py-3 text-sm text-neutral-900">
                  {row.pro}
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="flex flex-col gap-4 md:hidden">
            {PLAN_COMPARISONS.map((row) => (
              <div
                key={row.feature}
                className="border border-neutral-200  bg-white px-4 py-4"
              >
                <p className="text-xs font-semibold uppercase text-neutral-500">
                  {row.feature}
                </p>
                <div className="mt-3 grid gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Starter</span>
                    <span className="font-medium text-neutral-800">
                      {row.starter}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Pro</span>
                    <span className="font-medium text-neutral-900">
                      {row.pro}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

