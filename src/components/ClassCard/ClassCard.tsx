import { Users, UserCheck, ChevronRight } from "lucide-react";
import type { Class } from "../../App";

interface ClassCardProps {
  classData: Class;
  onClick: () => void;
}

export function ClassCard({ classData, onClick }: ClassCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all text-left w-full group"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg ${classData.color} flex items-center justify-center text-white`}
        >
          {classData.code.substring(0, 2)}
        </div>
        <ChevronRight
          className="text-gray-400 group-hover:text-gray-600 transition-colors"
          size={20}
        />
      </div>

      <h3 className="text-gray-900 mb-2">{classData.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{classData.description}</p>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
        <div className="flex items-center gap-1">
          <UserCheck size={16} />
          <span>{classData.studentsCount} students</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={16} />
          <span>{classData.teamsCount} teams</span>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">{classData.semester}</span>
      </div>
    </button>
  );
}
