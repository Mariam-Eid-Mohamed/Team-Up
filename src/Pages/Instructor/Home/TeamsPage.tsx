import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search, ArrowLeft, UserPlus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
// import JoinTeamModal from "@/components/JoinTeamModal/JoinTeamModal";
import JoinTeamModal from "../../../components/JoinTeamModal/JoinTeamModal"

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

const TeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id, courseworkId } = useParams();
  const [expandedTeam, setExpandedTeam] = useState<string | null>("alpha"); // "alpha" open by default
  const [searchQuery, setSearchQuery] = useState("");
const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

// when student click join team
const handleJoinConfirm = () => {
    // For now, navigating to the constant UI workspace
    // navigate(`/student/teams/${selectedTeam?.id || 'constant-id'}`);
    // setSelectedTeam(null);
  };
  // Mock data - replace with your API call using courseworkId
  const teams: Team[] = [
    {
      id: "alpha",
      name: "Team Alpha",
      membersLeft: 3,
      members: [
        { id: "1", name: "Mariam Eid", role: "Leader" },
        { id: "2", name: "Dalia Adel" },
      ],
    },
    { id: "beta", name: "Team Beta", membersLeft: 1, members: [] },
    { id: "gamma", name: "Team Gamma", membersLeft: 2, members: [] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* Back Button and Title */}
      <div className="max-w-4xl mx-auto mb-8">
  {/* Back + Title in same row */}
  <div className="flex items-center gap-3 mb-1">
    <button
      onClick={() => navigate(-1)}
      className="text-gray-600 hover:text-black transition-colors"
    >
      <ArrowLeft size={22} />
    </button>

    <h1 className="text-2xl font-bold text-gray-800">
      CS101 - Introduction to programming using python
    </h1>
  </div>

  <h2 className="text-xl text-gray-700 ml-9">
    Classwork | Project A
  </h2>
</div>
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search for a team..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-[#2D7A78] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Teams List */}
        {teams.map((team) => (
          <div key={team.id} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            {/* Team Header */}
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                  className="text-gray-500 hover:text-black transition-colors"
                >
                  {expandedTeam === team.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{team.name}</h3>
                  <p className="text-xs text-gray-400">{team.membersLeft} member(s) left</p>
                </div>
              </div>

              <button type="button" onClick={() => setSelectedTeam(team)} className="flex items-center gap-2 bg-[#2D7A78] hover:bg-[#23615f] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                Join Team <UserPlus size={16} />
              </button>
            </div>

            {/* Expanded Member List */}
            {expandedTeam === team.id && (
              <div className="border-t border-gray-50 bg-white">
                <div className="px-5 py-3 bg-gray-50/50">
                  <span className="text-sm font-semibold text-[#2D7A78]">Team Members</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {team.members.map((member) => (
                    <div key={member.id} className="px-5 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">{member.name}</span>
                        {member.role === "Leader" && (
                          <span className="flex items-center text-[10px] text-yellow-600 font-bold uppercase tracking-wider">
                            <span className="mr-1">👑</span> Leader
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {team.members.length === 0 && (
                    <div className="p-5 text-sm text-gray-400 italic">No members yet</div>
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
        onClose={() => setSelectedTeam(null)}
        onConfirm={handleJoinConfirm}
      />
    </div>
  );
};

export default TeamsPage;