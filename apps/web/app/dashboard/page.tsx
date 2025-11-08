"use client";

import { useLogout, useSession } from "@/hooks/useAuth";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Button } from "@workspace/ui/components/button";

export default function Dashboard() {
  const { data: user, isPending } = useSession();
  const { data: workspace, isLoading: isWorkspaceLoading } = useWorkspace();
  const logout = useLogout();

  if (isPending || isWorkspaceLoading) {
    return (
      <div className="h-full w-full flex justify-center items-center text-sm text-neutral-300">
        Loading...
      </div>
    );
  }

  if (!user || !workspace) {
    return null;
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="max-w-md bg-neutral-200 rounded-2xl flex flex-col justify-center items-center p-5 gap-5">
        <h2 className="text-black text-2xl font-bold">
          Dashboard of {workspace.name}
        </h2>
        <p className="text-black">
          Welcome, {user.lastName}
        </p>
        <Button variant="outline" onClick={() => logout.mutate()}>Logout</Button>
      </div>
    </div>
  );
}
