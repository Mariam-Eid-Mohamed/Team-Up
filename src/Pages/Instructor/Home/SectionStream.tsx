import { useParams, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Loader2, Pencil, Trash } from "lucide-react";

import CourseHeader from "@/components/ClassStream/CourseHeader";
import SectionDropdown from "@/components/ClassStream/SectionDropdown";
import ActionButtons from "@/components/ClassStream/ActionButtons";

import NoSectionsImg from "@/assets/Images/no-posts-yet-removebg-preview 1.png";
import { getToken } from "@/utilis/token";
import {
  getAllSectionsInClass,
  getSectionMembers,
  type Section,
  type SectionMember,
} from "@/Services/section Endpoints/Endpoints";
import CreateSectionModal from "@/components/CreateSectionModal/CreateSectionModal";

export default function SectionStream() {
  const { sectionId, id } = useParams();
  const location = useLocation();

  const [showInstructors, setShowInstructors] = useState(true);
  const [members, setMembers] = useState<SectionMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);
  const [sectionName, setSectionName] = useState<string | null>(null);
  const [loadingSectionName, setLoadingSectionName] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
const [selectedSection, setSelectedSection] = useState<any>(null);
const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "delete">("edit");

  const role: "admin" | "instructor" | "student" =
    location.pathname.startsWith("/instructor")
      ? "instructor"
      : location.pathname.startsWith("/student")
      ? "student"
      : "admin";

  const hasSection = !!sectionId;
  const classId = id;

  useEffect(() => {
    if (!hasSection || !classId || !sectionId) return;

    const token = getToken();
    if (!token) {
      setMembersError("Authentication required");
      setMembers([]);
      setSectionName(null);
      return;
    }

    const fetchMembersAndName = async () => {
      setLoadingMembers(true);
      setLoadingSectionName(true);
      setMembersError(null);
      try {
        const [membersRes, sectionsRes] = await Promise.all([
          getSectionMembers(classId, sectionId, token),
          getAllSectionsInClass(classId, token),
        ]);

        setMembers(
          Array.isArray(membersRes.data?.data) ? membersRes.data.data : [],
        );

        const sections: Section[] = Array.isArray(sectionsRes.data?.data)
          ? sectionsRes.data.data
          : [];
        const current = sections.find((s) => s._id === sectionId);
        setSectionName(current?.section_name || null);
      } catch (err: any) {
        setMembersError(
          err?.response?.data?.message ||
            "Failed to fetch section members. Please try again.",
        );
        setMembers([]);
        setSectionName(null);
      } finally {
        setLoadingMembers(false);
        setLoadingSectionName(false);
      }
    };

    fetchMembersAndName();
  }, [hasSection, classId, sectionId]);

  const instructors = useMemo(
    () => members.filter((m) => m.role === "Instructor"),
    [members],
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <CourseHeader />

        {/* Only show buttons if user is instructor and a section is actually selected */}
        {role === "instructor" && hasSection && !loadingSectionName && (
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => {
                setModalMode("edit");
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-800 text-white text-sm transition-colors shadow-sm"
            >
              <Pencil size={16} /> <span className="hidden sm:inline">Edit</span>
            </button>

            <button
              onClick={() => {
                setModalMode("delete");
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm transition-colors shadow-sm"
            >
              <Trash size={16} /> <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* SECTION DROPDOWN + ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
        <SectionDropdown />
        <ActionButtons role={role} classId={id!} hideCoursework />
      </div>

      {/* ✅ IF SECTION SELECTED */}
      {hasSection ? (
        <>
          {/* ✅ UPDATED SECTION TITLE WITH BUTTONS */}
          <div className="mt-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {loadingSectionName ? "Loading section..." : sectionName || "Section"}
            </h2>

            {/* Only show if user is instructor and section is loaded */}
            {/* {role === "instructor" && !loadingSectionName && sectionName && (
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setModalMode("edit");
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-700 hover:bg-gray-800 text-white text-sm transition-colors"
                >
                  <Pencil size={14} /> Edit
                </button>

                <button
                  onClick={() => {
                    setModalMode("delete");
                    setIsModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm transition-colors"
                >
                  <Trash size={14} /> Delete
                </button>
              </div>
            )} */}
          </div>

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
                  {loadingMembers ? (
                    <div className="flex items-center justify-center py-6 text-sm text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Loading members...
                    </div>
                  ) : membersError ? (
                    <div className="text-sm text-red-600">{membersError}</div>
                  ) : instructors.length === 0 ? (
                    <div className="text-sm text-gray-500">
                      No instructors in this section yet.
                    </div>
                  ) : (
                    instructors.map((inst) => (
                      <div
                        key={inst._id}
                        className="flex items-center gap-3 border-b pb-2 last:border-b-0 last:pb-0"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-300" />
                        <div className="min-w-0">
                          <div className="text-sm text-gray-800 font-medium truncate">
                            {inst.first_name} {inst.last_name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {inst.email}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
          {/* ✅ ADD THE MODAL COMPONENT */}
          <CreateSectionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            classId={id!}
            mode={modalMode}
            sectionData={{
              id: sectionId!,
              name: sectionName || "",
            }}
          />
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