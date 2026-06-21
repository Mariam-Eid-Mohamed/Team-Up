import { useState, useEffect, useRef } from "react";
import {
  Edit2,
  Trash2,
  UploadCloud,
  X,
  Download,
  Info,
  Loader2,
} from "lucide-react";
import {
  getTaskDetails,
  uploadDeliverable,
  updateTaskStatus,
  assignTask,
  unassignTask,
} from "@/Services/Task Endpoints/Endpoints";
import { useSessionStore } from "@/store/sessionStore";
import toast from "react-hot-toast";
import profilePlaceholder from "@/assets/images/profile-placeholder.png";

interface TaskDetailsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: any) => void;
  onDelete?: (task: any) => void;
  task: any;
  teamMembers?: any[];
  onUpdateStatus?: (taskId: string, newStatus: any) => void;
  onUpdateAssignee?: (taskId: string, newAssignee: any) => void;
}

export default function TaskDetailsSidebar({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  task,
  teamMembers = [],
  onUpdateStatus,
  onUpdateAssignee,
}: TaskDetailsSidebarProps) {
  const [taskDetails, setTaskDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isReplacing, setIsReplacing] = useState(false);

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);

  const token = useSessionStore((state) => state.token);
  const userId = useSessionStore((state) => state.userId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDetails = async () => {
    if (!task?.id || !token) return;
    setLoading(true);
    try {
      const response = await getTaskDetails(task.id, token);
      if (response.data?.success) {
        setTaskDetails(response.data.data);
      } else {
        toast.error("Failed to load task details");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error fetching task details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && task?.id) {
      fetchDetails();
      setSelectedFile(null);
      setIsReplacing(false);
    }
  }, [isOpen, task?.id]);

  if (!isOpen) return null;

  if (loading || !taskDetails) {
    return (
      <>
        {/* Dim Overlay Backdrop */}
        <div className="fixed inset-0 " onClick={onClose} />
        {/* Sidebar Drawer Container (Loading Mode) */}
        <div className="fixed right-0 top-0 h-screen w-full max-w-[500px] bg-white z-[1000] shadow-2xl flex flex-col items-center justify-center font-sans border-l border-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-[#2D7A78] mb-2" />
          <p className="text-sm text-gray-500 font-medium">
            Loading details...
          </p>
        </div>
      </>
    );
  }

  const creatorName = taskDetails.creator
    ? `${taskDetails.creator.firstName || taskDetails.creator.first_name || ""} ${taskDetails.creator.lastName || taskDetails.creator.last_name || ""}`.trim() ||
    taskDetails.creator.email ||
    "Unknown"
    : "Unknown";

  const assigneeName = taskDetails.assignee
    ? `${taskDetails.assignee.firstName || taskDetails.assignee.first_name || ""} ${taskDetails.assignee.lastName || taskDetails.assignee.last_name || ""}`.trim() ||
    taskDetails.assignee.email ||
    "Unassigned"
    : "Unassigned";

  const creatorProfilePicture =
    taskDetails.creator?.profilePicture ||
    taskDetails.creator?.profile_picture ||
    null;

  const assigneeProfilePicture =
    taskDetails.assignee?.profilePicture ||
    taskDetails.assignee?.profile_picture ||
    null;

  const getMemberName = (m: any) => {
    if (!m) return "";
    if (m.name) return m.name;
    if (m.student) {
      return `${m.student.first_name || ""} ${m.student.last_name || ""}`.trim() || m.student.email || "";
    }
    return m.email || "Unknown";
  };

  const getMemberId = (m: any) => {
    if (!m) return "";
    if (m.student) {
      return m.student.id || m.student._id || m.id;
    }
    return m.id || m._id;
  };

  const getMemberInitial = (m: any) => {
    const name = getMemberName(m);
    return name ? name.charAt(0) : "👤";
  };

  const getMemberProfilePicture = (m: any) => {
    if (!m) return null;
    if (m.student) {
      return m.student.profile_picture || m.student.profilePicture || null;
    }
    return m.profilePicture || m.profile_picture || null;
  };

  const currentAssigneeObj = taskDetails.assignee || taskDetails.assignee_id;
  const currentAssigneeId = typeof currentAssigneeObj === "string"
    ? currentAssigneeObj
    : (currentAssigneeObj?.id || currentAssigneeObj?._id || currentAssigneeObj?.student?.id);

  const isAssignee = currentAssigneeId === userId;
  const hasUploadedFile = !!(
    taskDetails.deliverableFileUrl || taskDetails.deliverable_file_url
  );

  const handleStatusChange = async (newStatus: string) => {
    if (!taskDetails._id && !taskDetails.id) return;
    const tid = taskDetails.id || taskDetails._id;
    try {
      const response = await updateTaskStatus(tid, token!, newStatus);
      if (response.data?.success) {
        toast.success("Status updated successfully");
        fetchDetails();
        if (onUpdateStatus) {
          onUpdateStatus(tid, newStatus);
        }
      } else {
        toast.error(response.data?.message || "Failed to update status");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error updating task status");
    }
  };

  const handleAssigneeChange = async (newAssigneeId: string | null) => {
    if (!taskDetails._id && !taskDetails.id) return;
    const tid = taskDetails.id || taskDetails._id;
    try {
      if (newAssigneeId === null) {
        const response = await unassignTask(tid, token!);
        if (response.data?.success) {
          toast.success("Task unassigned successfully");
          fetchDetails();
          if (onUpdateAssignee) {
            onUpdateAssignee(tid, null);
          }
        } else {
          toast.error(response.data?.message || "Failed to unassign task");
        }
      } else {
        const currentAssignee = taskDetails.assignee || taskDetails.assignee_id;
        if (currentAssignee) {
          toast.error("Task is already assigned. Please unassign it first.");
          return;
        }

        const response = await assignTask(tid, token!, newAssigneeId);
        if (response.data?.success) {
          toast.success("Task assigned successfully");
          fetchDetails();
          const m = teamMembers.find((member) => (member.id === newAssigneeId || member.student?.id === newAssigneeId));
          const name = m ? (m.name || `${m.student?.first_name || ""} ${m.student?.last_name || ""}`.trim()) : newAssigneeId;
          if (onUpdateAssignee) {
            onUpdateAssignee(tid, name);
          }
        } else {
          toast.error(response.data?.message || "Failed to assign task");
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error updating task assignee");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const requiredType =
        taskDetails.deliverableType || taskDetails.deliverable_type;

      if (
        requiredType &&
        !file.name.toLowerCase().endsWith(requiredType.toLowerCase())
      ) {
        toast.error(
          `Wrong file type. This task requires a ${requiredType} file.`,
        );
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !task?.id || !token) return;
    setUploading(true);
    try {
      const response = await uploadDeliverable(task.id, token, selectedFile);
      if (response.data?.success) {
        toast.success("Deliverable uploaded successfully");
        setSelectedFile(null);
        setIsReplacing(false);
        fetchDetails();
      } else {
        toast.error(response.data?.message || "Failed to upload deliverable");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error uploading deliverable");
    } finally {
      setUploading(false);
    }
  };

  const getFileName = (url: string) => {
    if (!url) return "";
    try {
      const decoded = decodeURIComponent(url);
      return decoded.split("/").pop() || "Deliverable";
    } catch {
      return url.split("/").pop() || "Deliverable";
    }
  };

  const getStatusStyle = (statusVal: string) => {
    switch (statusVal) {
      case "To Do":
        return "bg-gray-100 text-gray-600 border border-gray-200/80";
      case "In Progress":
        return "bg-amber-50 text-amber-600 border border-amber-200/60";
      case "Done":
        return "bg-emerald-50 text-emerald-600 border border-emerald-200/60";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200/80";
    }
  };

  const deliverableType =
    taskDetails.deliverableType || taskDetails.deliverable_type || ".pdf";
  const deliverableFileUrl =
    taskDetails.deliverableFileUrl || taskDetails.deliverable_file_url;
  const markedAsDoneAt =
    taskDetails.markedAsDoneAt ||
    taskDetails.marked_as_done_at ||
    taskDetails.updatedAt;

  return (
    <>
      {/* Dim Overlay Backdrop */}
      <div className="fixed inset-0 bg-transparent z-[999]" onClick={onClose} />

      {/* Sidebar Drawer Container */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-[500px] bg-white z-[1000] shadow-2xl flex flex-col font-sans border-l border-gray-100 animate-in slide-in-from-right duration-200">
        {/* Header Section with Inline Action Group */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            {taskDetails.name}
          </h2>

          {/* Aligned Control Group: Edit -> Delete -> Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-md transition-colors cursor-pointer"
            >
              <Edit2 size={18} className="stroke-[2.5]" />
            </button>
            <div className="w-[1px] h-4 bg-gray-200 mx-0.5" />
            <button
              onClick={() => onDelete?.(task)}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
            >
              <Trash2 size={18} className="stroke-[2.5]" />
            </button>
            <div className="w-[1px] h-4 bg-gray-200 mx-0.5" />
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
            >
              <X size={20} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

        <div className="px-8">
          <hr className="border-gray-200/70 w-full" />
        </div>

        {/* Scrollable body content */}
        <div className="flex-1 overflow-y-scroll px-8 py-6 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Status Row */}
          <div className="flex items-center justify-between relative">
            <span className="text-gray-500 font-medium text-[15px]">
              Status
            </span>
            <div>
              <button
                onClick={() => {
                  setIsStatusDropdownOpen(!isStatusDropdownOpen);
                  setIsAssigneeDropdownOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${getStatusStyle(taskDetails.status)}`}
              >
                <span>{taskDetails.status}</span>
                <span className="text-[9px]">▼</span>
              </button>

              {isStatusDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-32 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                  {["To Do", "In Progress", "Done"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        handleStatusChange(opt);
                        setIsStatusDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Deadline Row */}
          <div className="flex items-center justify-between text-[15px]">
            <span className="text-gray-500 font-medium">Deadline</span>
            <span className="text-gray-700 font-medium">
              {taskDetails.deadline
                ? new Date(taskDetails.deadline).toLocaleDateString()
                : ""}
            </span>
          </div>

          {/* Contributors Group */}
          <div className="space-y-4 pt-2">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">
              Contributors
            </h3>

            {/* Created By Row */}
            <div className="flex items-center justify-between text-[15px]">
              <span className="text-gray-500 font-medium">Created by</span>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                  {creatorProfilePicture ? (
                    <img
                      src={creatorProfilePicture}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={profilePlaceholder}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <span className="text-gray-800 font-medium">{creatorName}</span>
              </div>
            </div>

            {/* Assigned To Row */}
            <div className="flex items-center justify-between text-[15px] relative">
              <span className="text-gray-500 font-medium">Assigned to</span>
              <div>
                <button
                  onClick={() => {
                    setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen);
                    setIsStatusDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50/80 transition-colors cursor-pointer bg-white"
                >
                  <div className="w-5 h-5 rounded-full border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                    {assigneeProfilePicture ? (
                      <img
                        src={assigneeProfilePicture}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={profilePlaceholder}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <span className="text-gray-800 font-medium text-sm">
                    {assigneeName}
                  </span>
                  <span className="text-gray-400 text-[9px] ml-0.5">▼</span>
                </button>

                {isAssigneeDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1.5 overflow-hidden">
                    <button
                      onClick={() => {
                        handleAssigneeChange(null);
                        setIsAssigneeDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-full border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                        <img
                          src={profilePlaceholder}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Unassigned
                      </span>
                    </button>
                    {teamMembers.map((member) => {
                      const mId = getMemberId(member);
                      const mName = getMemberName(member);
                      const mPic = getMemberProfilePicture(member);
                      return (
                        <button
                          key={mId}
                          onClick={() => {
                            handleAssigneeChange(mId);
                            setIsAssigneeDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded-full border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                            {mPic ? (
                              <img
                                src={mPic}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img
                                src={profilePlaceholder}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {mName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description Block */}
          <div className="space-y-2 pt-2">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">
              Description
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed text-justify">
              {taskDetails.description || "No description provided."}
            </p>
          </div>

          {/* Deliverable Section */}
          <div className="space-y-3 pt-2 pb-8">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">
              Deliverable
            </h3>

            {hasUploadedFile && !isReplacing ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between border border-emerald-100/70 rounded-lg px-4 py-3 bg-emerald-50/20">
                  <div className="space-y-0.5">
                    <p
                      className="text-sm font-medium text-gray-800 truncate max-w-[200px]"
                      title={getFileName(deliverableFileUrl)}
                    >
                      {getFileName(deliverableFileUrl)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {markedAsDoneAt
                        ? `Uploaded on ${new Date(markedAsDoneAt).toLocaleString()}`
                        : "Uploaded"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open(deliverableFileUrl, "_blank")}
                      className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 bg-white border border-gray-100 px-2.5 py-1.5 rounded-md shadow-xs transition-colors cursor-pointer"
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </button>

                    {isAssignee && (
                      <button
                        onClick={() => setIsReplacing(true)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-700 bg-white border border-gray-100 px-2.5 py-1.5 rounded-md shadow-xs transition-colors cursor-pointer"
                      >
                        <span>Replace</span>
                      </button>
                    )}
                  </div>
                </div>

                {!isAssignee && (
                  <div className="flex items-start gap-2.5 border border-sky-100 bg-sky-50/40 p-3 rounded-lg text-xs text-sky-700 leading-normal">
                    <Info size={15} className="mt-0.5 flex-shrink-0" />
                    <p>Only the assigned member can replace the deliverable.</p>
                  </div>
                )}
              </div>
            ) : isAssignee ? (
              <div className="border border-gray-200 rounded-xl p-5 bg-white flex flex-col items-center justify-center shadow-xs">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept={deliverableType}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center py-4 text-center cursor-pointer hover:bg-gray-50/50 w-full rounded-lg transition-colors border border-dashed border-gray-200 mb-3"
                >
                  <UploadCloud
                    size={32}
                    className="text-teal-600 stroke-[1.5] mb-2"
                  />
                  <p className="text-xs font-semibold text-teal-600 hover:underline">
                    click to browse
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Requires {deliverableType} file
                  </p>
                </div>

                {selectedFile && (
                  <div className="w-full border border-gray-100 rounded-lg p-3 bg-gray-50/50 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-red-100 text-red-600 font-bold rounded-md flex items-center justify-center text-[9px] tracking-wider uppercase">
                        {selectedFile.name.split(".").pop() || "FILE"}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-gray-800 truncate max-w-[200px]">
                          {selectedFile.name}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded-full transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="w-full py-2.5 bg-[#2D7A78] hover:bg-[#235F5D] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading && <Loader2 size={16} className="animate-spin" />}
                  {uploading ? "Uploading..." : "Upload Deliverable"}
                </button>

                {isReplacing && (
                  <button
                    onClick={() => {
                      setIsReplacing(false);
                      setSelectedFile(null);
                    }}
                    className="w-full mt-2 py-2 border border-gray-200 text-gray-500 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-start gap-2.5 border border-sky-100 bg-sky-50/40 p-3 rounded-lg text-xs text-sky-700 leading-normal">
                <Info size={15} className="mt-0.5 flex-shrink-0" />
                <p>
                  Only the assigned member can upload deliverables for this
                  task.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
