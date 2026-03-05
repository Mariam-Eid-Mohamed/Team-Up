import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, UserPlus, RefreshCw } from 'lucide-react';
import { Pagination } from '../../../components/Pagination/Pagination';
import { getToken } from '@/utilis/token';
import { getClassMembers } from '@/Services/class Endpoints/Endpoints';

export interface ClassMember {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: string;
  classRole: string;
  joined_date: string;
}

interface ClassMembersResponse {
  success: boolean;
  data: {
    instructors: ClassMember[];
    students: ClassMember[];
  };
}

const MEMBERS_PER_PAGE = 9;

const ClassMembers: React.FC = () => {
  const navigate = useNavigate();
  const { id: classId } = useParams<{ id: string }>();
  const location = useLocation();
  const isInstructor = location.pathname.includes('/instructor');
  const className = (location.state as { className?: string } | null)?.className;

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [instructors, setInstructors] = useState<ClassMember[]>([]);
  const [students, setStudents] = useState<ClassMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMembers = useCallback(async (isRefresh = false) => {
    if (!classId) return;
    const token = getToken();
    if (!token) {
      setError('Please sign in to view class members.');
      setLoading(false);
      return;
    }
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const response = await getClassMembers(classId, token);
      const data = (response.data as ClassMembersResponse).data;
      setInstructors(data?.instructors ?? []);
      setStudents(data?.students ?? []);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Failed to load class members.';
      setError(message ?? 'Failed to load class members.');
      setInstructors([]);
      setStudents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchMembers(false);
  }, [fetchMembers]);

  const handleRefresh = () => {
    fetchMembers(true);
  };

  const filteredInstructors = instructors.filter(
    (m) =>
      `${m.first_name} ${m.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredStudents = students.filter(
    (m) =>
      `${m.first_name} ${m.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStudentPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / MEMBERS_PER_PAGE)
  );
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * MEMBERS_PER_PAGE,
    currentPage * MEMBERS_PER_PAGE
  );

  const handleAssignAdmin = (_member: ClassMember) => {
    // TODO: integrate Assign Admin API when available; on success call fetchMembers(true) to refresh the list
  };

  if (!classId) {
    return (
      <div className="min-h-screen bg-gray-50/50 px-3 py-4 sm:p-6 md:p-8 flex items-center justify-center">
        <p className="text-gray-500">Invalid class.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 px-3 py-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Header */}
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm flex-shrink-0"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-base sm:text-xl md:text-2xl font-semibold text-gray-800 leading-snug truncate">
              {className ?? 'Class Members'}
            </h1>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-600 hover:text-[#2D7A78] hover:border-[#2D7A78]/30 transition-colors disabled:opacity-50 flex-shrink-0"
            title="Refresh members"
          >
            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Search & Stats Header */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A4D4C]">
              Class Members
            </h2>
            {!loading && !error && (
              <p className="text-gray-500 text-sm mt-1 font-medium">
                Instructors ({filteredInstructors.length})
              </p>
            )}
          </div>
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search member..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2D7A78]/20 shadow-sm"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#2D7A78] border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Instructor List */}
            <div className="space-y-3 mb-8 sm:mb-12">
              {filteredInstructors.map((member) => (
                <div
                  key={member._id}
                  className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                        {member.first_name} {member.last_name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-400 truncate">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  {isInstructor && (
                    <button
                      onClick={() => handleAssignAdmin(member)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#2D7A78] text-white rounded-lg text-sm font-medium hover:bg-[#246361] transition-all"
                    >
                      <UserPlus size={16} />
                      Assign Admin
                    </button>
                  )}
                </div>
              ))}
              {filteredInstructors.length === 0 && (
                <p className="text-gray-500 text-sm py-2">No instructors match your search.</p>
              )}
            </div>

            {/* Students Header */}
            <div className="mb-4 sm:mb-6">
              <p className="text-gray-500 text-sm font-medium">
                Students ({filteredStudents.length})
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
              {paginatedStudents.map((member) => (
                <div
                  key={member._id}
                  className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100 flex items-center gap-3 sm:gap-4 shadow-sm"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                      {member.first_name} {member.last_name}
                    </h4>
                    <p className="text-xs text-gray-400 truncate">{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
            {filteredStudents.length === 0 && (
              <p className="text-gray-500 text-sm py-2">No students match your search.</p>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalStudentPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ClassMembers;
