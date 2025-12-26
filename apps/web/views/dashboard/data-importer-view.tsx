"use client";

import Image from "next/image";
import { SquareInfo } from "@workspace/ui/components/icons";
import { DragAndDrop } from "@/components/dashboard/drag-and-drop";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Switch } from "@workspace/ui/components/switch";
import {
  CircleArrowOutUpRight,
  CircleCheck,
  CircleX,
  EllipsisVertical,
  File,
  X,
} from "lucide-react";
import {
  useDeleteResource,
  useGetAllResources,
  useToggleResource,
} from "@/hooks/useResource";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { Button } from "@workspace/ui/components/button";

interface Resource {
  id: string;
  filename: string;
  fileText: string;
  createdAt: string;
  active: boolean;
}

export const DataImporterView = () => {
  const { workspace } = useWorkspaceStore();

  const { data: resources } = useGetAllResources(workspace?.id || "", "FILE");
  const toggleMutation = useToggleResource();
  const deleteMutation = useDeleteResource();

  return (
    <div className="w-full h-full flex items-center p-16 flex-col gap-20">
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
              <h3 className="font-bold  tracking-tight mt-1">Import files</h3>
              <p className="text-xs text-neutral-500 tracking-tight font-medium">
                Select documents from your device
              </p>
            </div>
          </div>
          <div className="w-full h-full rounded-lg flex gap-16 items-center ">
            <DragAndDrop />
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

      <div className="w-6xl flex flex-col gap-3">
        <div className="flex justify-between items-center px-1">
          <span className=" font-bold tracking-tight">
            Manage Imported Data
          </span>
          <p className="tracking-tight font-medium text-sm text-neutral-400">
            <span className="text-neutral-700 font-bold">
              {resources?.length}
            </span>{" "}
            / 5 Documents
          </p>
        </div>
        <div className="bg-neutral-100 rounded-2xl w-full p-2 border border-neutral-400 border-dashed">
          <div className="rounded-lg overflow-hidden border bg-neutral-50 border-neutral-300 ">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-200 hover:bg-neutral-300/60 border-b border-neutral-300">
                  <TableHead className="pl-10 w-[260px] tracking-tight text-neutral-500 font-semibold">
                    Document Title
                  </TableHead>

                  <TableHead className="w-[260px] tracking-tight text-neutral-500 font-semibold">
                    Text Preview
                  </TableHead>

                  <TableHead className="w-[200px] tracking-tight text-neutral-500 font-semibold">
                    Imported on
                  </TableHead>

                  <TableHead className="w-[120px] tracking-tight text-neutral-500 font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="pr-6 w-[120px] text-right tracking-tight text-neutral-500 font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources &&
                  resources.map((resource: Resource) => (
                    <TableRow
                      key={resource.id}
                      className="hover:bg-neutral-200/10 border-b border-neutral-300"
                    >
                      <TableCell className="relative font-medium pl-10 w-[260px] text-neutral-600 tracking-tight flex items-center gap-1">
                        <Dialog>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DialogTrigger asChild>
                                <button className="absolute left-2.5 p-1 rounded-full hover:bg-neutral-300/50">
                                  <EllipsisVertical
                                    className="size-4 text-neutral-400"
                                    strokeWidth={3.5}
                                  />
                                </button>
                              </DialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent className="flex gap-1">
                              <X className="size-4 text-red-600" />
                              <p>Remove Document</p>
                            </TooltipContent>
                          </Tooltip>
                          <DialogContent
                            className="max-w-xl rounded-2xl"
                            showCloseButton={false}
                          >
                            <DialogHeader>
                              <DialogTitle className="text-neutral-600 tracking-tight font-medium">
                                Delete this document?
                              </DialogTitle>
                              <DialogDescription className=" text-neutral-500 text-sm tracking-tight">
                                This document, and all its contents, will be
                                removed. Your Agent will lose knowledge about
                                this removed content. Are you sure you want to
                                proceed?
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button
                                onClick={() =>
                                  deleteMutation.mutate({
                                    workspaceId: workspace?.id!,
                                    resourceId: resource.id,
                                  })
                                }
                                variant="destructive"
                                type="submit"
                                disabled={deleteMutation.isPending}
                              >
                                {deleteMutation.isPending
                                  ? "Deleting..."
                                  : "Yes, Delete Document"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <File className="size-3.5" strokeWidth={2.5} />
                        {resource.filename}
                      </TableCell>
                      <TableCell className="w-[260px] text-neutral-600 tracking-tight">
                        <Dialog>
                          <DialogTrigger>
                            <div className="flex gap-1 items-center">
                              <span className="ml-4">Open</span>
                              <CircleArrowOutUpRight
                                strokeWidth={2.5}
                                className="size-3 inline"
                              />
                            </div>
                          </DialogTrigger>
                          <DialogContent
                            className="w-full p-0 max-w-2xl h-full max-h-2/3 rounded-2xl border border-none"
                            showCloseButton={true}
                          >
                            <DialogHeader>
                              <DialogTitle className="border-b border-neutral-400 text-center text-neutral-600 tracking-tight font-medium py-4 bg-neutral-300 rounded-t-2xl">
                                {resource.filename}
                              </DialogTitle>
                              <div className="overflow-y-auto max-h-[60vh] scrollbar-none scrollbar-w-1 scrollbar-thumb-neutral-400">
                                <DialogDescription className="p-5 whitespace-pre-wrap">
                                  {resource.fileText}
                                </DialogDescription>
                              </div>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell className="w-[200px] text-neutral-600 tracking-tight">
                        {new Date(resource.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </TableCell>
                      <TableCell className="w-[120px] text-neutral-600 tracking-tight">
                        {resource.active ? (
                          <div className="flex items-center gap-1">
                            <CircleCheck
                              strokeWidth={2.5}
                              className="inline size-3.5 text-center text-green-600"
                            />
                            Active
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <CircleX
                              strokeWidth={2.5}
                              className="inline size-3.5 text-center text-red-600"
                            />
                            Inactive
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="w-[120px] text-neutral-600 tracking-tight text-right pr-6">
                        <Switch
                          disabled={
                            toggleMutation.isPending &&
                            toggleMutation.variables?.resourceId === resource.id
                          }
                          checked={resource.active}
                          onCheckedChange={(checked) =>
                            toggleMutation.mutate({
                              active: checked as boolean,
                              workspaceId: workspace?.id!,
                              resourceId: resource.id,
                            })
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};
