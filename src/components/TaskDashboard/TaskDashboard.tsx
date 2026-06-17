import { useState } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import TaskModal from "../Task/TaskModal";

interface Task {
  id: string;
  name: string;
  status: "To Do" | "In Progress" | "Done";
  deadline: string;
  createdBy: string;
  assignedTo: string | null;
  description: string;
  deliverable?: {
    name: string;
    size: string;
    uploadedAt?: string;
  } | null;
}

interface TaskDashboardProps {
  tasks: Task[];
  onViewTask: (task: Task) => void;
}

export default function TaskDashboard({
  tasks,
  onViewTask,
}: TaskDashboardProps) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // Tracks the task for view/edit mode
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Status");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Filter tasks based on search string and dropdown status
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "Status" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Open modal in CREATE mode
  const handleCreateClick = () => {
    setSelectedTask(null); // Clear selected task so it's fresh
    setIsTaskModalOpen(true);
  };

  // Open modal in EDIT/VIEW mode
  const handleViewClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
    onViewTask(task); // Optional: preserves your parent components action
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
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              {/* Profile/Assigned Entity Avatar Ring Indicator */}
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400">
                {task.assignedTo ? (
                  <div className="w-full h-full rounded-full bg-secondary/30 flex items-center justify-center font-bold text-xs text-primary-dark">
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
                    `}
                  >
                    {task.status}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 font-medium">
                    {task.deadline}
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
        ))}

        {filteredTasks.length === 0 && (
          <p className="text-center py-8 text-sm text-gray-400 italic">
            No tasks matched your parameters.
          </p>
        )}
      </div>

      {/* Pagination Footer Controls */}
      <div className="flex items-center justify-center gap-2 pt-6">
        <button className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 cursor-pointer">
          <ChevronLeft size={16} />
        </button>
        <button className="w-8 h-8 rounded-lg text-sm font-bold bg-primary text-white">
          1
        </button>
        <button className="w-8 h-8 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 cursor-pointer">
          2
        </button>
        <button className="w-8 h-8 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 cursor-pointer">
          3
        </button>
        <span className="text-gray-400 text-sm px-1">...</span>
        <button className="w-8 h-8 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 cursor-pointer">
          29
        </button>
        <button className="p-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 cursor-pointer">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Dynamic TaskModal Injection Integration */}
      <TaskModal
        open={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        mode={selectedTask ? "edit" : "create"}
        initialData={
          selectedTask
            ? {
                taskName: selectedTask.name,
                taskDescription: selectedTask.description,
                deliverableType: selectedTask.deliverable?.name || "",
                deadline: selectedTask.deadline,
                assignee: selectedTask.assignedTo || "",
              }
            : {
                taskName: "",
                taskDescription: "",
                deliverableType: "",
                deadline: "",
                assignee: "",
              }
        }
        onSubmit={(data) => {
          console.log("Captured Modal Submission Data Form:", data);
          setIsTaskModalOpen(false);
        }}
      />
    </div>
  );
}
