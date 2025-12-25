"use client";
import { useCreateResource } from "@/hooks/useResource";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import {
  ReloadIcon,
} from "@workspace/ui/components/icons";
import {
  CirclePlus,
  Loader2,
  SquareCheckBig,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const DragAndDrop = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const { workspace } = useWorkspaceStore();
  const createResourceMutation = useCreateResource();
  const [fileName, setFileName] = useState<string | null>(null);
  const isUploading = createResourceMutation.isPending;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (isUploading) return;
      if (!workspace?.id) return;
      if (acceptedFiles.length === 0) return;

      const [file] = acceptedFiles;
      if (!file) return;

      setFileName(file.name);

      setShowSuccess(false);

      createResourceMutation.mutate(
        { file, workspaceId: workspace.id },
        {
          onSuccess: () => {
            setShowSuccess(true);
          },
        }
      );
    },
    [createResourceMutation, workspace, isUploading]
  );

  const { getRootProps, getInputProps, isDragReject, isDragActive } =
    useDropzone({
      onDrop,
      multiple: false,
      maxSize: MAX_FILE_SIZE,
      disabled: isUploading,
      accept: {
        "application/pdf": [".pdf"],
        "text/csv": [".csv"],
        "text/plain": [".txt"],
      },
    });

  const handleUploadAnother = () => {
    setShowSuccess(false);
    createResourceMutation.reset();
  };

  return (
    <div
      className={`flex-1 h-full p-0.5 ${isDragActive && "bg-emerald-100"} ${isDragReject && "bg-red-100"} rounded-lg`}
    >
      {showSuccess && !isUploading ? (
        <div className="border h-full rounded-lg flex flex-col items-center justify-center gap-2">
          <span className="flex gap-1 items-center text-sm font-semibold text-emerald-800">
            <SquareCheckBig size={16} />
            Document imported successfully
          </span>
          <span className="text-xs text-neutral-500 tracking-tight">
            The content of your document is now ready to use by Cenra AI. Review
            it below.
          </span>
          <button
            type="button"
            onClick={handleUploadAnother}
            className="mt-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-neutral-500 border border-dashed border-neutral-300 hover:border-neutral-400 bg-neutral-100 hover:bg-neutral-200/40 transition-all duration-200 flex items-center gap-2 tracking-tight"
          >
            Import another file
            <ReloadIcon size="10px" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`w-full h-full border-2 border-dashed p-6 rounded-lg transition-all duration-300 flex flex-col justify-center items-center ${
            isUploading
              ? "bg-neutral-100 border-neutral-300 cursor-not-allowed"
              : isDragReject
                ? "border-red-500 bg-neutral-100 cursor-pointer"
                : isDragActive
                  ? "border-emerald-500 bg-neutral-100/30 hover:bg-neutral-100 cursor-pointer"
                  : "border-neutral-300 bg-neutral-100/30 hover:bg-neutral-100 cursor-pointer"
          }`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="flex flex-col items-center justify-center gap-1 text-center">
              <Loader2
                size={20}
                strokeWidth={1}
                className="animate-spin text-neutral-500 mb-1"
              />
              <span className="font-semibold text-sm text-neutral-700 max-w-2xl truncate">
                {fileName}
              </span>
              <span className=" text-xs text-neutral-500 tracking-tight animate-pulse">
                Uploading your document...
              </span>
            </div>
          ) : (
            <>
              <CirclePlus
                size={20}
                strokeWidth={2.5}
                className={`${isDragReject ? "text-red-600" : "text-neutral-500"} mb-1.5`}
              />
              <span
                className={`font-medium text-sm ${isDragReject ? "text-red-600" : "text-neutral-500"} tracking-tight mb-0.5`}
              >
                {isDragReject
                  ? "File is invalid"
                  : "Drag and drop document file here"}
              </span>
              <span className="text-xs text-neutral-400 tracking-tighter">
                Accepted file types: .pdf, .csv, .txt &bull; Max 5MB
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
