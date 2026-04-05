"use client";

import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Controller, useForm } from "react-hook-form";
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
    <div className="w-fit h-full flex flex-col items-center justify-center border border-neutral-300 border-dashed p-7 bg-white/40">
      <div className="w-full max-w-md flex flex-col">
        <div className="mb-7 flex flex-col gap-3">
          <h2 className="text-3xl md:text-4xl tracking-tight font-medium text-neutral-700 font-serif ">
            Tell us a bit about your company
          </h2>
          <h3 className="hidden md:block text-sm text-neutral-400 ml-0.5">
            We'll use this info to personalize your Cenra workspace.
            <br />
            No worries, you can always change it later.
          </h3>
        </div>
        <form
          onSubmit={form.handleSubmit((values: z.infer<typeof createWorkspaceSchema>) =>
            createWorkspaceMutation.mutate(values)
          )}
          className="flex flex-col gap-5"
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <FieldLabel htmlFor={field.name} className="text-xs">
                  What is the name of your company?
                </FieldLabel>
                <div className="border border-neutral-300 px-2.5 py-1 flex gap-2 items-center">
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Company name"
                    autoComplete="off"
                    className="border-none bg-transparent"
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
              <Field data-invalid={fieldState.invalid} className="gap-2">
                <FieldLabel htmlFor={field.name} className="text-xs">
                  What is your website domain ?
                </FieldLabel>
                <div className="border border-neutral-300 px-2.5 py-1 flex gap-2 items-center">
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="https://www.company.com"
                    autoComplete="off"
                    className="border-none bg-transparent"
                  />
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button
            type="submit"
            className="w-full h-12 mt-2 bg-emerald-800 hover:bg-emerald-900 rounded-none transition-colors duration-300"
            disabled={createWorkspaceMutation.isPending}
          >
            {createWorkspaceMutation.isPending ? "Creating..." : "Create Workspace"}
          </Button>
        </form>
      </div>
    </div>
  );
};
