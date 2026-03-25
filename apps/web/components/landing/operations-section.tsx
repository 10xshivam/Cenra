import { landingIntegrations, landingOperations } from "./landing-data";

export function OperationsSection() {
  return (
    <section id="operations" className="py-6 md:py-10">
      <div className="mb-10 flex max-w-2xl flex-col gap-3">
        <span className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-800">
          Operations layer
        </span>
        <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
          More than a widget. Cenra gives your team operational visibility.
        </h2>
        <p className="text-neutral-600">
          The assistant handles the front line while your team tracks
          conversations, escalations, and support patterns from the dashboard.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-neutral-300 bg-neutral-100 p-2">
          <div className="h-full rounded-[1.5rem] border border-neutral-300 bg-neutral-50 p-6">
            <div className="grid gap-4 md:grid-cols-3">
              {landingOperations.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-neutral-300 bg-white p-5 shadow-sm"
                  >
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold tracking-tight text-neutral-800">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-neutral-300 bg-white p-6 shadow-sm">
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-500">
            Embedded everywhere
          </span>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
            Install Cenra where your users already are.
          </h3>
          <p className="mt-3 text-sm leading-6 text-neutral-600">
            Use the generated workspace ID and integration snippets to add the
            widget across your product and support surfaces.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {landingIntegrations.map((item) => (
              <span
                key={item}
                className="rounded-full border border-neutral-300 bg-neutral-50 px-4 py-2 text-sm text-neutral-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
