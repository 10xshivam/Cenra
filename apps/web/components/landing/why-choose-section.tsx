import { landingFeatures } from "./landing-data";
import { IconQuestionMark } from "@tabler/icons-react";

export function WhyChooseSection() {
  const featureRows = Array.from(
    { length: Math.ceil(landingFeatures.length / 2) },
    (_, index) => landingFeatures.slice(index * 2, index * 2 + 2),
  );

  return (
    <section
      id="why-cenra"
      className="pt-6 md:pt-10 relative border-t border-neutral-200"
    >
      <IconQuestionMark className="absolute grayscale top-5 right-5 size-50 opacity-10" strokeWidth={3} />
      <div className="flex relative flex-col gap-3 pt-40 pb-10 pl-10">
        <h2 className="text-5xl font-medium tracking-tighter text-emerald-800 font-serif">
          Why choose Cenra
        </h2>
        <p className="text-neutral-600 tracking-tight pl-1 max-w-xl">
          Designed for teams that need accurate, scalable, and context-aware customer support, with everything to manage and improve support operations.
        </p>
      </div>

      <div className="grid md:grid-cols-1 border-dashed divide-y divide-dashed divide-neutral-200 border-t border-neutral-200">
        {featureRows.map((row, rowIndex) => (
          <div
            key={`feature-row-${rowIndex}`}
            className="grid grid-cols-2 divide-x divide-neutral-200 divide-dashed"
          >
            {row.map((feature) => {
              const Icon = feature.icon;

              return (
                  <div key={feature.title} className="flex flex-col gap-1.5 p-8">
                    <div className="size-12 border flex justify-center items-center text-emerald-800">
                      <Icon />
                    </div>
                    <h3 className="text-emerald-800 text-xl tracking-tight font-medium mt-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm tracking-tight text-neutral-600 ">
                      {feature.description}
                    </p>
                  </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}


