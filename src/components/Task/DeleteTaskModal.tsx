interface DeleteTaskModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}
import { X } from "lucide-react";

export default function DeleteTaskModal({
  open,
  onClose,
  onConfirm,
  loading = false,
}: DeleteTaskModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Delete Task</h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this task? This action cannot be
          undone.
        </p>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 border rounded-lg">
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
