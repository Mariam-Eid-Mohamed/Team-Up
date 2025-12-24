import React, { useState } from "react";
import { X, Search, Copy, RefreshCw } from "lucide-react";
import type { Class } from "../../App";

interface InviteStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classes: Class[];
}

export const InviteStudentsModal: React.FC<InviteStudentsModalProps> = ({ isOpen, onClose, classes }) => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const handleSelectClass = (id: string) => {
    setSelectedClassId(id);
  };

  const handleNextStep = () => {
    if (selectedClassId) setStep(2);
  };

  const handleClose = () => {
    setStep(1);
    setSelectedClassId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className={`bg-white w-full ${step === 1 ? 'max-w-md' : 'max-w-lg'} rounded-2xl shadow-xl p-6 transition-all duration-300`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Invite Students</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 1 ? (
          /* STEP 1: SELECT CLASS */
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-700">Select Class</label>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {classes.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleSelectClass(c.id)}
                  className={`p-4 border rounded-xl cursor-pointer transition-all ${
                    selectedClassId === c.id 
                    ? "border-green-500 bg-green-50/50 ring-1 ring-green-500" 
                    : "border-gray-100 hover:border-gray-300 bg-white"
                  }`}
                >
                  <p className="font-bold text-sm text-gray-800">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.code}</p>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-center text-gray-500 pt-4">Select a class to generate an invite code</p>
            
            <div className="flex gap-3 mt-6">
              <button onClick={handleClose} className="flex-1 py-2.5 border border-purple-200 text-gray-700 rounded-lg font-bold">
                Cancel
              </button>
              <button 
                onClick={handleNextStep}
                disabled={!selectedClassId}
                className="flex-1 py-2.5 bg-[#2D7A74] disabled:bg-gray-300 text-white rounded-lg font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: SEARCH & CODE */
          <div className="space-y-6">
             <label className="text-sm font-semibold text-gray-700">Select Class</label>
             {/* Selected Class Preview */}
             <div className="p-4 border border-green-500 bg-green-50/30 rounded-xl">
                <p className="font-bold text-sm text-gray-800">
                  {classes.find(c => c.id === selectedClassId)?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {classes.find(c => c.id === selectedClassId)?.code}
                </p>
             </div>

             {/* Search Input */}
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search by username" 
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D7A74]/20"
                />
             </div>

             <div className="text-center font-bold text-gray-400 text-xs">OR</div>

             {/* Invite Code Section */}
             <div className="p-4 bg-green-50/50 border border-green-100 rounded-xl space-y-3">
                <p className="text-xs font-bold text-gray-700">Invite code</p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-mono flex items-center justify-center">
                    389803ny
                  </div>
                  <button className="p-2 bg-[#2D7A74] text-white rounded-lg hover:bg-[#235e59]"><Copy className="w-4 h-4" /></button>
                  <button className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"><RefreshCw className="w-4 h-4" /></button>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Share this code with students so they can join your class. 
                  <br/>Click to reset class.
                </p>
             </div>

             <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(1)} className="flex-1 py-2.5 border border-purple-200 text-gray-700 rounded-lg font-bold">
                Back
              </button>
              <button onClick={handleClose} className="flex-1 py-2.5 bg-[#2D7A74] text-white rounded-lg font-bold">
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};