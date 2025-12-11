import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "@/Pages/Auth/Register/Register";
import { registerUser } from "@/Services/Auth.service";

jest.mock("@/Services/Auth.service");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Register Component", () => {
  test("submits valid data and calls registerUser", async () => {
    (registerUser as jest.Mock).mockResolvedValue({
      status: "success",
    });

    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText("John"), {
      target: { value: "John" },
    });

    fireEvent.change(screen.getByPlaceholderText("Doe"), {
      target: { value: "Doe" },
    });

    fireEvent.change(screen.getByPlaceholderText("john@mail.com"), {
      target: { value: "john@mail.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password123" },
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "password123" },
    });

    // role select defaults to "Student", no need to change it here

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        first_name: "John",
        last_name: "Doe",
        email: "john@mail.com",
        username: "john",
        password: "password123",
        role: "Student",
        rememberMe: false,
      });
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});

