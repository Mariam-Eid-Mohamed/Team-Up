import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TeamCard } from "../../../components/Teams/TeamCard";
import { getInstructorTeams } from "@/Services/team Endpoints/Endpoints";
import { useSessionStore } from "@/store/sessionStore";

interface InstructorTeamItem {
  teamId: string;
  courseworkId: string | null;
  classId: string | null;
  courseCode: string;
  classCode: string;
  classColor: string;
  teamName: string;
  courseworkName: string;
}

const ITEMS_PER_PAGE = 4;

const normalizeInstructorTeam = (item: any): InstructorTeamItem | null => {
  if (!item || typeof item !== "object") return null;

  const teamId = item.teamId ?? item.team_id ?? item.id ?? item._id;
  if (!teamId) return null;

  return {
    teamId: String(teamId),
    courseworkId:
      item.courseworkId ?? item.coursework_id ?? item.coursework?.id ?? null,
    classId: item.classId ?? item.class_id ?? item.class?.id ?? null,
    courseCode: String(item.courseCode ?? item.course_code ?? ""),
    classCode: String(item.classCode ?? item.class_code ?? ""),
    classColor: String(item.classColor ?? item.class_color ?? "#FFFFFF"),
    teamName: String(item.teamName ?? item.team_name ?? ""),
    courseworkName: String(
      item.courseworkName ?? item.coursework_name ?? item.coursework?.name ?? "",
    ),
  };
};

const OwnTeams: React.FC = () => {
  const navigate = useNavigate();
  const token = useSessionStore((state) => state.token);
  const userId = useSessionStore((state) => state.userId);

  const [searchQuery, setSearchQuery] = useState("");
  const [teams, setTeams] = useState<InstructorTeamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      if (!token || !userId) {
        setError("User is not authenticated.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await getInstructorTeams(userId, token);

        const rawPayload = res.data?.data ?? res.data;
        const teamList = Array.isArray(rawPayload)
          ? rawPayload
          : Array.isArray(rawPayload?.teams)
            ? rawPayload.teams
            : Array.isArray(rawPayload?.items)
              ? rawPayload.items
              : [];

        const normalizedTeams = teamList
          .map(normalizeInstructorTeam)
          .filter(
            (team: InstructorTeamItem | null): team is InstructorTeamItem =>
              Boolean(team),
          );

        setTeams(normalizedTeams);
      } catch (err: any) {
        console.error("Failed to fetch teams:", err);
        setError(err?.response?.data?.message || "Failed to load teams.");
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [token, userId]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const classOptions = useMemo(() => {
    const uniqueCodes = Array.from(
      new Set(teams.map((team) => team.classCode).filter(Boolean)),
    );
    return ["All Classes", ...uniqueCodes];
  }, [teams]);

  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch =
        (team.courseCode || "").toLowerCase().includes(q) ||
        (team.classCode || "").toLowerCase().includes(q) ||
        (team.teamName || "").toLowerCase().includes(q) ||
        (team.courseworkName || "").toLowerCase().includes(q);

      const matchesClass =
        selectedClass === "All Classes" || team.classCode === selectedClass;

      return matchesSearch && matchesClass;
    });
  }, [teams, searchQuery, selectedClass]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedClass]);

  const totalPages = Math.ceil(filteredTeams.length / ITEMS_PER_PAGE);

  const paginatedTeams = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTeams.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTeams, currentPage]);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="min-h-screen bg-gray-50/50 px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            My Teams
          </h1>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center mb-6 sm:mb-8">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by team name or coursework..."
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div
            ref={filterRef}
            className="relative w-full md:w-[200px] shrink-0"
          >
            <button
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="w-full flex items-center justify-between gap-3 px-4 py-2.5 sm:py-3 bg-[#1F6B6B] text-white rounded-lg font-medium hover:bg-[#164e4e] transition-colors shadow-sm text-sm sm:text-base"
            >
              <span className="truncate">{selectedClass}</span>
              <ChevronDown size={18} />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden max-h-60 overflow-y-auto">
                {classOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setSelectedClass(option);
                      setIsFilterOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition"
                  >
                    <span className="block truncate">{option}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-gray-500">
              <p className="text-base sm:text-lg font-medium">
                Loading teams...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-red-500 text-center px-4">
              <p className="text-base sm:text-lg font-medium">{error}</p>
            </div>
          ) : paginatedTeams.length > 0 ? (
            paginatedTeams.map((team, index) => (
              <TeamCard
                key={`${team.teamId}-${index}`}
                courseCode={team.classCode || team.courseCode}
                teamName={team.teamName}
                courseName={team.courseworkName}
                classColor={team.classColor}
                hasAccess={true}
                onView={() =>
                  navigate(`/instructor/teams/${team.teamId}`, {
                    state: { courseworkId: team.courseworkId },
                  })
                }
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-gray-500 text-center px-4">
              <p className="text-base sm:text-lg font-medium">No teams found</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>

        {!loading && !error && totalPages > 1 && (
          <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-2 text-sm font-medium">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center px-2 py-1 ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:text-teal-600"
              }`}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                      currentPage === page
                        ? "bg-[#1F6B6B] text-white"
                        : "text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              type="button"
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`flex items-center px-2 py-1 ${
                currentPage === totalPages || totalPages === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:text-teal-600"
              }`}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnTeams;
