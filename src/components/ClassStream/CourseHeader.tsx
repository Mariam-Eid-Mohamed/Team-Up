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
          const formattedName = classItem.course_code && classItem.course_name
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

  const handleDelete = () => {
    toast.custom((t) => (
      <div className="bg-white shadow-lg rounded-lg p-4 w-[320px]">
        <p className="text-sm font-medium mb-3">
          Are you sure you want to delete this course?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-sm rounded-md border"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              toast.dismiss(t.id);
              // 🔥 DELETE LOGIC HERE
              toast.success("Course deleted successfully");
            }}
            className="px-3 py-1 text-sm rounded-md bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  return (
    <>
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

        {isInstructor && (
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-gray-700 text-white text-sm"
            >
              <Pencil size={16} /> Edit
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-red-600 text-white text-sm"
            >
              <Trash size={16} /> Delete
            </button>
          </div>
        )}
      </div>

      <CourseworkModal
        classId={id!}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={existingCoursework}
      />
    </>
  );
}
