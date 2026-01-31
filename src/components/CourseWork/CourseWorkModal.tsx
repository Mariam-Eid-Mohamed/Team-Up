import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateCourseworkSchema } from "@/utilis/Validations/courseworkValidations";
import type { CreateCourseworkInputs } from "@/utilis/Validations/courseworkValidations";
import {
  createCoursework,
  deleteCoursework,
  updateCoursework,
} from "@/Services/coursework Endpoints/Endpoints";
import { getToken } from "@/utilis/token";
import { Plus, Upload, Trash2, Paperclip } from "lucide-react";

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

  mode: "create" | "edit" | "delete";

  courseworkId?: string; // needed for edit/delete
  initialData?: CourseworkData | null;

  onChanged?: () => void; // refresh posts after edit/delete/create
}

export default function CourseworkModal({
  open,
  onClose,
  classId,
  mode,
  courseworkId,
  initialData,
  onChanged,
}: Props) {
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateCourseworkInputs, string>>
  >({});
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const isEdit = !!initialData;
  const [includeDiscussion, setIncludeDiscussion] = useState(false);
  type CriterionItem = { criterion: string; points: string };

  const [gradingCriteria, setGradingCriteria] = useState<CriterionItem[]>([
    { criterion: "", points: "" },
  ]);

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
  //handling files
  const MAX_FILES = 5;

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const incomingArr = Array.from(incoming);

    setFiles((prev) => {
      const merged = [...prev, ...incomingArr];

      // optional: منع التكرار بالاسم + الحجم
      const unique = merged.filter(
        (f, i, arr) =>
          i === arr.findIndex((x) => x.name === f.name && x.size === f.size),
      );

      return unique.slice(0, MAX_FILES);
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };
  //for create and edit
  const handleSubmit = async () => {
    const token = getToken();
    if (!token) {
      setApiError("Authentication required");
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      //  CREATE / EDIT: validate first
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      //  FormData appending (create/edit )
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
          new Date(form.discussionDate).toISOString(),
        );
      } else {
        fd.append("discussion_date", "");
      }

      const criteriaPayload = gradingCriteria
        .map((c) => ({
          criterion: c.criterion.trim(),
          points: Number(c.points),
        }))
        .filter(
          (c) =>
            c.criterion.length > 0 &&
            Number.isFinite(c.points) &&
            c.points >= 0,
        );

      fd.append("grading_criteria", JSON.stringify(criteriaPayload));

      files.forEach((file) => fd.append("files", file));

      //  API call حسب الـ mode
      if (mode === "create") {
        await createCoursework(classId, fd, token);
      } else if (mode === "edit") {
        if (!courseworkId) throw new Error("Missing courseworkId");
        await updateCoursework(courseworkId, fd, token);
      }

      onChanged?.();
      onClose();
    } catch (error: any) {
      setApiError(error.response?.data?.message || error.message || "Failed");
    } finally {
      setIsSubmitting(false);
    }
  };
  //for delete only
  const handleDelete = async () => {
    const token = getToken();
    if (!token) {
      setApiError("Authentication required");
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      if (!courseworkId) throw new Error("Missing courseworkId");
      await deleteCoursework(courseworkId, token);
      onChanged?.();
      onClose();
    } catch (error: any) {
      setApiError(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete coursework",
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
            {mode === "delete"
              ? "Delete Coursework"
              : mode === "edit"
                ? "Edit Coursework"
                : "Create New Coursework"}
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
          {mode === "delete" ? (
            <div className="space-y-5">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this coursework?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-md border border-purple-500 text-purple-600"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-md bg-red-600 text-white disabled:opacity-50"
                >
                  {isSubmitting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ) : (
            <>
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
                  className={`w-full border rounded-md p-2`}
                  // ${  errors.description ? "border-red-500" : ""
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
              {/* ATTACHMENTS */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Attachments (max {MAX_FILES})
                </label>

                <div className="flex items-center gap-2">
                  {/* زر Upload */}
                  <label className="inline-flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer hover:bg-gray-50">
                    <Upload size={16} />
                    <span className="text-sm">Upload files</span>

                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        addFiles(e.target.files);
                        // مهم: نفضي القيمة عشان لو اختار نفس الملف تاني يشتغل onChange
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>

                  {/* Add more */}
                  <label className="inline-flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer hover:bg-gray-50">
                    <Plus size={16} />
                    <span className="text-sm">Add more</span>

                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        addFiles(e.target.files);
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>

                  <span className="text-xs text-gray-500">
                    {files.length}/{MAX_FILES} selected
                  </span>
                </div>

                {/* قائمة الملفات */}
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((f, idx) => (
                      <div
                        key={`${f.name}-${f.size}-${idx}`}
                        className="flex items-center justify-between border rounded-md px-3 py-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Paperclip size={16} className="shrink-0" />
                          <span className="text-sm truncate">{f.name}</span>
                          <span className="text-xs text-gray-500 shrink-0">
                            {(f.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {files.length >= MAX_FILES && (
                  <p className="text-xs text-amber-600 mt-2">
                    Max {MAX_FILES} files reached.
                  </p>
                )}
              </div>

              {/* GRADE + TEAM */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Grade
                  </label>
                  <input
                    className={`w-full border rounded-md p-2 ${
                      errors.grade ? "border-red-500" : ""
                    }`}
                    placeholder="10"
                    value={form.grade || ""}
                    onChange={(e) =>
                      setForm({ ...form, grade: e.target.value })
                    }
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
                <label className="text-sm font-medium mb-1 block">
                  Deadline
                </label>
                <input
                  type="date"
                  className={`w-full border rounded-md p-2 ${
                    errors.deadline ? "border-red-500" : ""
                  }`}
                  value={form.deadline || ""}
                  onChange={(e) =>
                    setForm({ ...form, deadline: e.target.value })
                  }
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
              {/* GRADING CRITERIA */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium">
                    Grading criteria
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setGradingCriteria((prev) => [
                        ...prev,
                        { criterion: "", points: "" },
                      ])
                    }
                    className="p-2 rounded-md hover:bg-gray-100"
                    title="Add criterion"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <div className="space-y-2">
                  {gradingCriteria.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        className="flex-1 border rounded-md p-2"
                        placeholder="E.g. code works"
                        value={item.criterion}
                        onChange={(e) => {
                          const v = e.target.value;
                          setGradingCriteria((prev) =>
                            prev.map((x, i) =>
                              i === idx ? { ...x, criterion: v } : x,
                            ),
                          );
                        }}
                      />

                      <input
                        className="w-24 border rounded-md p-2"
                        placeholder="E.g. 5"
                        value={item.points}
                        onChange={(e) => {
                          const v = e.target.value;
                          setGradingCriteria((prev) =>
                            prev.map((x, i) =>
                              i === idx ? { ...x, points: v } : x,
                            ),
                          );
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setGradingCriteria((prev) =>
                            prev.filter((_, i) => i !== idx),
                          )
                        }
                        className="p-2 rounded-md hover:bg-gray-100 text-red-600"
                        title="Remove"
                        disabled={gradingCriteria.length === 1}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
