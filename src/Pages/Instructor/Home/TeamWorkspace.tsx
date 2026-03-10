import { useState, useEffect } from "react";
import {
  MessageSquare,
  UserPlus,
  Lock,
  Crown,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSessionStore } from "../../../store/sessionStore";
import {
  getTeamDetails,
  lockTeam,
} from "../../../Services/team Endpoints/Endpoints";
import toast from "react-hot-toast";

export default function TeamWorkspace() {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();
  const location = useLocation();
  const courseworkId = location.state?.courseworkId;
  const token = useSessionStore((state) => state.token);
  const userId = useSessionStore((state) => state.userId);

  const [activeTab, setActiveTab] = useState("Members");
  const tabs = ["Tasks", "Summary", "Members", "Insights"];

  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLocking, setIsLocking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeamDetails = async () => {
      if (!teamId || !courseworkId) {
        setError("Missing team or coursework information.");
        setLoading(false);
        return;
      }

      if (!token) {
        setError("Authentication required.");
        setLoading(false);
        return;
      }

      try {
        const response = await getTeamDetails(courseworkId, teamId, token);
        if (response.data?.success) {
          setTeamData(response.data.data);
        } else {
          setError(response.data?.message || "Failed to load team details");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "An unexpected error occurred.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [teamId, courseworkId, token]);

  const handleInviteClick = () => {
    if (!teamData || teamData.isLocked) return;
    const role = window.location.pathname.includes("/instructor")
      ? "instructor"
      : "student";
    navigate(
      `/${role}/classes/${teamData.classId || "unknown"}/available-members`,
    );
  };

  const handleLockTeam = async () => {
    if (!teamId || !token) return;

    setIsLocking(true);
    try {
      const response = await lockTeam(teamId, token);
      if (response.data) {
        toast.success(response.data.message || "Team locked successfully");
        setTeamData({ ...teamData, isLocked: true });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to lock the team");
    } finally {
      setIsLocking(false);
    }
  };

  const isLeader = teamData?.teamMembers?.some(
    (m: any) => m.id === userId && m.role === "LEADER",
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2D7A78]" />
      </div>
    );
  }

  if (error || !teamData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-4">
            {error || "Team not found"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-[#2D7A78] text-white rounded-md text-sm cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-[#F9FAFB] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm flex-shrink-0"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            {teamData.teamName}
          </h1>
          <p className="text-gray-500 text-sm">
            {teamData.classCode} {teamData.className} ·{" "}
            {teamData.courseworkName}
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleInviteClick}
            disabled={teamData.isLocked}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2 text-white rounded-lg text-sm font-semibold transition-colors
              ${teamData.isLocked ? "bg-gray-400 cursor-not-allowed" : "bg-[#528E8C] hover:bg-[#437674] cursor-pointer"}`}
          >
            <UserPlus size={16} />
            <span className="inline">Invite</span>
          </button>

          {isLeader && !teamData.isLocked && (
            <button
              onClick={handleLockTeam}
              disabled={isLocking}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-[#528E8C] text-white rounded-lg text-sm font-semibold hover:bg-[#437674] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLocking ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Lock size={16} />
              )}
              <span className="inline">Lock Team</span>
            </button>
          )}

          {teamData.isLocked && (
            <button
              disabled
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-gray-400 text-white rounded-lg text-sm font-semibold cursor-not-allowed"
            >
              <Lock size={16} />
              <span className="inline">Team Locked</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs - Scrollable on mobile */}
      <div className="flex gap-6 md:gap-8 border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-all relative whitespace-nowrap cursor-pointer ${
              activeTab === tab
                ? "text-[#2D7A78]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2D7A78]" />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {activeTab === "Members" && (
        <div className="space-y-6 md:space-y-8">
          {/* Instructors Section */}
          <section>
            <h2 className="text-[#1B4D49] font-bold text-lg mb-4">
              Instructor
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                <div
                  //made the avatar background the same color as the class color
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-200 flex-shrink-0 flex items-center justify-center font-bold uppercase"
                  style={{
                    backgroundColor: teamData.classColor || "#f3f4f6",
                    color: teamData.classColor ? "#ffffff" : "#6b7280",
                  }}
                >
                  {teamData.instructor ? teamData.instructor.charAt(0) : "?"}
                </div>
                <div>
                  <p className="font-bold text-sm md:text-base text-gray-800">
                    {teamData.instructor || "No Instructor Assigned"}
                  </p>
                  <p className="text-xs text-gray-400">Instructor</p>
                </div>
              </div>
              {teamData.instructor && (
                <button className="p-2 text-[#2D7A78] hover:bg-gray-50 rounded-full transition-colors cursor-pointer">
                  <MessageSquare size={20} />
                </button>
              )}
            </div>
          </section>

          {/* Team Members Section */}
          <section>
            <h2 className="text-[#1B4D49] font-bold text-lg mb-4">
              Team Members
            </h2>
            <div className="space-y-3">
              {teamData.teamMembers?.map((member: any) => (
                <div
                  key={member.id}
                  onClick={() => navigate(`/student/${member.id}/profile`)}
                  className="cursor-pointer bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                    <div
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-200 flex-shrink-0 flex items-center justify-center font-bold uppercase"
                      style={{
                        backgroundColor: teamData.classColor || "#f3f4f6",
                        color: teamData.classColor ? "#ffffff" : "#6b7280",
                      }}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-sm md:text-base text-gray-800 truncate">
                          {member.name}
                        </p>
                        {member.role === "LEADER" && (
                          <span className="flex items-center gap-1 text-[10px] md:text-xs text-yellow-600 font-semibold bg-yellow-50 px-2 py-0.5 rounded-full">
                            <Crown size={12} className="fill-yellow-600" />
                            Leader
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">Student</p>
                    </div>
                  </div>
                  {member.id !== userId && (
                    <button className="p-2 text-[#2D7A78] hover:bg-gray-50 rounded-full transition-colors flex-shrink-0 cursor-pointer">
                      <MessageSquare size={20} />
                    </button>
                  )}
                </div>
              ))}

              {(!teamData.teamMembers || teamData.teamMembers.length === 0) && (
                <p className="text-sm text-gray-500 italic">
                  No members found.
                </p>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
