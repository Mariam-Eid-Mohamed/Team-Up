import { Pencil, FileText, Eye, UserPlus, LogOut } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import CourseworkModal from "../CourseWork/CourseWorkModal";
import AnnouncementModal from "../ClassStream/AnnouncemetModal";
import { createAnnouncement } from "@/Services/announcement Endpoints/Endpoints";
import { getToken } from "@/utilis/token";
import JoinSectionModal from "../JoinSectionModal/JoinSectionModal";
import LeaveSectionModal from "../LeaveSectionModal/LeaveSectionModal";

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
  const [open, setOpen] = useState(false);
  const [isAnnounceOpen, setIsAnnounceOpen] = useState(false);
  const [isJoinSectionOpen, setIsJoinSectionOpen] = useState(false);
  // NEW STATE
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

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

  return (
    <>
      <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
        {/* New Post — Instructor only */}
        {(role === "instructor" || role === "admin") && (
          <button
            onClick={() => setIsAnnounceOpen(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-[#9B87F5] text-white hover:bg-purple-700 text-sm"
          >
            <Pencil size={16} />
            <span className="hidden sm:inline">New post</span>
          </button>
        )}

        {role === "instructor" && !hideCoursework && (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-[#9B87F5] text-white hover:bg-purple-700 text-sm"
          >
            <FileText size={16} />
            <span className="hidden sm:inline">New Coursework</span>
          </button>
        )}

        <button
          onClick={() =>
            navigate(
              role === "instructor"
                ? `/instructor/classes/${id}/details`
                : `/student/classes/${id}/details`,
            )
          }
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-[#9B87F5] hover:bg-purple-700 text-white text-sm hover:cursor-pointer"
        >
          <Eye size={16} />
          <span>Class Details</span>
        </button>

{/* 3. CONDITIONAL BUTTON: Join vs Leave */}
        {sectionId ? (
        <button
            onClick={() => setIsLeaveModalOpen(true)} // Open Leave Modal
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-[#9B87F5] hover:bg-purple-700 text-white text-sm"
          >
            <LogOut size={16} />
            <span>Leave Section</span>
          </button>
        ) : (
          <button
            onClick={() => setIsJoinSectionOpen(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-[#9B87F5] hover:bg-purple-700 text-white text-sm hover:cursor-pointer"
          >
            <UserPlus size={16} />
            <span>Join Section</span>
          </button>
        )}
      </div>


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
