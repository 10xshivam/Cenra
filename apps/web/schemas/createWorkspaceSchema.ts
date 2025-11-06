import z from "zod";

export const createWorkspaceSchema = z.object({
    name: z.string().min(2, "Company name must be at least 2 characters long"),
    website: z.string().url("Invalid website URL"),
});