import { UserPlus } from "lucide-react";

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  teamName: string;
}

const JoinTeamModal: React.FC<JoinModalProps> = ({ isOpen, onClose, onConfirm, teamName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#F0F7F7] text-[#2D7A78] rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Join Team?</h2>
          <p className="text-gray-500 text-sm mb-8">
            Are you sure you want to join <span className="font-semibold text-gray-700">"{teamName}"</span>? 
            You can only be in one team per coursework.
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-[#2D7A78] hover:bg-[#23615f] text-white rounded-xl font-semibold transition-colors shadow-lg shadow-[#2d7a78]/20"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
export default JoinTeamModal;