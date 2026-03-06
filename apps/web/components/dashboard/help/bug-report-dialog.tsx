"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Send, X } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Textarea } from "@workspace/ui/components/textarea";
import { IconBugFilled } from "@tabler/icons-react";
import { sendSupportEmail } from "@/lib/send-support-email";
import { bugSchema, type BugFormValues } from "@/schemas/helpSchema";

export const BugReportDialog = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<BugFormValues>({
    resolver: zodResolver(bugSchema),
    defaultValues: {
      name: "",
      email: "",
      title: "",
      description: "",
      steps: "",
      severity: "medium",
    },
  });

  const onSubmit = async (values: BugFormValues) => {
    try {
      await sendSupportEmail({ type: "bug", ...values, priority: values.severity });
      toast.success("Bug report submitted. We will look into it shortly.");
      form.reset();
      setOpen(false);
    } catch (err) {
      toast.error(
        (err as Error).message || "Failed to submit bug report. Please try again.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex w-full justify-end">
        <DialogTrigger asChild>
          <Button className="h-9 px-4 text-sm font-medium bg-neutral-900 hover:bg-neutral-700 text-white rounded-lg gap-1.5">
            <IconBugFilled className="size-4 text-red-500" />
            Open Bug Report
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent
        className="max-w-3xl rounded-2xl p-2 pb-5 bg-neutral-300"
        showCloseButton={false}
      >
        <div className="relative w-full rounded-xl p-5 pt-4 border border-neutral-400 bg-neutral-50">
          <DialogClose className="absolute top-4 right-5 text-neutral-500 hover:text-neutral-700">
            <X className="size-4" />
          </DialogClose>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold tracking-tight text-emerald-800">
              Report a Bug
            </DialogTitle>
            <DialogDescription className="text-sm text-neutral-500 leading-tight mt-0.5">
              Describe the issue and we&apos;ll work to fix it as soon as possible.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-6"
            noValidate
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Your Name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="John Doe"
                      className="border border-neutral-300 bg-white px-3 shadow-none"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      placeholder="john@example.com"
                      className="border border-neutral-300 bg-white px-3 shadow-none"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Bug Title</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="e.g. Inbox messages not loading on mobile"
                    className="border border-neutral-300 bg-white px-3 shadow-none"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>What happened?</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Describe the unexpected behaviour you encountered..."
                    className="border border-neutral-300 bg-white px-3 shadow-none min-h-[90px] resize-none"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="steps"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Steps to Reproduce (optional)</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder={"1. Go to...\n2. Click on...\n3. See error"}
                    className="border border-neutral-300 bg-white px-3 shadow-none min-h-[80px] resize-none"
                  />
                </Field>
              )}
            />

            <Controller
              name="severity"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="bug-severity">Severity</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="bug-severity"
                      className="w-full border border-neutral-300 bg-white shadow-none"
                    >
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Minor visual issue</SelectItem>
                      <SelectItem value="medium">Medium - Affects usability</SelectItem>
                      <SelectItem value="high">High - Major feature broken</SelectItem>
                      <SelectItem value="critical">Critical - App unusable</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="h-9 px-4 text-sm font-medium bg-neutral-900 hover:bg-neutral-700 text-white rounded-lg gap-1.5"
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                Submit Report
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
