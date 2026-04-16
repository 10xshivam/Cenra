"use client";

import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";

export const CancelPageView = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-4">
      <div className="p-2.5 bg-red-800/10 rounded-2xl">
        <div className="w-full max-w-sm bg-white rounded-2xl text-center">
          <div className="bg-red-800 p-5 rounded-t-2xl">
            <div className="flex justify-center mb-5">
              <div className="size-16 bg-white rounded-full flex items-center justify-center text-red-700">
                <AlertCircle className="size-9" strokeWidth={2.5} />
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight">
              Payment Cancelled
            </h2>

            <p className="text-white/70 text-xs tracking-tight">
              Your payment was cancelled or didn’t go through. No charges were
              made to your account.
            </p>
          </div>

          <div className="p-4 flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => router.replace("/pricing")}
                className="w-full tracking-tight"
              >
                <RefreshCcw className="size-3.5" strokeWidth={3} />
                Try Again
              </Button>

              <Button
                variant="outline"
                onClick={() => router.replace("/")}
                className="w-full tracking-tight"
              >
                <ArrowLeft className="size-3.5" strokeWidth={3} />
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
}
