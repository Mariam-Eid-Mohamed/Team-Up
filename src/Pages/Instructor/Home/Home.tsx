import { useState } from "react";
import { Plus, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ClassCard } from "../../../components/ClassCard/ClassCard";
import type { Class } from "../../../App";
import { CreateClassForm } from "../../../components/CreateClassForm/CreateClassForm"; // import the new component
// import { CreateClassModal } from "../../../components/CreateClassModal/CreateClassModal";

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

  const [isCreating, setIsCreating] = useState(false);
  const [newClass, setNewClass] = useState<Class>({
    id: "",
    name: "",
    code: "",
    description: "",
    semester: "",
    studentsCount: 0,
    teamsCount: 0,
    instructorsCount: 1,
    color: "bg-blue-500",
  });

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
          {/* HEADER BUTTONS */}
          {!isCreating && (
            <div className="mb-6 flex gap-3 justify-end flex-nowrap">
              <button
                className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#9B87F5] text-white rounded-md sm:rounded-lg flex items-center gap-1.5 sm:gap-2 hover:bg-[#8B77E5] transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Invite Students
              </button>

              <button
                onClick={() => setIsCreating(true)}
                className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#9B87F5] text-white rounded-md sm:rounded-lg flex items-center gap-1.5 sm:gap-2 hover:bg-[#8B77E5] transition-colors"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Create Class
              </button>
            </div>
          )}

          {/* SHOW CREATE FORM OR CLASS CARDS */}
          {isCreating ? (
            <CreateClassForm
              newClass={newClass}
              setNewClass={setNewClass}
              onCancel={() => setIsCreating(false)}
              onCreate={() => {
                console.log("Create class:", newClass);
                setIsCreating(false);
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {classes.map((classData) => (
                <ClassCard
                  key={classData.id}
                  classData={classData}
                  onClick={() => navigate(`/instructor/classes/${classData.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
