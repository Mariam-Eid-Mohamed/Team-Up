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
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters"),
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

/* CREATE CLASS SCHEMA */
export const CreateClassSchema = z.object({
  name: z.string().min(3, "Class name must be at least 3 characters"),
  code: z.string().min(5, "Class code must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  year: z.string().min(1, "Semester is required"),
  color: z.string().min(1, "Theme color is required"),
});

/* TYPES */
export type CreateClassInputs = z.infer<typeof CreateClassSchema>;

/* JOIN CLASS SCHEMA */
export const JoinClassSchema = z.object({
  classCode: z
    .string()
    .min(1, "Class code is required")
    .length(6, "Class code must be exactly 6 characters"),
});

/* TYPES */
export type JoinClassInputs = z.infer<typeof JoinClassSchema>;

/* SEARCH USERNAME SCHEMA */
export const SearchUsernameSchema = z.object({
  username: z
    .string()
    .refine(
      (val) => !val || val.trim().length === 0 || val.trim().length >= 3,
      { message: "Username must be at least 3 characters" }
    ),
});

/* TYPES */
export type SearchUsernameInputs = z.infer<typeof SearchUsernameSchema>;
