import { Pencil, FileText, Eye, UserPlus, LogOut, ChevronDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState,useRef } from "react";
import CourseworkModal from "../CourseWork/CourseWorkModal";
import AnnouncementModal from "../ClassStream/AnnouncemetModal";
import { createAnnouncement } from "@/Services/announcement Endpoints/Endpoints";
import { getToken } from "@/utilis/token";
import JoinSectionModal from "../JoinSectionModal/JoinSectionModal";
import LeaveSectionModal from "../LeaveSectionModal/LeaveSectionModal";
import CreateSectionModal from "../CreateSectionModal/CreateSectionModal";

interface ActionButtonsProps {
  role: "admin" | "instructor" | "student";
  classId: string;
  hideCoursework?: boolean;
  onPostCreated?: () => void;
}

export default function ActionButtons({
  role,
  classId,
  hideCoursework = false,
  onPostCreated,
}: ActionButtonsProps) {
  const navigate = useNavigate();
  const { id, sectionId } = useParams();
  // Dropdown UI State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [isAnnounceOpen, setIsAnnounceOpen] = useState(false);
  const [isJoinSectionOpen, setIsJoinSectionOpen] = useState(false);
  const [isCreateSectionOpen, setIsCreateSectionOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  // NEW STATE
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);


  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleLeaveConfirm = () => {
    // Logic for leaving (API call here)
    console.log("Left section");
    setIsLeaveModalOpen(false);
    navigate(role === "instructor" ? `/instructor/classes/${id}` : `/student/classes/${id}`);
  };

  const handleCreateAnnouncement = async (content: string) => {
    if (!classId || !content.trim()) return;

    const token = getToken();
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      await createAnnouncement(classId, content.trim(), token);
      setIsAnnounceOpen(false);
      onPostCreated?.(); // Refresh the posts list
    } catch (error: any) {
      console.error("Failed to create announcement:", error);
      alert(
        error?.response?.data?.message ||
          "Failed to create announcement. Please try again.",
      );
    }
  };

  const executeAction = (action: () => void) => {
    action();
    setIsDropdownOpen(false);
  };
  return (
    <>
      <div className="relative inline-block text-left w-full sm:w-auto" ref={dropdownRef}>
        {/* Dropdown Trigger Button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-between gap-2 w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#8c80d9] text-white hover:bg-purple-700 text-sm font-medium shadow-sm transition-all duration-200"
        >
          <span>Actions Menu</span>
          <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown Menu Overlay List */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-full sm:w-56 rounded-xl bg-white border border-slate-100 shadow-xl z-50 py-1.5 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-150">
            
            {/* New Post Option */}
            {(role === "instructor" || role === "admin") && (
              <button
                onClick={() => executeAction(() => setIsAnnounceOpen(true))}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <Pencil size={16} className="text-slate-400" />
                <span>New post</span>
              </button>
            )}

            {/* New Coursework Option */}
            {role === "instructor" && !hideCoursework && (
              <button
                onClick={() => executeAction(() => setOpen(true))}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <FileText size={16} className="text-slate-400" />
                <span>New Coursework</span>
              </button>
            )}

            {/* Class Details Option */}
            <button
              onClick={() =>
                executeAction(() =>
                  navigate(
                    role === "instructor"
                      ? `/instructor/classes/${id}/details`
                      : `/student/classes/${id}/details`,
                  )
                )
              }
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
            >
              <Eye size={16} className="text-slate-400" />
              <span>Class Details</span>
            </button>

            {/* Create Section Option */}
            {(role === "instructor" || role === "admin") && (
              <button
                onClick={() => executeAction(() => setIsCreateSectionOpen(true))}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
              >
                <UserPlus size={16} className="text-slate-400" />
                <span>Create Section</span>
              </button>
            )}

            {/* Divider */}
            <hr className="my-1 border-slate-100" />

            {/* Conditional Handle Join/Leave Section Option */}
            {sectionId ? (
              <button
                onClick={() => executeAction(() => setIsLeaveModalOpen(true))}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50/50 transition-colors text-left font-medium"
              >
                <LogOut size={16} className="text-red-400" />
                <span>Leave Section</span>
              </button>
            ) : (
              <button
                onClick={() => executeAction(() => setIsJoinSectionOpen(true))}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-teal-600 hover:bg-teal-50/50 transition-colors text-left font-medium"
              >
                <UserPlus size={16} className="text-teal-500" />
                <span>Join Section</span>
              </button>
            )}
          </div>
        )}
      </div>

<CreateSectionModal
  isOpen={isCreateSectionOpen} // Changed from isCreateOpen
  onClose={() => setIsCreateSectionOpen(false)} // Changed from setIsCreateOpen
  classId={id!}
  mode="create"
/>
{/* NEW MODAL COMPONENT */}
      <LeaveSectionModal
        isOpen={isLeaveModalOpen}
        sectionName={sectionId || ""}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={handleLeaveConfirm}
      />
      <JoinSectionModal
  isOpen={isJoinSectionOpen}
  onClose={() => setIsJoinSectionOpen(false)}
  classId={id!}
/>
      <AnnouncementModal
        isOpen={isAnnounceOpen}
        onClose={() => setIsAnnounceOpen(false)}
        mode="create"
        classId={classId}
        onConfirm={handleCreateAnnouncement}
        onSuccess={() => {
          // Additional success handling if needed
        }}
      />
      <CourseworkModal
        open={open}
        mode="create"
        onClose={() => setOpen(false)}
        classId={classId}
        onChanged={() => {
          setOpen(false);
          onPostCreated?.(); // دي تعمل refetch في ClassStream
        }}
      />
    </>
  );
}