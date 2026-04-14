import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ClassDetails } from "../ClassDetails/ClassDetails";
import type { Class } from "../../interfaces/interfaces";
import { getUserClasses, updateClass, deleteClass } from "../../Services/class Endpoints/Endpoints";
import { getToken, getUserId } from "../../utilis/token";

export default function ClassDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [classData, setClassData] = useState<Class | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const role: "student" | "instructor" =
    location.pathname.startsWith("/instructor") ? "instructor" : "student";

  useEffect(() => {
    if (id) {
      fetchClassDetails();
    }
  }, [id]);

  const fetchClassDetails = async () => {
    if (!id) {
      setError("Class ID is missing");
      setIsLoading(false);
      return;
    }

    const token = getToken();
    const userId = getUserId();

    if (!token || !userId) {
      setError("Authentication required. Please login again.");
      setIsLoading(false);
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await getUserClasses(userId, token);

      if (response.data.success && response.data.data) {
        // Find the specific class by ID from the user's classes
        const classItem = response.data.data.find((c: any) => c._id === id);

        if (classItem) {
          // Map API response to Class interface
          const mappedClass: Class = {
            id: classItem._id,
            name: classItem.course_name || "",
            code: classItem.course_code || "",
            description: classItem.course_plan || "",
            year: classItem.year?.toString() || "",
            studentCount: classItem.studentCount || 0,
            memberCount: classItem.memberCount || 0,
            instructorCount: classItem.instructorCount || 0,
            color: classItem.class_color || "bg-blue-500", // Default color if not provided
          };
          setClassData(mappedClass);
        } else {
          setError("Class not found or you don't have access to this class");
        }
      } else {
        setError("Failed to load classes");
      }
    } catch (error: any) {
      console.error("Failed to fetch class details:", error);
      if (error.response?.status === 401) {
        setError("Unauthorized. Please login again.");
        navigate("/login");
      } else {
        setError(error.response?.data?.message || "Failed to load class details. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (updatedClass: Class) => {
    if (!id || !classData) {
      setError("Class ID is missing");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Authentication required. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setIsUpdating(true);
      setError(null);

      // Extract year number from string (e.g., "2025" or "Fall 2025" -> 2025)
      const yearMatch = updatedClass.year.match(/\d{4}/);
      if (!yearMatch) {
        setError("Year must contain a valid 4-digit year (e.g., 2025)");
        setIsUpdating(false);
        return;
      }
      const year = parseInt(yearMatch[0], 10);

      // Convert color to hex if it's a Tailwind class
      // Helper function to convert Tailwind color class to hex
      const colors = [
        { name: "Blue", value: "bg-blue-500", hex: "#3b82f6" },
        { name: "Purple", value: "bg-purple-500", hex: "#a855f7" },
        { name: "Green", value: "bg-green-500", hex: "#22c55e" },
        { name: "Red", value: "bg-red-500", hex: "#ef4444" },
        { name: "Orange", value: "bg-orange-500", hex: "#f97316" },
        { name: "Pink", value: "bg-pink-500", hex: "#ec4899" },
        { name: "Indigo", value: "bg-indigo-500", hex: "#6366f1" },
        { name: "Teal", value: "bg-teal-500", hex: "#14b8a6" },
        { name: "Yellow", value: "bg-yellow-400", hex: "#facc15" },
        { name: "Gray", value: "bg-gray-500", hex: "#6b7280" },
      ];

      const getColorHex = (colorClass: string): string => {
        const color = colors.find((c) => c.value === colorClass);
        if (color) {
          return color.hex;
        }
        // If it's already a hex color, return as-is
        if (colorClass.startsWith("#")) {
          return colorClass;
        }
        // Default fallback
        return "#3b82f6"; // Default to blue
      };

      const classColor = getColorHex(updatedClass.color);

      const payload = {
        course_name: updatedClass.name.trim(),
        course_code: updatedClass.code.trim(),
        year: year,
        course_plan: updatedClass.description?.trim() || undefined,
        class_color: classColor,
      };

      const response = await updateClass(id, payload, token);

      if (response.data.success) {
        setSuccessMessage("Class updated successfully!");
        // Refresh the class data after update
        await fetchClassDetails();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError("Failed to update class");
      }
    } catch (error: any) {
      console.error("Failed to update class:", error);
      if (error.response?.status === 403) {
        setError(error.response?.data?.message || "You don't have permission to edit this class.");
      } else if (error.response?.status === 401) {
        setError("Unauthorized. Please login again.");
        navigate("/login");
      } else {
        setError(error.response?.data?.message || "Failed to update class. Please try again.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !classData) {
      setError("Class ID is missing");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Authentication required. Please login again.");
      navigate("/login");
      return;
    }

    // Show confirmation dialog (handled by ClassDetails component)
    // This will be called after user confirms
    try {
      setIsDeleting(true);
      setError(null);

      const response = await deleteClass(id, token);

      if (response.data.success) {
        // Navigate back to dashboard after successful deletion
        navigate(role === "instructor" ? "/instructor" : "/student");
      } else {
        setError("Failed to delete class");
      }
    } catch (error: any) {
      console.error("Failed to delete class:", error);
      if (error.response?.status === 403) {
        setError(error.response?.data?.message || "You don't have permission to delete this class.");
      } else if (error.response?.status === 404) {
        setError("Class not found");
      } else if (error.response?.status === 401) {
        setError("Unauthorized. Please login again.");
        navigate("/login");
      } else {
        setError(error.response?.data?.message || "Failed to delete class. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading class details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md w-full">
          <p className="mb-4">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Go Back
            </button>
            {error !== "Class not found" && (
              <button
                onClick={fetchClassDetails}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <p className="text-gray-500">Class not found</p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-md">
          <div className="flex items-center justify-between">
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-800 hover:text-red-900 font-bold text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-md">
          <div className="flex items-center justify-between">
            <p>{successMessage}</p>
            <button
              onClick={() => setSuccessMessage(null)}
              className="ml-4 text-green-800 hover:text-green-900 font-bold text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}
      <ClassDetails
        classData={classData}
        role={role}
        onBack={() => navigate(-1)}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        
      />
      {(isUpdating || isDeleting) && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
              <p className="text-gray-700">
                {isUpdating ? "Updating class..." : "Deleting class..."}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
