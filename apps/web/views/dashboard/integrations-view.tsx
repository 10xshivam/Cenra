"use client";

import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { Button } from "@workspace/ui/components/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@workspace/ui/components/dialog";
import { Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { codeToHtml } from "shiki";
import { integrations } from "@/constants/integrations.constants";

export const IntegrationsView = () => {
    const { workspace } = useWorkspaceStore();
    const workspaceId = workspace?.id || "your-workspace-id";
    const [selectedIntegration, setSelectedIntegration] = useState<typeof integrations[0] | null>(null);
    const [copiedScript, setCopiedScript] = useState(false);
    const [copiedId, setCopiedId] = useState(false);
    const [highlightedCode, setHighlightedCode] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedIntegration) {
            setHighlightedCode(null);
            return;
        }

        let isMounted = true;
        const code = selectedIntegration.getCode(workspaceId);

        async function highlight() {
            try {
                if (!selectedIntegration) return;
                const html = await codeToHtml(code, {
                    lang: selectedIntegration.lang as "html" | "tsx",
                    theme: "github-light",
                });
                if (isMounted) {
                    setHighlightedCode(html);
                }
            } catch (error) {
                console.error("Failed to highlight code:", error);
                if (isMounted) {
                    setHighlightedCode(`<pre><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`);
                }
            }
        }

        highlight();

        return () => {
            isMounted = false;
        };
    }, [selectedIntegration, workspaceId]);

    const handleCopyScript = async (code: string) => {
        await navigator.clipboard.writeText(code);
        setCopiedScript(true);
        setTimeout(() => setCopiedScript(false), 2000);
    };

    const handleCopyId = async (id: string) => {
        await navigator.clipboard.writeText(id);
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
    };

    return (
        <div className="w-full h-full flex items-center p-16 flex-col gap-8 md:gap-14">
           <div className="rounded-2xl w-full p-2 max-w-6xl h-fit bg-neutral-500/10 pb-6">
        <div  className="flex flex-col gap-2 w-full h-full border border-neutral-300 rounded-xl p-5 bg-white/60">
                    <span className="flex gap-1.5 text-2xl items-center text-emerald-800 font-semibold tracking-tight">
                        Integrations
                    </span>
                    <span className="text-neutral-500 text-sm tracking-tight leading-relaxed">
                        Embed the Cenra widget seamlessly into your website or web application to provide instant, AI-powered support for your users. Choose your platform below to get the tailored embed code for React, Next.js, or traditional HTML setups.
                    </span>
                    <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <span className="text-sm font-semibold tracking-tight text-neutral-700 w-24 shrink-0">
                            Workspace ID
                        </span>
                        <div className="flex-1 w-full  flex items-center gap-2">
                            <input
                                type="text"
                                readOnly
                                value={workspaceId}
                                className="w-full h-8 px-3 bg-white border border-neutral-300 rounded-md text-sm text-neutral-500 font-mono tracking-tight focus:outline-none"
                            />
                            <Button
                                onClick={() => handleCopyId(workspaceId)}
                                className="h-8 px-4 bg-emerald-800 border-2 border-b-4 border-emerald-700 hover:bg-emerald-900 text-white rounded-md shrink-0 transition-colors flex items-center gap-1.5 font-medium text-xs"
                            >
                                {copiedId ? (
                                    <><Check className="size-3.5" /> Copied</>
                                ) : (
                                    <><Copy className="size-3.5" /> Copy</>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((integration) => {
                    const Icon = integration.icon;
                    return (
                        <div
                            key={integration.id}
                            onClick={() => {
                                setSelectedIntegration(integration);
                                setCopiedScript(false);
                            }}
                            className="rounded-xl w-full px-5 py-4 flex flex-col gap-2.5 border border-dashed border-neutral-300 bg-white/50 hover:bg-white/70 hover:border-neutral-400 hover:shadow-sm cursor-pointer transition-all"
                        >
                            <div className="flex items-center gap-2.5">
                                <Icon className="size-5 text-emerald-700" />
                                <h3 className="font-semibold text-neutral-700 tracking-tight text-base">
                                    {integration.name}
                                </h3>
                            </div>
                            <p className="text-sm text-neutral-500 tracking-tight">
                                {integration.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            <Dialog open={!!selectedIntegration} onOpenChange={(open) => !open && setSelectedIntegration(null)}>
                <DialogContent
                    className="w-full p-0 max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-neutral-300 shadow-xl overflow-hidden gap-0"
                    showCloseButton={true}
                >
                    <DialogHeader className="p-0 shrink-0">
                        <DialogTitle className="border-b border-neutral-300 text-center text-neutral-600 tracking-tight font-semibold py-4 bg-neutral-100 rounded-t-2xl">
                            {selectedIntegration?.name} Integration
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-neutral-300 flex flex-col gap-5">
                        <p className="text-sm text-neutral-600 tracking-tight">
                            Follow these instructions to add the Cenra widget to your {selectedIntegration?.name} application.
                        </p>

                        <div className="relative rounded-lg overflow-hidden border border-neutral-300 bg-neutral-50 shadow-sm">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-300 bg-neutral-100">
                                <div className="flex gap-2 items-center">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                                    </div>
                                    <span className="text-xs font-semibold text-neutral-500 tracking-tight ml-2 border px-1.5 py-0.5 rounded border-neutral-300 bg-white">Snippet</span>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 tracking-tight px-2 cursor-pointer border border-neutral-300"
                                    onClick={() => selectedIntegration && handleCopyScript(selectedIntegration.getCode(workspaceId))}
                                >
                                    {copiedScript ? (
                                        <><Check className="size-3 text-emerald-600" strokeWidth={2.5} /> <span className="text-emerald-700 font-medium">Copied!</span></>
                                    ) : (
                                        <><Copy className="size-3 text-emerald-600" strokeWidth={2.5} /> Copy Code</>
                                    )}
                                </Button>
                            </div>
                            <div className="text-[13px] font-mono leading-relaxed [&>div>pre]:!bg-white [&>div>pre]:p-5 [&>div>pre]:m-0 [&>div>pre]:overflow-x-auto [&_code]:[counter-reset:line] [&_.line::before]:[counter-increment:line] [&_.line::before]:[content:counter(line)] [&_.line::before]:inline-block [&_.line::before]:w-4 [&_.line::before]:mr-4 [&_.line::before]:text-right [&_.line::before]:text-neutral-400 [&_.line::before]:select-none">
                                {highlightedCode ? (
                                    <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                                ) : (
                                    <pre className="p-5 text-neutral-800 bg-white overflow-x-auto no-scrollbar">
                                        <code>{selectedIntegration?.getCode(workspaceId)}</code>
                                    </pre>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
