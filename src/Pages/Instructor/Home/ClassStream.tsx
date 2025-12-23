import { useLocation } from "react-router-dom";
import CourseHeader from "@/components/ClassStream/CourseHeader";
import SectionDropdown from "@/components/ClassStream/SectionDropdown";
import ActionButtons from "@/components/ClassStream/ActionButtons";
import PostCard from "@/components/ClassStream/PostCard";

export default function ClassStream() {
  const location = useLocation();

  const role: "student" | "instructor" =
    location.pathname.startsWith("/instructor")
      ? "instructor"
      : "student";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <CourseHeader />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
        <SectionDropdown />
        <ActionButtons role={role} />
      </div>

      <div className="mt-6 space-y-6">
        <PostCard withFile={false} />
        <PostCard withFile />
      </div>
    </div>
  );
}
