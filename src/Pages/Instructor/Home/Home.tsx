import { useState, useEffect } from "react";
import { Plus, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ClassCard } from "../../../components/ClassCard/ClassCard";
import type { Class } from "../../../interfaces/interfaces";
import { CreateClassForm } from "../../../components/CreateClassForm/CreateClassForm";
import { InviteStudentsModal } from "../../../components/InviteStudentModal/InviteStudentModal";
import { getUserClasses } from "../../../Services/class Endpoints/Endpoints";
import { getToken, getUserId } from "../../../utilis/token";

export function InstructorDashboard() {
  const navigate = useNavigate();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch classes on component mount
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const token = getToken();
    const userId = getUserId();

    if (!token || !userId) {
      setError("Authentication required. Please login again.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await getUserClasses(userId, token);

      if (response.data.success && response.data.data) {
        // Map API response to Class interface
        const mappedClasses: Class[] = response.data.data.map((classItem: any) => ({
          id: classItem._id,
          name: classItem.course_name || "",
          code: classItem.course_code || "",
          description: classItem.course_plan || "",
          year: classItem.year?.toString() || "",
          studentsCount: classItem.studentsCount || 0,
          teamsCount: classItem.teamsCount || 0,
          instructorsCount: classItem.instructorsCount || 1,
          color: classItem.class_color || "bg-blue-500", // Default color if not provided
        }));
        setClasses(mappedClasses);
      }
    } catch (error: any) {
      console.error("Failed to fetch classes:", error);
      setError(error.response?.data?.message || "Failed to load classes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const [newClass, setNewClass] = useState<Class>({
    id: "",
    name: "",
    code: "",
    description: "",
    year: "",
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
              <h1 className="text-2xl font-bold text-gray-800">
                Instructor Dashboard
              </h1>

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
                  // Class was successfully created via API
                  setIsCreating(false);
                  // Refresh the classes list
                  fetchClasses();
                }}
              />
            ) : (
              <>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500">Loading classes...</div>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                    <button
                      onClick={fetchClasses}
                      className="ml-4 text-red-800 underline hover:text-red-900"
                    >
                      Retry
                    </button>
                  </div>
                ) : classes.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No classes found.</p>
                    <button
                      onClick={() => setIsCreating(true)}
                      className="px-4 py-2 bg-[#9B87F5] text-white rounded-lg hover:bg-[#8B77E5]"
                    >
                      Create Your First Class
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {classes.map((classData) => (
                      <ClassCard
                        key={classData.id}
                        classData={classData}
                        onClick={() =>
                          navigate(`/instructor/classes/${classData.id}`)
                        }
                      />
                    ))}
                  </div>
                )}
              </>
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
