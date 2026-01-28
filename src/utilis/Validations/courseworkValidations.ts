import { z } from "zod";

export const CreateCourseworkSchema = z
  .object({
    name: z.string().min(1, "Coursework name is required"),

    deadline: z.string().min(1, "Deadline is required"),

    grade: z
      .string()
      .optional()
      .refine(
        (v) => !v || (!isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100),
        "Grade must be between 0 and 100"
      ),

    teamMin: z
      .string()
      .optional()
      .refine(
        (v) => !v || (!isNaN(Number(v)) && Number(v) >= 1),
        "Min team size must be at least 1"
      ),

    teamMax: z
      .string()
      .optional()
      .refine(
        (v) => !v || (!isNaN(Number(v)) && Number(v) >= 1),
        "Max team size must be at least 1"
      ),

    discussionDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.teamMin && data.teamMax) {
        return Number(data.teamMin) <= Number(data.teamMax);
      }
      return true;
    },
    {
      path: ["teamMax"],
      message: "Max team size must be ≥ min team size",
    }
  );

export type CreateCourseworkInputs = z.infer<typeof CreateCourseworkSchema>;
