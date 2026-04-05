"use client";

import { usePathname } from "next/navigation";

export const OnboardingSidebar = () => {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const isSignup = pathname === "/signup";
  const isPayment = pathname === "/payment";
  const isCreateWorkspace = pathname === "/create-workspace";
  return (
    <div className="relative p-6 pt-3.5 flex flex-col justify-between bg-emerald-800 ">
      <div className="w-full flex flex-col">
        <h2 className="text-2xl tracking-tight text-white font-serif">
          Automate & Elevate Your Customer Support
        </h2>
        <p className=" text-sm mt-0.5 text-white/50 tracking-tight">
          Log in to manage your AI agent or sign up to start resolving customer
          inquiries 24/7.
        </p>
        <div className="flex gap-3 mt-5">
          {isLogin || isSignup ? (
            <div
              key="1"
              className="flex flex-col w-full p-4 gap-3 bg-neutral-100 backdrop-blur-xl rounded-xl ring ring-white/10"
            >
              <div className="rounded-full py-1.5 px-[13px] w-fit text-sm bg-black/10">
                1
              </div>
              <h3 className="text-neutral-600 text-sm">
                Login in or create your account
              </h3>
            </div>
          ) : (
            <div className="flex flex-col w-full p-4 gap-3 bg-white/5 backdrop-blur-xl rounded-xl ring ring-white/10">
              <div className="rounded-full py-1.5 px-[13px] w-fit text-sm bg-white/10 text-white/80">
                1
              </div>
              <h3 className="text-sm text-white/80 tracking-tight">
                Login in or create your account
              </h3> 
            </div>
          )}
            {isPayment ? (
              <div
                key="2"
                className="flex flex-col w-full p-4 gap-3 bg-neutral-100 backdrop-blur-xl rounded-xl ring ring-white/10"
              >
                <div className="rounded-full py-1.5 px-3 w-fit text-sm bg-black/10">
                  2
                </div>
                <h3 className="text-neutral-600 text-sm">
                  Complete your payment setup
                </h3>
              </div>
            ) : (
              <div className="flex flex-col w-full p-4 gap-3 bg-white/5 backdrop-blur-xl rounded-xl ring ring-white/10">
                <div className="rounded-full py-1.5 px-3 w-fit text-sm bg-white/10 text-white/80">
                  2
                </div>
                <h3 className="text-sm text-white/80 tracking-tight">
                  Complete your payment setup
                </h3>
              </div>
            )}
          {isCreateWorkspace ? (
            <div
              key="3"
              className="flex flex-col w-full p-4 gap-3 bg-neutral-100 backdrop-blur-xl rounded-xl ring ring-white/10"
            >
              <div className="rounded-full py-1.5 px-3 w-fit text-sm bg-black/10">
                3
              </div>
              <h3 className="text-neutral-600 text-sm">
                Configure your workspace details
              </h3>
            </div>
          ) : (
            <div className="flex flex-col w-full p-4 gap-3 bg-white/5 backdrop-blur-xl rounded-xl ring ring-white/10">
              <div className="rounded-full py-1.5 px-3 w-fit text-sm bg-white/10 text-white/80">
                3
              </div>
              <h3 className="text-sm text-white/80 tracking-tight">
                Configure your workspace details
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
