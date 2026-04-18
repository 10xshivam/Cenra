import { MessageSquareDashed } from "lucide-react";

export const EmptyConversations = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full p-4 text-center border-2 border-dashed border-neutral-200 rounded-2xl bg-neutral-300/10">
      <div className="bg-white flex justify-center items-center p-3 rounded-full border border-neutral-200">
        <MessageSquareDashed className="size-5 text-neutral-400" strokeWidth={2.5} />
      </div>
      <h3 className="font-semibold text-sm text-neutral-400 tracking-tight mt-2">
        No conversations yet
      </h3>
    </div>
  );
}