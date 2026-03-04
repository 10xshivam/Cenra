import { z } from "zod";

export const workspaceSettingsSchema = z.object({
    name: z.string().min(1, "Workspace name is required"),
    website: z
        .string()
        .url("Must be a valid URL (e.g. https://example.com)")
        .or(z.literal(""))
        .optional(),
});

export type WorkspaceSettingsFormValues = z.infer<typeof workspaceSettingsSchema>;
