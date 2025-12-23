import { X, Plus } from "lucide-react";
import { useEffect, useState } from "react";

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
  open: boolean;
  onClose: () => void;
  initialData?: CourseworkData | null;
}

export default function CourseworkModal({
  open,
  onClose,
  initialData,
}: Props) {
  const isEdit = !!initialData;

  const [descType, setDescType] = useState<"text" | "file">("text");
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
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Coursework Name
            </label>
            <input
              className="w-full border rounded-md p-2"
              placeholder="E.g. CS101 - Introduction to Programming"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">
                Coursework Description
              </label>

              <div className="flex gap-2">
                <button
                  onClick={() => setDescType("text")}
                  className={`px-2 py-0.5 text-xs rounded ${
                    descType === "text"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Text
                </button>
                <button
                  onClick={() => setDescType("file")}
                  className={`px-2 py-0.5 text-xs rounded ${
                    descType === "file"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  File
                </button>
              </div>
            </div>

            {descType === "text" ? (
              <textarea
                className="w-full border rounded-md p-2"
                placeholder="Brief overview of coursework"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            ) : (
              <input type="file" className="w-full text-sm" />
            )}
          </div>

          {/* NOTES */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Coursework Notes
            </label>
            <input
              className="w-full border rounded-md p-2"
              placeholder="E.g. Please upload PDF"
            />
          </div>

          {/* GRADE + TEAM */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Grade</label>
              <input className="w-full border rounded-md p-2" placeholder="10" />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Team Size
              </label>
              <div className="flex gap-2">
                <input
                  className="w-full border rounded-md p-2"
                  placeholder="Min"
                />
                <input
                  className="w-full border rounded-md p-2"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          {/* DEADLINE */}
          <div>
            <label className="text-sm font-medium mb-1 block">Deadline</label>
            <input type="date" className="w-full border rounded-md p-2" />
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

          {/* CONDITIONAL FIELDS */}
          {includeDiscussion && (
            <>
              {/* DISCUSSION DATE */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Discussion Date
                </label>
                <input type="date" className="w-full border rounded-md p-2" />
              </div>

              {/* GRADING CRITERIA */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Grading Criteria
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 border rounded-md p-2"
                    placeholder="E.g. Code works"
                  />
                  <input
                    className="w-20 border rounded-md p-2"
                    placeholder="5"
                  />
                  <button className="bg-gray-200 rounded-md p-2">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-purple-500 text-purple-600"
            >
              Cancel
            </button>
            <button className="px-6 py-2 rounded-md bg-teal-600 text-white">
              {isEdit ? "Save" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
