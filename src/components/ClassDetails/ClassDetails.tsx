import { useState } from "react";
import {
  ArrowLeft,
  Trash2,
  Edit,
  Users,
  UserCheck,
  Layers,
  User,
  LogOut,
} from "lucide-react";
import type { Class } from "../../interfaces/interfaces";
import { CreateClassModal } from "../CreateClassModal/CreateClassModal";
import { useNavigate } from "react-router-dom";
import LeaveClassModal from "../LeaveClassModal/LeaveClassModal";
import { leaveClass } from "../../Services/class Endpoints/Endpoints";
import { useSessionStore } from "../../store/sessionStore";
import toast from "react-hot-toast";

interface ClassDetailsProps {
  classData: Class;
  role: "student" | "instructor";
  onBack: () => void;
  onUpdate: (updatedClass: Class) => void;
  onDelete: () => void;
}

export function ClassDetails({
  classData,
  role,
  onBack,
  onUpdate,
  onDelete,
}: ClassDetailsProps) {
  const navigate = useNavigate();
  const token = useSessionStore((state) => state.token);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const currentClassName = "IS598 - Web Development";
  // Check if color is a hex value (starts with #) or a Tailwind class
  const isHexColor = (color: string) => color?.startsWith("#");
  const getColorStyle = (color: string) =>
    isHexColor(color) ? { backgroundColor: color } : {};
  const getColorClass = (color: string) =>
    isHexColor(color)
      ? "w-12 h-12 sm:w-16 sm:h-16 rounded-lg"
      : `w-12 h-12 sm:w-16 sm:h-16 rounded-lg ${color}`;

  const handleDelete = () => {
    onDelete();
  };

  const handleConfirmLeave = async () => {
    if (!token) {
      toast.error("You must be logged in to leave a class.");
      return;
    }

    try {
      await leaveClass(classData.id, token);
      toast.success("You have successfully left the class.");
      setShowLeaveModal(false);
      // Navigate back or call onDelete to refresh the list
      navigate(-2); // or some other appropriate action like going to the dashboard
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || "Failed to leave the class.";
      toast.error(errorMsg);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>

              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {classData.name}
                </h1>
                <p className="text-gray-600 text-sm">{classData.year}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {/* Role-based buttons */}
              {role === "instructor" ? (
                <>
                  {/* <button className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-[#084a49] hover:bg-[#063a39] text-white rounded-lg flex items-center gap-2">
                    <Layers size={18} />
                    View Sections
                  </button> */}
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Edit size={18} />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </>
              ) : (
                <>
                  {/* <button className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-[#084a49] hover:bg-[#063a39] text-white rounded-lg flex items-center gap-2">
                    <Layers size={18} />
                    Class Stream
                  </button>
                  <button className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-[#313a3a] hover:bg-[#063a39] text-white rounded-lg flex items-center gap-2">
                    <Layers size={18} />+ Join Section
                  </button> */}
                </>
              )}

              <button
                onClick={() => setShowLeaveModal(true)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border rounded-md bg-red-600 hover:bg-red-700 text-white text-sm flex items-center gap-2"
              >
                <LogOut size={18} />
                Leave Class
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-gray-900 mb-4 sm:mb-6 text-base sm:text-lg">
                Class Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Class Code
                  </label>
                  <p className="text-gray-900">{classData.code}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Description
                  </label>
                  <p className="text-gray-900">{classData.description}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Semester
                  </label>
                  <p className="text-gray-900">{classData.year}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Color Theme
                  </label>
                  <div
                    className={getColorClass(classData.color)}
                    style={getColorStyle(classData.color)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Statistics + Quick Actions */}
          <div className="space-y-6">
            {/* Statistics */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-gray-900 mb-4 text-base sm:text-lg">
                Statistics
              </h3>

              <div className="space-y-4">
                {/* Students */}
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                    <UserCheck size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl text-gray-900">
                      {classData.studentCount}
                    </p>
                    <p className="text-sm text-gray-500">Students Enrolled</p>
                  </div>
                </div>

                {/* Instructors */}
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                    <User size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl text-gray-900">
                      {classData.instructorCount}
                    </p>
                    <p className="text-sm text-gray-500">Instructors</p>
                  </div>
                </div>

                {/* Teams */}
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                    <Users size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl text-gray-900">
                      {classData.memberCount}
                    </p>
                    <p className="text-sm text-gray-500">members</p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate(`/${role}/classes/${classData.id}/members`, {
                      state: { className: classData.name },
                    })
                  }
                  className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2D7A78] cursor-pointer hover:bg-[#23615f] text-white rounded-lg font-medium transition-all shadow-sm"
                >
                  <Users size={18} />
                  View Class Members
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            {/* <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-4 sm:p-6">
              <h3 className="text-gray-900 mb-3 text-base sm:text-lg">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                  Export Student List
                </button>
                <button className="w-full px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                  Download Grades
                </button>
                <button className="w-full px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
                  Class Analytics
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </main>

      {/* Edit Class Modal */}
      {showEditModal && (
        <CreateClassModal
          classData={classData}
          onClose={() => setShowEditModal(false)}
          onUpdate={(updatedClass) => {
            onUpdate(updatedClass);
            setShowEditModal(false);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6">
            <h3 className="text-gray-900 mb-3">Delete Class?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {classData.name}? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <LeaveClassModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={handleConfirmLeave}
        className={currentClassName}
      />
    </>
  );
}
