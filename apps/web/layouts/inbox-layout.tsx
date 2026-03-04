import { ConversationMenu } from "@/components/dashboard/inbox/conversation-menu";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable";

export const InboxLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full">
      <ResizablePanel minSize={20} maxSize={25} defaultSize={25}>
        <ConversationMenu />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>{children}</ResizablePanel>
    </ResizablePanelGroup>
  );
};
