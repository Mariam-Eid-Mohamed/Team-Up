import { useState } from "react";
import { Search, Plus, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

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

export default function TaskDashboard({ tasks, onViewTask }: TaskDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Status");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Filter tasks based on search string and dropdown status matching layout mockups
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "Status" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Search & Controls Panel Bar */}
      <div className="flex items-center justify-between gap-4">
        {/* Search Input Bar */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by task name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D7A78] focus:border-transparent transition-all shadow-xs"
          />
        </div>

        {/* Action Controls Panel */}
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-gray-600 transition-colors shadow-xs cursor-pointer">
            <Plus size={20} />
          </button>

          {/* Functional Dropdown Status Filter Menu */}
          <div className="relative">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#2C7A7B] text-white rounded-xl text-sm font-medium hover:bg-[#235F60] transition-colors shadow-xs cursor-pointer"
            >
              <span>{statusFilter}</span>
              <ChevronDown size={16} />
            </button>

            {isFilterDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsFilterDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1 animate-in fade-in zoom-in-95 duration-100">
                  {["Status", "To Do", "In Progress", "Done"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setStatusFilter(opt);
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer hover:bg-gray-50
                        ${statusFilter === opt ? "text-[#2D7A78] font-semibold bg-teal-50/40" : "text-gray-600"}
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
                  <div className="w-full h-full rounded-full bg-teal-50 flex items-center justify-center font-bold text-xs text-[#2D7A78]">
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
                  <span className="text-xs text-gray-500 font-medium">{task.deadline}</span>
                </div>
                <h4 className="text-base font-bold text-gray-900">{task.name}</h4>
              </div>
            </div>

            {/* View Open Trigger Drawer Button */}
            <button
              onClick={() => onViewTask(task)}
              className="flex items-center gap-2 px-5 py-2 bg-[#2D7A78] hover:bg-[#235F5D] text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
            >
              <span>View</span>
              <span>➔</span>
            </button>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <p className="text-center py-8 text-sm text-gray-400 italic">No tasks matched your parameters.</p>
        )}
      </div>

      {/* Pagination Footer Controls */}
      <div className="flex items-center justify-center gap-2 pt-6">
        <button className="p-1.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 cursor-pointer">
          <ChevronLeft size={16} />
        </button>
        <button className="w-8 h-8 rounded-lg text-sm font-bold bg-[#2D7A78] text-white">1</button>
        <button className="w-8 h-8 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 cursor-pointer">2</button>
        <button className="w-8 h-8 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 cursor-pointer">3</button>
        <span className="text-gray-400 text-sm px-1">...</span>
        <button className="w-8 h-8 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 cursor-pointer">29</button>
        <button className="p-1.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 cursor-pointer">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}