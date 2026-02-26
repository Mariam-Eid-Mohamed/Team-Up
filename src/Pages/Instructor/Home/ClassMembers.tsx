import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, UserPlus } from 'lucide-react';
import { Pagination } from '../../../components/Pagination/Pagination';

const ClassMembers: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isInstructor = location.pathname.includes('/instructor');

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  return (
    <div className="min-h-screen bg-gray-50/50 px-3 py-4 sm:p-6 md:p-8"> {/* ⭐ better mobile padding */}
      <div className="max-w-6xl mx-auto">

        {/* Navigation Header */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8"> {/* ⭐ tighter spacing */}
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>

          {/* wrap title instead of truncate on small */}
          <h1 className="text-base sm:text-xl md:text-2xl font-semibold text-gray-800 leading-snug">
            CS101 - Introduction to programming
          </h1>
        </div>

        {/* Search & Stats Header */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A4D4C]">
              Class Members
            </h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              Instructors (3)
            </p>
          </div>

          {/* full width search always */}
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

        {/* Instructor List */}
        <div className="space-y-3 mb-8 sm:mb-12">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm"
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex-shrink-0" /> {/* ⭐ smaller avatar mobile */}

                <div className="min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                    Instructor Name
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-400 truncate">
                    instructor@university.edu
                  </p>
                </div>
              </div>

              {isInstructor && (
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#2D7A78] text-white rounded-lg text-sm font-medium hover:bg-[#246361] transition-all">
                  <UserPlus size={16} />
                  Assign Admin
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Students Header */}
        <div className="mb-4 sm:mb-6">
          <p className="text-gray-500 text-sm font-medium">Students (32)</p>
        </div>

        {/* responsive grid tuned for phones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100 flex items-center gap-3 sm:gap-4 shadow-sm"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex-shrink-0" />

              <div className="min-w-0">
                <h4 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                  Student Name
                </h4>
                <p className="text-xs text-gray-400 truncate">
                  student@university.edu
                </p>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default ClassMembers;