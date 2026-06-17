import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

export interface Instructor {
  id: number | string;
  name: string;
  // You can keep the 'avatar' property in the interface to pass the URL 
  // or use it as a CSS background-image later
  avatar?: string; 
}

interface AssignInstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructors: Instructor[];
  onAssign: (instructorId: number | string) => void;
}

const AssignInstructorModal: React.FC<AssignInstructorModalProps> = ({ 
  isOpen, 
  onClose, 
  instructors, 
  onAssign 
}) => {
  const [selectedId, setSelectedId] = useState<number | string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-2">
          <h2 className="text-xl font-bold text-gray-800">Select Instructor</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div className="px-4 py-2 max-h-[60vh] overflow-y-auto space-y-1">
          {instructors.map((instructor) => {
            const isSelected = selectedId === instructor.id;
            return (
              <div
                key={instructor.id}
                onClick={() => setSelectedId(instructor.id)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border-2 
                  ${isSelected 
                    ? "bg-[#F0F9F8] border-[#528E8C]" 
                    : "bg-white border-transparent hover:bg-gray-50"}`}
              >
                <div className="flex items-center gap-3">
                  {/* --- Instructor Avatar Div --- */}
                  <div 
                    className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden bg-gray-200 border border-gray-100
                      ${isSelected ? "ring-2 ring-[#528E8C] ring-offset-1" : ""}`}
                    // You can later add: style={{ backgroundImage: `url(${instructor.avatar})`, backgroundSize: 'cover' }}
                  >
                    {/* Placeholder for initials or icon if no image exists */}
                    {!instructor.avatar && (
                      <span className="text-xs font-bold text-gray-500">
                        {instructor.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  
                  <span className={`font-medium ${isSelected ? "text-[#3D6B69]" : "text-gray-700"}`}>
                    {instructor.name}
                  </span>
                </div>

                {isSelected && (
                  <div className="bg-[#528E8C] rounded-full p-0.5 animate-in zoom-in duration-200">
                    <Check className="text-white" size={14} strokeWidth={3} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="p-6 pt-4">
          <button
            onClick={() => selectedId && onAssign(selectedId)}
            disabled={selectedId === null}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all transform active:scale-[0.98]
              ${selectedId !== null 
                ? "bg-[#2D7A78] cursor-pointer hover:bg-[#23615f] shadow-md" 
                : "bg-gray-300 cursor-not-allowed"}`}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignInstructorModal;