import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { ClassCard } from "../../../components/ClassCard/ClassCard";
import type { Class } from "../../../App";
import JoinClassModal from "../../../components/JoinClassModal/JoinClassModal"; // Ensure this path matches your file structure

export function StudentDashboard() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const [classes] = useState<Class[]>([
    {
      id: "1",
      name: "CS 101 - Introduction to Programming",
      code: "CS101",
      description: "Learn the fundamentals of programming using Python",
      semester: "Fall 2025",
      studentsCount: 45,
      teamsCount: 9,
      instructorsCount: 1,
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
      instructorsCount: 1,
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
      instructorsCount: 1,
      color: "bg-green-500",
    },
  ]);

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
                My Classes
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Overview of your enrolled courses
              </p>
            </div>
            
            {/* Dark Green Responsive Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1B4D49] hover:bg-[#2D7A74] text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-teal-900/10 transition-all active:scale-95"
            >
              <span className="text-sm md:text-base">Join Class</span>
              <LogIn className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Grid Layout (2 columns for large screens as per your previous request) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {classes.map((classData) => (
              <ClassCard
                key={classData.id}
                classData={classData}
                onClick={() => navigate(`/student/classes/${classData.id}`)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Modal Integration */}
      <JoinClassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}