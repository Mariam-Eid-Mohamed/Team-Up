import { Users, UserCheck, ChevronRight } from "lucide-react";
import type { Class } from "../../interfaces/interfaces";

interface ClassCardProps {
  classData: Class;
  onClick: () => void;
}

export function ClassCard({ classData, onClick }: ClassCardProps) {
  // Check if color is a hex value (starts with #) or a Tailwind class
  const isHexColor = classData.color?.startsWith("#");
  const colorStyle = isHexColor 
    ? { backgroundColor: classData.color } 
    : {};
  const colorClass = isHexColor 
    ? "w-2 h-12 rounded-lg" 
    : `w-2 h-12 rounded-lg ${classData.color}`;

  return (
    <button
      onClick={onClick}
      className="
        bg-white rounded-lg border border-gray-200
        p-4 sm:p-6
        hover:shadow-lg transition-all
        text-left w-full group
      "
    >
      {/* TOP */}
      {/* TOP: Color + Name + Chevron */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-3">
          {/* Color bar */}
          <div className={colorClass} style={colorStyle} />
          {/* Class name */}
          <h3 className="text-gray-900 text-sm sm:text-base font-semibold">
            {classData.name}
          </h3>
        </div>

        {/* Chevron */}
        <ChevronRight
          className="text-gray-400 group-hover:text-gray-600 transition-colors"
          size={18}
        />
      </div>

      {/* TITLE */}
      {/* <h3 className="text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">
        {classData.name}
      </h3> */}

      {/* DESCRIPTION */}
      <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
        {classData.description}
      </p>

      {/* STATS */}
      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500 mb-3">
        <div className="flex items-center gap-1">
          <UserCheck size={14} />
          <span>{classData.studentsCount} students</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={14} />
          <span>{classData.teamsCount} teams</span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="pt-2 sm:pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">{classData.year}</span>
      </div>
    </button>
  );
}
