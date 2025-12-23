import { Pencil, FileText, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import CourseworkModal from "../CourseWork/CourseWorkModal";

interface ActionButtonsProps {
  role: "student" | "instructor";
  hideCoursework?: boolean;
}

export default function ActionButtons({
  role,
  hideCoursework = false,
}: ActionButtonsProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
        <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 text-sm">
          <Pencil size={16} />
          <span className="hidden sm:inline">New post</span>
        </button>

        {role === "instructor" && !hideCoursework && (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 text-sm"
          >
            <FileText size={16} />
            <span className="hidden sm:inline">New Coursework</span>
          </button>
        )}

        <button
          onClick={() =>
            navigate(`/instructor/classes/${id}/details`)
          }
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-purple-600 text-white text-sm"
        >
          <Eye size={16} />
        </button>
      </div>

      <CourseworkModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
