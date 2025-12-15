import { useState } from "react";
import { Plus, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ClassCard } from "../../../components/ClassCard/ClassCard";
import type { Class } from "../../../App";

export function InstructorDashboard() {
  const navigate = useNavigate();

  const [classes] = useState<Class[]>([
    {
      id: "1",
      name: "CS 101 - Introduction to Programming",
      code: "CS101",
      description: "Learn the fundamentals of programming using Python",
      semester: "Fall 2025",
      studentsCount: 45,
      teamsCount: 9,
      color: "bg-blue-500",
    },
    {
      id: "2",
      name: "CS 301 - Data Structures",
      code: "CS301",
      description: "Advanced data structures and algorithms",
      semester: "Fall 2025",
      studentsCount: 38,
      teamsCount: 8,
      color: "bg-purple-500",
    },
    {
      id: "3",
      name: "CS 401 - Software Engineering",
      code: "CS401",
      description: "Software development methodologies and practices",
      semester: "Fall 2025",
      studentsCount: 32,
      teamsCount: 6,
      color: "bg-green-500",
    },
  ]);

  return (
    <div className="flex h-screen bg-[#FAFAFA]">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 my-3 sm:px-8 py-8">
          {/* Buttons */}
          <div className="mb-6 flex gap-3 justify-end flex-nowrap">
  <button className="
    px-2 sm:px-4        /* smaller horizontal padding on mobile */
    py-1.5 sm:py-2      /* smaller vertical padding on mobile */
    text-xs sm:text-sm   /* smaller font on mobile */
    bg-[#9B87F5] text-white
    rounded-md sm:rounded-lg
    flex items-center gap-1.5 sm:gap-2   /* smaller gap on mobile */
    hover:bg-[#8B77E5] transition-colors
  ">
    <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />  {/* smaller icon on mobile */}
    Invite Students
  </button>

  <button className="
    px-2 sm:px-4
    py-1.5 sm:py-2
    text-xs sm:text-sm
    bg-[#9B87F5] text-white
    rounded-md sm:rounded-lg
    flex items-center gap-1.5 sm:gap-2
    hover:bg-[#8B77E5] transition-colors
  ">
    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    Create Class
  </button>
</div>


        

          {/* My Classes */}
          <div>
            {/* <h2 className="text-[#171717] mb-4 text-lg font-semibold">My Classes</h2> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {classes.map((classData) => (
                <ClassCard
                  key={classData.id}
                  classData={classData}
                  onClick={() => navigate(`/instructor/classes/${classData.id}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


//  <button
//               onClick={() => setShowAnnouncement(true)}
//               className="px-4 py-2 bg-[#7DD3FC] text-white rounded-lg hover:bg-[#38BDF8] transition-colors flex items-center gap-2"
//             >
//               <Megaphone className="w-4 h-4" />
//               New Announcement
//             </button>