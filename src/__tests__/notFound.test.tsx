import { render, screen } from "@testing-library/react";
import NotFound from "@/Pages/NotFound/NotFound";

describe("NotFound page", () => {
  test("renders not found text", () => {
    render(<NotFound />);
    expect(screen.getByText("NotFound")).toBeInTheDocument();
  });
});

