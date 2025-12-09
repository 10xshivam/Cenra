import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@workspace/ui/components/field";
import { Forward } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod/v4";

export const ChatInputSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

interface ChatInputProps {
  handleSendMessage: (data: z.infer<typeof ChatInputSchema>) => void;
  isSendingMessage: boolean;
  showIdentityForm: boolean;
}

export type ChatInputData = z.infer<typeof ChatInputSchema>;

export const ChatInput = ({
  handleSendMessage,
  isSendingMessage,
  showIdentityForm,
}: ChatInputProps) => {
  const form = useForm<z.infer<typeof ChatInputSchema>>({
    resolver: zodResolver(ChatInputSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = (data: ChatInputData) => {
    handleSendMessage(data);
    form.reset();
  };

  const isInputEmpty = form.watch("message").trim() === "";
  return (
    <div className="relative w-[95%] border rounded-2xl bg-white">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <textarea
                {...field}
                ref={field.ref}
                className="w-full p-3 resize-none outline-none border-0 focus:ring-0 text-sm text-neutral-600 scrollbar-w-1 scrollbar scrollbar-thumb-neutral-300 scrollbar-track-transparent"
                placeholder="Type your message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)();
                  }
                }}
              />
            </Field>
          )}
        />
        <div className="w-full pb-1.5 px-1.5 flex justify-end">
          <button
            type="submit"
            disabled={isInputEmpty || isSendingMessage || showIdentityForm}
            className="rounded-full disabled:bg-neutral-300/50 bg-emerald-800 hover:bg-emerald-800 disabled:text-neutral-600 text-white p-2"
          >
            <Forward size={14} strokeWidth={3} />
          </button>
        </div>
      </form>
    </div>
  );
};
