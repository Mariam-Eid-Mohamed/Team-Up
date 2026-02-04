//test zod validations

import { LoginSchema, RegisterSchema } from "@/utilis/Validations/Validations";

describe("zod validation Tests", () => {
  test("Login schema rejects invalid email", () => {
    const result = LoginSchema.safeParse({
      email: "not-email",
      password: "123456",
    });
    expect(result.success).toBe(false);
  });

  test("Login schema accepts valid credentials", () => {
    const result = LoginSchema.safeParse({
      email: "valid@mail.com",
      password: "123456",
    });
    expect(result.success).toBe(true);
  });

  test("registration schema fails if passwords don't match", () => {
    const result = RegisterSchema.safeParse({
      first_name: "John",
      last_name: "Doe",
      username: "john_doe",
      email: "john@mail.com",
      password: "password123",
      confirmPassword: "password124",
      role: "Student",
    });
    expect(result.success).toBe(false);
  });

  test("registration schema accepts valid data", () => {
    const result = RegisterSchema.safeParse({
      first_name: "John",
      last_name: "Doe",
      username: "john_doe",
      email: "john@mail.com",
      password: "password123",
      confirmPassword: "password123",
      role: "Student",
    });
    expect(result.success).toBe(true);
  });
});
