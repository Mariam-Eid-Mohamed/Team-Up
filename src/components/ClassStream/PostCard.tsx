import { Pencil, Trash, Download } from "lucide-react";
import { useState } from "react";
import type { Post } from "@/Types/posts";
import AnnouncementModal from "./AnnouncemetModal";
import { updateAnnouncement, deleteAnnouncement } from "@/Services/announcement Endpoints/Endpoints";
import { getToken } from "@/utilis/token";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(); // تقدري تخصصيها
}

export default function PostCard({
  post,
  role,
  onChanged,
}: {
  post: Post;
  role: "student" | "instructor";
  onChanged?: () => void;
}) {
  const [modalMode, setModalMode] = useState<"edit" | "delete" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const authorName = post.authorId.last_name
    ? `${post.authorId.first_name} ${post.authorId.last_name}`.trim()
    : post.authorId.first_name.trim();
  const created = formatDate(post.createdAt);

  const canEdit = role === "instructor" && post.type === "ANNOUNCEMENT"; // Only instructors can edit/delete announcements

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
          "Failed to update announcement. Please try again."
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
          "Failed to delete announcement. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
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

          {/* Files */}
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
          mode={modalMode === "edit" ? "edit" : modalMode === "delete" ? "delete" : "create"}
          initialData={post.announcement_text}
          onConfirm={
            modalMode === "edit"
              ? handleEditAnnouncement
              : modalMode === "delete"
              ? handleDeleteAnnouncement
              : () => {}
          }
        />
      )}
    </div>
  );
}
