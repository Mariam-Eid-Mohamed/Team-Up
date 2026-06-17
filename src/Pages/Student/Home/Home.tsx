import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { ClassCard } from "../../../components/ClassCard/ClassCard";
import type { Class } from "../../../interfaces/interfaces";
import JoinClassModal from "../../../components/JoinClassModal/JoinClassModal";
import { getUserClasses } from "../../../Services/class Endpoints/Endpoints";
import { getToken, getUserId } from "../../../utilis/token";

export function StudentDashboard() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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
          studentCount: classItem.studentCount || 0,
          memberCount: classItem.memberCount || 0,
          instructorCount: classItem.instructorCount || 1,
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
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md  bg-[#2D7A78] cursor-pointer hover:bg-[#23615f] text-white  "
            >
              <span className="text-sm md:text-base">Join Class</span>
              <LogIn className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Grid Layout (2 columns for large screens as per your previous request) */}
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
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-[#1B4D49] text-white rounded-lg hover:bg-[#2D7A74]"
              >
                Join Your First Class
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {classes.map((classData) => (
                <ClassCard
                  key={classData.id}
                  classData={classData}
                  onClick={() => navigate(`/student/classes/${classData.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal Integration */}
      <JoinClassModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onSuccess={() => {
          // Refresh classes after successfully joining
          fetchClasses();
        }}
      />
    </div>
  );
}
