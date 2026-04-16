import React from "react";

interface LeaveClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  className: string;
}

const LeaveClassModal: React.FC<LeaveClassModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  className,
}) => {
  // If the modal isn't open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-[400px]">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Leave Class</h3>
          <p className="text-gray-600">
            Are you sure you want to leave this class?
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-sm shadow-red-200"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveClassModal;
