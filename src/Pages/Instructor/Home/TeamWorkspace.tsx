import React, { useState } from "react";
import { 
  MessageSquare, 
  UserPlus, 
  Lock, 
  Crown 
} from "lucide-react";
// 1. Import useNavigate
import { useNavigate } from "react-router-dom";

const teamData = {
  name: "Team Alpha",
  project: "Project A",
  course: "CS101",
  classId: "123", // Assuming you have the class ID in your data
  instructor: {
    name: "Nourhan Ihab",
    role: "Instructor",
  },
  members: [
    { id: 1, name: "Mariam Eid", role: "Leader", section: "Section 1" },
    { id: 2, name: "Anas Mohamed", role: "Member", section: "Section 2" },
    { id: 3, name: "Nada Mohamed", role: "Member", section: "Section 1" },
    { id: 4, name: "Marwan Mohamed", role: "Member", section: "Section 2" },
  ]
};

export default function TeamWorkspace() {
  // 2. Initialize navigate
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Members");
  const tabs = ["Tasks", "Summary", "Members", "Insights"];

  // 3. Handle Navigation
  const handleInviteClick = () => {
    // Determine role (you can also pass this as a prop to the component)
    const role = window.location.pathname.includes('/instructor') ? 'instructor' : 'student';
    
    // Navigate to the members page using the pattern from your App.tsx
    navigate(`/${role}/classes/${teamData.classId}/members`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#F9FAFB] min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{teamData.name}</h1>
          <p className="text-gray-500 text-sm">
            {teamData.project} · {teamData.course}
          </p>
        </div>
        <div className="flex gap-3">
          {/* Add the onClick handler here */}
          <button 
            onClick={handleInviteClick}
            className="flex items-center gap-2 px-4 py-2 bg-[#528E8C] text-white rounded-lg text-sm font-semibold hover:bg-[#437674] transition-colors"
          >
            <UserPlus size={16} />
            Invite Members
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-[#528E8C] text-white rounded-lg text-sm font-semibold hover:bg-[#437674] transition-colors">
            <Lock size={16} />
            Lock Team
          </button>
        </div>
      </div>

      
      
      {/* Navigation Tabs */}
      <div className="flex gap-8 border-b border-gray-200 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-all relative ${
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
        <div className="space-y-8">
          <section>
            <h2 className="text-[#1B4D49] font-bold text-lg mb-4">Instructors</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-gray-200 bg-gray-100 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-800">{teamData.instructor.name}</p>
                  <p className="text-xs text-gray-400">{teamData.instructor.role}</p>
                </div>
              </div>
              <button className="p-2 text-[#2D7A78] hover:bg-gray-50 rounded-full transition-colors">
                <MessageSquare size={20} />
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-[#1B4D49] font-bold text-lg mb-4">Team Members</h2>
            <div className="space-y-3">
              {teamData.members.map((member) => (
                <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-gray-200 bg-gray-100 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-800">{member.name}</p>
                        {member.role === "Leader" && (
                          <span className="flex items-center gap-1 text-xs text-yellow-600 font-semibold bg-yellow-50 px-2 py-0.5 rounded-full">
                            <Crown size={12} className="fill-yellow-600" />
                            Leader
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{member.section}</p>
                    </div>
                  </div>
                  <button className="p-2 text-[#2D7A78] hover:bg-gray-50 rounded-full transition-colors">
                    <MessageSquare size={20} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}