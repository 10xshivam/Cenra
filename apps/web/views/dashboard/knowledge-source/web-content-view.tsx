"use client";

import { Button } from "@workspace/ui/components/button";
import { CloudCheckIcon, SquareInfo } from "@workspace/ui/components/icons";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleArrowOutUpRight,
  CirclePlus,
  Globe,
  RotateCw,
  Trash,
  Trash2,
} from "lucide-react";
import { useState } from "react";
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
import { Field, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateWebResource,
  useDeleteResource,
  useGetAllResources,
  useRecrawlWebResource,
  useToggleResource,
} from "@/hooks/useResource";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { Switch } from "@workspace/ui/components/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible";
import { handleTimeSince } from "@/lib/formatTime";

const webContentSchema = z.object({
  domain: z.string().url("Invalid URL"),
  paths: z.string().optional(),
});

interface WebResource {
  url: string;
  webContent?:
    | {
        page: string;
        content: string;
      }[]
    | null;
  updatedAt: string;
  id: string;
  active: boolean;
}

export const WebContentView = () => {
  const [open, setOpen] = useState(false);
  const [openCollapsibles, setOpenCollapsibles] = useState<
    Record<string, boolean>
  >({});
  const [openRecrawlDialogs, setOpenRecrawlDialogs] = useState<
    Record<string, boolean>
  >({});
  const { workspace } = useWorkspaceStore();
  const createWebResourceMutation = useCreateWebResource();
  const { data: resources, isPending } = useGetAllResources(
    workspace?.id || "",
    "WEB",
  );
  const toggleMutation = useToggleResource();
  const deleteMutation = useDeleteResource();
  const crawlMutation = useRecrawlWebResource();

  const form = useForm<z.infer<typeof webContentSchema>>({
    resolver: zodResolver(webContentSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      domain: "",
      paths: "",
    },
  });

  const handleFormSubmit = (values: z.infer<typeof webContentSchema>) => {
    const pathArray = values.paths
      ? values.paths.split(",").map((path) => path.trim())
      : [];
    createWebResourceMutation.mutate(
      {
        url: values.domain,
        paths: pathArray,
        workspaceId: workspace?.id || "",
      },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      },
    );
  };
  return (
    <div className="w-full h-full flex items-center p-16 flex-col gap-20">
      <div className="rounded-2xl w-full p-2 max-w-6xl h-fit bg-neutral-200 pb-6">
        <div className="flex flex-col gap-3.5 w-full h-full border border-neutral-400 rounded-xl p-5 bg-neutral-50">
          <span className="flex gap-1 text-lg items-center text-emerald-800 font-semibold tracking-tight">
            <SquareInfo size="18" /> What is Web Content?
          </span>
          <span className="text-neutral-500 text-sm tracking-tight">
            Web Content lets Cenra learn directly from your website and online
            documentation. Add your domains, and Cenra will crawl and extract
            the pages so your AI assistant can answer questions using your real,
            up-to-date content.
          </span>
          <span className="text-neutral-500 text-sm tracking-tight">
            <span className="font-bold text-neutral-700">Tip</span>: Once
            indexed, Cenra uses this content to generate accurate, context-aware
            replies inside your chat widget and conversations.
          </span>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-40 h-11 bg-emerald-800 rounded-lg mt-2 hover:bg-emerald-900">
                <CirclePlus size="18" /> Add a domain
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-3xl rounded-2xl p-2 pb-5 bg-neutral-300"
              showCloseButton={false}
            >
              <div className=" relative w-full rounded-xl p-5 pt-4 border border-neutral-400 bg-neutral-50">
                <DialogClose className="absolute top-4 right-5 text-neutral-500 hover:text-neutral-700">
                  ✕
                </DialogClose>
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold tracking-tight text-emerald-800">
                    Import your Web Pages
                  </DialogTitle>
                  <DialogDescription className="text-sm text-neutral-500 leading-tight mt-0.5">
                    Connect your website by entering its main URL and any extra
                    public pages you want Cenra AI to learn from, such as /faq,
                    /docs, or /support. If you leave Additional Paths empty,
                    only your homepage will be imported.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={form.handleSubmit(handleFormSubmit)}
                  className="flex flex-col gap-4 mt-6"
                >
                  <Controller
                    name="domain"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Web Domain</FieldLabel>
                        <div className="border border-neutral-300 px-2 py-1 rounded-lg flex gap-2 items-center bg-neutral-100">
                          <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="https://www.yourdomain.com"
                            autoComplete="off"
                          />
                        </div>
                      </Field>
                    )}
                  />
                  <Controller
                    name="paths"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Additional Paths (Optional)
                        </FieldLabel>
                        <div className="border border-neutral-300 px-2 py-1 rounded-lg flex gap-2 items-center bg-neutral-100">
                          <Input
                            {...field}
                            id={field.name}
                            value={field.value ?? ""}
                            aria-invalid={fieldState.invalid}
                            placeholder="/faq, /docs, /support"
                            autoComplete="off"
                          />
                        </div>
                      </Field>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      disabled={
                        createWebResourceMutation.isPending ||
                        !form.formState.isDirty ||
                        !form.formState.isValid
                      }
                      type="submit"
                      className="h-11 mt-2 bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors duration-300"
                    >
                      {createWebResourceMutation.isPending ? (
                        <RotateCw className="size-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="size-4" />
                      )}
                      Import Your Website
                    </Button>
                  </DialogFooter>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {resources &&
        !isPending &&
        resources.map((resource: WebResource) => (
          <Collapsible
            open={openCollapsibles[resource.id] || false}
            onOpenChange={(isOpenState) =>
              setOpenCollapsibles((prev) => ({
                ...prev,
                [resource.id]: isOpenState,
              }))
            }
            className="w-full max-w-6xl flex flex-col bg-neutral-200/60 rounded-xl p-1"
            key={resource.id}
          >
            <div
              key={resource.id}
              className="rounded-xl w-full px-4 py-3.5 flex gap-5 items-center justify-between border border-neutral-300 bg-neutral-50"
            >
              <span className="font-semibold flex items-center gap-1.5 tracking-tight text-base text-neutral-700">
                <Globe className="size-4 text-emerald-700" /> {resource.url}
              </span>
              <span className="flex items-center gap-1.5 tracking-tight text-sm text-neutral-600 font-medium">
                <CloudCheckIcon className="size-4 text-emerald-700" />
                {(resource.webContent ?? []).length} pages crawled
              </span>
              <span className="flex items-center gap-1.5 tracking-tight text-sm text-emerald-700 font-medium">
                {handleTimeSince(resource.updatedAt)}
              </span>
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
              <div className="flex gap-3">
                <span className="border p-1.5 px-2 flex gap-3 rounded-xl border-neutral-300">
                  {/* Recrawl Content */}
                  <Dialog
                    open={openRecrawlDialogs[resource.id] || false}
                    onOpenChange={(isOpenState) => {
                      if (isOpenState || !crawlMutation.isPending) {
                        setOpenRecrawlDialogs((prev) => ({
                          ...prev,
                          [resource.id]: isOpenState,
                        }));
                      }
                    }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <button className="cursor-pointer">
                            <RotateCw
                              className="size-4 text-emerald-700"
                              strokeWidth={2}
                            />
                          </button>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Refresh Pages</p>
                      </TooltipContent>
                    </Tooltip>
                    <DialogContent
                      className="max-w-2xl rounded-2xl p-1.5 pb-5 bg-neutral-300"
                      showCloseButton={false}
                    >
                      <div className="flex flex-col gap-5 relative w-full rounded-xl p-5 border border-neutral-400 bg-neutral-50">
                        <DialogHeader>
                          <DialogTitle className="text-emerald-700 tracking-tight font-semibold">
                            Refresh all domain pages?
                          </DialogTitle>
                          <DialogDescription className="flex flex-col gap-1 mt-1 text-neutral-500 text-sm tracking-tight">
                            <span>
                              If your website content has changed, you can
                              refresh your domains to update the data Cenra uses
                              for answering questions. This will start a new
                              crawl and reindex your pages so your AI assistant
                              stays aligned with your latest content.
                            </span>
                            <span>
                              To ensure reliable performance, avoid triggering
                              refreshes too frequently.
                            </span>
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button
                            onClick={() =>
                              crawlMutation.mutate(
                                {
                                  workspaceId: workspace?.id!,
                                  resourceId: resource.id,
                                },
                                {
                                  onSuccess: () =>
                                    setOpenRecrawlDialogs((prev) => ({
                                      ...prev,
                                      [resource.id]: false,
                                    })),
                                },
                              )
                            }
                            type="submit"
                            disabled={crawlMutation.isPending}
                            className=" bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors duration-300"
                          >
                            <RotateCw
                              className={`size-3.5 ${crawlMutation.isPending ? "animate-spin" : ""}`}
                            />
                            Start Refreshing Domain
                          </Button>
                        </DialogFooter>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Delete Content */}
                  <Dialog>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <button className="cursor-pointer">
                            <Trash
                              className="size-4 text-red-600"
                              strokeWidth={2}
                            />
                          </button>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                    <DialogContent
                      className="max-w-2xl rounded-2xl p-1.5 pb-5 bg-neutral-300"
                      showCloseButton={false}
                    >
                      <div className="flex flex-col gap-4 relative w-full rounded-xl p-5 border border-neutral-400 bg-neutral-50">
                        <DialogHeader>
                          <DialogTitle className="text-neutral-600 tracking-tight font-medium">
                            Delete this domain?
                          </DialogTitle>
                          <DialogDescription className=" text-neutral-500 text-sm tracking-tight">
                            All crawled pages for this domain will be removed.
                            Cenra AI will lose knowledge about those removed
                            pages. You can still add this domain back again
                            later.
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
                            {deleteMutation.isPending ? (
                              <RotateCw className="size-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="size-3.5" />
                            )}
                            Yes, Delete Domain
                          </Button>
                        </DialogFooter>
                      </div>
                    </DialogContent>
                  </Dialog>
                </span>

                <CollapsibleTrigger asChild>
                  <button>
                    {openCollapsibles[resource.id] ? (
                      <ChevronDown className="transition-transform size-5.5" />
                    ) : (
                      <ChevronRight className="size-5.5" />
                    )}
                  </button>
                </CollapsibleTrigger>
              </div>
            </div>
            <CollapsibleContent>
              <div className="flex flex-col p-4 pt-0">
                {(resource.webContent ?? []).map((content) => (
                  <div
                    key={content.page}
                    className="mt-4 flex justify-between items-center"
                  >
                    <span className="tracking-tight text-neutral-600 font-semibold border py-1 px-2 border-dashed border-neutral-500 rounded-md">
                      {content.page}
                    </span>
                    <Dialog>
                      <DialogTrigger>
                        <div className="flex gap-1 items-center border border-neutral-300 rounded-lg p-1 px-2 text-sm text-neutral-600 hover:text-neutral-700 bg-neutral-100 hover:bg-neutral-200/50 cursor-pointer">
                          <span>Open</span>
                          <CircleArrowOutUpRight
                            strokeWidth={2.5}
                            className="size-3 inline"
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent
                        className="w-full p-0 max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-neutral-300 shadow-xl overflow-hidden"
                        showCloseButton={true}
                      >
                        <DialogHeader className="p-0 shrink-0">
                          <DialogTitle className="border-b border-neutral-300 text-center text-neutral-600 tracking-tight font-semibold py-4 bg-neutral-100 rounded-t-2xl">
                            {content.page}
                          </DialogTitle>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-neutral-300">
                          <div className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
                            {content.content}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
    </div>
  );
};
