// ../../../utilis/Validations/Validations.ts
import { z } from "zod";

/* LOGIN SCHEMA */
export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/* REGISTER SCHEMA */
export const RegisterSchema = z
  .object({
    first_name: z.string().min(1, "First Name is required"),
    last_name: z.string().min(1, "Last Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
    role: z.enum(
      ["Instructor", "Student"],
      "Role must be Instructor or Student"
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"], // show error under confirmPassword
  });

/* TYPES */
export type LoginInputs = z.infer<typeof LoginSchema>;
export type RegisterInputs = z.infer<typeof RegisterSchema>;

// Modals schema
// 1)create new coursework
