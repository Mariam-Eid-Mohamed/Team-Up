import { useEffect } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  TaskSchema,
  type TaskInputs,
} from "../../utilis/Validations/TaskValidations";

import type { TaskModalProps } from "../../interfaces/interfaces";

export default function TaskModal({
  open,
  onClose,
  mode,
  initialData,
  onSubmit,
  members,
}: TaskModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskInputs>({
    resolver: zodResolver(TaskSchema),

    defaultValues: {
      taskName: "",
      taskDescription: "",
      deliverableType: "",
      deadline: "",
      assignee: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);
  useEffect(() => {
    console.log("Modal members:", members);
  }, [members]);

  if (!open) return null;

  const submitForm = (data: TaskInputs) => {
    onSubmit(data);
  };

    const getTomorrow = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate());
  return tomorrow.toISOString().split("T")[0]; // YYYY-MM-DD
};
const minAllowedDate = getTomorrow();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      {/*  Added max-h-[90vh] and flex flex-col so the modal card can manage internal heights */}
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

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-6 text-left base-scrollbar">
          {/* Task Name */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Task Name
            </label>
            <input
              {...register("taskName")}
              type="text"
              placeholder="e.g. UI Wireframe creation"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {errors.taskName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.taskName.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Task Description
            </label>
            <textarea
              {...register("taskDescription")}
              rows={3}
              placeholder="Describe what needs to be done..."
              className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            {errors.taskDescription && (
              <p className="mt-1 text-xs text-red-500">
                {errors.taskDescription.message}
              </p>
            )}
          </div>

          {/* Deliverable Type */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Deliverable Type
            </label>
            <select
              {...register("deliverableType")}
              className="w-full rounded-xl border border-gray-200 px-3 py-2"
            >
              <option value="">Select Type</option>

              <option value=".pdf">PDF</option>
              <option value=".docx">DOCX</option>
              <option value=".pptx">PPTX</option>
              <option value=".xlsx">XLSX</option>
              <option value=".zip">ZIP</option>
              <option value=".txt">TXT</option>
              <option value=".py">PY</option>
              <option value=".jpg">JPG</option>
              <option value=".jpeg">JPEG</option>
              <option value=".png">PNG</option>
            </select>

            {errors.deliverableType && (
              <p className="mt-1 text-xs text-red-500">
                {errors.deliverableType.message}
              </p>
            )}
          </div>

          {/* Deadline */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Deadline
            </label>
            <input
              {...register("deadline")}
              type="date"
              min={minAllowedDate}
              className="w-full rounded-xl border border-gray-200 px-3 py-2"
            />

            {errors.deadline && (
              <p className="mt-1 text-xs text-red-500">
                {errors.deadline.message}
              </p>
            )}
          </div>

          {/* Assignee */}
          {mode === "create" && (
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                Assignee (optional)
              </label>

              <select
                {...register("assignee")}
                className="w-full rounded-xl border border-gray-200 px-3 py-2"
              >
                <option value="">Unassigned</option>

                {members.map((member) => (
                  <option key={member.student.id} value={member.student.id}>
                    {member.student.first_name} {member.student.last_name}
                  </option>
                ))}
              </select>
            </div>
          )}
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
            onClick={handleSubmit(submitForm)}
            className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold transition active:scale-95 cursor-pointer"
          >
            {mode === "edit" ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
