import { Loader2 } from "lucide-react";

interface RemoveProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberName: string;
  loading?: boolean;
}

export default function RemoveMemberModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  memberName, 
  loading 
}: RemoveProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[70] bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-8 w-[400px] shadow-2xl text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Remove Student</h2>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Are you sure you want to remove <span className="font-bold text-gray-800">{memberName}</span> from this class? 
          <br /> This action cannot be undone.
        </p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-[#d91d09] text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}