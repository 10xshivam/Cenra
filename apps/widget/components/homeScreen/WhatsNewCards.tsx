export const WhatsNewCards = () => {
  return (
    <div className="w-full relative z-10 mt-8">
      <p className="text-sm text-neutral-400 tracking-tight mb-2">What's New</p>
      <div className="flex gap-4">
        <div className="w-full h-fit  p-3 rounded-lg flex flex-col gap-1 hover:-translate-y-0.5 transition-transform duration-300 border cursor-default">
          <div className="h-6 w-6 flex items-center justify-center rounded-sm bg-neutral-100 text-xs mb-1 border">
            1
          </div>
          <h5 className="text-xs font-medium tracking-tight text-neutral-700">
            Smart AI Support Inbox
          </h5>
          <p className="text-[10px] text-neutral-500 tracking-tight leading-tight">
            Cenra greets customers, answers common questions, and escalates
            tricky conversations to your team when needed.
          </p>
        </div>
        <div className="w-full h-fit  p-3 rounded-lg flex flex-col gap-1 hover:-translate-y-0.5 transition-transform duration-300 border cursor-default">
          <div className="h-6 w-6 flex items-center justify-center rounded-sm bg-neutral-100 text-xs mb-1 border">
            2
          </div>
          <h5 className="text-xs font-medium tracking-tight text-neutral-700">
            Cenra Knowledge Engine
          </h5>
          <p className="text-[10px] text-neutral-500 tracking-tight leading-tight">
            Plug in help docs, FAQs, and release notes so Cenra can respond
            using your real product knowledge, not guesswork.
          </p>
        </div>
      </div>
    </div>
  );
};
