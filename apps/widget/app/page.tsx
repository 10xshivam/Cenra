import { IconPaperPlane, IconX } from "@workspace/ui/components/icons";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="h-[700px] w-md rounded-3xl shadow-lg relative bg-neutral-50 p-8">
        <div className="absolute top-0 left-0 min-h-2/4 w-full bg-gradient-to-b from-emerald-950 to-neutral-50 rounded-t-3xl z-0" />
        <div className="w-full relative z-10 flex justify-between items-center mb-20">
          <h3 className="text-white text-2xl font-semibold">Cenra.</h3>
          <IconX size="20px" color="white" />
        </div>
        <h4 className="relative z-10 text-white text-4xl tracking-tight font-medium">
          Hi there👋 <br /> How can we help?
        </h4>
        <div className="relative z-10 px-3 py-3 bg-white flex justify-between items-center mt-8 rounded-lg shadow-md">
          <p className="font-medium text-emerald-950/90">Ask a Question</p>
          <IconPaperPlane size="20px" color="#14532d" />
        </div>
      </div>
    </div>
  );
}
