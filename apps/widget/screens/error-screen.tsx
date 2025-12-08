import { useWidgetScreenStore } from "@/store/useWidgetScreenStore";
import { Button } from "@workspace/ui/components/button";
import { ErrorIcon } from "@workspace/ui/components/icons";

export const ErrorScreen = () => {
    const { setCurrentScreen } = useWidgetScreenStore();
    const handleErrorRetry = () => {
        window.location.reload();
        setCurrentScreen("loading");
    }
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center h-full w-full p-7">
      <ErrorIcon size="60" className="mb-2 text-red-700" />
      <h2 className="text-2xl tracking-tight font-bold mb-2 text-neutral-700">Something went off track</h2>
      <p className="text-center text-neutral-600 mb-4 font-medium">
        I’ll try again for you, tap below.
      </p>
      <Button className="rounded-lg" onClick={handleErrorRetry}>Try Again</Button>
    </div>
  );
};
