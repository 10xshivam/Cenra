"use client";

import { useGetAllMessages } from "@/hooks/useMessages";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Field } from "@workspace/ui/components/field";
import { Forward, MoreHorizontal, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import {
  Message as UiMessage,
  MessageContent,
  MessageResponse,
} from "@workspace/ui/components/ai-elements/message";

interface ChatMessage {
  from: "user" | "assistant";
  content: string;
  id: string;
}

export const ChatInputSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

export type ChatInputData = z.infer<typeof ChatInputSchema>;

export const ConversationBoxView = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { workspace } = useWorkspaceStore();
  const {
    data: historyData,
    isLoading: historyLoading,
    isError: historyError,
  } = useGetAllMessages(workspace?.id || "", conversationId);

  useEffect(() => {
    if (historyError) {
      console.error("Error fetching messages");
      return;
    }

    if (historyLoading || !historyData) return;

    const mapped: ChatMessage[] = (historyData.messages || []).map(
      (m: { role: string; content: string }) => ({
        id: crypto.randomUUID(),
        from: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })
    );

    setMessages(mapped);
  }, [historyLoading, historyError, historyData]);

  const form = useForm<z.infer<typeof ChatInputSchema>>({
    resolver: zodResolver(ChatInputSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = (data: ChatInputData) => {
    // handleSendMessage(data);
    form.reset();
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-14 w-full border-b flex items-center justify-between px-4">
        <MoreHorizontal
          size={20}
          strokeWidth={3}
          className="text-neutral-600"
        />
        <Button className="bg-green-600 rounded-lg">Resolved</Button>
      </div>
      <div className="max-h-[calc(100vh-240px)] h-full overflow-y-auto p-4">
        {messages.map((m) =>
        m.from === "user" ? (
          <div key={m.id} className="flex items-end gap-1.5 mb-4 mt-4">
            <div className="size-7 rounded-full flex items-center justify-center flex-shrink-0 bg-neutral-100 border border-neutral-300">
              <User size={12} className="text-neutral-600" />
            </div>
            <UiMessage
              from="assistant"
              className="border max-w-[75%] w-fit px-3.5 py-2.5 rounded-xl bg-white rounded-bl-none text-neutral-600"
            >
              <MessageContent>
                <MessageResponse>{m.content}</MessageResponse>
              </MessageContent>
            </UiMessage>
          </div>
        ) : (
          <UiMessage
            key={m.id}
            from="user"
            className="border max-w-[75%] w-fit px-3.5 py-2.5 rounded-xl bg-emerald-800 text-white rounded-br-none border-none ml-auto"
          >
            <MessageContent>
              <MessageResponse>{m.content}</MessageResponse>
            </MessageContent>
          </UiMessage>
        )
      )}
      </div>
      <div className="w-full p-2">
        <div className="border rounded-2xl bg-white">
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
                // disabled={isInputEmpty || isSendingMessage || showIdentityForm}
                className="rounded-full disabled:bg-neutral-300/50 bg-emerald-800 hover:bg-emerald-800 disabled:text-neutral-600 text-white p-2"
              >
                <Forward size={14} strokeWidth={3} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
