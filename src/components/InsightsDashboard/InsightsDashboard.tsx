import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts";
import {
  insightsSubTabs,
  workDistributionData,
  tasksOverviewData,
  fullTaskListData,
  CustomWorkDistributionTooltip,
  CustomTasksOverviewTooltip,
  CustomActivityTimelineTooltip,
} from "../Insights/InsightsData";

// Mock data populated based on the timeline trend in Screenshot (1422).png
const activityTimelineData = [
  { date: "Oct 1", "Sarah Chen": 2, "Alex Rivera": 2, "Jordan Yeoh": 1 },
  { date: "Oct 5", "Sarah Chen": 12, "Alex Rivera": 5, "Jordan Yeoh": 1 },
  { date: "Oct 10", "Sarah Chen": 20, "Alex Rivera": 9, "Jordan Yeoh": 1 },
  { date: "Oct 15", "Sarah Chen": 24, "Alex Rivera": 13, "Jordan Yeoh": 2 },
  { date: "Oct 20", "Sarah Chen": 26, "Alex Rivera": 18, "Jordan Yeoh": 3 },
  { date: "Oct 25", "Sarah Chen": 27, "Alex Rivera": 23, "Jordan Yeoh": 5 },
  { date: "Oct 30", "Sarah Chen": 28, "Alex Rivera": 28, "Jordan Yeoh": 9 },
  { date: "Nov 2", "Sarah Chen": 29, "Alex Rivera": 32, "Jordan Yeoh": 28 },
  { date: "Nov 5", "Sarah Chen": 29, "Alex Rivera": 34, "Jordan Yeoh": 31 }, // Deadline Node
  { date: "Nov 10", "Sarah Chen": 29, "Alex Rivera": 36, "Jordan Yeoh": 35 },
  { date: "Nov 15", "Sarah Chen": 29, "Alex Rivera": 37, "Jordan Yeoh": 35 },
  { date: "Nov 20", "Sarah Chen": 30, "Alex Rivera": 39, "Jordan Yeoh": 36 },
];

