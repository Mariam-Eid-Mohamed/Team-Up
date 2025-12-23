import { useState } from "react";
import { Plus, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ClassCard } from "../../../components/ClassCard/ClassCard";
import type { Class } from "../../../App";
import { CreateClassForm } from "../../../components/CreateClassForm/CreateClassForm";
import { InviteStudentsModal } from "../../../components/InviteStudentModal/InviteStudentModal";

export function InstructorDashboard() {
  const navigate = useNavigate();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

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
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* HEADER ACTIONS */}
          {!isCreating && (
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-800">Instructor Dashboard</h1>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="flex-1 sm:flex-none px-4 py-2.5 text-sm bg-[#9B87F5] hover:bg-[#8B77E5] text-white rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Invite Students</span>
                </button>

                <button
                  onClick={() => setIsCreating(true)}
                  className="flex-1 sm:flex-none px-4 py-2.5 text-sm bg-[#9B87F5] hover:bg-[#8B77E5] text-white rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Class</span>
                </button>
              </div>
            </div>
          )}

          {/* DYNAMIC CONTENT AREA */}
          <div className="transition-all duration-300">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
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
        </div>
      </main>

      {/* INVITE STUDENTS MODAL */}
      <InviteStudentsModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        classes={classes}
      />
    </div>
  );
}