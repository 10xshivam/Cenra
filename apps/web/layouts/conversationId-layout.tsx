import { CustomerInfo } from "@/components/dashboard/inbox/customer-info";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable";

export const ConversationIdLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-full w-full">
      <ResizablePanel defaultSize={65}>{children}</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={30} minSize={30} maxSize={35}>
        <CustomerInfo />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
