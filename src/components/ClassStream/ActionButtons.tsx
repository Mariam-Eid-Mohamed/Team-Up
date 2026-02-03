import { Pencil, FileText, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import CourseworkModal from "../CourseWork/CourseWorkModal";
import AnnouncementModal from "../ClassStream/AnnouncemetModal";
import { createAnnouncement } from "@/Services/announcement Endpoints/Endpoints";
import { getToken } from "@/utilis/token";

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
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [isAnnounceOpen, setIsAnnounceOpen] = useState(false);

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
        {role === "instructor" ||
          (role === "admin" && (
            <button
              onClick={() => setIsAnnounceOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-[#9B87F5] text-white hover:bg-purple-700 text-sm"
            >
              <Pencil size={16} />
              <span className="hidden sm:inline">New post</span>
            </button>
          ))}

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
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-[#9B87F5] hover:bg-purple-700 text-white text-sm"
        >
          <Eye size={16} />
        </button>
      </div>
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
        onClose={() => setOpen(false)}
        classId={classId}
        onCreated={() => {
          setOpen(false);
          onPostCreated?.(); // دي تعمل refetch في ClassStream
        }}
      />
    </>
  );
}
