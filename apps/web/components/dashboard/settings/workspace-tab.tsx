"use client";

import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { useUpdateWorkspace } from "@/hooks/useWorkspace";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workspaceSettingsSchema, WorkspaceSettingsFormValues } from "@/schemas/workspaceSettingsSchema";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Section } from "./section";

export const WorkspaceTab = () => {
    const { workspace } = useWorkspaceStore();
    const updateMutation = useUpdateWorkspace();

    const form = useForm<WorkspaceSettingsFormValues>({
        resolver: zodResolver(workspaceSettingsSchema),
        defaultValues: {
            name: workspace?.name ?? "",
            website: workspace?.website ?? "",
        },
    });

    useEffect(() => {
        form.reset({
            name: workspace?.name ?? "",
            website: workspace?.website ?? "",
        });
    }, [workspace, form]);

    const onSubmit = (values: WorkspaceSettingsFormValues) => {
        updateMutation.mutate(
            { name: values.name, website: values.website || undefined },
            {
                onSuccess: () => {
                    toast.success("Workspace updated successfully.");
                    form.reset(values);
                },
            },
        );
    };

    return (
        <div className="space-y-5">
            <Section
                title="General Information"
                description="Configure the basic details and settings for your workspace."
            >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Workspace Name</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        className="border border-neutral-300 bg-white px-3 shadow-none"
                                        placeholder="My Company"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="website"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Website</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        aria-invalid={fieldState.invalid}
                                        className="border border-neutral-300 bg-white px-3 shadow-none"
                                        placeholder="https://yourcompany.com"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Field className="md:col-span-2">
                            <FieldLabel htmlFor="workspaceId">Workspace ID</FieldLabel>
                            <Input
                                id="workspaceId"
                                value={workspace?.id ?? ""}
                                disabled
                                className="border border-neutral-200 bg-neutral-100 px-3 shadow-none text-neutral-500 font-mono text-xs cursor-not-allowed"
                            />
                            <p className="text-xs text-neutral-400 tracking-tight">
                                Read-only unique identifier for this workspace.
                            </p>
                        </Field>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            type="submit"
                            disabled={!form.formState.isDirty || updateMutation.isPending}
                             className="h-9 px-4 text-sm font-medium bg-emerald-800 border-2 border-b-4 border-emerald-700 hover:bg-emerald-900 text-white rounded-lg disabled:opacity-50 gap-1.5"
                        >
                            {updateMutation.isPending ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Save className="size-4" />
                            )}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Section>
        </div>
    );
};
