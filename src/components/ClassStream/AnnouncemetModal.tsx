import React, { useState, useEffect } from "react";
import { Megaphone, Trash, X } from "lucide-react";

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "delete";
  initialData?: string;
  onConfirm: (data: string) => void;
}

export default function AnnouncementModal({
  isOpen,
  onClose,
  mode,
  initialData = "",
  onConfirm,
}: AnnouncementModalProps) {
  const [content, setContent] = useState(initialData);

  useEffect(() => {
    setContent(initialData);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const config = {
    create: {
      title: "New Announcement",
      icon: <Megaphone className="text-teal-600" size={20} />,
      buttonText: "Post",
      buttonClass: "bg-[#4f928d] hover:bg-[#3d716d]",
    },
    edit: {
      title: "Edit Announcement",
      icon: <Megaphone className="text-teal-600" size={20} />,
      buttonText: "Save Changes",
      buttonClass: "bg-[#4f928d] hover:bg-[#3d716d]",
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
            <h2 className="text-lg font-semibold text-gray-800">{current.title}</h2>
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
              className="px-10 py-1.5 border border-purple-400 text-purple-600 rounded-full text-sm font-medium hover:bg-purple-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm(content);
                onClose();
              }}
              className={`px-10 py-1.5 text-white rounded-full text-sm font-medium transition-colors ${current.buttonClass}`}
            >
              {current.buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}