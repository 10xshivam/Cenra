import {
  IconAdjustmentsFilled,
  IconClockFilled,
  IconCodeCircleFilled,
  IconFileUploadFilled,
} from "@tabler/icons-react";
import { landingSteps } from "./landing-data";
import Image from "next/image";

export function WorkflowSection() {
  return (
    <section id="workflow">
      <div className="flex  relative flex-col gap-3 pt-40 pb-10 pl-10">
        <Image
          alt="Cenra Logo"
          height={40}
          width={40}
          src="/cenra-logo.svg"
          className="absolute grayscale top-5 right-8 size-50 opacity-10"
        />
        <h2 className="text-5xl font-medium tracking-tighter text-emerald-800 font-serif">
          Get started in minutes
        </h2>
        <p className="text-neutral-600 tracking-tight max-w-xl">
          Set up your AI support agent by connecting your data, customizing the
          experience, and deploying it to your website.
        </p>
      </div>

      <div className="grid md:grid-cols-1 border-dashed divide-y divide-dashed divide-neutral-200 border-t border-neutral-200">
        <div className="grid grid-cols-2 divide-x divide-neutral-200 divide-dashed">
          <div className="p-8 flex flex-col gap-7">
            <div className="flex flex-col gap-1.5">
              <div className="size-12 border flex justify-center items-center text-emerald-800">
                <IconFileUploadFilled />
              </div>
              <h3 className="text-emerald-800 text-xl tracking-tight font-medium mt-2">
                Add your website and documents
              </h3>
              <p className="text-sm tracking-tight text-neutral-600">
                Enter your website URL or upload docs, FAQs, and internal
                content so Cenra can learn your product and answer accurately.
              </p>
            </div>
            <div className="h-60 border"></div>
          </div>
          <div className="p-8 flex flex-col gap-7">
            <div className="flex flex-col gap-1.5">
              <div className="size-12 border flex justify-center items-center text-emerald-800">
                <IconAdjustmentsFilled />
              </div>
              <h3 className="text-emerald-800 text-xl tracking-tight font-medium mt-2">
                Customize your chat widget
              </h3>
              <p className="text-sm tracking-tight text-neutral-600">
                Personalize the chat experience with your brand colors, greeting
                message, and behavior to match your product.
              </p>
            </div>
            <div className="h-60 border"></div>
          </div>
        </div>
        <div className="h-96 p-8 flex flex-col gap-5 col-span-2">
          <div className="flex flex-col gap-1.5">
            <div className="size-12 border flex justify-center items-center text-emerald-800">
              <IconCodeCircleFilled />
            </div>
            <h3 className="text-emerald-800 text-xl tracking-tight font-medium mt-2">
              Install on your website
            </h3>
            <p className="text-sm tracking-tight text-neutral-600">
              Copy and paste a simple script into your website or app and start
              assisting customers instantly.
            </p>
          </div>
          <div className="flex-1 border"></div>
        </div>
      </div>
    </section>
  );
}
