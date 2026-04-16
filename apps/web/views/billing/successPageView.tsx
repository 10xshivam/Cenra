"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Loader2, ArrowRight, CircleCheckBig, Check } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";

export const SuccessPageView = () => {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const sync = async () => {
      try {
        await axiosInstance.post("/subscription/sync-subscription");
        setIsSyncing(false);

        setTimeout(() => {
          router.replace("/create-workspace");
        }, 2000);
      } catch (err) {
        console.error("Failed to sync session", err);
        router.replace("/pricing");
      }
    };

    sync();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-4">
      <div className="p-2.5 bg-emerald-800/10 rounded-2xl">
        <div className="w-full max-w-sm bg-white rounded-2xl text-center">
          <div className="bg-emerald-800 p-5 rounded-t-2xl">
            <div className="flex justify-center mb-5">
              <div className="size-16 bg-white rounded-full flex items-center justify-center text-emerald-700">
                <CircleCheckBig className="size-9" strokeWidth={2.5} />
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight">
              Payment Successful!
            </h2>

            <p className="text-white/70 text-xs tracking-tight">
              Thank you for subscribing. Your account is now active and we're
              getting everything ready for you.
            </p>
          </div>

          <div className="p-4 flex flex-col gap-3">
            <div className="bg-neutral-100 rounded-lg px-4 py-2.5  flex items-center justify-center gap-2 text-left">
              {isSyncing ? (
                <Loader2 className="size-4 text-neutral-400 animate-spin" />
              ) : (
                <Check className="size-4 text-emerald-700" strokeWidth={3.5} />
              )}
              <span className={`text-sm text-neutral-600 font-medium tracking-tight ${isSyncing ? " animate-pulse" : "text-green-600"}`}>
                {isSyncing ? "Syncing subscription..." : "Subscription synced"}
              </span>
            </div>

            <div className="">
              <p className="text-xs text-neutral-400 mb-5 tracking-tight">
                You will be redirected to workspace setup in a moment...
              </p>

              <Button
                onClick={() => router.replace("/create-workspace")}
                disabled={isSyncing}
                className="w-full group"
              >
                Continue to Setup
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
