import React, { useState } from "react";
import { PlusCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Change this if using Next.js
import { getToken } from "../../utilis/token";
// import { createTeam } from "../../Services/team Endpoints/Endpoints"; 

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseworkId: string;
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ isOpen, onClose, courseworkId }) => {
  const [teamName, setTeamName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

 const handleSubmit = async () => {
  if (!teamName.trim()) {
    setError("Please enter a team name.");
    return;
  }

  setIsSubmitting(true);

  // Simulating the transition to the constant UI
  setTimeout(() => {
    setIsSubmitting(false);
    onClose();
    
    // Navigate to the student team path
    // This matches the path added in App.tsx
    navigate(`/student/teams/constant-id`); 
  }, 800);
};

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50  p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-800">Create New Team</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-center mb-10">
          <label className="block text-sm font-semibold text-gray-700">Team Name</label>
          <input
            type="text"
            placeholder="e.g., Team Alpha"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className={`w-full text-center py-3 px-4 border-b-2 outline-none text-lg transition-colors placeholder:text-gray-300 ${
              error ? "border-red-500" : "border-gray-100 focus:border-[#2D7A78]"
            }`}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <div className="flex gap-4">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg font-bold">
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-2.5 bg-[#1B4D49] hover:bg-[#2D7A74] text-white rounded-lg font-bold flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Create Team"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default CreateTeamModal;