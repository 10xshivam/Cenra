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
import { IconBulbFilled } from "@tabler/icons-react";
import { sendSupportEmail } from "@/lib/send-support-email";
import { featureSchema, type FeatureFormValues } from "@/schemas/helpSchema";

export const FeatureRequestDialog = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<FeatureFormValues>({
    resolver: zodResolver(featureSchema),
    defaultValues: {
      name: "",
      email: "",
      title: "",
      description: "",
      priority: "medium",
    },
  });

  const onSubmit = async (values: FeatureFormValues) => {
    try {
      await sendSupportEmail({ type: "feature", ...values });
      toast.success("Feature request submitted. Thank you!");
      form.reset();
      setOpen(false);
    } catch (err) {
      toast.error(
        (err as Error).message || "Failed to submit request. Please try again.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex w-full justify-end mt-1">
        <DialogTrigger asChild>
          <Button className="h-9 px-4 text-sm font-medium bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg gap-1.5">
            <IconBulbFilled className="size-4 text-yellow-300" />
            Submit Feature Request
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
              Request a Feature
            </DialogTitle>
            <DialogDescription className="text-sm text-neutral-500 leading-tight mt-0.5">
              Share your idea and we&apos;ll look into adding it to the platform.
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
                  <FieldLabel htmlFor={field.name}>Feature Title</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="e.g. Dark mode for the dashboard"
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
                  <FieldLabel htmlFor={field.name}>Description / Use Case</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Describe what you'd like to see and why it would be useful..."
                    className="border border-neutral-300 bg-white px-3 shadow-none min-h-[100px] resize-none"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="priority"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="feature-priority">Priority</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="feature-priority"
                      className="w-full border border-neutral-300 bg-white shadow-none"
                    >
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - Nice to have</SelectItem>
                      <SelectItem value="medium">Medium - Would be helpful</SelectItem>
                      <SelectItem value="high">High - Critical for my workflow</SelectItem>
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
                Submit Request
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
