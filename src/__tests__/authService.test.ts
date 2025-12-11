import Api from "../Services/Api";
import { loginUser, registerUser, googleAuth } from "@/Services/Auth.service";

jest.mock("../Services/Api");

describe("Auth service tests", () => {
  test("loginUser calls correct API endpoint", async () => {
    (Api.post as jest.Mock).mockResolvedValue({ data: { status: "success" } });

    await loginUser({
      email: "test@gmail.com",
      password: "123456",
      rememberMe: false,
    });

    expect(Api.post).toHaveBeenCalledWith("/auth/login", {
      email: "test@gmail.com",
      password: "123456",
      rememberMe: false,
    });
  });

  test("registerUser sends correct data", async () => {
    (Api.post as jest.Mock).mockResolvedValue({ data: { status: "success" } });

    await registerUser({
      first_name: "John",
      last_name: "Doe",
      email: "john@gmail.com",
      username: "john",
      password: "password123",
      role: "Student",
      rememberMe: true,
    });

    expect(Api.post).toHaveBeenCalledWith("/auth/register", {
      first_name: "John",
      last_name: "Doe",
      email: "john@gmail.com",
      username: "john",
      password: "password123",
      role: "Student",
      rememberMe: true,
    });
  });

  test("googleAuth calls /auth/google with token and optional fields", async () => {
    (Api.post as jest.Mock).mockResolvedValue({ data: { status: "success" } });

    await googleAuth({
      token: "google-id-token",
      role: "Student",
      first_name: "John",
      last_name: "Doe",
      username: "john",
    });

    expect(Api.post).toHaveBeenCalledWith("/auth/google", {
      token: "google-id-token",
      role: "Student",
      first_name: "John",
      last_name: "Doe",
      username: "john",
    });
  });
});
