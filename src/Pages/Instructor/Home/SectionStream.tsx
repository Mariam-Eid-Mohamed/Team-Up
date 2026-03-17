import { useParams, useLocation } from "react-router-dom";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import CourseHeader from "@/components/ClassStream/CourseHeader";
import SectionDropdown from "@/components/ClassStream/SectionDropdown";
import ActionButtons from "@/components/ClassStream/ActionButtons";

import NoSectionsImg from "@/assets/Images/no-posts-yet-removebg-preview 1.png";

export default function SectionStream() {
  const { sectionId, id } = useParams();
  const location = useLocation();

  const [showInstructors, setShowInstructors] = useState(true);

  const role: "admin" | "instructor" | "student" =
    location.pathname.startsWith("/instructor")
      ? "instructor"
      : location.pathname.startsWith("/student")
      ? "student"
      : "admin";

  const hasSection = !!sectionId;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* HEADER */}
      <CourseHeader />

      {/* SECTION DROPDOWN + ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
        <SectionDropdown />
        <ActionButtons role={role} classId={id!} hideCoursework />
      </div>

      {/* ✅ IF SECTION SELECTED */}
      {hasSection ? (
        <>
          {/* SECTION TITLE */}
          <h2 className="mt-6 text-lg font-semibold text-gray-900">
            Section {sectionId}
          </h2>

          {/* STREAM CONTENT */}
          <div className="mt-6 space-y-6">

            {/* 🔹 Instructors Card with Collapse */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              
              {/* HEADER */}
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowInstructors(!showInstructors)}
              >
                <h3 className="font-semibold text-gray-800">
                  Instructors
                </h3>

                {showInstructors ? (
                  <ChevronUp size={18} className="text-gray-500" />
                ) : (
                  <ChevronDown size={18} className="text-gray-500" />
                )}
              </div>

              {/* COLLAPSIBLE CONTENT */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  showInstructors ? "max-h-40 mt-3" : "max-h-0"
                }`}
              >
                <div className="space-y-3 pr-2">
                  {[1, 2, 3].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 border-b pb-2"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-300" />
                      <span className="text-sm text-gray-800">
                        Anas Mohamed
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 🔹 Announcement Card */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-300" />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Anas Mohamed
                  </p>
                  <p className="text-xs text-gray-500">
                    2/10/2026, 6:57:54 PM
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-700 mt-2">
                Tomorrow’s section will be held online
              </p>
            </div>

          </div>
        </>
      ) : (
        /* ❌ NO SECTION SELECTED */
        <div className="flex flex-col items-center text-center text-gray-500 mt-16">
          <img src={NoSectionsImg} alt="No work" className="w-50 mb-6" />
          <p className="text-lg font-medium">
            Looks like there’s no work… for now
          </p>
        </div>
      )}
    </div>
  );
}