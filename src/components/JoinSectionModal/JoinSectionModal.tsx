import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
}

const sections = ["Section 1", "Section 2", "Section 3"];

export default function JoinSectionModal({
  isOpen,
  onClose,
  classId,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  const filteredSections = sections.filter((sec) =>
    sec.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ detect role from URL
  const basePath =
    location.pathname.startsWith("/instructor")
      ? "/instructor"
      : "/student";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl p-6 w-[360px] shadow-xl border border-gray-200">
        
        {/* Title */}
        <h2 className="text-lg font-semibold text-center text-gray-800">
          Join Section
        </h2>
        <p className="text-sm text-gray-500 text-center mb-4">
          Select section
        </p>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by section name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f6f73]"
        />

        {/* Sections list */}
        <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
          {filteredSections.map((sec) => (
            <div
              key={sec}
              onClick={() => setSelected(sec)}
              className={`px-3 py-2 cursor-pointer text-sm transition border rounded-md ${
                selected === sec
                  ? "border-[#2f6f73] bg-[#f8fdfd]"
                  : "border-transparent hover:bg-gray-100"
              }`}
            >
              {sec}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-5 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              if (!selected) return;

              // Extract section number (temporary logic)
              const sectionId = selected.split(" ")[1];

              navigate(
                `${basePath}/classes/${classId}/sections/${sectionId}`
              );

              onClose();
            }}
            className="px-5 py-1.5 bg-[#2f6f73] text-white rounded-md text-sm hover:bg-[#285f62]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}