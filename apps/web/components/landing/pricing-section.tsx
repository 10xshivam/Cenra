import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

export function PricingSection() {
  return (
    <section id="pricing" className="p-10 border-y border-neutral-200">
      <div className="grid grid-cols-2">
        <div className="flex relative flex-col gap-3 max-w-xl">
          <h2 className="text-4xl font-medium tracking-tighter text-emerald-800 font-serif">
            Pricing that scales with your business
          </h2>
          <p className="text-neutral-600 tracking-tight pl-1">
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
        </div>

        <div className="flex flex-col gap-4 justify-center items-end">
          <div className="">
            <p className="text-sm text-neutral-400 tracking-tight">
              Starts from
            </p>
            <p className="text-9xl font-semibold tracking-tighter font-mono opacity-10">
              $19
            </p>
            <p className="text-sm text-neutral-400 text-end tracking-tight">
              per month
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
