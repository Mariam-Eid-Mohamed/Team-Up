import { cn } from "@/lib/utils";

describe("cn utility", () => {
  test("merges class names using clsx and tailwind-merge", () => {
    const result = cn(
      "px-2 py-1",
      false && "hidden",
      "text-sm",
      ["px-4", { "font-bold": true }],
    );

    // px-2 should be overridden by px-4 by tailwind-merge
    expect(result).toContain("px-4");
    expect(result).not.toContain("px-2");
    expect(result).toContain("py-1");
    expect(result).toContain("text-sm");
    expect(result).toContain("font-bold");
  });
});

