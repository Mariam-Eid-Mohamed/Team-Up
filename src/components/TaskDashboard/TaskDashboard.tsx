import { useEffect, useState } from "react";

import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import TaskModal from "../Task/TaskModal";
import type {
  TaskDashboardProps,
  TaskModalData,
  TeamMember,
} from "@/interfaces/interfaces";
import toast from "react-hot-toast";
import { createTask, getTeamTasks } from "@/Services/Task Endpoints/Endpoints";
import { useParams } from "react-router-dom";
import { useSessionStore } from "@/store/sessionStore";
import { getTeamMembers } from "@/Services/team Endpoints/Endpoints";

export default function TaskDashboard({ onViewTask }: TaskDashboardProps) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null); // Tracks the task for view/edit mode
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Status");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const { teamId } = useParams();

  const token = useSessionStore((state) => state.token);
  const [members, setMembers] = useState<TeamMember[]>([]);

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const fetchMembers = async () => {
    if (!teamId || !token) return;

    try {
      const response = await getTeamMembers(teamId, token);

      if (response.data.success) {
        setMembers(response.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load team members");
    }
  };
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);
  useEffect(() => {
    fetchMembers();
  }, [teamId, token]);

  const fetchTasks = async (page = currentPage, query = debouncedSearch) => {
    if (!teamId || !token) return;
    setLoading(true);
    try {
      const response = await getTeamTasks(teamId, token, {
        page,
        limit: 10,
        search: query || undefined,
      });
      if (response.data?.success) {
        const { tasks: fetchedTasks, pagination } = response.data.data;
        const mapped = fetchedTasks.map((t: any) => ({
          id: t.id,
          name: t.task_name,
          status: t.status,
          deadline: t.deadline,
          description: t.description || "",
          assignedTo: t.assignee ? t.assignee.name : null,
          assigneeId: t.assignee ? t.assignee.id : null,
          assigneeProfilePicture: t.assignee
            ? t.assignee.profile_picture
            : null,
          deliverable: t.deliverable_url
            ? {
                name: t.deliverable_url.split("/").pop() || "Deliverable",
                size: "Unknown Size",
              }
            : null,
        }));
        setTasks(mapped);
        setTotalPages(pagination.totalPages || 1);
        setTotalTasks(pagination.total || 0);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch, teamId, token]);

  const filteredTasks = tasks.filter((task) => {
    return statusFilter === "Status" || task.status === statusFilter;
  });

  const handleUpdateTask = async (data: TaskModalData) => {
    console.log("Update task:", data);
  };

  const handleCreateTask = async (data: TaskModalData) => {
    try {
      await createTask(teamId!, token!, {
        name: data.taskName,
        description: data.taskDescription,
        deadline: data.deadline,
        deliverable_type: data.deliverableType,
        assignee_id: data.assignee || undefined,
      } as any);

      setIsTaskModalOpen(false);
      toast.success("Task created successfully");
      fetchTasks(currentPage, debouncedSearch);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create task");
    }
  };

  // Open modal in CREATE mode
  const handleCreateClick = () => {
    setSelectedTask(null); // Clear selected task so it's fresh
    setIsTaskModalOpen(true);
  };

  // Open modal in EDIT/VIEW mode
  const handleViewClick = (task: any) => {
    onViewTask(task); // Optional: preserves your parent components action
  };

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getPageNumbers = () => {
    const range: (number | string)[] = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      if (currentPage <= 3) {
        range.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        range.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        range.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return range;
  };

  return (
    <div className="space-y-6 relative">
      {/* Top Search & Controls Panel Bar */}
      <div className="flex items-center justify-between gap-4">
        {/* Search Input Bar */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2  -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by task name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none  focus:ring-2 focus:ring-[#2D7A78]/20 shadow-xs"
          />
        </div>

        {/* Action Controls Panel */}
        <div className="flex items-center gap-3">
          {/* Modified + button to cleanly kick off create sequence */}
          <button
            onClick={handleCreateClick}
            className="p-2.5 bg-white hover:bg-soft-background border border-gray-200 rounded-xl text-primary cursor-pointer transition-colors"
          >
            <Plus size={20} />
          </button>

          {/* Functional Dropdown Status Filter Menu */}
          <div className="relative">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors shadow-xs cursor-pointer"
            >
              <span>{statusFilter}</span>
              <ChevronDown size={16} />
            </button>

            {isFilterDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsFilterDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1 animate-in fade-in zoom-in-95 duration-100">
                  {["Status", "To Do", "In Progress", "Done"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setStatusFilter(opt);
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer hover:bg-soft-background
                        ${statusFilter === opt ? "text-primary font-semibold bg-secondary/20" : "text-gray-600"}
                      `}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Task Rows List Feed Stack */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-gray-500 font-medium">
              Loading tasks...
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                {/* Profile/Assigned Entity Avatar Ring Indicator */}
                <div className="w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {task.assigneeProfilePicture ? (
                    <img
                      src={task.assigneeProfilePicture}
                      alt={task.assignedTo || ""}
                      className="w-full h-full object-cover"
                    />
                  ) : task.assignedTo ? (
                    <div className="w-full h-full bg-secondary/30 flex items-center justify-center font-bold text-xs text-primary-dark">
                      {task.assignedTo.charAt(0)}
                    </div>
                  ) : (
                    <span className="text-sm">👤</span>
                  )}
                </div>

                {/* Text Fields Metadata Cluster */}
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider
                        ${task.status === "To Do" ? "bg-gray-100 text-gray-600" : ""}
                        ${task.status === "In Progress" ? "bg-amber-50 text-amber-600" : ""}
                        ${task.status === "Done" ? "bg-emerald-50 text-emerald-600" : ""}
                        ${task.status === "Blocked" ? "bg-red-50 text-red-600" : ""}
                      `}
                    >
                      {task.status}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 font-medium">
                      {formatDate(task.deadline)}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900">
                    {task.name}
                  </h4>
                </div>
              </div>

              {/* View Open Trigger Drawer Button linked to handleViewClick */}
              <button
                onClick={() => handleViewClick(task)}
                className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
              >
                <span>View</span>
                <span>➔</span>
              </button>
            </div>
          ))
        )}

        {!loading && filteredTasks.length === 0 && (
          <p className="text-center py-8 text-sm text-gray-400 italic">
            No tasks matched your parameters.
          </p>
        )}
      </div>

      {/* Pagination Footer Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>

          {getPageNumbers().map((page, idx) => {
            if (page === "...") {
              return (
                <span
                  key={`dots-${idx}`}
                  className="text-gray-400 text-sm px-1"
                >
                  ...
                </span>
              );
            }
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(Number(page))}
                className={`w-8 h-8 rounded-lg text-sm font-bold cursor-pointer transition-colors
                  ${
                    currentPage === page
                      ? "bg-primary text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }
                `}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Dynamic TaskModal Injection Integration */}
      <TaskModal
        open={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        mode={selectedTask ? "edit" : "create"}
        members={members}
        initialData={
          selectedTask
            ? {
                taskName: selectedTask.name,
                taskDescription: selectedTask.description,
                deliverableType: selectedTask.deliverable?.name || "",
                deadline: selectedTask.deadline
                  ? selectedTask.deadline.split("T")[0]
                  : "",
                assignee: selectedTask.assigneeId || "",
              }
            : null
        }
        onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
      />
    </div>
  );
}
