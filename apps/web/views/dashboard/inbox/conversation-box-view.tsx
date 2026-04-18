"use client";

import { useCreateMessage, useGetAllMessages } from "@/hooks/useMessages";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Field } from "@workspace/ui/components/field";
import { Forward, RotateCw, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import {
  Message as UiMessage,
  MessageContent,
  MessageResponse,
} from "@workspace/ui/components/ai-elements/message";
import {
  useConversationStatus,
  useDeleteConversation,
  useUpdateConversationStatus,
} from "@/hooks/useConversation";
import { ConversationStatusButton } from "@/components/dashboard/inbox/conversation-status-button";
import { Hint } from "@workspace/ui/components/hint";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { ChatMessagesSkeleton } from "@/skeletons/chatMessagesSkeleton";

interface ChatMessage {
  from: "user" | "assistant";
  content: string;
  id: string;
}

export const ChatInputSchema = z.object({
  message: z.string().trim().min(1, "Message cannot be empty"),
});

export type ChatInputData = z.infer<typeof ChatInputSchema>;

export const ConversationBoxView = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [open, setOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { workspace } = useWorkspaceStore();
  const {
    data: historyData,
    isLoading: historyLoading,
    isError: historyError,
    // error: historyErrorDetails,
  } = useGetAllMessages(workspace?.id || "", conversationId);
  const { data: conversationStatus } = useConversationStatus(conversationId);
  const updateConversationStatusMutation = useUpdateConversationStatus();
  const sendMessageMutation = useCreateMessage();
  const isSendingMessage = sendMessageMutation.isPending;
  const deleteMutation = useDeleteConversation();

  const scrollToBottom = () => {
    if (!scrollContainerRef.current) return;
    setTimeout(() => {
      if (!scrollContainerRef.current) return;
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSendingMessage]);

  useEffect(() => {
    // if (historyError) {
    //   console.error("Error fetching messages:", historyErrorDetails);
    //   return;
    // }

    if (historyLoading || !historyData) return;

    setMessages(historyData.messages);
  }, [historyLoading, historyError, historyData]);

  const form = useForm<z.infer<typeof ChatInputSchema>>({
    resolver: zodResolver(ChatInputSchema),
    defaultValues: {
      message: "",
    },
  });

  const pushMessage = (from: "user" | "assistant", content: string) => {
    setMessages((prev) => [
      ...prev,
      { from, content, id: Date.now().toString() },
    ]);
  };

  const handleSendMessage = async (data: ChatInputData) => {
    if (!workspace?.id) return;

    const text = data.message.trim();
    pushMessage("assistant", text);

    form.reset();
    await sendMessageMutation.mutateAsync({
      workspaceId: workspace.id,
      conversationId,
      message: text,
    });
  };

  const handleStatusChange = async () => {
    if (!conversationId) return;

    let newStatus: "unresolved" | "resolved" | "escalated";

    if (conversationStatus?.status === "unresolved") {
      newStatus = "escalated";
    } else if (conversationStatus?.status === "escalated") {
      newStatus = "resolved";
    } else {
      newStatus = "unresolved";
    }

    await updateConversationStatusMutation.mutateAsync({
      conversationId,
      status: newStatus,
    });
  };

  const handleDeleteConversation = async () => {
    if (!conversationId) return;
    await deleteMutation.mutateAsync(conversationId);
    setOpen(false);
  };

  const isInputEmpty = form.watch("message").trim() === "";

  const loading = true;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-14 w-full border-b flex items-center justify-between px-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <Hint text="Delete Conversation">
            <DialogTrigger asChild>
              <Button
                variant={"outline"}
                className=" bg-red-200/10 hover:bg-red-200/20 rounded-lg h-7 border border-red-300"
              >
                <Trash2 size={16} strokeWidth={2} className="text-red-600" />
              </Button>
            </DialogTrigger>
          </Hint>

          <DialogContent
            className="max-w-2xl rounded-2xl p-1.5 pb-5 bg-neutral-100/50 border border-neutral-500"
            showCloseButton={false}
          >
            <div className="flex flex-col gap-4 relative w-full rounded-xl p-5 border border-neutral-400 bg-neutral-100">
              <DialogHeader>
                <DialogTitle className="text-neutral-600 tracking-tight font-medium">
                  Delete this conversation?
                </DialogTitle>
                <DialogDescription className=" text-neutral-500 text-sm tracking-tight">
                  This will permanently remove the conversation and its AI
                  memory. The customer can start a new chat later, but past
                  messages will be lost.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button>Cancel</Button>
                </DialogClose>
                <Button
                  onClick={handleDeleteConversation}
                  variant="destructive"
                  type="submit"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <RotateCw className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                  Yes, Delete Conversation
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
        <ConversationStatusButton
          status={conversationStatus?.status}
          onClick={handleStatusChange}
          disabled={updateConversationStatusMutation.isPending}
        />
      </div>
      <div
        ref={scrollContainerRef}
        className="max-h-[calc(100vh-231px)] h-full overflow-y-auto p-4"
      >
        {historyLoading ? (
          <ChatMessagesSkeleton />
        ) : (
          messages.map((m) =>
            m.from === "user" ? (
              <div key={m.id} className="flex items-end gap-1.5 mb-4">
                <div className="size-7 rounded-full flex items-center justify-center flex-shrink-0 bg-neutral-400/10 border border-neutral-300">
                  <User size={12} className="text-neutral-600" />
                </div>
                <UiMessage
                  from="assistant"
                  className="border max-w-[75%] w-fit px-3.5 py-2.5 rounded-xl bg-neutral-400/10 rounded-bl-none text-neutral-600"
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
                className="border max-w-[75%] w-fit px-3.5 py-2.5 mb-4 rounded-xl bg-emerald-800 text-white rounded-br-none border-none ml-auto"
              >
                <MessageContent>
                  <MessageResponse>{m.content}</MessageResponse>
                </MessageContent>
              </UiMessage>
            )
          )
        )}
      </div>
      <div className="w-full p-2 pt-0">
        <div className="border border-neutral-300 rounded-2xl bg-neutral-400/10">
          <form onSubmit={form.handleSubmit(handleSendMessage)}>
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
                        form.handleSubmit(handleSendMessage)();
                        form.reset();
                      }
                    }}
                  />
                </Field>
              )}
            />
            <div className="w-full pb-1.5 px-1.5 flex justify-end">
              <button
                type="submit"
                disabled={isInputEmpty || isSendingMessage}
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
