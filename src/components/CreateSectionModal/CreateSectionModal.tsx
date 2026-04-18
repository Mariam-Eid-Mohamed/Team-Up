import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getClassInstructors, createSection } from "../../Services/class Endpoints/Endpoints";
import { useSessionStore } from "../../store/sessionStore";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  mode: "create" | "edit" | "delete";
  sectionData?: {
    id: string;
    name: string;
  };
}

export default function CreateSectionModal({
  isOpen,
  onClose,
  classId,
  mode,
  sectionData,
}: Props) {
  const [sectionName, setSectionName] = useState("");
  const [instructor, setInstructor] = useState<{ id: string; name: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [instructorsList, setInstructorsList] = useState<{ id: string; name: string }[]>([]);
  const navigate = useNavigate();
  const token = useSessionStore((state) => state.token);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if ((mode === "edit" || mode === "delete") && sectionData) {
      setSectionName(sectionData.name);
    } else {
      setSectionName("");
      setInstructor(null);
    }
  }, [mode, sectionData, isOpen]);

  useEffect(() => {
    if (isOpen && classId && token) {
      const fetchInstructors = async () => {
        try {
          const res = await getClassInstructors(classId, token);
          if (res.data?.success) {
             const formattedList = res.data.data.map((inst: any) => ({
                id: inst._id,
                name: `${inst.first_name} ${inst.last_name}`.trim() || inst.username
             }));
             setInstructorsList(formattedList);
          }
        } catch (error) {
           console.error("Failed to fetch instructors", error);
           toast.error("Failed to fetch instructors");
        }
      };
      fetchInstructors();
    }
  }, [isOpen, classId, token]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (mode === "create") {
      if (!sectionName.trim()) {
        toast.error("Please enter a section name");
        return;
      }
      if (!instructor) {
        toast.error("Please select an instructor");
        return;
      }
      if (!token) {
        toast.error("No authentication token found");
        return;
      }
      setIsLoading(true);
      try {
        const payload = {
           section_name: sectionName.trim(),
           instructorIds: [instructor.id]
        };
        const res = await createSection(classId, payload, token);
        toast.success("Section created successfully");
        onClose();
        const newSectionId = res.data?.data?._id;
        navigate(`/instructor/classes/${classId}/sections/${newSectionId}`);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to create section");
      } finally {
        setIsLoading(false);
      }
    } else {
       console.log({ mode, sectionName, instructor, classId });
       onClose();
       // Mock for edit/delete if needed
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[9999] backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl w-[90%] sm:w-[400px] shadow-2xl border border-gray-100">
        
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {mode === "create" && "Create Section"}
          {mode === "edit" && "Edit Section"}
          {mode === "delete" && "Delete Section"}
        </h2>

        {mode === "delete" ? (
          <p className="text-center text-gray-600 mb-8">
            Are you sure you want to delete <span className="font-semibold text-red-600">{sectionName}</span>?
          </p>
        ) : (
          <div className="space-y-4">
            {/* Section Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
                Section Name
              </label>
              <input
                type="text"
                placeholder="E.g., Section 1"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#4E8D8A] focus:outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Instructor Assigned (Custom Dropdown) */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">
                Instructor Assigned
              </label>
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full border border-gray-300 p-3 rounded-lg flex justify-between items-center cursor-pointer bg-white hover:border-gray-400 transition-colors"
              >
                <span className={instructor ? "text-gray-800" : "text-gray-400"}>
                  {instructor?.name || "Select Instructor"}
                </span>
                {isDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {isDropdownOpen && (
                <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-20 max-h-48 overflow-y-auto">
                  {instructorsList.map((inst) => (
                    <div
                      key={inst.id}
                      onClick={() => {
                        setInstructor(inst);
                        setIsDropdownOpen(false);
                      }}
                      className="px-4 py-3 hover:bg-[#F3F4F6] cursor-pointer text-gray-700 border-b last:border-none transition-colors"
                    >
                      {inst.name}
                    </div>
                  ))}
                  {instructorsList.length === 0 && (
                    <div className="px-4 py-3 text-gray-500">No instructors found</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer ${
              mode === "delete" ? "bg-red-600 hover:bg-red-700" : "bg-[#4E8D8A] hover:bg-[#3d6f6d]"
            }`}
          >
            {isLoading 
              ? "Processing..." 
              : mode === "create" ? "Create" : mode === "edit" ? "Save" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}