export default function InsightsDashboard() {
  const [insightsTab, setInsightsTab] = useState("Work Distribution");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header Context */}
      <div>
        <h2 className="text-xl font-bold text-[#1b4d49]">Insights Dashboard</h2>
        <p className="text-gray-400 text-xs mt-1 font-medium">Visualize team performance and task activity.</p>
      </div>

      {/* Sub Tab Navigation */}
      <div className="flex items-center gap-6 border-b border-gray-200 pb-2 overflow-x-auto no-scrollbar">
        {insightsSubTabs.map((subTab) => {
          const Icon = subTab.icon;
          const isSelected = insightsTab === subTab.id;
          return (
            <button
              key={subTab.id}
              onClick={() => setInsightsTab(subTab.id)}
              className={`flex items-center gap-1.5 text-sm font-semibold pb-2 px-1 transition-all relative cursor-pointer whitespace-nowrap ${
                isSelected ? "text-[#2D7A78]" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon size={15} />
              <span>{subTab.id}</span>
              {isSelected && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2D7A78]" />}
            </button>
          );
        })}
      </div>

      {/* Graphical Presentation Layer */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 min-h-[400px]">
        
        {/* TAB 1: WORK DISTRIBUTION */}
        {insightsTab === "Work Distribution" && (
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">Work Distribution</h3>
            <p className="text-xs font-semibold text-gray-400 pb-4">Tasks per Team Member</p>

            <div className="w-full h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={workDistributionData}
                  layout="vertical"
                  margin={{ top: 10, right: 10, left: 5, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="0" horizontal={false} stroke="#f3f4f6" />
                  <XAxis type="number" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#374151"
                    fontSize={12}
                    fontWeight={600}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                  />
                  <Tooltip
                    content={<CustomWorkDistributionTooltip />}
                    cursor={{ fill: "#f9fafb" }}
                  />
                  <Bar dataKey="tasks" fill="#8c80d9" radius={[0, 4, 4, 0]} barSize={16} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 2: TASKS OVERVIEW */}
        {insightsTab === "Tasks Overview" && (
          <div className="space-y-1">
            {/* Legend/Status Row sitting above the graph canvas */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Tasks Overview</h3>
                <p className="text-xs font-semibold text-gray-400">Completion Status per Team Member</p>
              </div>
              
              <div className="flex items-center gap-4 text-[11px] font-bold text-gray-500 self-start sm:self-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  <span>Done</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8c80d9]" />
                  <span>In Progress</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#9ca3af]" />
                  <span>To Do</span>
                </div>
              </div>
            </div>

            {/* A. MOBILE VIEW LAYOUT */}
            <div className="block sm:hidden w-full h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={tasksOverviewData}
                  layout="vertical"
                  margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
                  barGap={2}
                >
                  <CartesianGrid strokeDasharray="0" vertical={true} horizontal={false} stroke="#f3f4f6" />
                  <XAxis type="number" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#374151"
                    fontSize={11}
                    fontWeight={600}
                    axisLine={false}
                    tickLine={false}
                    width={85}
                  />
                  <Tooltip content={<CustomTasksOverviewTooltip />} cursor={{ fill: "#f9fafb" }} />
                  <Bar dataKey="Done" fill="#10b981" radius={[0, 3, 3, 0]} barSize={8} />
                  <Bar dataKey="In Progress" fill="#8c80d9" radius={[0, 3, 3, 0]} barSize={8} />
                  <Bar dataKey="To Do" fill="#9ca3af" radius={[0, 3, 3, 0]} barSize={8} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>

            {/* B. DESKTOP/TABLET VIEW LAYOUT */}
            <div className="hidden sm:block w-full h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={tasksOverviewData}
                  layout="horizontal"
                  margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="0" horizontal={true} stroke="#f3f4f6" />
                  <XAxis dataKey="name" stroke="#374151" fontSize={12} fontWeight={600} tickLine={false} axisLine={false} />
                  <YAxis type="number" stroke="#9ca3af" fontSize={11} axisLine={false} tickLine={false} width={40} />
                  <Tooltip content={<CustomTasksOverviewTooltip />} cursor={{ fill: "#f9fafb" }} />
                  <Bar dataKey="Done" fill="#10b981" radius={[3, 3, 0, 0]} barSize={14} />
                  <Bar dataKey="In Progress" fill="#8c80d9" radius={[3, 3, 0, 0]} barSize={14} />
                  <Bar dataKey="To Do" fill="#9ca3af" radius={[3, 3, 0, 0]} barSize={14} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 3: ACTIVITY TIMELINE  */}
        {insightsTab === "Activity Timeline" && (
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">Work activity over time</h3>
            <p className="text-xs font-semibold text-gray-400 pb-6">
              Cumulative completed tasks per member · dashed line = project deadline
            </p>

            <div className="w-full h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={activityTimelineData}
                  margin={{ top: 20, right: 20, left: -20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f8fafc" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis type="number" hide />
                  
                <Tooltip content={<CustomActivityTimelineTooltip />} />
                  {/* Red Dashed Project Deadline Tracker line */}
                  <ReferenceLine
                    x="Nov 5"
                    stroke="#ef4444"
                    strokeDasharray="3 3"
                    label={{
                      value: "PROJECT DEADLINE (NOV 5)",
                      position: "top",
                      fill: "#b91c1c",
                      fontSize: 9,
                      fontWeight: 800,
                      offset: 10,
                    }}
                  />

                
                  <Line
                    type="monotone"
                    dataKey="Sarah Chen"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Alex Rivera"
                    stroke="#eab308"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Jordan Yeoh"
                    stroke="#8c80d9"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Bottom Line Legend matching the picture style */}
            <div className="flex items-center gap-5 text-xs font-bold text-gray-800 pt-4 px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                <span>Sarah Chen</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                <span>Alex Rivera</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8c80d9]" />
                <span>Jordan Yeoh</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Task List Component Layer */}
      {insightsTab === "Work Distribution" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Table Header Controls */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Full Task List</h3>
              <p className="text-gray-400 text-xs font-medium">All workspace tasks for every team member</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by task name or assignee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-[#2D7A78] focus:border-[#2D7A78]"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="w-full overflow-x-auto min-w-full inline-block align-middle">
            <div className="overflow-hidden border-b border-gray-200">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-6">Task Name</th>
                    <th className="py-3 px-4 sm:px-6">Assignee</th>
                    <th className="py-3 px-4 sm:px-6">Status</th>
                    <th className="py-3 px-4 sm:px-6">Deadline</th>
                    <th className="py-3 px-4 sm:px-6">Deliverable</th>
                    <th className="py-3 px-4 sm:px-6">Completed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700 font-medium">
                  {fullTaskListData
                    .filter(
                      (task) =>
                        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((task) => (
                      <tr key={task.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-4 px-4 sm:px-6 font-bold text-gray-900">{task.name}</td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-200 border border-gray-200 flex items-center justify-center font-bold text-[10px] text-gray-600 shrink-0">
                              {task.assignee.avatar}
                            </div>
                            <span className="text-gray-700 font-semibold text-[11px] whitespace-nowrap">
                              {task.assignee.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border whitespace-nowrap ${
                              task.status === "DONE"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200/50"
                                : task.status === "IN PROGRESS"
                                ? "bg-amber-50 text-amber-600 border-amber-200/50"
                                : task.status === "OVERDUE"
                                ? "bg-red-50 text-red-600 border-red-200/50"
                                : "bg-gray-100 text-gray-500 border-gray-200/50"
                            }`}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td className={`py-4 px-4 sm:px-6 font-semibold whitespace-nowrap ${task.status === "OVERDUE" ? "text-red-600 font-bold" : "text-gray-500"}`}>
                          {task.deadline}
                        </td>
                        <td className="py-4 px-4 sm:px-6 max-w-[150px] truncate">
                          {task.deliverable ? (
                            <a href={task.deliverable.url} className="text-blue-600 font-bold hover:underline block truncate">
                              {task.deliverable.name}
                            </a>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-gray-500 whitespace-nowrap">{task.completedAt || <span className="text-gray-300">—</span>}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Pagination Utilities */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-center gap-1 sm:gap-1.5 text-xs flex-wrap">
            <button className="p-1 border border-gray-200 rounded text-gray-400 hover:bg-gray-50 cursor-pointer">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="w-6 h-6 rounded bg-[#2D7A78] text-white font-bold flex items-center justify-center">1</button>
            <button className="w-6 h-6 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold flex items-center justify-center cursor-pointer">2</button>
            <button className="w-6 h-6 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold flex items-center justify-center cursor-pointer hidden sm:flex">3</button>
            <span className="text-gray-400 px-0.5 hidden sm:inline">...</span>
            <button className="w-6 h-6 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold flex items-center justify-center cursor-pointer">29</button>
            <button className="p-1 border border-gray-200 rounded text-gray-600 hover:bg-gray-50 cursor-pointer">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}