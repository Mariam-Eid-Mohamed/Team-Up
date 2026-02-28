import React, { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { TeamCard } from "../../components/Teams/TeamCard";

// 1. Mock Data for UI Development
const MOCK_TEAMS = [
  {
    id: "1",
    courseCode: "CS101",
    teamName: "Team Alpha",
    courseName: "Introduction to Computer Science",
    color: "text-blue-500",
    hasAccess: true,
  },
  {
    id: "2",
    courseCode: "CS455",
    teamName: "Team Alpha",
    courseName: "Advanced Networking",
    color: "text-purple-500",
    hasAccess: true,
  },
  {
    id: "3",
    courseCode: "IS202",
    teamName: "Team Alpha",
    courseName: "Information Systems",
    color: "text-pink-500",
    hasAccess: true,
  },
  {
    id: "4",
    courseCode: "IT333",
    teamName: "Team Alpha",
    courseName: "IT Infrastructure",
    color: "text-green-500",
    hasAccess: true,
  },
  {
    id: "5",
    courseCode: "CS455",
    teamName: "Team Beta",
    courseName: "Advanced Networking",
    color: "text-orange-500",
    hasAccess: true,
  },
];

const Teams: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(2); // Matches your screenshot's active page

  // 2. Client-side Search Filter (Temporary until API is ready)
  const filteredTeams = useMemo(() => {
    return MOCK_TEAMS.filter(
      (team) =>
        team.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.teamName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Teams</h1>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search for a team or class"
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="flex items-center justify-between gap-3 px-4 py-3 bg-[#1F6B6B] text-white rounded-lg font-medium min-w-[160px] hover:bg-[#164e4e] transition-colors shadow-sm">
            All Classes
            <ChevronDown size={18} />
          </button>
        </div>

        {/* Teams List Area */}
        <div className="space-y-4 min-h-[400px]">
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team) => (
              <TeamCard
                key={team.id}
                courseCode={team.courseCode}
                teamName={team.teamName}
                courseName={team.courseName}
                colorHex={team.color}
                hasAccess={team.hasAccess}
                onView={() => console.log(`Navigating to team ${team.id}`)}
              />
            ))
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <p className="text-lg font-medium">No teams found</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="mt-12 flex items-center justify-center gap-2 text-sm font-medium">
          <button className="flex items-center text-gray-400 hover:text-teal-600 px-2 py-1">
            <ChevronLeft size={16} /> Previous
          </button>

          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                currentPage === page
                  ? "bg-[#1F6B6B] text-white"
                  : "text-gray-500 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}

          <span className="text-gray-400 px-1">...</span>

          <button className="flex items-center text-gray-600 hover:text-teal-600 px-2 py-1">
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Teams;
