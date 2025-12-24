import { X, Save } from "lucide-react";
import type { Class } from "../../App";

interface CreateClassFormProps {
  newClass: Class;
  setNewClass: (value: Class) => void;
  onCancel: () => void;
  onCreate: () => void;
}

export function CreateClassForm({
  newClass,
  setNewClass,
  onCancel,
  onCreate,
}: CreateClassFormProps) {
  const colors = [
    { name: "Blue", value: "bg-blue-500" },
    { name: "Purple", value: "bg-purple-500" },
    { name: "Green", value: "bg-green-500" },
    { name: "Red", value: "bg-red-500" },
    { name: "Orange", value: "bg-orange-500" },
    { name: "Pink", value: "bg-pink-500" },
    { name: "Indigo", value: "bg-indigo-500" },
    { name: "Teal", value: "bg-teal-500" },
    { name: "Yellow", value: "bg-yellow-400" },
    { name: "Gray", value: "bg-gray-500" },
  ];

  return (
    /* OVERLAY */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      {/* MODAL CARD */}
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Create New Class</h2>
          <button
            onClick={onCancel}
            className="p-2 rounded hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm mb-1">Class Name</label>
            <input
              className="w-full border rounded-lg px-4 py-2"
              value={newClass.name}
              onChange={(e) =>
                setNewClass({ ...newClass, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Class Code</label>
            <input
              className="w-full border rounded-lg px-4 py-2"
              value={newClass.code}
              onChange={(e) =>
                setNewClass({ ...newClass, code: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              rows={3}
              className="w-full border rounded-lg px-4 py-2"
              value={newClass.description}
              onChange={(e) =>
                setNewClass({ ...newClass, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Semester</label>
            <input
              className="w-full border rounded-lg px-4 py-2"
              value={newClass.semester}
              onChange={(e) =>
                setNewClass({ ...newClass, semester: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm mb-3">Class Color</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() =>
                    setNewClass({ ...newClass, color: c.value })
                  }
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center ${
                    newClass.color === c.value
                      ? "border-gray-900 scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-full h-8 rounded ${c.value}`} />
                  <p className="text-xs text-gray-600 mt-1">
                    {c.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-center gap-6 px-6 py-4 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg text-gray-700 flex items-center gap-1 hover:bg-gray-50"
          >
            <X size={16} />
            Cancel
          </button>

          <button
            onClick={onCreate}
            className="px-4 py-2 bg-[#58a8a7] text-white rounded-lg flex items-center gap-1 hover:bg-green-700"
          >
            <Save size={16} />
            Create Class
          </button>
        </div>
      </div>
    </div>
  );
}
