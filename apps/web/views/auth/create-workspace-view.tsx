"use client";

import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Controller, useForm } from "react-hook-form";
import { LinkIcon, OfficeIcon } from "@workspace/ui/components/icons";
import { createWorkspaceSchema } from "@/schemas/createWorkspaceSchema";
import { useCreateWorkspace } from "@/hooks/useWorkspace";
import z from "zod";

export const CreateWorkspaceView = () => {
    const createWorkspaceMutation = useCreateWorkspace();
  const form = useForm({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      website: "",
    },
  });

  return (
    <div className=" h-full flex flex-col gap-9 justify-end">
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl tracking-tight font-medium text-neutral-700">
          Tell us a bit about your company
        </h2>
        <h3 className="text-sm text-neutral-400 ml-1">
          We’ll use this info to personalize your Cenra workspace.
          <br />
          No worries, you can always change it later.
        </h3>
      </div>
      <form
        onSubmit={form.handleSubmit((values: z.infer<typeof createWorkspaceSchema>) => createWorkspaceMutation.mutate(values))}
        className="flex flex-col gap-6 pl-1"
      >
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                What is the name of your company?
              </FieldLabel>
              <div className="border px-2.5 py-2 rounded-lg flex gap-2 items-center bg-neutral-100">
                <span className="w-fit p-1.5 bg-white rounded-md">
                  <OfficeIcon />
                </span>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Company name"
                  autoComplete="off"
                  className="border-none"
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="website"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                What is your website domain ?
              </FieldLabel>
              <div className="border px-2.5 py-2 rounded-lg flex gap-2 items-center bg-neutral-100">
                <span className="w-fit p-1.5 bg-white rounded-md">
                  <LinkIcon />
                </span>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="https://www.company.com"
                  autoComplete="off"
                  className="border-none"
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button
          type="submit"
          className=" h-12 mt-2 bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors duration-300"
            disabled={createWorkspaceMutation.isPending}
        >
          {createWorkspaceMutation.isPending ? "Creating..." : "Create Workspace"}
        </Button>
      </form>
    </div>
  );
};
