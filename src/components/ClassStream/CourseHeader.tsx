import { ArrowLeft, Pencil, Trash } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import CourseworkModal from "../CourseWork/CourseWorkModal";
import { getUserClasses } from "@/Services/class Endpoints/Endpoints";
import { getToken, getUserId } from "@/utilis/token";

export default function CourseHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [editOpen, setEditOpen] = useState(false);
  const [courseName, setCourseName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const isSectionStream = location.pathname.includes("/sections/");
  const isInstructor = location.pathname.startsWith("/instructor");

  const existingCoursework = {
    name: "Assignment 1",
    grade: "10",
    deadline: "2025-12-22",
    discussionDate: "2025-12-25",
  };

  useEffect(() => {
    if (id) {
      fetchCourseName();
    }
  }, [id]);

  const fetchCourseName = async () => {
    if (!id) return;

    const token = getToken();
    const userId = getUserId();

    if (!token || !userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await getUserClasses(userId, token);

      if (response.data.success && response.data.data) {
        const classItem = response.data.data.find((c: any) => c._id === id);
        if (classItem) {
          // Format: "COURSE_CODE - COURSE_NAME"
          const formattedName =
            classItem.course_code && classItem.course_name
              ? `${classItem.course_code} - ${classItem.course_name}`
              : classItem.course_name || classItem.course_code || "Course";
          setCourseName(formattedName);
        }
      }
    } catch (error) {
      console.error("Failed to fetch course name:", error);
      setCourseName("Course");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(
      isSectionStream
        ? `/${isInstructor ? "instructor" : "student"}/classes/${id}`
        : isInstructor
          ? "/instructor/dashboard"
          : "/student/dashboard",
    );
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-200 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-base sm:text-lg md:text-xl font-semibold">
          {isLoading ? "Loading..." : courseName || "Course"}
        </h1>
      </div>
    </div>
  );
}
