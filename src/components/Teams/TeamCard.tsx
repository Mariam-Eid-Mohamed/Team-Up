interface TeamCardProps {
  courseCode: string;
  courseName: string;
  teamName: string;
  classColor: string; // hex color from API
  hasAccess?: boolean;
  onView: () => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  courseCode,
  courseName,
  teamName,
  classColor,
  hasAccess = true,
  onView,
}) => {
  return (
    <div className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span
            className="font-bold text-lg"
            style={{ color: classColor || "#6b7280" }}
          >
            {courseCode}
          </span>
          <span className="text-gray-400">•</span>
          <span className="font-semibold text-gray-800 text-lg">
            {teamName}
          </span>
        </div>
        <p className="text-sm text-gray-400 mt-1">{courseName}</p>
      </div>

      {hasAccess ? (
        <button
          onClick={onView}
          className="flex items-center gap-2 px-6 py-2 bg-[#1F6B6B] text-white rounded-lg hover:bg-[#164e4e] transition-colors"
        >
          View <span className="text-xl">→</span>
        </button>
      ) : (
        <div className="w-[105px]" />
      )}
    </div>
  );
};
