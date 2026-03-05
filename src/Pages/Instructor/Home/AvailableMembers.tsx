import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, UserPlus, X } from 'lucide-react';
import { Pagination } from '../../../components/Pagination/Pagination';

// --- Simple Modal Component ---
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  studentName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  studentName: string 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Confirm Invitation</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to add <span className="font-semibold text-[#1A4D4C]">{studentName}</span>?
        </p>
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-[#2D7A78] text-white rounded-xl font-medium hover:bg-[#1A4D4C] transition-colors"
          >
            Yes, Add
          </button>
        </div>
      </div>
    </div>
  );
};

const AvailableMembers: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // --- State for Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{name: string, id: number} | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const handleInviteClick = (name: string, id: number) => {
    setSelectedStudent({ name, id });
    setIsModalOpen(true);
  };

  const handleConfirmInvite = () => {
    console.log(`Confirmed: Adding ${selectedStudent?.name}`);
    // Add your API call logic here
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 px-3 py-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Header */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-base sm:text-xl md:text-2xl font-semibold text-gray-800 leading-snug">
            CS101 - Introduction to programming
          </h1>
        </div>

        {/* Search & Stats Header */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A4D4C]">
              Available Students
            </h2>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search member..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2D7A78]/20 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <p className="text-gray-500 text-sm font-medium">Students (32)</p>
        </div>

        {/* responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
          {Array.from({ length: 9 }).map((_, i) => {
            const studentName = `Student Name ${i + 1}`; // Demo name
            return (
              <div
                key={i}
                className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100 flex items-center justify-between gap-3 shadow-sm hover:border-[#2D7A78]/30 transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                      {studentName}
                    </h4>
                    <p className="text-xs text-gray-400 truncate">
                      student@university.edu
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => handleInviteClick(studentName, i)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#2D7A78]/10 text-[#2D7A78] hover:bg-[#2D7A78] hover:text-white rounded-lg transition-all text-xs font-semibold group"
                >
                  <UserPlus size={14} className="group-hover:scale-110 transition-transform" />
                  <span className="hidden xs:inline">Invite</span>
                </button>
              </div>
            );
          })}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* --- Modal Component Instance --- */}
      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmInvite}
        studentName={selectedStudent?.name || ""}
      />
    </div>
  );
};

export default AvailableMembers;