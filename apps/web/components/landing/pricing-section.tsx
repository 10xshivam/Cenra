import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 md:py-20">
      <div className="rounded-[2rem] border border-neutral-300 bg-neutral-900 p-8 text-white shadow-[0_30px_80px_-32px_rgba(0,0,0,0.45)] md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Pricing
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Simple pricing that scales with your support team.
            </h2>
            <p className="mt-4 text-sm leading-6 text-neutral-300 md:text-base">
              Everything you need to launch an AI-powered chat widget, track
              conversations, and improve support operations as demand grows.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <div>
              <p className="text-sm text-neutral-400">Starts from</p>
              <p className="text-4xl font-semibold tracking-tight">$19/mo</p>
            </div>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white px-6 text-neutral-900 hover:bg-neutral-100"
            >
              <Link href="/pricing">Explore Pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
