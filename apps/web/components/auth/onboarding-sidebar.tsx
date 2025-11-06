"use client";

import Image from "next/image";
import gradient from "@/public/gradient.png";
import { usePathname } from "next/navigation";

export const OnboardingSidebar = () => {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const isSignup = pathname === "/signup";
  const isCreateWorkspace = pathname === "/create-workspace";
  return (
    <div className="relative w-2/4 bg-transparent p-8 flex flex-col justify-between">
      <Image
        src={gradient}
        alt="Gradient background"
        fill={true}
        priority={true}
        placeholder="blur"
        className="-z-10 object-cover rounded-3xl"
      />
      <h2 className="text-2xl text-white font-medium">Cenra.</h2>
      <div className="w-full">
        <h2 className="text-white/80 text-2xl tracking-tight">
          Automate & Elevate Your Customer Support
        </h2>
        <p className="text-white/40 text-sm mt-0.5">
          Log in to manage your AI agent or sign up to start resolving customer
          inquiries 24/7.
        </p>
        <div className="flex gap-3 mt-7">
          {isLogin || isSignup ? (
            <div
              key="1"
              className="mb-4 flex flex-col w-full p-4 gap-3 bg-neutral-100 backdrop-blur-xl rounded-xl ring ring-white/10"
            >
              <div className="rounded-full py-1.5 px-[13px] w-fit text-sm bg-black/10">
                1
              </div>
              <h3 className="text-neutral-600 text-sm">
                Login in or create your account
              </h3>
            </div>
          ) : (
            <div className="mb-4 flex flex-col w-full p-4 gap-3 bg-white/5 backdrop-blur-xl rounded-xl ring ring-white/10">
              <div className="rounded-full py-1.5 px-[13px] w-fit text-sm bg-white/10 text-white/80">
                1
              </div>
              <h3 className="text-white/80 text-sm">
                Login in or create your account
              </h3>
            </div>
          )}
          {isCreateWorkspace ? (
            <div
              key="2"
              className="mb-4 flex flex-col w-full p-4 gap-3 bg-neutral-100 backdrop-blur-xl rounded-xl ring ring-white/10"
            >
              <div className="rounded-full py-1.5 px-3 w-fit text-sm bg-black/10">
                2
              </div>
              <h3 className="text-neutral-600 text-sm">
                Configure your workspace details
              </h3>
            </div>
          ) : (
            <div className="mb-4 flex flex-col w-full p-4 gap-3 bg-white/5 backdrop-blur-xl rounded-xl ring ring-white/10">
              <div className="rounded-full py-1.5 px-3 w-fit text-sm bg-white/10 text-white/80">
                2
              </div>
              <h3 className="text-white/80 text-sm">
                Configure your workspace details
              </h3>
            </div>
          )}
          <div className="mb-4 flex flex-col w-full p-4 gap-3 bg-white/5 backdrop-blur-xl rounded-xl ring ring-white/10">
            <div className="rounded-full py-1.5 px-3 w-fit text-sm bg-white/10 text-white/80">
              3
            </div>
            <h3 className="text-white/80 text-sm">
              Install the Cenra widget on your website
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};
