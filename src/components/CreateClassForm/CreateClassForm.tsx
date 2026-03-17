import { useState } from "react";
import { X, Save } from "lucide-react";
import type { Class } from "../../interfaces/interfaces";
import { CreateClassSchema, type CreateClassInputs } from "../../utilis/Validations/Validations";
import { createClass } from "../../Services/class Endpoints/Endpoints";
import { getToken } from "../../utilis/token";

interface CreateClassFormProps {
  newClass: Class;
  setNewClass: (value: Class) => void;
  onCancel: () => void;
  onCreate: () => void;
}

export function CreateClassForm({
  newClass,
  setNewClass,
  onCancel,
  onCreate,
}: CreateClassFormProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof CreateClassInputs, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

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

  // Helper function to convert Tailwind color class to hex
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

  const validateForm = (): boolean => {
    try {
      CreateClassSchema.parse({
        name: newClass.name || "",
        code: newClass.code || "",
        description: newClass.description || "",
        year: newClass.year || "",
        color: newClass.color || "",
      });
      setErrors({});
      return true;
    } catch (error: any) {
      if (error.issues) {
        const newErrors: Partial<Record<keyof CreateClassInputs, string>> = {};
        error.issues.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            newErrors[err.path[0] as keyof CreateClassInputs] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const token = getToken();
    if (!token) {
      setApiError("Authentication required. Please login again.");
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      // Validate that required fields are not empty
      if (!newClass.name || !newClass.name.trim()) {
        setApiError("Course name is required");
        setIsSubmitting(false);
        return;
      }
      if (!newClass.code || !newClass.code.trim()) {
        setApiError("Course code is required");
        setIsSubmitting(false);
        return;
      }
      if (!newClass.year || !newClass.year.trim()) {
        setApiError("Year is required");
        setIsSubmitting(false);
        return;
      }
      if (!newClass.color || !newClass.color.trim()) {
        setApiError("Class color is required");
        setIsSubmitting(false);
        return;
      }

      // Map form fields to API fields
      // Extract year number from string (e.g., "2025" or "Fall 2025" -> 2025)
      const yearMatch = newClass.year.match(/\d{4}/);
      if (!yearMatch) {
        setApiError("Year must contain a valid 4-digit year (e.g., 2025)");
        setIsSubmitting(false);
        return;
      }
      const year = parseInt(yearMatch[0], 10);

      // Convert Tailwind color class to hex color
      // Backend expects a valid hex color (e.g., "#3b82f6")
      const classColor = getColorHex(newClass.color);

      const payload = {
        course_name: newClass.name.trim(),
        course_code: newClass.code.trim(),
        year: year,
        course_plan: newClass.description?.trim() || undefined,
        class_color: classColor, // Always include class_color as backend requires it
      };

      console.log("Sending payload to API:", payload);

      const response = await createClass(payload, token);
      
      if (response.data.success) {
        // Successfully created - callback will handle UI update
        onCreate();
        // Reset form
        setNewClass({
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
      }
    } catch (error: any) {
      console.error("Failed to create class:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      const errorMessage = error.response?.data?.message || "Failed to create class. Please try again.";
      setApiError(errorMessage);
      
      // Set field-specific errors if available
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.message?.includes("Missing required fields")) {
          setApiError(errorData.message);
        } else if (errorData.message?.includes("Only instructors")) {
          setApiError(errorData.message);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: keyof CreateClassInputs, value: string) => {
    setNewClass({ ...newClass, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    /* OVERLAY */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      {/* MODAL CARD */}
      <div
        className="bg-white rounded-xl shadow-xl w-fit  max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Create New Class</h2>
          <button
            onClick={onCancel}
            className="p-2 rounded hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {apiError}
            </div>
          )}
          <div>
            <label className="block text-sm mb-1">Class Name</label>
            <input
              className={`w-full border rounded-lg px-4 py-2 ${
                errors.name ? "border-red-500" : ""
              }`}
              value={newClass.name || ""}
              onChange={(e) => handleFieldChange("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Class Code</label>
            <input
              className={`w-full border rounded-lg px-4 py-2 ${
                errors.code ? "border-red-500" : ""
              }`}
              value={newClass.code || ""}
              onChange={(e) => handleFieldChange("code", e.target.value)}
            />
            {errors.code && (
              <p className="text-red-500 text-xs mt-1">{errors.code}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              rows={3}
              className={`w-full border rounded-lg px-4 py-2 ${
                errors.description ? "border-red-500" : ""
              }`}
              value={newClass.description || ""}
              onChange={(e) => handleFieldChange("description", e.target.value)}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Semester</label>
            <input
              className={`w-full border rounded-lg px-4 py-2 ${
                errors.year ? "border-red-500" : ""
              }`}
              value={newClass.year || ""}
              onChange={(e) => handleFieldChange("year", e.target.value)}
            />
            {errors.year && (
              <p className="text-red-500 text-xs mt-1">{errors.year}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-3">Class Color</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => handleFieldChange("color", c.value)}
                  className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center ${
                    newClass.color === c.value
                      ? "border-gray-900 scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-full h-8 rounded ${c.value}`} />
                  <p className="text-xs text-gray-600 mt-1">
                    {c.name}
                  </p>
                </button>
              ))}
            </div>
            {errors.color && (
              <p className="text-red-500 text-xs mt-1">{errors.color}</p>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-center gap-6 px-6 py-4 border-t">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg text-gray-700 flex items-center gap-1 hover:bg-gray-50"
          >
            <X size={16} />
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#1B4D49] hover:bg-[#2D7A74] text-white rounded-lg flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {isSubmitting ? "Creating..." : "Create Class"}
          </button>
        </div>
      </div>
    </div>
  );
}
