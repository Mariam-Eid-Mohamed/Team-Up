import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface TaskFormData {
  taskName: string;
  taskDescription: string;
  deliverableType: string;
  deadline: string;
  assignee: string;
}

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  initialData?: TaskFormData | null;
  onSubmit: (data: TaskFormData) => void;
}

export default function TaskModal({
  open,
  onClose,
  mode,
  initialData,
  onSubmit,
}: TaskModalProps) {
  const [form, setForm] = useState<TaskFormData>({
    taskName: "",
    taskDescription: "",
    deliverableType: "",
    deadline: "",
    assignee: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  if (!open) return null;

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      {/* 💡 Added max-h-[90vh] and flex flex-col so the modal card can manage internal heights */}
      <div className="bg-white w-full max-w-md max-h-[90vh] rounded-2xl shadow-2xl p-6 relative flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header Layout (Fixed at the top) */}
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h2 className="text-xl font-bold text-gray-800">
            {mode === "edit" ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 💡 Scrollable Body Container (Only this section scrolls if content is too tall) */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-6 text-left base-scrollbar">
          {/* Task Name */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Task Name
            </label>
            <input
              type="text"
              placeholder="e.g. UI Wireframe creation"
              value={form.taskName}
              onChange={(e) =>
                setForm({
                  ...form,
                  taskName: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Task Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe what needs to be done..."
              value={form.taskDescription}
              onChange={(e) =>
                setForm({
                  ...form,
                  taskDescription: e.target.value,
                })
              }
              className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Deliverable Type */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Deliverable Type
            </label>
            <select
              value={form.deliverableType}
              onChange={(e) =>
                setForm({
                  ...form,
                  deliverableType: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="">Select Type</option>
              <option value="pdf">PDF</option>
              <option value="image">Image</option>
              <option value="document">Document</option>
              <option value="zip">ZIP</option>
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Deadline
            </label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) =>
                setForm({
                  ...form,
                  deadline: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Assignee */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Assignee (optional)
            </label>
            <input
              type="text"
              placeholder="Assign or search member..."
              value={form.assignee}
              onChange={(e) =>
                setForm({
                  ...form,
                  assignee: e.target.value,
                })
              }
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Action Button Row Footer (Fixed at the bottom) */}
        <div className="flex gap-4 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-lg font-bold transition hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold transition active:scale-95 cursor-pointer"
          >
            {mode === "edit" ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
