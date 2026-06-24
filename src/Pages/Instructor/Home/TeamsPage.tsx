import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  ArrowLeft,
  UserPlus,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import JoinTeamModal from "../../../components/JoinTeamModal/JoinTeamModal";
import { getToken, getUserId } from "@/utilis/token";
import {
  getCourseworkTeams,
  getUserClasses,
  GetClassPosts,
} from "@/Services/class Endpoints/Endpoints";
import type { Post } from "@/Types/posts";
import { sendJoinRequest } from "@/Services/team Endpoints/Endpoints";
import toast from "react-hot-toast";

interface TeamMember {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
}

interface Team {
  id: string;
  name: string;
  membersLeft: number;
  members: TeamMember[];
}

// API response types
interface ApiTeamMember {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: string;
}

interface ApiTeam {
  teamId?: string;
  _id?: string;
  id?: string;
  teamName: string;
  teamMembers: ApiTeamMember[];
  courseworkName: string;
  className: string;
}

interface CourseworkTeamsResponse {
  success: boolean;
  data: ApiTeam[];
}

function mapApiTeamToTeam(apiTeam: ApiTeam): Team {
  const members: TeamMember[] = (apiTeam.teamMembers ?? []).map((m) => ({
    id: m._id,
    name: `${m.first_name} ${m.last_name}`.trim() || m.username,
    role: m.role === "LEADER" ? "Leader" : undefined,
  }));

  const teamId = apiTeam.teamId || apiTeam._id || apiTeam.id || "";
  if (!teamId) {
    console.warn("API returned a team without an ID identifier:", apiTeam);
  }

  return {
    id: teamId,
    name: apiTeam.teamName,
    membersLeft: 0, // API does not return max size; display uses member count only
    members,
  };
}

function formatClassName(classItem: {
  course_code?: string;
  course_name?: string;
}): string {
  return classItem.course_code && classItem.course_name
    ? `${classItem.course_code} - ${classItem.course_name}`
    : classItem.course_name || classItem.course_code || "Class";
}

const TeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state || {}) as {
    courseworkName?: string;
    className?: string;
  };
  const { id: classId, courseworkId } = useParams<{
    id: string;
    courseworkId: string;
  }>();
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseworkName, setCourseworkName] = useState<string>(
    navState.courseworkName ?? "Coursework",
  );
  const [className, setClassName] = useState<string>(
    navState.className ?? "Class",
  );
  const [isJoining, setIsJoining] = useState(false);
  const [pendingTeams, setPendingTeams] = useState<Set<string>>(new Set());

  const fetchTeams = useCallback(async () => {
    if (!classId || !courseworkId) return;
    const token = getToken();
    if (!token) {
      setError("Please sign in to view teams.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const userId = getUserId();
      const [teamsResult, classesResult, postsResult] =
        await Promise.allSettled([
          getCourseworkTeams(classId, courseworkId, token, { locked: false }),
          userId ? getUserClasses(userId, token) : Promise.reject(),
          GetClassPosts(classId, token),
        ]);

      if (teamsResult.status === "rejected") {
        throw teamsResult.reason;
      }

      const { data } = teamsResult.value.data as CourseworkTeamsResponse;
      const list = Array.isArray(data) ? data : [];
      setTeams(list.map(mapApiTeamToTeam));

      let resolvedClassName = navState.className ?? "Class";
      let resolvedCourseworkName = navState.courseworkName ?? "Coursework";

      if (list.length > 0) {
        resolvedClassName = list[0].className ?? resolvedClassName;
        resolvedCourseworkName =
          list[0].courseworkName ?? resolvedCourseworkName;
      } else {
        if (
          classesResult.status === "fulfilled" &&
          classesResult.value.data?.success &&
          classesResult.value.data.data
        ) {
          const classItem = classesResult.value.data.data.find(
            (c: { _id: string }) => c._id === classId,
          );
          if (classItem) {
            resolvedClassName = formatClassName(classItem);
          }
        }

        if (
          postsResult.status === "fulfilled" &&
          postsResult.value.data?.posts
        ) {
          const posts: Post[] = postsResult.value.data.posts;
          const courseworkPost = posts.find(
            (post): post is Extract<Post, { type: "COURSEWORK" }> =>
              post.type === "COURSEWORK" &&
              post.courseworkId._id === courseworkId,
          );
          if (courseworkPost) {
            resolvedCourseworkName =
              courseworkPost.courseworkId.name ?? resolvedCourseworkName;
          }
        }
      }

      setClassName(resolvedClassName);
      setCourseworkName(resolvedCourseworkName);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Failed to load teams.";
      setError(message ?? "Failed to load teams.");
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }, [classId, courseworkId, navState.className, navState.courseworkName]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleJoinConfirm = async () => {
    if (!selectedTeam) return;

    if (!selectedTeam.id) {
      toast.error(
        "Cannot join team: this team is missing an ID. Check the developer console for details.",
      );
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error("Please sign in to send a join request.");
      return;
    }

    setIsJoining(true);
    try {
      const response = await sendJoinRequest(selectedTeam.id, token);

      const newStatus = response?.data?.data?.status;

      toast.success("Join request sent successfully.");

      if (newStatus === "PENDING" || !newStatus) {
        setPendingTeams((prev) => {
          const newSet = new Set(prev);
          newSet.add(selectedTeam.id);
          return newSet;
        });
      }
      setSelectedTeam(null);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Failed to send join request. Please try again.";
      toast.error(message ?? "Failed to send join request. Please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 font-sans">
      {/* Back Button and Title */}
      <div className="max-w-6xl mx-auto mb-6 md:mb-8">
        <div className="flex items-start md:items-center gap-3 mb-1">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-lg"
          >
            <ArrowLeft size={22} />
          </button>

          <h1 className="text-lg md:text-2xl font-bold text-gray-800 leading-tight">
            {className}
          </h1>
        </div>

        <h2 className="text-base md:text-xl text-gray-700 ml-8 md:ml-9">
          Coursework | {courseworkName}
        </h2>
      </div>

      <div className="max-w-6xl mx-auto space-y-4">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search for a team..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full bg-white  focus:outline-none focus:ring-2 focus:ring-[#2D7A78]/20 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 text-center text-gray-500">
            Loading teams...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-white border border-red-100 rounded-xl shadow-sm p-6 text-center text-red-600">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredTeams.length === 0 && (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-8 text-center text-gray-500">
            {teams.length === 0
              ? "No teams available for this coursework yet."
              : "No teams match your search."}
          </div>
        )}

        {/* Teams List */}
        {!loading &&
          !error &&
          filteredTeams.map((team) => (
            <div
              key={team.id}
              className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
            >
              {/* Team Header - Stacked on mobile, row on tablet+ */}
              <div className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <button
                    onClick={() =>
                      setExpandedTeam(expandedTeam === team.id ? null : team.id)
                    }
                    className="text-gray-500 hover:text-black transition-colors"
                  >
                    {expandedTeam === team.id ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                  <div>
                    <h3 className="font-semibold text-base md:text-lg text-gray-800">
                      {team.name}
                    </h3>
                    <p className="text-[10px] md:text-xs text-gray-400">
                      {team.members.length} member(s)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTeam(team)}
                  disabled={pendingTeams.has(team.id)}
                  className={`flex items-center justify-center gap-2 px-4 md:px-6 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto ${
                    pendingTeams.has(team.id)
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-[#2D7A78] cursor-pointer hover:bg-[#23615f] text-white"
                  }`}
                >
                  {pendingTeams.has(team.id) ? (
                    "Pending"
                  ) : (
                    <>
                      Join Team <UserPlus size={16} />
                    </>
                  )}
                </button>
              </div>

              {/* Expanded Member List */}
              {expandedTeam === team.id && (
                <div className="border-t border-gray-50 bg-white">
                  <div className="px-4 md:px-5 py-2 md:py-3 bg-gray-50/50">
                    <span className="text-xs md:text-sm font-semibold text-[#2D7A78]">
                      Team Members
                    </span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {team.members.map((member) => (
                      <div
                        key={member.id}
                        className="px-4 md:px-5 py-3 md:py-4 flex items-center gap-3"
                      >
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex-shrink-0" />
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            {member.name}
                          </span>
                          {member.role === "Leader" && (
                            <span className="flex items-center text-[9px] md:text-[10px] text-yellow-600 font-bold uppercase tracking-wider bg-yellow-50 px-2 py-0.5 rounded">
                              👑 Leader
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {team.members.length === 0 && (
                      <div className="p-5 text-sm text-gray-400 italic">
                        No members yet
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>

      <JoinTeamModal
        isOpen={!!selectedTeam}
        teamName={selectedTeam?.name || ""}
        isLoading={isJoining}
        onClose={() => setSelectedTeam(null)}
        onConfirm={handleJoinConfirm}
      />
    </div>
  );
};

export default TeamsPage;
