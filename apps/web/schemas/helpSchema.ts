import { z } from "zod";

export const featureSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Please describe the feature in more detail"),
  priority: z.enum(["low", "medium", "high"]),
});

export const bugSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Please describe the bug in more detail"),
  steps: z.string().optional(),
  severity: z.enum(["low", "medium", "high", "critical"]),
});

export type FeatureFormValues = z.infer<typeof featureSchema>;
export type BugFormValues = z.infer<typeof bugSchema>;
