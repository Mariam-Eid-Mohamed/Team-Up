import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "@/Pages/Auth/Login/Login";
import { loginUser } from "@/Services/Auth.service";

jest.mock("@/Services/Auth.service");

// Mock Google OAuth so tests don't depend on GoogleOAuthProvider
jest.mock("@react-oauth/google", () => ({
  GoogleLogin: () => null,
  GoogleOAuthProvider: ({ children }: any) => children,
}));

const renderWithRouter = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

describe("Login Component", () => {
  test("renders email input", () => {
    renderWithRouter();
    expect(screen.getByPlaceholderText("john@mail.com")).toBeInTheDocument();
  });

  test("calls loginUser on submit with valid data", async () => {
    (loginUser as jest.Mock).mockResolvedValue({
      data: { user: { role: "Student" } },
    });
    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText("john@mail.com"), {
      target: { value: "test@mail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: "test@mail.com",
        password: "123456",
        rememberMe: false,
      });
    });
  });
});
