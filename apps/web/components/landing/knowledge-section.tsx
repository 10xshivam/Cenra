import { CheckCircle2 } from "lucide-react";

const knowledgeBullets = [
  "Website docs, FAQs, and support pages",
  "Uploaded files and internal documents",
  "Workspace greetings, suggestions, and brand settings",
] as const;

export function KnowledgeSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-neutral-300 bg-emerald-950 p-8 text-white shadow-[0_30px_80px_-32px_rgba(0,0,0,0.45)]">
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-200">
            Knowledge sources
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">
            Train Cenra on the content your customers already trust.
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-6 text-emerald-50/85">
            Sync public pages, upload documents, and organize workspace
            knowledge so every answer starts from real business context.
          </p>

          <div className="mt-8 grid gap-3">
            {knowledgeBullets.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-emerald-50"
              >
                <CheckCircle2 className="size-4 text-emerald-300" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-neutral-300 bg-neutral-100 p-2">
          <div className="h-full rounded-[1.5rem] border border-neutral-300 bg-neutral-50 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-neutral-300 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-neutral-800">
                  Web Content
                </p>
                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Crawl product pages, documentation, policy pages, and help
                  content directly from your site.
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-300 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-neutral-800">
                  File Imports
                </p>
                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Add documents that matter to support teams and keep the
                  assistant aligned with updated materials.
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-300 bg-white p-5 shadow-sm md:col-span-2">
                <p className="text-sm font-semibold text-neutral-800">
                  Workspace-level behavior
                </p>
                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Control greetings, widget branding, and customer-facing
                  suggestions from one place so the assistant feels native to
                  each business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
