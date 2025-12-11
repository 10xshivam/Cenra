import Image from "next/image";
import { CirclePlus } from "lucide-react";
import { SquareInfo } from "@workspace/ui/components/icons";

export const DataImporterView = () => {
  return (
    <div className="w-full h-full flex justify-center p-16">
      <div className="bg-neutral-100 rounded-2xl w-full p-2 max-w-6xl h-fit border">
        <div className="w-full border border-neutral-300 h-60 rounded-xl p-5 bg-neutral-50 flex flex-col justify-center gap-4">
          <div className="flex gap-2 items-center">
            <Image
              width={60}
              height={60}
              alt="Knowledge Source"
              src={"/file-icon.png"}
            />
            <div className="flex flex-col">
              <h3 className="font-bold  tracking-tight mt-1">
                Upload files
              </h3>
              <p className="text-xs text-neutral-500 tracking-tight font-medium">
                Select documents from your device
              </p>
            </div>
          </div>
          <div className="w-full h-full rounded-lg flex gap-16 items-center ">
            <div className="flex-1 border-2 h-full rounded-lg border-dashed bg-neutral-100/50 flex justify-center items-center flex-col hover:bg-emerald-100/5 transition-colors duration-300 cursor-pointer hover:border-emerald-600">
              <CirclePlus
                size={20}
                strokeWidth={2.5}
                className="text-neutral-500 mb-1.5"
              />
              <span className="font-medium text-sm text-neutral-500 tracking-tight mb-0.5">
                Drag and drop document file here
              </span>
              <span className="text-xs text-neutral-400 tracking-tighter">
                Accepted file types: .pdf, .csv, .txt
              </span>
            </div>
            <div className="flex h-full border-l pl-5 flex-col gap-3.5 justify-center">
              <span className="flex gap-1 text-sm items-center text-emerald-800 font-semibold tracking-tight">
                <SquareInfo size="18" /> What file types are supported?
              </span>
              <span className="text-neutral-500 text-xs tracking-tight max-w-3xs">
                You can upload any kind of text documents, such as PDF or CSV.
              </span>
              <span className="text-neutral-500 text-xs tracking-tight max-w-3xs">
                Cenra will extract the text content from your documents and
                train your AI with that text.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
