interface LeaveProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sectionName: string;
}

export default function LeaveSectionModal({ isOpen, onClose, onConfirm, sectionName }: LeaveProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[60] bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-8 w-[400px] shadow-2xl text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Leave Section</h2>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          You are about to leave <span className="font-bold text-gray-800">Section {sectionName}</span>. <br />
          Are you sure about this?
        </p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-purple-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-[#d91d09] text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}