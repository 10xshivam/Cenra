"use client";

import { useEffect, useMemo, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@workspace/ui/components/input";
import { Switch } from "@workspace/ui/components/switch";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { useWorkspace } from "@/hooks/useWorkspace";
import {
  WidgetSection,
  WidgetSettingsPayload,
} from "@/lib/api/widget-settings";
import {
  useUpdateWidgetSettings,
  useWidgetSettings,
} from "@/hooks/useWidgetSettings";
import {
  WidgetCustomizationFormValues,
  widgetCustomizationSchema,
} from "@/schemas/widgetCustomizationSchema";

const buildSection = (
  section: WidgetSection | null,
  withDescription: boolean
): WidgetCustomizationFormValues["whatsNewSection"] => ({
  enabled: Boolean(section),
  title: section?.title ?? "",
  items: [0, 1].map((index) => ({
    title: section?.items?.[index]?.title ?? "",
    description: withDescription
      ? section?.items?.[index]?.description ?? ""
      : undefined,
    linkLabel: section?.items?.[index]?.linkLabel ?? "",
    linkUrl: section?.items?.[index]?.linkUrl ?? "",
  })),
});

const getColorValue = (value: string) =>
  /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(value) ? value : "#000000";

const normalizeUrlForSave = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

export default function WidgetCustomizationView() {
  const { data: workspace } = useWorkspace();
  const workspaceId = workspace?.id;

  const { data } = useWidgetSettings(workspaceId);
  const updateMutation = useUpdateWidgetSettings(workspaceId);

  const values = useMemo<WidgetCustomizationFormValues>(
    () => ({
      brandName: data?.brandName ?? workspace?.name ?? "",
      companyLogoUrl: data?.companyLogoUrl ?? "",
      greetMessage: data?.greetMessage ?? "",
      themeMode: data?.themeMode === "dark" ? "dark" : "light",
      gradientFrom: data?.gradientFrom ?? "",
      themeColor: data?.themeColor ?? "",
      whatsNewSection: buildSection(data?.whatsNewSection ?? null, true),
      featuredArticlesSection: buildSection(
        data?.featuredArticlesSection ?? null,
        false
      ),
    }),
    [data, workspace?.name]
  );

  const form = useForm<WidgetCustomizationFormValues>({
    resolver: zodResolver(widgetCustomizationSchema),
    values,
  });
  const watchedValues = useWatch({ control: form.control });
  const lastSavedPayloadRef = useRef<string>("");

  const watchWhatsNewEnabled = form.watch("whatsNewSection.enabled");
  const watchFeaturedEnabled = form.watch("featuredArticlesSection.enabled");

  useEffect(() => {
    if (!workspaceId || !watchedValues) return;
    if (!form.formState.isDirty) return;

    const timeout = setTimeout(async () => {
      const isValid = await form.trigger();
      if (!isValid || updateMutation.isPending) return;

      const parsed = widgetCustomizationSchema.safeParse(watchedValues);
      if (!parsed.success) return;
      const formValues = parsed.data;

      const payload: WidgetSettingsPayload = {
        brandName: formValues.brandName,
        companyLogoUrl: normalizeUrlForSave(formValues.companyLogoUrl),
        greetMessage: formValues.greetMessage,
        themeMode: formValues.themeMode,
        gradientFrom: formValues.gradientFrom,
        themeColor: formValues.themeColor,
        whatsNewSection: formValues.whatsNewSection.enabled
          ? formValues.whatsNewSection
          : null,
        featuredArticlesSection: formValues.featuredArticlesSection.enabled
          ? formValues.featuredArticlesSection
          : null,
      };

      const payloadKey = JSON.stringify(payload);
      if (payloadKey === lastSavedPayloadRef.current) return;

      try {
        await updateMutation.mutateAsync(payload);
        lastSavedPayloadRef.current = payloadKey;
        form.reset(formValues);
      } catch (error) {
        toast.error(
          `Failed to save customization: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }, 700);

    return () => clearTimeout(timeout);
  }, [
    workspaceId,
    watchedValues,
    form,
    updateMutation,
    form.formState.isDirty,
  ]);

  return (
    <div className="w-full h-full p-10 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-800">
            Widget Customization
          </h1>
          <p className="mt-2 text-lg text-neutral-600">
            Customize how your chat widget looks and behaves for your
            customers.
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            {updateMutation.isPending ? "Saving changes..." : "Autosave enabled"}
          </p>
        </div>

        <form className="space-y-6" noValidate>
          <section className="rounded-2xl border border-neutral-300 bg-white p-6 space-y-4">
            <h2 className="text-xl font-semibold text-neutral-800">
              Brand and Messages
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="brandName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Brand Name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      className="border border-neutral-300 bg-white px-3"
                      placeholder="Cenra"
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                name="companyLogoUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Company Logo URL</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      className="border border-neutral-300 bg-white px-3"
                      placeholder="https://your-domain.com/logo.png"
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="greetMessage"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Greeting Message</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className="border border-neutral-300 bg-white min-h-[92px]"
                    placeholder="Hi! How can I help you today?"
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />
          </section>

          <section className="rounded-2xl border border-neutral-300 bg-white p-6 space-y-4">
            <h2 className="text-xl font-semibold text-neutral-800">Theme</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Controller
                name="themeMode"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="theme-mode">Mode</FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value: "light" | "dark") =>
                        field.onChange(value)
                      }
                    >
                      <SelectTrigger
                        id="theme-mode"
                        className="w-full border border-neutral-300 bg-white"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              <Controller
                name="gradientFrom"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Gradient From</FieldLabel>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={getColorValue(field.value)}
                        onChange={field.onChange}
                        className="h-10 w-14 border border-neutral-300 bg-white p-1"
                      />
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        className="border border-neutral-300 bg-white px-3"
                        placeholder="#052e2b"
                      />
                    </div>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                name="themeColor"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Theme Color</FieldLabel>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={getColorValue(field.value)}
                        onChange={field.onChange}
                        className="h-10 w-14 border border-neutral-300 bg-white p-1"
                      />
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        className="border border-neutral-300 bg-white px-3"
                        placeholder="#047857"
                      />
                    </div>
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-300 bg-white p-6 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-neutral-800">
                What&apos;s New Section
              </h2>
              <Controller
                name="whatsNewSection.enabled"
                control={form.control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label="Enable What's New section"
                  />
                )}
              />
            </div>

            {watchWhatsNewEnabled ? (
              <>
                <Controller
                  name="whatsNewSection.title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Section Title</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        className="border border-neutral-300 bg-white px-3"
                        placeholder="What's New"
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : null}
                    </Field>
                  )}
                />

                {[0, 1].map((index) => (
                  <div
                    key={`whats-new-${index}`}
                    className="rounded-xl border border-neutral-200 p-4 space-y-3"
                  >
                    <p className="text-sm font-semibold text-neutral-700">
                      Card {index + 1}
                    </p>
                    <Controller
                      name={`whatsNewSection.items.${index}.title`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <Input
                            {...field}
                            aria-invalid={fieldState.invalid}
                            className="border border-neutral-300 bg-white px-3"
                            placeholder={`Card ${index + 1} title`}
                          />
                          {fieldState.invalid ? (
                            <FieldError errors={[fieldState.error]} />
                          ) : null}
                        </Field>
                      )}
                    />
                    <Controller
                      name={`whatsNewSection.items.${index}.description`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <Textarea
                            {...field}
                            value={field.value ?? ""}
                            aria-invalid={fieldState.invalid}
                            className="border border-neutral-300 bg-white min-h-[80px]"
                            placeholder={`Card ${index + 1} description`}
                          />
                          {fieldState.invalid ? (
                            <FieldError errors={[fieldState.error]} />
                          ) : null}
                        </Field>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Controller
                        name={`whatsNewSection.items.${index}.linkLabel`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <Input
                              {...field}
                              aria-invalid={fieldState.invalid}
                              className="border border-neutral-300 bg-white px-3"
                              placeholder="Link label"
                            />
                            {fieldState.invalid ? (
                              <FieldError errors={[fieldState.error]} />
                            ) : null}
                          </Field>
                        )}
                      />
                      <Controller
                        name={`whatsNewSection.items.${index}.linkUrl`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <Input
                              {...field}
                              aria-invalid={fieldState.invalid}
                              className="border border-neutral-300 bg-white px-3"
                              placeholder="https://example.com"
                            />
                            {fieldState.invalid ? (
                              <FieldError errors={[fieldState.error]} />
                            ) : null}
                          </Field>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </>
            ) : null}
          </section>

          <section className="rounded-2xl border border-neutral-300 bg-white p-6 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-neutral-800">
                Featured Articles Section
              </h2>
              <Controller
                name="featuredArticlesSection.enabled"
                control={form.control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label="Enable Featured Articles section"
                  />
                )}
              />
            </div>

            {watchFeaturedEnabled ? (
              <>
                <Controller
                  name="featuredArticlesSection.title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Section Title</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        className="border border-neutral-300 bg-white px-3"
                        placeholder="Featured Articles"
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : null}
                    </Field>
                  )}
                />

                {[0, 1].map((index) => (
                  <div
                    key={`featured-${index}`}
                    className="rounded-xl border border-neutral-200 p-4 space-y-3"
                  >
                    <p className="text-sm font-semibold text-neutral-700">
                      Article {index + 1}
                    </p>
                    <Controller
                      name={`featuredArticlesSection.items.${index}.title`}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <Input
                            {...field}
                            aria-invalid={fieldState.invalid}
                            className="border border-neutral-300 bg-white px-3"
                            placeholder={`Article ${index + 1} title`}
                          />
                          {fieldState.invalid ? (
                            <FieldError errors={[fieldState.error]} />
                          ) : null}
                        </Field>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Controller
                        name={`featuredArticlesSection.items.${index}.linkLabel`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <Input
                              {...field}
                              aria-invalid={fieldState.invalid}
                              className="border border-neutral-300 bg-white px-3"
                              placeholder="Link label"
                            />
                            {fieldState.invalid ? (
                              <FieldError errors={[fieldState.error]} />
                            ) : null}
                          </Field>
                        )}
                      />
                      <Controller
                        name={`featuredArticlesSection.items.${index}.linkUrl`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <Input
                              {...field}
                              aria-invalid={fieldState.invalid}
                              className="border border-neutral-300 bg-white px-3"
                              placeholder="https://example.com"
                            />
                            {fieldState.invalid ? (
                              <FieldError errors={[fieldState.error]} />
                            ) : null}
                          </Field>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </>
            ) : null}
          </section>
        </form>
      </div>
    </div>
  );
}
