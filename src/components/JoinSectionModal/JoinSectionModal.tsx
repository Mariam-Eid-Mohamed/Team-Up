import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";
import {
  getAllSectionsInClass,
  joinSection,
  type Section,
} from "@/Services/section Endpoints/Endpoints";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
}

export default function JoinSectionModal({
  isOpen,
  onClose,
  classId,
}: Props) {
  const token = useSessionStore((state) => state.token);

  const [sections, setSections] = useState<Section[]>([]);
  const [selected, setSelected] = useState<Section | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isOpen) return;
    if (!classId) return;

    const fetchSections = async () => {
      if (!token) {
        setError("You need to be logged in to view sections.");
        setSections([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await getAllSectionsInClass(classId, token);
        const data = res.data;
        setSections(Array.isArray(data?.data) ? data.data : []);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to fetch sections. Please try again.",
        );
        setSections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [isOpen, classId, token]);

  useEffect(() => {
    if (!isOpen) return;
    setSelected(null);
    setSearch("");
  }, [isOpen, classId]);

  const filteredSections = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sections;
    return sections.filter((sec) =>
      sec.section_name.toLowerCase().includes(q),
    );
  }, [sections, search]);

  // ✅ detect role from URL
  const basePath =
    location.pathname.startsWith("/instructor")
      ? "/instructor"
      : "/student";

  if (!isOpen) return null;

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
          {loading ? (
            <div className="flex items-center justify-center py-6 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Loading sections...
            </div>
          ) : error ? (
            <div className="px-3 py-3 text-sm text-red-600">{error}</div>
          ) : filteredSections.length === 0 ? (
            <div className="px-3 py-3 text-sm text-gray-500">
              No sections found.
            </div>
          ) : (
            filteredSections.map((sec) => (
              <div
                key={sec._id}
                onClick={() => setSelected(sec)}
                className={`px-3 py-2 cursor-pointer text-sm transition border rounded-md ${
                  selected?._id === sec._id
                    ? "border-[#2f6f73] bg-[#f8fdfd]"
                    : "border-transparent hover:bg-gray-100"
                }`}
              >
                {sec.section_name}
              </div>
            ))
          )}
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
              if (!selected || !token || isJoining) return;

              const doJoin = async () => {
                setIsJoining(true);
                setError(null);
                try {
                  await joinSection(classId, selected._id, token);
                  navigate(
                    `${basePath}/classes/${classId}/sections/${selected._id}`,
                  );
                  onClose();
                } catch (err: any) {
                  setError(
                    err?.response?.data?.message ||
                      "Failed to join section. Please try again.",
                  );
                } finally {
                  setIsJoining(false);
                }
              };

              void doJoin();
            }}
            disabled={!selected || loading || isJoining}
            className="px-5 py-1.5 bg-[#2f6f73] text-white rounded-md text-sm hover:bg-[#285f62] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isJoining ? "Joining..." : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}