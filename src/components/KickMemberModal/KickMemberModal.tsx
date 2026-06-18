import { Loader2, UserMinus } from "lucide-react";

interface KickProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberName: string;
  loading?: boolean;
}

export default function KickMemberModal({ isOpen, onClose, onConfirm, memberName, loading }: KickProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[70] bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-8 w-[400px] shadow-2xl text-center border border-gray-100">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserMinus className="text-red-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Kick Member</h2>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Are you sure you want to remove <span className="font-bold text-gray-800">{memberName}</span> from this team? 
          They will be returned to the available members list.
        </p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-purple-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Kick Member"}
          </button>
        </div>
      </div>
    </div>
  );
}