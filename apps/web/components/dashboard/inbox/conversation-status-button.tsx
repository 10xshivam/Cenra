import { Button } from "@workspace/ui/components/button";
import { Hint } from "@workspace/ui/components/hint";
import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";

export const ConversationStatusButton = ({
  status,
  onClick,
  disabled,
}: {
  status: "resolved" | "escalated" | "unresolved";
  onClick: () => void;
  disabled?: boolean;
}) => {
  if (status === "resolved") {
    return (
      <Hint text="Mark as unresolved">
        <Button
          onClick={onClick}
          variant={"outline"}
          className="rounded-lg bg-green-100 text-green-700 border-green-400 hover:bg-green-200/60 shadow-none"
          disabled={disabled}
        >
          <CheckIcon size={17} strokeWidth={3.5} className="text-green-600" />
          <span className="text-sm text-neutral-700 font-medium tracking-tight">
            Resolved
          </span>
        </Button>
      </Hint>
    );
  }

  if (status === "escalated") {
    return (
      <Hint text="Mark as resolved">
        <Button
          onClick={onClick}
          variant={"outline"}
          className="rounded-lg bg-yellow-100 text-yellow-700 border-yellow-400 hover:bg-yellow-200/60 shadow-none"
          disabled={disabled}
        >
          <ArrowUpIcon
            size={17}
            strokeWidth={3.5}
            className="text-yellow-600"
          />
          <span className="text-sm text-neutral-700 font-medium tracking-tight">
            Escalated
          </span>
        </Button>
      </Hint>
    );
  }

  return (
    <Hint text="Mark as escalated">
      <Button
        onClick={onClick}
        variant={"outline"}
        className="rounded-lg bg-red-100 text-red-700 border-red-400 hover:bg-red-200/60 shadow-none"
        disabled={disabled}
      >
        <ArrowRightIcon size={17} strokeWidth={3.5} className="text-red-600" />
        <span className="text-sm text-neutral-700 font-medium tracking-tight">
          Unresolved
        </span>
      </Button>
    </Hint>
  );
};
