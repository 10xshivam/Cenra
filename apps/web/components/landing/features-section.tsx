import { landingFeatures } from "./landing-data";

export function FeaturesSection() {
  return (
    <section id="features" className="py-6 md:py-10">
      <div className="mb-10 flex max-w-2xl flex-col gap-3">
        <span className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-800">
          Why Cenra
        </span>
        <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
          Built for support teams that need accuracy, continuity, and control.
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {landingFeatures.map((feature) => {
          const Icon = feature.icon;

          return (
            <article
              key={feature.title}
              className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur"
            >
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
                <Icon className="size-5" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-neutral-900">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                {feature.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
