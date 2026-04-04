import Image from "next/image";

const integrations = [
  { label: "Turborepo", src: "/turborepo.png" },
  { label: "Next.js", src: "/nextjs.svg" },
  { label: "LangChain", src: "/langchain.svg" },
  { label: "QuadrantDB", src: "/quadrant.svg" },
  { label: "TanStack", src: "/tanstack.svg" },
] as const;

export const BuiltWithStrip = () => {
  return (
    <section className="flex flex-wrap border-y border-neutral-200 divide-y divide-neutral-200 md:flex-nowrap md:divide-x md:divide-y-0">
        {integrations.map((item) => (
          <div
            key={item.label}
            className="flex h-32 min-w-[180px] flex-1 basis-1/2 items-center justify-center px-6 md:h-30 md:basis-0"
          >
            <Image
              src={item.src}
              alt={item.label}
              width={130}
              height={130}
              className="grayscale opacity-30"
            />
          </div>
        ))}
    </section>
  );
};
