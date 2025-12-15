import { useState } from "react";
import {
  ArrowLeft,
  Trash2,
  Edit,
  Users,
  UserCheck,
  Save,
  X,
} from "lucide-react";
// import { TeamsView } from "./TeamsView";
import type { Class } from "../../App";

interface ClassDetailsProps {
  classData: Class;
  onBack: () => void;
  onUpdate: (updatedClass: Class) => void;
  onDelete: () => void;
}

export function ClassDetails({
  classData,
  onBack,
  onUpdate,
  onDelete,
}: ClassDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  //   const [showTeams, setShowTeams] = useState(false);
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

  //   if (showTeams) {
  //     return (
  //       <TeamsView classData={classData} onBack={() => setShowTeams(false)} />
  //     );
  //   }

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                {/* <h1 className="text-gray-900">{classData.name}</h1> */}
                <p className="text-gray-600 mt-1">{classData.semester}</p>
              </div>
            </div>
            <div className="flex gap-3">
              {/* <button
                onClick={() => setShowTeams(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Users size={18} />
                View Teams
              </button> */}
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Edit size={18} />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Save size={18} />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedData(classData);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Class Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-6">Class Information</h2>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Class Name
                    </label>
                    <input
                      type="text"
                      value={editedData.name}
                      onChange={(e) =>
                        setEditedData({ ...editedData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Class Code
                    </label>
                    <input
                      type="text"
                      value={editedData.code}
                      onChange={(e) =>
                        setEditedData({ ...editedData, code: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Semester</label>
                    <input
                      type="text"
                      value={editedData.semester}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          semester: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-3">
                      Class Color
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {colors.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() =>
                            setEditedData({ ...editedData, color: color.value })
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
                      className={`w-16 h-16 rounded-lg ${classData.color}`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <UserCheck size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl text-gray-900">
                      {classData.studentsCount}
                    </p>
                    <p className="text-sm text-gray-500">Students Enrolled</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Users size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl text-gray-900">
                      {classData.teamsCount}
                    </p>
                    <p className="text-sm text-gray-500">Active Teams</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Export Student List
                </button>
                <button className="w-full px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Download Grades
                </button>
                <button className="w-full px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
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
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-gray-900 mb-3">Delete Class?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {classData.name}? This action
              cannot be undone and will remove all associated data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
