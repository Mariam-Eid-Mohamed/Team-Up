import { useState, useEffect } from "react";
import { Megaphone, Trash } from "lucide-react";

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "delete";
  initialData?: string;
  onConfirm: (data: string) => void | Promise<void>;
  classId?: string;
  onSuccess?: () => void;
}

export default function AnnouncementModal({
  isOpen,
  onClose,
  mode,
  initialData = "",
  onConfirm,
  classId,
  onSuccess,
}: AnnouncementModalProps) {
  const [content, setContent] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setContent(initialData);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const config = {
    create: {
      title: "New Announcement",
      icon: <Megaphone className="text-teal-600" size={20} />,
      buttonText: "Post",
      buttonClass: "bg-[#2D7A78] cursor-pointer hover:bg-[#23615f]",
    },
    edit: {
      title: "Edit Announcement",
      icon: <Megaphone className="text-teal-600" size={20} />,
      buttonText: "Save Changes",
      buttonClass: "bg-[#2D7A78] cursor-pointer hover:bg-[#23615f]",
    },
    delete: {
      title: "Delete Announcement",
      icon: <Trash className="text-red-600" size={20} />,
      buttonText: "Delete",
      buttonClass: "bg-red-600 hover:bg-red-700",
    },
  };

  const current = config[mode];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            {current.icon}
            <h2 className="text-lg font-semibold text-gray-800">
              {current.title}
            </h2>
          </div>

          {/* Text Area */}
          <textarea
            className={`w-full h-32 p-3 border rounded-md outline-none transition-all resize-none text-sm
              ${mode === "delete" ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "focus:ring-2 focus:ring-teal-100 border-gray-200"}`}
            placeholder="Write your announcement here"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={mode === "delete"}
          />

          {/* Buttons */}
          <div className="flex gap-4 mt-6 justify-center">
            <button
              onClick={onClose}
              className="px-10 py-1.5 border  rounded-full text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (mode === "create" && !content.trim()) {
                  return; // Don't submit empty content
                }
                setIsSubmitting(true);
                try {
                  await onConfirm(content);
                  onSuccess?.();
                  onClose();
                } catch (error) {
                  console.error("Error submitting announcement:", error);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting || (mode === "create" && !content.trim())}
              className={`px-10 py-1.5 text-white rounded-full text-sm font-medium transition-colors ${current.buttonClass} ${
                isSubmitting || (mode === "create" && !content.trim())
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isSubmitting
                ? mode === "delete"
                  ? "Deleting..."
                  : mode === "edit"
                    ? "Saving..."
                    : "Posting..."
                : current.buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
