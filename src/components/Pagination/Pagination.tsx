import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  const pages = Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-8 py-8 border-t border-gray-100">
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#2D7A78] disabled:opacity-30 font-medium transition-colors"
      >
        <ChevronLeft size={18}/> <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="flex items-center gap-2">
        {pages.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-8 h-8 flex items-center justify-center text-sm rounded transition-all ${
              currentPage === pageNum 
                ? "bg-white border border-gray-300 text-[#2D7A78] font-bold shadow-sm" 
                : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            {pageNum}
          </button>
        ))}
        {totalPages > 3 && <span className="text-gray-400 px-1">...</span>}
      </div>

      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 text-sm text-[#2D7A78] hover:underline font-medium disabled:opacity-30"
      >
        <span className="hidden sm:inline">Next</span> <ChevronRight size={18}/>
      </button>
    </div>
  );
};