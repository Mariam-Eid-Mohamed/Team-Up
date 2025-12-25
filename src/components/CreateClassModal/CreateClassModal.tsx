import { useState } from "react";
import { X } from "lucide-react";
import type { Class } from "../../interfaces/interfaces";
import { CreateClassSchema, type CreateClassInputs } from "../../utilis/Validations/Validations";
import { createClass } from "../../Services/class Endpoints/Endpoints";
import { getToken } from "../../utilis/token";

interface CreateClassModalProps {
  onClose: () => void;
  onCreate: (newClass: Class) => void;
}



export function CreateClassModal({
  onClose,
  onCreate,
}: CreateClassModalProps) {
  const [formData, setFormData] = useState<Class>({
    id: crypto.randomUUID(),
    name: "",
    code: "",
    description: "",
    year: "",
    studentsCount: 0,
    teamsCount: 0,
    instructorsCount: 1,
    color: "bg-blue-500",
  });

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
        name: formData.name || "",
        code: formData.code || "",
        description: formData.description || "",
        year: formData.year || "",
        color: formData.color || "",
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
      if (!formData.name || !formData.name.trim()) {
        setApiError("Course name is required");
        setIsSubmitting(false);
        return;
      }
      if (!formData.code || !formData.code.trim()) {
        setApiError("Course code is required");
        setIsSubmitting(false);
        return;
      }
      if (!formData.year || !formData.year.trim()) {
        setApiError("Year is required");
        setIsSubmitting(false);
        return;
      }
      if (!formData.color || !formData.color.trim()) {
        setApiError("Class color is required");
        setIsSubmitting(false);
        return;
      }

      // Map form fields to API fields
      // Extract year number from string (e.g., "2025" or "Fall 2025" -> 2025)
      const yearMatch = formData.year.match(/\d{4}/);
      if (!yearMatch) {
        setApiError("Year must contain a valid 4-digit year (e.g., 2025)");
        setIsSubmitting(false);
        return;
      }
      const year = parseInt(yearMatch[0], 10);

      // Convert Tailwind color class to hex color
      // Backend expects a valid hex color (e.g., "#3b82f6")
      const classColor = getColorHex(formData.color);

      const payload = {
        course_name: formData.name.trim(),
        course_code: formData.code.trim(),
        year: year,
        course_plan: formData.description?.trim() || undefined,
        class_color: classColor, // Always include class_color as backend requires it
      };

      console.log("Sending payload to API:", payload);

      const response = await createClass(payload, token);
      
      if (response.data.success) {
        // Map API response to Class interface
        const createdClass: Class = {
          id: response.data.data._id,
          name: response.data.data.course_name,
          code: response.data.data.course_code,
          description: response.data.data.course_plan || "",
          year: response.data.data.year.toString(),
          studentsCount: 0,
          teamsCount: 0,
          instructorsCount: 1,
          color: formData.color,
        };
        
        onCreate(createdClass);
        onClose();
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
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl p-6 relative max-h-[85vh] overflow-y-auto">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>

        <h2 className="text-lg font-semibold mb-6">Create New Class</h2>

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {apiError}
          </div>
        )}

        {/* FORM (same style as edit) */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2 text-sm">
              Class Name
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.name || ""}
              onChange={(e) => handleFieldChange("name", e.target.value)}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm">
              Class Code
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.code ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.code || ""}
              onChange={(e) => handleFieldChange("code", e.target.value)}
            />
            {errors.code && (
              <p className="text-red-500 text-xs mt-1">{errors.code}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm">
              Description
            </label>
            <textarea
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.description || ""}
              onChange={(e) => handleFieldChange("description", e.target.value)}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm">
              Semester
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.year ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.year || ""}
              onChange={(e) => handleFieldChange("year", e.target.value)}
            />
            {errors.year && (
              <p className="text-red-500 text-xs mt-1">{errors.year}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-3 text-sm">
              Class Color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleFieldChange("color", color.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.color === color.value
                      ? "border-gray-900 scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-full h-8 rounded ${color.value}`}
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    {color.name}
                  </p>
                </button>
              ))}
            </div>
            {errors.color && (
              <p className="text-red-500 text-xs mt-1">{errors.color}</p>
            )}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#9B87F5] text-white rounded-lg hover:bg-[#8B77E5] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create Class"}
          </button>
        </div>
      </div>
    </div>
  );
}
