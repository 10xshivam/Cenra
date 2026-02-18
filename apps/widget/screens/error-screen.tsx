import { useWidgetScreenStore } from "@/store/useWidgetScreenStore";
import { Button } from "@workspace/ui/components/button";
import { ErrorIcon } from "@workspace/ui/components/icons";

export const ErrorScreen = () => {
  const { setCurrentScreen } = useWidgetScreenStore();

  const handleErrorRetry = () => {
    window.location.reload();
    setCurrentScreen("loading");
  };

  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center p-7">
      <ErrorIcon size="60" className="mb-2 text-red-700 dark:text-red-500" />
      <h2 className="mb-2 text-2xl font-bold tracking-tight text-neutral-700 dark:text-neutral-100">
        Something went off track
      </h2>
      <p className="mb-4 text-center font-medium text-neutral-600 dark:text-neutral-300">
        I'll try again for you, tap below.
      </p>
      <Button
        variant="ghost"
        className="rounded-lg !bg-[var(--widget-theme-color)] text-white enabled:hover:opacity-90"
        onClick={handleErrorRetry}
      >
        Try Again
      </Button>
    </div>
  );
};
