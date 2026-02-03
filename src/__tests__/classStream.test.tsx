import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ClassStream from "@/Pages/Instructor/Home/ClassStream";
import { GetClassPosts } from "@/Services/class Endpoints/Endpoints";
import { getClassAnnouncements } from "@/Services/announcement Endpoints/Endpoints";
import { getToken } from "@/utilis/token";

jest.mock("@/Services/class Endpoints/Endpoints", () => ({
  GetClassPosts: jest.fn(),
}));

jest.mock("@/Services/announcement Endpoints/Endpoints", () => ({
  getClassAnnouncements: jest.fn(),
}));

jest.mock("@/utilis/token", () => ({
  getToken: jest.fn(),
}));

jest.mock("@/components/ClassStream/CourseHeader", () => () => (
  <div>CourseHeader</div>
));

jest.mock("@/components/ClassStream/SectionDropdown", () => () => (
  <div>SectionDropdown</div>
));

jest.mock("@/components/ClassStream/ActionButtons", () => ({
  __esModule: true,
  default: ({ onPostCreated }: any) => (
    <button onClick={onPostCreated}>Refresh Posts</button>
  ),
}));

jest.mock("@/components/ClassStream/PostCard", () => ({
  __esModule: true,
  default: ({ post }: any) => (
    <div data-testid="post-card">{post.announcement_text}</div>
  ),
}));

describe("ClassStream", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRoute = () => {
    return render(
      <MemoryRouter initialEntries={["/instructor/classes/123/stream"]}>
        <Routes>
          <Route path="/instructor/classes/:id/stream" element={<ClassStream />} />
        </Routes>
      </MemoryRouter>,
    );
  };

  test("shows auth error when no token", async () => {
    (getToken as jest.Mock).mockReturnValue(null);

    renderWithRoute();

    await waitFor(() => {
      expect(screen.getByText("Authentication required")).toBeInTheDocument();
    });
  });

  test("renders posts from announcements and courseworks", async () => {
    (getToken as jest.Mock).mockReturnValue("token");
    (getClassAnnouncements as jest.Mock).mockResolvedValue({
      data: {
        data: [
          {
            _id: "a1",
            authorId: { _id: "i1", name: "Dr. John Doe" },
            announcement_text: "Announcement 1",
            createdAt: "2024-01-01T00:00:00.000Z",
          },
        ],
      },
    });

    (GetClassPosts as jest.Mock).mockResolvedValue({
      data: {
        posts: [
          {
            _id: "p1",
            type: "COURSEWORK",
            createdAt: "2024-01-02T00:00:00.000Z",
          },
        ],
      },
    });

    renderWithRoute();

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByTestId("post-card").length).toBeGreaterThan(0);
    });
  });
});

