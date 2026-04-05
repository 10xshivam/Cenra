"use client";

import { PLAN_COMPARISONS, PRICING_PLANS } from "@/constants/pricing.constants";
import { useCreateCheckout, useSubscription } from "@/hooks/useSubscription";
import { useUserStore } from "@/store/useUserStore";
import { Check } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export const PaymentView = () => {
  const createCheckoutMutation = useCreateCheckout();
  const { data: subscription } = useSubscription();
  const userId = useUserStore((state) => state.user?.id);

  const handleCheckout = async (planName: "Starter" | "Pro") => {
    if (!userId) {
      toast.error("Unable to start checkout. Please login again.");
      return;
    }

    const plan = planName === "Starter" ? "STARTER" : "PRO";
    const data = await createCheckoutMutation.mutateAsync({ plan, userId });

    if (!data?.checkoutUrl) {
      toast.error("Checkout link was not returned. Please try again.");
      return;
    }

    window.location.href = data.checkoutUrl;
  };

  return (
    <div className="flex flex-col gap-7 py-7">
      <div className="flex flex-col gap-1">
        <h2 className="text-4xl font-medium tracking-tighter font-serif text-emerald-800">
          Choose your plan
        </h2>
        <p className="tracking-tght text-neutral-500 text-sm">
         Pick a plan that matches your support needs and grows with your team.
        </p>
      </div>
        <section className="grid gap-6 lg:grid-cols-2">
          {PRICING_PLANS.map((plan) => {
            const isCurrentPlan = subscription?.plan === plan.name.toUpperCase();
            const isDisabled =
              plan.name === "Pro" || createCheckoutMutation.isPending || isCurrentPlan;
            const buttonText = isCurrentPlan
              ? "Current Plan"
              : plan.name === "Pro"
                ? "Coming Soon"
                : createCheckoutMutation.isPending
                  ? "Redirecting..."
                  : plan.cta;

            return (
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
                onClick={() => handleCheckout(plan.name)}
                disabled={isDisabled}
              >
                {buttonText}
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
            );
          })}
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
  );
};
