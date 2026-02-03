import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { InstructorDashboard } from "@/Pages/Instructor/Home/Home";
import { getUserClasses } from "@/Services/class Endpoints/Endpoints";
import { getToken, getUserId } from "@/utilis/token";

jest.mock("@/Services/class Endpoints/Endpoints", () => ({
  getUserClasses: jest.fn(),
}));

jest.mock("@/utilis/token", () => ({
  getToken: jest.fn(),
  getUserId: jest.fn(),
}));

jest.mock("@/components/ClassCard/ClassCard", () => ({
  ClassCard: ({ classData }: any) => (
    <div data-testid="class-card">{classData.name}</div>
  ),
}));

jest.mock("@/components/CreateClassForm/CreateClassForm", () => ({
  CreateClassForm: ({ onCancel }: any) => (
    <div>
      <span>CreateClassForm</span>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

jest.mock("@/components/InviteStudentModal/InviteStudentModal", () => ({
  InviteStudentsModal: ({ isOpen }: any) =>
    isOpen ? <div>Invite Modal</div> : null,
}));

describe("InstructorDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows auth error when token or userId is missing", async () => {
    (getToken as jest.Mock).mockReturnValue(null);
    (getUserId as jest.Mock).mockReturnValue(null);

    render(
      <MemoryRouter>
        <InstructorDashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Authentication required. Please login again."),
      ).toBeInTheDocument();
    });
  });

  test("renders class cards when data is returned", async () => {
    (getToken as jest.Mock).mockReturnValue("token");
    (getUserId as jest.Mock).mockReturnValue("user-1");
    (getUserClasses as jest.Mock).mockResolvedValue({
      data: {
        success: true,
        data: [
          {
            _id: "c1",
            course_name: "Class 1",
            course_code: "C1",
            course_plan: "Plan",
            year: 2024,
            studentsCount: 10,
            teamsCount: 2,
            instructorsCount: 1,
            class_color: "bg-red-500",
          },
        ],
      },
    });

    render(
      <MemoryRouter>
        <InstructorDashboard />
      </MemoryRouter>,
    );

    expect(screen.getByText("Loading classes...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("class-card")).toBeInTheDocument();
      expect(screen.getByText("Class 1")).toBeInTheDocument();
    });
  });

  test("shows empty state when there are no classes", async () => {
    (getToken as jest.Mock).mockReturnValue("token");
    (getUserId as jest.Mock).mockReturnValue("user-1");
    (getUserClasses as jest.Mock).mockResolvedValue({
      data: { success: true, data: [] },
    });

    render(
      <MemoryRouter>
        <InstructorDashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("No classes found.")).toBeInTheDocument();
    });
  });

  test("can toggle create class form", async () => {
    (getToken as jest.Mock).mockReturnValue(null);
    (getUserId as jest.Mock).mockReturnValue(null);

    render(
      <MemoryRouter>
        <InstructorDashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("Authentication required. Please login again."),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Create Class"));
    expect(screen.getByText("CreateClassForm")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("CreateClassForm")).not.toBeInTheDocument();
  });
});

