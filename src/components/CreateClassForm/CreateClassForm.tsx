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
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-4xl mx-auto w-full">
      <h2 className="text-lg font-semibold mb-6">Create New Class</h2>

      <div className="space-y-4">
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
                onClick={() => setNewClass({ ...newClass, color: c.value })}
                className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center ${
                  newClass.color === c.value
                    ? "border-gray-900 scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`w-full h-8 rounded ${c.value}`} />
                <p className="text-xs text-gray-600 mt-1 text-center">
                  {c.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg text-gray-700 flex items-center gap-1 text-sm sm:text-base hover:bg-gray-50"
        >
          <X size={16} />
          Cancel
        </button>

        <button
          onClick={onCreate}
          className="px-4 py-2 bg-[#58a8a7] text-white rounded-lg flex items-center gap-1 text-sm sm:text-base hover:bg-green-700"
        >
          <Save size={16} />
          Create Class
        </button>
      </div>
    </div>
  );
}
