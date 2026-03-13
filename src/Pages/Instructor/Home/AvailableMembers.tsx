import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { ArrowLeft, Search, UserPlus, X, Loader2 } from "lucide-react";
import { Pagination } from "../../../components/Pagination/Pagination";
import { useSessionStore } from "../../../store/sessionStore";
import { getAvailableStudentsForCoursework } from "../../../Services/coursework Endpoints/Endpoints";
import { sendTeamInvitation } from "../../../Services/team Endpoints/Endpoints";
import toast from "react-hot-toast";

// --- Simple Modal Component ---
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  studentName,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentName: string;
  isSubmitting: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Confirm Invitation
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to invite{" "}
          <span className="font-semibold text-[#1A4D4C]">{studentName}</span> to
          your team?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-[#2D7A78] text-white rounded-xl font-medium hover:bg-[#1A4D4C] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Yes, Invite"}
          </button>
        </div>
      </div>
    </div>
  );
};

type AvailableStudent = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture?: {
    filename: string;
    storagePath: string;
    uploadedAt: string;
  } | null;
};

const PAGE_SIZE = 9;

const AvailableMembers: React.FC = () => {
  const navigate = useNavigate();
  const { id: classId } = useParams<{ id: string }>();
  const location = useLocation();

  const token = useSessionStore((state) => state.token);

  const { courseworkId, teamId, className, classCode, courseworkName } =
    (location.state || {}) as {
      courseworkId?: string;
      teamId: string;
      className?: string;
      classCode?: string;
      courseworkName?: string;
    };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{
    name: string;
    id: string;
  } | null>(null);

  const [students, setStudents] = useState<AvailableStudent[]>([]);
  const [invitedStudentIds, setInvitedStudentIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  useEffect(() => {
    if (!courseworkId || !token) {
      setError("Missing coursework information or authentication.");
      return;
    }

    const fetchAvailableStudents = async () => {
      setLoading(true);
      setError(null);
      setInfoMessage(null);
      try {
        const response = await getAvailableStudentsForCoursework(
          courseworkId,
          teamId,
          token,
        );

        const data = response.data;
        if (data?.success) {
          setStudents(data.data || []);
          if (data.count === 0 && data.message) {
            setInfoMessage(data.message);
          }
        } else {
          setError(data?.message || "Failed to load available students.");
        }
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "An unexpected error occurred while loading students.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableStudents();
  }, [courseworkId, token]);

  const handleInviteClick = (student: AvailableStudent) => {
    if (!teamId) {
      toast.error("Missing team information.");
      return;
    }
    setSelectedStudent({
      name: `${student.first_name} ${student.last_name}`,
      id: student.user_id,
    });
    setIsModalOpen(true);
  };

  const handleConfirmInvite = async () => {
    if (!selectedStudent || !teamId || !token) {
      setIsModalOpen(false);
      return;
    }

    try {
      setIsSendingInvite(true);
      const response = await sendTeamInvitation(
        teamId,
        selectedStudent.id,
        token,
      );
      if (response.data?.success) {
        toast.success(
          response.data.message || "Team invitation sent successfully.",
        );
        setInvitedStudentIds(
          (prev) => new Set([...Array.from(prev), selectedStudent.id]),
        );
      } else {
        toast.error(
          response.data?.message || "Failed to send team invitation.",
        );
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "An unexpected error occurred while sending the invitation.",
      );
    } finally {
      setIsSendingInvite(false);
      setIsModalOpen(false);
    }
  };

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return students;
    return students.filter((student) => {
      const fullName =
        `${student.first_name} ${student.last_name}`.toLowerCase();
      const email = student.email.toLowerCase();
      return fullName.includes(query) || email.includes(query);
    });
  }, [students, searchQuery]);

  const totalPages =
    filteredStudents.length === 0
      ? 1
      : Math.ceil(filteredStudents.length / PAGE_SIZE);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredStudents.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredStudents, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const headerTitle =
    (classCode && className && `${classCode} - ${className}`) ||
    className ||
    courseworkName ||
    "Available Members";

  return (
    <div className="min-h-screen bg-gray-50/50 px-3 py-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Header */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-base sm:text-xl md:text-2xl font-semibold text-gray-800 leading-snug">
            {headerTitle}
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
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
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
          <p className="text-gray-500 text-sm font-medium">
            Students ({students.length})
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#2D7A78]" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        ) : students.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            {infoMessage || "No available students found for this coursework."}
          </p>
        ) : (
          <>
            {/* responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
              {paginatedStudents.map((student) => {
                const fullName = `${student.first_name} ${student.last_name}`;
                const isInvited = invitedStudentIds.has(student.user_id);

                return (
                  <Link
                    to={`/student/${student.user_id}/profile`}
                    key={student.user_id}
                  >
                    <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-100 flex items-center justify-between gap-3 shadow-sm hover:border-[#2D7A78]/30 transition-colors">
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex-shrink-0" />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                            {fullName}
                          </h4>
                          <p className="text-xs text-gray-400 truncate">
                            {student.email}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          if (!isInvited) {
                            handleInviteClick(student);
                          }
                        }}
                        disabled={isInvited}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs font-semibold group cursor-pointer disabled:opacity-60 ${
                          isInvited
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-[#2D7A78]/10 text-[#2D7A78] hover:bg-[#2D7A78] hover:text-white"
                        }`}
                      >
                        <UserPlus
                          size={14}
                          className="group-hover:scale-110 transition-transform"
                        />
                        <span className="hidden xs:inline">
                          {isInvited ? "Invited" : "Invite"}
                        </span>
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}
      </div>

      {/* --- Modal Component Instance --- */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmInvite}
        studentName={selectedStudent?.name || ""}
        isSubmitting={isSendingInvite}
      />
    </div>
  );
};

export default AvailableMembers;
