import { z } from "zod";

const supportedDeliverableTypes = [
  ".pdf",
  ".docx",
  ".pptx",
  ".xlsx",
  ".zip",
  ".txt",
  ".py",
  ".jpg",
  ".jpeg",
  ".png",
] as const;

export const TaskSchema = z.object({
  taskName: z
    .string()
    .trim()
    .min(3, "Task name must be at least 3 characters")
    .max(100, "Task name cannot exceed 100 characters"),

  taskDescription: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),

  deadline: z.string().min(1, "Deadline is required"),

  deliverableType: z
    .string()
    .refine((value) => supportedDeliverableTypes.includes(value as any), {
      message: "Invalid deliverable type",
    }),

  assignee: z.string().optional(),
});

export type TaskInputs = z.infer<typeof TaskSchema>;
