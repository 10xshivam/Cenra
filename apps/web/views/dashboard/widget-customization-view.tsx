"use client";

import { useEffect, useMemo, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SquareInfo } from "@workspace/ui/components/icons";
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
import { RefreshCw } from "lucide-react";

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
    <div className="w-full h-full flex items-center p-16 flex-col gap-12">
      <div className="rounded-2xl w-full p-2 pb-5 max-w-6xl h-fit bg-neutral-200">
        <div className="flex flex-col gap-3.5 w-full h-full border border-neutral-400 rounded-xl p-5 bg-neutral-50">
          <span className="flex gap-1 text-2xl items-center text-emerald-800 font-semibold tracking-tight">
            {/* <SquareInfo size="18" />  */}
            Widget Customization
          </span>
          <p className="text-neutral-500 text-sm tracking-tight">
            Customize the appearance and behavior of your Cenra chat widget to match your brand and customer experience. Update branding, colors, greetings, and content cards so the widget feels native to your product.
          </p>
          <span className="text-neutral-500 text-sm tracking-tight">
            <span className="font-bold text-neutral-700">Tip</span>: Changes are saved automatically. Refresh the widget on your website to see the latest updates.
          </span>
            {updateMutation.isPending ? (
              <span className="text-sm flex items-center gap-1 text-neutral-400 tracking-tight ml-auto">
              <RefreshCw className="size-3.5 animate-spin" strokeWidth={2.5}/>
              Saving changes...
              </span>
            ) : (
              <span className="text-sm flex items-center gap-1 text-neutral-400 tracking-tight ml-auto">
              <RefreshCw  className="size-3.5" strokeWidth={2.5} />
              Autosave enabled
              </span>
            )}
        </div>
      </div>

      <div className="w-full max-w-6xl space-y-5">
        <form className="space-y-5" noValidate>
          <section className="rounded-2xl border border-neutral-400 border-dashed bg-neutral-100 p-2">
            <div className="rounded-xl border border-neutral-300 bg-neutral-50 p-6 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-neutral-700">
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
                      placeholder="Your company or product name"
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
                    className="border border-neutral-300 bg-white min-h-[92px] shadow-none resize-none text-neutral-600"
                    placeholder="Hi! How can I help you today?"
                  />
                  {fieldState.invalid ? (
                    <FieldError errors={[fieldState.error]} />
                  ) : null}
                </Field>
              )}
            />
            </div>
          </section>

          <section className="rounded-2xl border border-dashed border-neutral-400 bg-neutral-100 p-2">
            <div className="rounded-xl border border-neutral-300 bg-neutral-50 p-6 space-y-4">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-700">
                Theme
              </h2>
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
                        className="w-full border border-neutral-300 bg-white shadow-none"
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
                        className="w-10 rounded-full bg-white p-0 overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:border-none"
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
                        className="w-10 rounded-full border border-neutral-300 bg-white p-0 overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:border-none"
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
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-400 border-dashed bg-neutral-100 p-2">
            <div className="rounded-xl border border-neutral-300 bg-neutral-50 p-6 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-700">
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
                    className="rounded-xl border border-neutral-300 bg-neutral-100 p-4 space-y-3"
                  >
                    <p className="text-sm font-semibold tracking-tight text-neutral-700">
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
                            className="border border-neutral-300 bg-white min-h-[80px] resize-none text-neutral-600 shadow-none"
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
            </div>
          </section>

          <section className="rounded-2xl border border-dashed border-neutral-400 bg-neutral-100 p-2">
            <div className="rounded-xl border border-neutral-300 bg-neutral-50 p-6 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-700">
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
                    className="rounded-xl border border-neutral-300 bg-neutral-100 p-4 space-y-3"
                  >
                    <p className="text-sm font-semibold tracking-tight text-neutral-700">
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
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}
