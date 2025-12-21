import { useState } from "react";
import { X } from "lucide-react";
import type { Class } from "../../App";

interface CreateClassModalProps {
  onClose: () => void;
  onCreate: (newClass: Class) => void;
}

export function CreateClassModal({
  onClose,
  onCreate,
}: CreateClassModalProps) {
  const [formData, setFormData] = useState<Class>({
    id: crypto.randomUUID(),
    name: "",
    code: "",
    description: "",
    semester: "",
    studentsCount: 0,
    teamsCount: 0,
    instructorsCount: 1,
    color: "bg-blue-500",
  });

  const colors = [
    { name: "Blue", value: "bg-blue-500" },
    { name: "Purple", value: "bg-purple-500" },
    { name: "Green", value: "bg-green-500" },
    { name: "Red", value: "bg-red-500" },
    { name: "Orange", value: "bg-orange-500" },
    { name: "Pink", value: "bg-pink-500" },
    { name: "Indigo", value: "bg-indigo-500" },
    { name: "Teal", value: "bg-teal-500" },
  ];

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl p-6 relative max-h-[85vh] overflow-y-auto">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>

        <h2 className="text-lg font-semibold mb-6">Create New Class</h2>

        {/* FORM (same style as edit) */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2 text-sm">
              Class Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm">
              Class Code
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm">
              Semester
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={formData.semester}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  semester: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-3 text-sm">
              Class Color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      color: color.value,
                    })
                  }
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.color === color.value
                      ? "border-gray-900 scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-full h-8 rounded ${color.value}`}
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    {color.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={() => onCreate(formData)}
            className="px-4 py-2 bg-[#9B87F5] text-white rounded-lg hover:bg-[#8B77E5]"
          >
            Create Class
          </button>
        </div>
      </div>
    </div>
  );
}
