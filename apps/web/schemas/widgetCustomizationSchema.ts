import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .refine(
    (value) =>
      value.length === 0 ||
      /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(?:[\/?#]\S*)?$/i.test(value),
    "Enter a valid URL"
  );

const sectionItemSchema = z.object({
  title: z.string().trim(),
  description: z.string().trim().optional(),
  linkLabel: z.string().trim(),
  linkUrl: optionalUrl,
});

const sectionSchema = z.object({
  enabled: z.boolean(),
  title: z.string().trim(),
  items: z.array(sectionItemSchema).length(2),
});

export const widgetCustomizationSchema = z.object({
  brandName: z.string().trim().min(1, "Brand name is required"),
  companyLogoUrl: optionalUrl,
  greetMessage: z.string().trim().min(1, "Greeting message is required"),
  themeMode: z.enum(["light", "dark"]),
  gradientFrom: z.string().trim().min(1, "Gradient from is required"),
  themeColor: z.string().trim().min(1, "Theme color is required"),
  whatsNewSection: sectionSchema,
  featuredArticlesSection: sectionSchema,
}).superRefine((value, ctx) => {
  if (value.whatsNewSection.enabled) {
    if (!value.whatsNewSection.title.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Section title is required",
        path: ["whatsNewSection", "title"],
      });
    }

    value.whatsNewSection.items.forEach((item, index) => {
      if (!item.title.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Card title is required",
          path: ["whatsNewSection", "items", index, "title"],
        });
      }
      if (!(item.description ?? "").trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Card description is required",
          path: ["whatsNewSection", "items", index, "description"],
        });
      }
      if (!item.linkLabel.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Link label is required",
          path: ["whatsNewSection", "items", index, "linkLabel"],
        });
      }
    });
  }

  if (value.featuredArticlesSection.enabled) {
    if (!value.featuredArticlesSection.title.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Section title is required",
        path: ["featuredArticlesSection", "title"],
      });
    }

    value.featuredArticlesSection.items.forEach((item, index) => {
      if (!item.title.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Article title is required",
          path: ["featuredArticlesSection", "items", index, "title"],
        });
      }
      if (!item.linkLabel.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Link label is required",
          path: ["featuredArticlesSection", "items", index, "linkLabel"],
        });
      }
    });
  }
});

export type WidgetCustomizationFormValues = z.infer<
  typeof widgetCustomizationSchema
>;
