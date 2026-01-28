import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateCourseworkSchema } from "@/utilis/Validations/courseworkValidations";
import type { CreateCourseworkInputs } from "@/utilis/Validations/courseworkValidations";
import { createCoursework } from "@/Services/coursework Endpoints/Endpoints";
import { getToken } from "@/utilis/token";

interface CourseworkData {
  name: string;
  description?: string;
  grade?: string;
  teamMin?: string;
  teamMax?: string;
  deadline?: string;
  discussionDate?: string;
}

interface Props {
  classId: string;
  open: boolean;
  onClose: () => void;
  initialData?: CourseworkData | null;
}

export default function CourseworkModal({
  open,
  onClose,
  classId,
  initialData,
}: Props) {
  console.log("Modal received classId:", classId);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateCourseworkInputs, string>>
  >({});
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const isEdit = !!initialData;
  const [includeDiscussion, setIncludeDiscussion] = useState(false);

  const [form, setForm] = useState<CourseworkData>({
    name: "",
    description: "",
    grade: "",
    teamMin: "",
    teamMax: "",
    deadline: "",
    discussionDate: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setIncludeDiscussion(!!initialData.discussionDate);
    }
  }, [initialData]);
  const validateForm = (): boolean => {
    try {
      CreateCourseworkSchema.parse({
        name: form.name || "",
        deadline: form.deadline || "",
        grade: form.grade || "",
        teamMin: form.teamMin || "",
        teamMax: form.teamMax || "",
        discussionDate: form.discussionDate || "",
      });
      setErrors({});
      return true;
    } catch (err: unknown) {
      const zodErr = err as {
        issues?: Array<{ path: (string | number)[]; message: string }>;
      };
      const newErrors: Partial<Record<keyof CreateCourseworkInputs, string>> =
        {};

      zodErr.issues?.forEach((issue) => {
        const key = issue.path?.[0] as keyof CreateCourseworkInputs;
        if (key) newErrors[key] = issue.message;
      });

      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async () => {
    console.log("Submitting with:", {
      classId,
      form,
      notes,
      files,
      includeDiscussion,
    });

    if (!validateForm()) return;

    const token = getToken();
    if (!token) {
      setApiError("Authentication required");
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const fd = new FormData();

      fd.append("name", form.name);
      fd.append("deadline", new Date(form.deadline!).toISOString());

      fd.append("description", form.description || "");
      fd.append("notes", notes || "");
      fd.append("grade", form.grade || "");
      fd.append("team_size_min", form.teamMin || "");
      fd.append("team_size_max", form.teamMax || "");
      fd.append("include_discussion", String(includeDiscussion));

      if (includeDiscussion && form.discussionDate) {
        fd.append(
          "discussion_date",
          new Date(form.discussionDate).toISOString()
        );
      } else {
        fd.append("discussion_date", "");
      }

      files.forEach((file) => fd.append("files", file));
      for (const [k, v] of fd.entries()) console.log(k, v);

      await createCoursework(classId, fd, token);

      onClose();
    } catch (error: any) {
      setApiError(
        error.response?.data?.message || "Failed to create coursework"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[95%] max-w-xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Coursework" : "Create New Coursework"}
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="space-y-4">
          {/* API ERROR */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
              {apiError}
            </div>
          )}

          {/* NAME */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Coursework Name
            </label>
            <input
              className={`w-full border rounded-md p-2 ${
                errors.name ? "border-red-500" : ""
              }`}
              placeholder="E.g. Assignment 1 - Data Structures"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Coursework Description
            </label>

            <textarea
              // className={`w-full border rounded-md p-2 ${
              //   errors.description ? "border-red-500" : ""
              // }`}
              placeholder="Brief overview of coursework"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            {/* لو عندك description validation مستقبلاً */}
            {/* {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>} */}
          </div>

          {/* NOTES */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Coursework Notes
            </label>
            <input
              className="w-full border rounded-md p-2"
              placeholder="E.g. Submit in PDF only"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* ATTACHMENTS (separate upload) */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Attachments (max 5)
            </label>
            <input
              type="file"
              multiple
              className="w-full text-sm"
              onChange={(e) => {
                const selected = e.target.files
                  ? Array.from(e.target.files)
                  : [];
                setFiles(selected.slice(0, 5));
              }}
            />
            {files.length > 0 && (
              <p className="text-xs text-gray-600 mt-1">
                {files.length} file(s) selected
              </p>
            )}
          </div>

          {/* GRADE + TEAM */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Grade</label>
              <input
                className={`w-full border rounded-md p-2 ${
                  errors.grade ? "border-red-500" : ""
                }`}
                placeholder="10"
                value={form.grade || ""}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
              />
              {errors.grade && (
                <p className="text-red-500 text-xs mt-1">{errors.grade}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1 block">
                Team Size
              </label>
              <div className="flex gap-2">
                <input
                  className={`w-full border rounded-md p-2 ${
                    errors.teamMin ? "border-red-500" : ""
                  }`}
                  placeholder="Min"
                  value={form.teamMin || ""}
                  onChange={(e) =>
                    setForm({ ...form, teamMin: e.target.value })
                  }
                />
                <input
                  className={`w-full border rounded-md p-2 ${
                    errors.teamMax ? "border-red-500" : ""
                  }`}
                  placeholder="Max"
                  value={form.teamMax || ""}
                  onChange={(e) =>
                    setForm({ ...form, teamMax: e.target.value })
                  }
                />
              </div>
              {(errors.teamMin || errors.teamMax) && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.teamMin || errors.teamMax}
                </p>
              )}
            </div>
          </div>

          {/* DEADLINE */}
          <div>
            <label className="text-sm font-medium mb-1 block">Deadline</label>
            <input
              type="date"
              className={`w-full border rounded-md p-2 ${
                errors.deadline ? "border-red-500" : ""
              }`}
              value={form.deadline || ""}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />
            {errors.deadline && (
              <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>
            )}
          </div>

          {/* INCLUDE DISCUSSION */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeDiscussion}
              onChange={(e) => setIncludeDiscussion(e.target.checked)}
            />
            <span className="text-sm">Include Discussion</span>
          </div>

          {/* DISCUSSION DATE */}
          {includeDiscussion && (
            <div>
              <label className="text-sm font-medium mb-1 block">
                Discussion Date
              </label>
              <input
                type="date"
                className="w-full border rounded-md p-2"
                value={form.discussionDate || ""}
                onChange={(e) =>
                  setForm({ ...form, discussionDate: e.target.value })
                }
              />
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-purple-500 text-purple-600"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 rounded-md bg-teal-600 text-white disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : isEdit ? "Save" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
