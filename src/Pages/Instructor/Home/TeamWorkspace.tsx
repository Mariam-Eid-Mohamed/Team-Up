import { useState, useEffect } from "react";
import {
  MessageSquare,
  UserPlus,
  Lock,
  Crown,
  Loader2,
  ArrowLeft,
  UserMinus,
} from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSessionStore } from "../../../store/sessionStore";
import {
  getTeamDetails,
  lockTeam,
  assignInstructor,
  getInstructorTeams,
  kickStudentFromTeam,
} from "../../../Services/team Endpoints/Endpoints";
import toast from "react-hot-toast";
import AssignInstructorMenu from "@/components/AssignInstructor/AssignInstructorMenu";

interface Instructor {
  id: string | number;
  name: string;
  avatar?: string;
}
import { getClassInstructors } from "../../../Services/class Endpoints/Endpoints";
import InsightsDashboard from "@/components/InsightsDashboard/InsightsDashboard";

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
  const [isKickModalOpen, setIsKickModalOpen] = useState(false);
  const [memberToKick, setMemberToKick] = useState<{ id: string, name: string } | null>(null);
  const [isKicking, setIsKicking] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [instructorsList, setInstructorsList] = useState<Instructor[]>([]);

  const isInstructorRoute = location.pathname.includes("/instructor");
  const [isAssignedInstructor, setIsAssignedInstructor] = useState(false);

  const handleAssign = async (id: number | string) => {
    if (!teamId || !token) return;
    try {
      const response = await assignInstructor(teamId, id.toString(), token);
      if (response.data.success) {
        toast.success("Instructor assigned successfully.");
        setShowModal(false);
        setTeamData({
          ...teamData,
          instructor: response.data.data.instructor.name
        });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to assign instructor");
    }
  };

  const fetchInstructors = async () => {
    const classIdToUse = teamData?.classId;
    if (!classIdToUse) {
      toast.error("Could not find class ID to fetch instructors.");
      return;
    }
    if (!token) return;

    try {
      const resp = await getClassInstructors(classIdToUse, token);

      const responseData = resp.data?.data || resp.data;
      if (Array.isArray(responseData)) {
        const mapped = responseData.map((inv: any) => ({
          id: inv.id || inv._id,
          name: inv.first_name + ' ' + inv.last_name || inv.username || 'Unknown',
          avatar: inv.profile_picture || inv.avatar || undefined
        }));
        setInstructorsList(mapped);
      } else {
        toast.error("Invalid response format for instructors");
      }
    } catch (err) {
      toast.error("Failed to fetch instructors");
    }
  };
  const handleKickMember = async () => {
    if (!memberToKick || !token || !teamId || isKicking) return;
    if (!isInstructorRoute || !isAssignedInstructor) {
      toast.error("Only the assigned instructor can remove team members.");
      return;
    }

    setIsKicking(true);
    try {
      const response = await kickStudentFromTeam(teamId, memberToKick.id, token);
      toast.success(
        response.data?.message || `${memberToKick.name} has been removed`,
      );

      setTeamData({
        ...teamData,
        teamMembers: teamData.teamMembers.filter(
          (m: any) => m.id !== memberToKick.id,
        ),
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to kick member");
    } finally {
      setIsKicking(false);
      setIsKickModalOpen(false);
      setMemberToKick(null);
    }
  };
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

  useEffect(() => {
    const checkInstructorStatus = async () => {
      if (isInstructorRoute && token && userId && teamId) {
        try {
           const response = await getInstructorTeams(userId, token);
           const data = response.data?.data || response.data;
           if (Array.isArray(data)) {
              const ownsTeam = data.some((team: any) => team.teamId === teamId);
              setIsAssignedInstructor(ownsTeam);
           }
        } catch (err) {
           console.error("Failed to verify instructor team ownership:", err);
        }
      }
    };
    checkInstructorStatus();
  }, [isInstructorRoute, token, userId, teamId]);

  const handleInviteClick = () => {
    if (!teamData || teamData.isLocked) return;
    const role = window.location.pathname.includes("/instructor")
      ? "instructor"
      : "student";
    navigate(
      `/${role}/classes/${teamData.classId || "unknown"}/available-members`,
      {
        state: {
          courseworkId,
          teamId,
          className: teamData.className,
          classCode: teamData.classCode,
          courseworkName: teamData.courseworkName,
        },
      },
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm flex-shrink-0"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div><h1 className="text-xl md:text-2xl font-bold text-gray-900">
            {teamData.teamName}
          </h1>
            <p className="text-gray-500 text-sm">
              {teamData.className} -{" "}
              {teamData.courseworkName}
            </p></div>

        </div>

        {!isInstructorRoute && (
          <div className="flex gap-2 w-full sm:w-auto">

            {isLeader && !teamData.instructor && (
              <button
                onClick={() => {
                  fetchInstructors();
                  setShowModal(true);
                }}
                disabled={teamData.isLocked}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 md:px-4 py-2 text-white rounded-lg text-sm font-semibold transition-colors
                  ${teamData.isLocked ? "bg-gray-400 cursor-not-allowed" : "bg-[#528E8C] hover:bg-[#437674] cursor-pointer"}`}
              >
                <UserPlus size={16} />
                <span className="inline">Assign instructor</span>
              </button>
            )}
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
        )}
      </div>

      {/* Navigation Tabs - Scrollable on mobile */}
      <div className="flex gap-6 md:gap-8 border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-all relative whitespace-nowrap cursor-pointer ${activeTab === tab
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
              {/* {teamData.instructor && (
                <button className="p-2 text-[#2D7A78] hover:bg-gray-50 rounded-full transition-colors cursor-pointer">
                  <MessageSquare size={20} />
                </button>
              )} */}
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
                  {/* GROUP 1: AVATAR AND NAME */}
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

                  {/* ✅ GROUP 2: ACTION BUTTONS (The Fix) */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* {member.id !== userId && (
                      <button
                        onClick={(e) => e.stopPropagation()} // Prevent card click
                        className="p-2 text-[#2D7A78] hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
                      >
                        <MessageSquare size={20} />
                      </button>
                    )} */}

                    {isInstructorRoute &&
                      isAssignedInstructor &&
                      member.id !== userId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          setMemberToKick({ id: member.id, name: member.name });
                          setIsKickModalOpen(true);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                        title="Kick Member"
                      >
                        <UserMinus size={20} />
                      </button>
                    )}
                  </div>
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

      {activeTab === "Insights" && (
  <InsightsDashboard />
)}
      <AssignInstructorMenu
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        instructors={instructorsList}
        onAssign={handleAssign}
      />
      {/* ✅ KICK CONFIRMATION MODAL */}
      {isKickModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999] backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-[400px] shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              Kick Member
            </h2>

            <p className="text-center text-gray-600 mb-8 leading-relaxed">
              Are you sure you want to kick <span className="font-semibold text-red-600">{memberToKick?.name}</span> from the team? This action cannot be undone.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (isKicking) return;
                  setIsKickModalOpen(false);
                  setMemberToKick(null);
                }}
                disabled={isKicking}
                className="flex-1 px-4 py-2 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleKickMember}
                disabled={isKicking}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                {isKicking ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Kicking...
                  </>
                ) : (
                  "Kick"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}