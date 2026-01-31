import { useParams, useLocation } from "react-router-dom";
import CourseHeader from "@/components/ClassStream/CourseHeader";
import SectionDropdown from "@/components/ClassStream/SectionDropdown";
import ActionButtons from "@/components/ClassStream/ActionButtons";

import NoSectionsImg from "@/assets/Images/no-posts-yet-removebg-preview 1.png";

export default function SectionStream() {
  const { sectionId } = useParams();
  const location = useLocation();

  const role: "student" | "instructor" = location.pathname.startsWith(
    "/instructor"
  )
    ? "instructor"
    : "student";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* HEADER */}
      <CourseHeader />

      {/* SECTION DROPDOWN + ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
        <SectionDropdown />

        <ActionButtons role={role} hideCoursework />
      </div>

      {/* SECTION TITLE */}
      <h2 className="mt-6 text-lg font-semibold text-gray-900">
        Section {sectionId}
      </h2>

      {/* STREAM CONTENT */}
      <div className="mt-10 space-y-6">
        {/* Empty state (same as image) */}
        <div className="flex flex-col items-center text-center text-gray-500 mt-16">
          <img src={NoSectionsImg} alt="No work" className="w-50  mb-6" />
          <p className="text-lg font-medium">
            Looks like there’s no work… for now
          </p>
        </div>

        {/* Later from API */}
        {/* <PostCard withFile /> */}
      </div>
    </div>
  );
}
