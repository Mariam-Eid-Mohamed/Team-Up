import { useState } from "react";
import {
  ArrowLeft,
  Trash2,
  Edit,
  Users,
  UserCheck,
  Save,
  X,
  Layers,
  User,
} from "lucide-react";
import type { Class } from "../../App";

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
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editedData, setEditedData] = useState(classData);

  const handleSave = () => {
    onUpdate(editedData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete();
  };

  const colors = [
    { name: "Blue", value: "bg-blue-500" },
    { name: "Purple", value: "bg-purple-500" },
    { name: "Green", value: "bg-green-500" },
    { name: "Red", value: "bg-red-500" },
    { name: "Orange", value: "bg-orange-500" },
    { name: "Pink", value: "bg-pink-500" },
    { name: "Indigo", value: "bg-indigo-500" },
    { name: "Teal", value: "bg-teal-500" },
  ];

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
                <p className="text-gray-600 text-sm">{classData.semester}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {!isEditing ? (
                <>
                  {/* Role-based buttons */}
                  {role === "instructor" ? (
                    <>
                      <button className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-[#084a49] hover:bg-[#063a39] text-white rounded-lg flex items-center gap-2">
                        <Layers size={18} />
                        View Sections
                      </button>
                      <button
                        onClick={() => setIsEditing(true)}
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
                      <button className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-[#084a49] hover:bg-[#063a39] text-white rounded-lg flex items-center gap-2">
                        <Layers size={18} />
                        Class Stream
                      </button>
                      <button className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-[#313a3a] hover:bg-[#063a39] text-white rounded-lg flex items-center gap-2">
                        <Layers size={18} />
                        + Join Section
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-[#58a8a7] text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Save size={18} />
                    Save
                  </button>

                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedData(classData);
                    }}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </>
              )}
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

              {isEditing ? (
                <div className="space-y-4">
                  {/* Editing form */}
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm">
                      Class Name
                    </label>
                    <input
                      type="text"
                      value={editedData.name}
                      onChange={(e) =>
                        setEditedData({ ...editedData, name: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm">
                      Class Code
                    </label>
                    <input
                      type="text"
                      value={editedData.code}
                      onChange={(e) =>
                        setEditedData({ ...editedData, code: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm">
                      Description
                    </label>
                    <textarea
                      value={editedData.description}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm">
                      Semester
                    </label>
                    <input
                      type="text"
                      value={editedData.semester}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          semester: e.target.value,
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-3 text-sm">
                      Class Color
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {colors.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() =>
                            setEditedData({
                              ...editedData,
                              color: color.value,
                            })
                          }
                          className={`p-3 rounded-lg border-2 transition-all ${
                            editedData.color === color.value
                              ? "border-gray-900 scale-105"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div
                            className={`w-full h-8 rounded ${color.value}`}
                          />
                          <p className="text-xs text-gray-600 mt-2">
                            {color.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
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
                    <p className="text-gray-900">{classData.semester}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Color Theme
                    </label>
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg ${classData.color}`}
                    />
                  </div>
                </div>
              )}
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
                      {classData.studentsCount}
                    </p>
                    <p className="text-sm text-gray-500">Students Enrolled</p>
                  </div>
                </div>

                {/* Teams */}
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                    <Users size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl text-gray-900">
                      {classData.teamsCount}
                    </p>
                    <p className="text-sm text-gray-500">Active Teams</p>
                  </div>
                </div>

                {/* Instructors */}
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                    <User size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl text-gray-900">
                      {classData.instructorsCount}
                    </p>
                    <p className="text-sm text-gray-500">Instructors</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-4 sm:p-6">
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
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
    </>
  );
}
