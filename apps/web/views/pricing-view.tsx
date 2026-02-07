import React from "react";

export const PricingView = () => {
  const plans = [
    {
      name: "Starter",
      price: "$19",
      cadence: "/ month",
      blurb: "Perfect for small teams getting started.",
      cta: "Start Free",
      highlight: false,
      features: [
        "1 Workspace",
        "Single Chat Widget",
        "AI Customer Support Agent",
        "1 Web Resource + 5 Documents",
        "Standard Analytics",
        "Real-time Visitor Info",
        "Basic Widget Customization",
        "Up to 200 Monthly Customers",
        "Voice Features not included",
        "Collaboration not included",
        "Language Support not included",
      ],
    },
    {
      name: "Pro",
      price: "$49",
      cadence: "/ month",
      blurb: "For scaling teams that need deeper insights.",
      cta: "Upgrade to Pro",
      highlight: true,
      features: [
        "Up to 5 Workspaces",
        "Multiple Chat Widgets",
        "AI Agent with Model Selection",
        "10 Web Resources + 15 Documents",
        "Advanced Analytics",
        "Detailed Visitor Insights",
        "Full Widget Customization",
        "Up to 500 Monthly Customers",
        "Voice Assistant Support",
        "Team Collaboration & Access",
        "Multilingual Support",
      ],
    },
  ];

  const comparisons = [
    {
      feature: "Price",
      starter: "$19 / month",
      pro: "$49 / month",
    },
    {
      feature: "Workspaces",
      starter: "1 Workspace",
      pro: "Up to 5 Workspaces",
    },
    {
      feature: "Chat Widget",
      starter: "Single Widget",
      pro: "Multiple Chat Widgets",
    },
    {
      feature: "AI Support",
      starter: "AI Customer Support Agent",
      pro: "AI Agent with Model Selection",
    },
    {
      feature: "Knowledge Base",
      starter: "1 Web Resource + 5 Documents",
      pro: "10 Web Resources + 15 Documents",
    },
    {
      feature: "Analytics",
      starter: "Standard Analytics",
      pro: "Advanced Analytics",
    },
    {
      feature: "Visitor Info",
      starter: "Real-time Visitor Info",
      pro: "Detailed Visitor Insights",
    },
    {
      feature: "Customization",
      starter: "Basic Widget Customization",
      pro: "Full Widget Customization",
    },
    {
      feature: "Monthly Customers",
      starter: "Up to 200 Customers",
      pro: "Up to 500 Customers",
    },
    {
      feature: "Voice Features",
      starter: "Not Included",
      pro: "Voice Assistant Support",
    },
    {
      feature: "Collaboration",
      starter: "Not Included",
      pro: "Team Collaboration & Access",
    },
    {
      feature: "Language Support",
      starter: "Not Included",
      pro: "Multilingual Support",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f3f0] text-neutral-900">
      <div className="pointer-events-none absolute -top-32 -right-40 h-96 w-96 rounded-full bg-[#d6e4ff] blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-[30rem] w-[30rem] rounded-full bg-[#ffd6b0] blur-[140px]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 md:px-10">
        <header className="flex flex-col gap-4">
          <span className="w-fit rounded-full border border-neutral-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Pricing Plans
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl">
            Pick a plan that scales with your support team
          </h1>
          <p className="max-w-2xl text-base text-neutral-600 md:text-lg">
            Everything you need to launch a high-converting chat widget, track
            visitors in real time, and unlock AI-driven support automation.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex h-full flex-col gap-6 rounded-3xl border px-6 py-8 shadow-lg transition-transform duration-300 hover:-translate-y-1 ${
                plan.highlight
                  ? "border-neutral-900 bg-neutral-900 text-white shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)]"
                  : "border-white/40 bg-white/80 text-neutral-900 backdrop-blur"
              }`}
            >
              {plan.highlight && (
                <span className="absolute right-6 top-6 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                  Most Popular
                </span>
              )}
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold">{plan.name}</h2>
                <p
                  className={`text-sm ${
                    plan.highlight ? "text-white/70" : "text-neutral-500"
                  }`}
                >
                  {plan.blurb}
                </p>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-semibold">{plan.price}</span>
                <span
                  className={`text-sm ${
                    plan.highlight ? "text-white/70" : "text-neutral-500"
                  }`}
                >
                  {plan.cadence}
                </span>
              </div>
              <button
                className={`h-12 rounded-full px-6 text-sm font-semibold transition-colors ${
                  plan.highlight
                    ? "bg-white text-neutral-900 hover:bg-neutral-100"
                    : "bg-neutral-900 text-white hover:bg-neutral-800"
                }`}
                type="button"
              >
                {plan.cta}
              </button>
              <div className="grid gap-2">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className={`flex items-start gap-3 text-sm ${
                      plan.highlight ? "text-white/80" : "text-neutral-600"
                    }`}
                  >
                    <span
                      className={`mt-1 h-2 w-2 rounded-full ${
                        plan.highlight ? "bg-white" : "bg-neutral-900"
                      }`}
                    />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-neutral-200/70 bg-white/80 p-6 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-2 pb-6">
            <h3 className="text-2xl font-semibold text-neutral-900">
              Feature-by-feature comparison
            </h3>
            <p className="text-sm text-neutral-500">
              A quick scan of what each plan includes for your support stack.
            </p>
          </div>

          <div className="hidden grid-cols-[1.2fr_1fr_1fr] gap-4 md:grid">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Feature
            </div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Starter
            </div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Pro
            </div>

            {comparisons.map((row) => (
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
            {comparisons.map((row) => (
              <div
                key={row.feature}
                className="rounded-2xl border border-neutral-200/70 bg-white px-4 py-4 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
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
