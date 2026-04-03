import Image from "next/image";
import { landingSetupItems } from "./landing-data";

export function SetupSection() {
  const setupRows = Array.from(
    { length: Math.ceil(landingSetupItems.length / 2) },
    (_, index) => landingSetupItems.slice(index * 2, index * 2 + 2),
  );

  return (
    <section id="setup">
      <div className="relative flex flex-col gap-3 pb-10 pl-10 pt-40">
        <Image
          alt="Cenra Logo"
          height={40}
          width={40}
          src="/cenra-logo.svg"
          className="absolute right-8 top-5 size-50 grayscale opacity-10"
        />
        <h2 className="font-serif text-5xl font-medium tracking-tighter text-emerald-800">
          Setup in minutes
        </h2>
        <p className="max-w-xl tracking-tight text-neutral-600">
          Set up your AI support agent by connecting your data, customizing the
          experience, and deploying it to your website.
        </p>
      </div>

      <div className="grid border-t border-neutral-200 border-dashed divide-y divide-dashed divide-neutral-200 md:grid-cols-1">
        {setupRows.map((row, rowIndex) => (
          <div
            key={`setup-row-${rowIndex}`}
            className="grid grid-cols-1 divide-dashed divide-neutral-200 lg:grid-cols-2 lg:divide-x"
          >
            {row.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="flex flex-col gap-1.5 p-8">
                  <div className="flex size-12 items-center justify-center border text-emerald-800">
                    <Icon />
                  </div>
                  <h3 className="mt-2 text-xl font-medium tracking-tight text-emerald-800">
                    {item.title}
                  </h3>
                  <p className="text-sm tracking-tight text-neutral-600">
                    {item.description}
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
