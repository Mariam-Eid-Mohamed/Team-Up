import { Pencil, Trash, Download, Users, UserPlus, MessageSquareCode } from "lucide-react";
import { useState } from "react";
import type { Post } from "@/Types/posts";
import CourseworkModal from "../CourseWork/CourseWorkModal";
import AnnouncementModal from "./AnnouncemetModal";
import {
  updateAnnouncement,
  deleteAnnouncement,
} from "@/Services/announcement Endpoints/Endpoints";
import { getToken } from "@/utilis/token";
import CreateTeamModal from "../CreateTeamModal/CreateTeamModal";
import { useNavigate } from "react-router-dom";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(); // تقدري تخصصيها
}

export default function PostCard({
  post,
  role,
  classId,
  onChanged,
  hideActions = false,
}: {
  post: Post;
  role: "admin" | "instructor" | "student";
  classId: string;
  onChanged?: () => void;
  hideActions?: boolean;
}) {
  const [modalMode, setModalMode] = useState<"edit" | "delete" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const first = post.authorId?.first_name?.trim() || "Unknown";
  const last = post.authorId?.last_name?.trim() || "";
  const authorName = `${first} ${last}`.trim();
  const created = formatDate(post.createdAt);
  console.log(authorName);

  const canEdit = (role === "instructor" || role === "admin") && !hideActions; // ✅ UPDATED // Only instructors can edit/delete announcements

  const handleEditAnnouncement = async (content: string) => {
    if (post.type !== "ANNOUNCEMENT" || !content.trim()) return;

    const token = getToken();
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    setIsProcessing(true);
    try {
      await updateAnnouncement(post._id, content.trim(), token);
      setModalMode(null);
      onChanged?.(); // Refresh the posts list
    } catch (error: any) {
      console.error("Failed to update announcement:", error);
      alert(
        error?.response?.data?.message ||
        "Failed to update announcement. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAnnouncement = async (_content: string) => {
    // Content parameter is required by modal but not used for delete
    if (post.type !== "ANNOUNCEMENT") return;

    const token = getToken();
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    setIsProcessing(true);
    try {
      await deleteAnnouncement(post._id, token);
      setModalMode(null);
      onChanged?.(); // Refresh the posts list
    } catch (error: any) {
      console.error("Failed to delete announcement:", error);
      alert(
        error?.response?.data?.message ||
        "Failed to delete announcement. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Placeholder functions for the new buttons
  const handleJoinTeam = () => {
    navigate(`/student/classes/${classId}/coursework/${post.courseworkId._id}/teams`, {
      state: { courseworkName: post.courseworkId.name }
    });
    // Add your navigation or logic here
  };
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);

  // Update your handleCreateTeam function
  const handleCreateTeam = () => {
    setIsCreateTeamOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-5">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300" />
          <div>
            <p className="font-semibold text-sm">{authorName}</p>
            <p className="text-xs text-gray-500">{created}</p>
          </div>
        </div>

        {canEdit && (
          <div className="flex gap-2 text-gray-500">
            <Pencil
              size={16}
              className="cursor-pointer hover:text-black"
              onClick={() => setModalMode("edit")}
            />
            <Trash
              size={16}
              className="cursor-pointer hover:text-red-600"
              onClick={() => setModalMode("delete")}
            />
          </div>
        )}

        {/* Student Chatbot Icon */}
        {role === "student" && post.type === "COURSEWORK" && (
          <button
            onClick={() =>
              navigate("/student/AI-Chat", {
                state: {
                  courseworkId: post.courseworkId._id,
                  courseworkName: post.courseworkId.name,
                },
              })
            }
            title="AI Chat"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-500 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            <MessageSquareCode size={16} />
            <span className="text-xs font-semibold">Ask AI</span>
          </button>
        )}

      </div>

      <hr className="border-t border-gray-300 mt-4" />

      {/* Body */}
      {post.type === "ANNOUNCEMENT" ? (
        <div className="mt-4 text-sm">
          <p className="whitespace-pre-wrap">{post.announcement_text}</p>
        </div>
      ) : (
        <div className="mt-4 space-y-2 text-sm">
          <h3 className="font-semibold">{post.courseworkId.name}</h3>

          {post.courseworkId.description && (
            <p className="text-gray-700 whitespace-pre-wrap">
              {post.courseworkId.description}
            </p>
          )}

          <div className="text-gray-700">
            {post.courseworkId.team_size_min != null &&
              post.courseworkId.team_size_max != null && (
                <p>
                  <strong>Team size:</strong> {post.courseworkId.team_size_min}{" "}
                  - {post.courseworkId.team_size_max}
                </p>
              )}

            {post.courseworkId.grade != null && (
              <p>
                <strong>Grade:</strong> {post.courseworkId.grade}
              </p>
            )}

            <p>
              <strong>Deadline:</strong>{" "}
              {formatDate(post.courseworkId.deadline)}
            </p>
          </div>

          {/* NEW SECTION: Student Team Buttons */}
          {role === "student" && (
            <div className="flex flex-wrap gap-3 mt-4 pt-2">
              <button
                onClick={handleJoinTeam}
                className="flex items-center gap-2 px-4 py-2 bg-[#2D7A78] cursor-pointer hover:bg-[#23615f] text-white rounded-md  transition-colors text-xs font-medium"
              >
                <Users size={14} />
                Join Existing Team
              </button>
              <button
                onClick={handleCreateTeam}
                className="flex items-center gap-2 px-4 py-2 border border-[#2D7A78] rounded-md cursor-pointer hover:bg-[#2D7A78] hover:text-white transition-colors text-xs font-medium"
              >
                <UserPlus size={14} />
                Create a New Team
              </button>
            </div>
          )}

          <CreateTeamModal
            isOpen={isCreateTeamOpen}
            onClose={() => setIsCreateTeamOpen(false)}
            courseworkId={post.courseworkId._id}
          />
          {post.courseworkId.files?.length > 0 && (
            <div className="mt-3 space-y-2">
              {post.courseworkId.files.map((f) => (
                <div
                  key={f._id}
                  className="flex items-center justify-between border rounded-md p-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">
                      {f.file_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(f.file_size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <a href={f.file_url} target="_blank" rel="noreferrer">
                    <Download size={16} className="cursor-pointer" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Announcement Edit/Delete Modal */}
      {post.type === "ANNOUNCEMENT" && (
        <AnnouncementModal
          isOpen={modalMode !== null}
          onClose={() => setModalMode(null)}
          mode={
            modalMode === "edit"
              ? "edit"
              : modalMode === "delete"
                ? "delete"
                : "create"
          }
          initialData={post.announcement_text}
          onConfirm={
            modalMode === "edit"
              ? handleEditAnnouncement
              : modalMode === "delete"
                ? handleDeleteAnnouncement
                : () => { }
          }
        />
      )}
      {post.type === "COURSEWORK" && (
        <CourseworkModal
          open={modalMode !== null}
          onClose={() => setModalMode(null)}
          classId={classId}
          mode={modalMode === "edit" ? "edit" : "delete"}
          courseworkId={post.courseworkId._id}
          initialData={{
            name: post.courseworkId.name ?? "",
            description: post.courseworkId.description ?? "",
            grade:
              post.courseworkId.grade == null
                ? ""
                : String(post.courseworkId.grade),
            teamMin:
              post.courseworkId.team_size_min == null
                ? ""
                : String(post.courseworkId.team_size_min),
            teamMax:
              post.courseworkId.team_size_max == null
                ? ""
                : String(post.courseworkId.team_size_max),
            deadline: post.courseworkId.deadline
              ? post.courseworkId.deadline.slice(0, 10)
              : "",
            discussionDate: "", // لو عندك discussion_date في API ضيفيه هنا
          }}
          onChanged={onChanged}
        />
      )}
    </div>
  );
}
