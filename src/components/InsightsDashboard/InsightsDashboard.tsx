import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, Loader2, MessageSquare, PieChart, History } from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts";
import { useSessionStore } from "@/store/sessionStore";
import { getTeamInsights } from "@/Services/team Endpoints/Endpoints";
import { getTeamTasks } from "@/Services/Task Endpoints/Endpoints";

const insightsSubTabs = [
  { id: "Work Distribution", icon: MessageSquare },
  { id: "Tasks Overview", icon: PieChart },
  { id: "Activity Timeline", icon: History },
];

const colors = [
  "#10b981", // Green
  "#eab308", // Yellow/Orange
  "#8c80d9", // Purple
  "#3b82f6", // Blue
  "#f43f5e", // Pink/Red
  "#0d9488", // Teal
  "#6366f1", // Indigo
  "#f97316", // Orange
];

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
};

// --- 1. CUSTOM TOOLTIP FOR WORK DISTRIBUTION ---
const CustomWorkDistributionTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="relative bg-[#F4F9F9] border border-gray-100 rounded-xl p-4 shadow-xl max-w-[240px] text-left mb-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-[#2D7A78]/20">
          {data.profilePicture ? (
            <img
              src={data.profilePicture}
              alt={data.name}
              className="w-9 h-9 rounded-full object-cover border border-gray-200 flex-shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-300 border border-gray-200 flex-shrink-0 flex items-center justify-center text-[10px] text-gray-600 font-bold uppercase">
              {data.name ? data.name.charAt(0) : "?"}
            </div>
          )}
          <div>
            <h4 className="text-xs font-bold text-gray-900 leading-tight">{data.name}</h4>
          </div>
        </div>
        <div className="pt-2 space-y-1.5 text-xs text-[#1B4D49] font-medium">
          <div className="flex justify-between items-center gap-8">
            <span className="text-gray-600">Total Tasks</span>
            <span className="font-bold text-gray-900">{data.tasks}</span>
          </div>
          <div className="flex justify-between items-center gap-8">
            <span className="text-gray-600">Team share</span>
            <span className="font-bold text-[#2D7A78]">{data.share}%</span>
          </div>
        </div>
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#F4F9F9] rotate-45 border-r border-b border-gray-100 shadow-sm" />
      </div>
    );
  }
  return null;
};

// --- 2. CUSTOM TOOLTIP FOR TASKS OVERVIEW ---
const CustomTasksOverviewTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const memberName = data.name;
    const doneCount = data.Done || 0;
    const inProgressCount = data["In Progress"] || 0;
    const toDoCount = data["To Do"] || 0;

    return (
      <div className="relative bg-[#F4F9F9] border border-gray-100 rounded-xl p-4 shadow-xl min-w-[210px] text-xs text-left mb-3 animate-in fade-in zoom-in duration-100 z-[9999]">
        <div className="pb-2 border-b border-[#2D7A78]/20 mb-2">
          <h4 className="font-bold text-gray-900 text-xs">{memberName}</h4>
        </div>
        <div className="space-y-1.5 text-[#1B4D49] font-medium">
          <div className="flex justify-between items-center gap-4">
            <span className="text-gray-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" /> Done
            </span>
            <span className="font-bold text-gray-900">{doneCount} tasks</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-gray-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#8c80d9]" /> In Progress
            </span>
            <span className="font-bold text-gray-900">{inProgressCount} tasks</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-gray-600 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#9ca3af]" /> To Do
            </span>
            <span className="font-bold text-gray-900">{toDoCount} tasks</span>
          </div>
        </div>
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#F4F9F9] rotate-45 border-r border-b border-gray-100 shadow-sm" />
      </div>
    );
  }
  return null;
};

// --- 3. CUSTOM TOOLTIP FOR ACTIVITY TIMELINE ---
const CustomActivityTimelineTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const dateStr = data.date;

    const completions: any[] = [];
    Object.keys(data).forEach((key) => {
      if (key.endsWith("_meta") && data[key]) {
        completions.push(data[key]);
      }
    });

    return (
      <div className="relative bg-[#f4f9f9]/95 backdrop-blur-sm border border-gray-100 rounded-xl p-4 shadow-xl w-[280px] text-left mb-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-150 z-[9999]">
        {completions.length > 0 ? (
          <div className="space-y-3">
            {completions.map((comp, idx) => (
              <div key={idx} className="space-y-1.5 ">
                <div className="pb-1.5 border-b border-gray-300/60 mb-2">
                  <div className="flex items-center gap-2 ">
                    {comp.profilePicture ? (
                      <img
                        src={comp.profilePicture}
                        alt={comp.name}
                        className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gray-300 border border-gray-200 shrink-0 flex items-center justify-center text-[9px] text-gray-600 font-bold uppercase">
                        {comp.name ? comp.name.charAt(0) : "?"}
                      </div>
                    )}
                    <span className="text-xs font-bold text-gray-800 truncate ">{comp.name}</span>
                  </div>
                </div>

                <div className="pl-2 space-y-0.5 text-[10px] text-gray-600 font-medium">
                  <div>
                    <span className="text-gray-400 font-bold">Task: </span>
                    <span className="text-gray-800 font-semibold">{comp.taskName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold">Completed: </span>
                    <span className="text-gray-800 font-semibold">
                      {new Date(comp.completedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold">Days early/late: </span>
                    <span className={`font-extrabold ${comp.daysBeforeTaskDeadline >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {comp.daysBeforeTaskDeadline >= 0
                        ? `${comp.daysBeforeTaskDeadline} days early`
                        : `${Math.abs(comp.daysBeforeTaskDeadline)} days late`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-2 text-center text-xs text-gray-400 italic">
            No tasks completed on this date
          </div>
        )}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#f4f9f9] rotate-45 border-r border-b border-gray-100 shadow-md" />
      </div>
    );
  }
  return null;
};

const getDoneCount = (taskCounts: any) => {
  if (!taskCounts) return 0;
  return taskCounts.done ?? taskCounts.Done ?? taskCounts.completed ?? 0;
};

const getInProgressCount = (taskCounts: any) => {
  if (!taskCounts) return 0;
  return taskCounts.inProgress ?? taskCounts.in_progress ?? taskCounts.InProgress ?? taskCounts["In Progress"] ?? 0;
};

const getToDoCount = (taskCounts: any) => {
  if (!taskCounts) return 0;
  return taskCounts.toDo ?? taskCounts.to_do ?? taskCounts.ToDo ?? taskCounts["To Do"] ?? taskCounts.todo ?? 0;
};


interface InsightsDashboardProps {
  teamId?: string;
}

export default function InsightsDashboard({ teamId }: InsightsDashboardProps) {
  const { teamId: paramTeamId } = useParams<{ teamId: string }>();
  const idToUse = teamId || paramTeamId;

  const token = useSessionStore((state) => state.token);

  const [insightsTab, setInsightsTab] = useState("Work Distribution");
  const [insightsData, setInsightsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Task list states
  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksPage, setTasksPage] = useState(1);
  const [tasksTotalPages, setTasksTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const fetchInsights = async () => {
    if (!idToUse || !token) return;
    setLoading(true);
    setError("");
    try {
      const response = await getTeamInsights(idToUse, token);
      if (response.data?.success) {
        setInsightsData(response.data.data);
      } else {
        setError(response.data?.message || "Failed to retrieve team insights.");
      }
    } catch (err: any) {
      console.error("Error fetching insights:", err);
      setError(err.response?.data?.message || "Failed to retrieve team insights.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (page = tasksPage, search = debouncedSearch) => {
    if (!idToUse || !token) return;
    setTasksLoading(true);
    try {
      const response = await getTeamTasks(idToUse, token, {
        page,
        limit: 5,
        search: search || undefined,
      });
      if (response.data?.success) {
        const { tasks: fetchedTasks, pagination } = response.data.data;
        const mapped = fetchedTasks.map((t: any) => ({
          id: t.id || t._id,
          name: t.task_name,
          status: t.status,
          deadline: t.deadline ? formatDate(t.deadline) : "",
          assignee: {
            name: t.assignee ? t.assignee.name : "Unassigned",
            avatar: t.assignee ? t.assignee.name.charAt(0).toUpperCase() : "?",
            profilePicture: t.assignee ? t.assignee.profile_picture : null,
          },
          deliverable: t.deliverable_url
            ? {
              name: t.deliverable_url.split("/").pop() || "Deliverable",
              url: t.deliverable_url,
            }
            : null,
          completedAt: t.marked_as_done_at
            ? formatDate(t.marked_as_done_at)
            : t.status === "Done" && t.updatedAt
              ? formatDate(t.updatedAt)
              : null,
        }));
        setTasks(mapped);
        setTasksTotalPages(pagination.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching tasks for insights:", err);
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [idToUse, token]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setTasksPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (insightsTab === "Work Distribution") {
      fetchTasks(tasksPage, debouncedSearch);
    }
  }, [idToUse, token, tasksPage, debouncedSearch, insightsTab]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <Loader2 className="w-8 h-8 animate-spin text-[#2D7A78]" />
        <p className="text-sm text-gray-500 font-medium">Loading team insights...</p>
      </div>
    );
  }

  if (error || !insightsData) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <p className="text-red-500 font-semibold">{error || "Failed to load team insights."}</p>
        <button
          onClick={fetchInsights}
          className="px-4 py-2 bg-[#2D7A78] hover:bg-[#23615f] text-white rounded-md text-sm font-semibold transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  // --- Process Chart 1 & Chart 2 Data ---
  const totalTasks = insightsData.workDistribution?.totalTasks || 0;
  const unassignedCount = insightsData.workDistribution?.unassignedCount || 0;
  const membersList = insightsData.workDistribution?.members || [];

  const workDistributionChartData = membersList.map((m: any) => {
    const tasksCount = m.taskCounts?.total || 0;
    const share = totalTasks > 0 ? (tasksCount / totalTasks) * 100 : 0;
    return {
      name: m.name,
      profilePicture: m.profilePicture,
      tasks: tasksCount,
      share: Number(share.toFixed(1)),
    };
  });

  // Always append Unassigned to match visuals and show unassigned load
  const unassignedShare = totalTasks > 0 ? (unassignedCount / totalTasks) * 100 : 0;
  workDistributionChartData.push({
    name: "Unassigned",
    profilePicture: null,
    tasks: unassignedCount,
    share: Number(unassignedShare.toFixed(1)),
  });

  const tasksOverviewChartData = membersList.map((m: any) => ({
    name: m.name,
    Done: getDoneCount(m.taskCounts),
    "In Progress": getInProgressCount(m.taskCounts),
    "To Do": getToDoCount(m.taskCounts),
  }));

  tasksOverviewChartData.push({
    name: "Unassigned",
    Done: 0,
    "In Progress": 0,
    "To Do": unassignedCount,
  });

  // --- Process Chart 3 (Activity Timeline) Data ---
  const courseworkDeadline = insightsData.activityTimeline?.courseworkDeadline || null;
  const activityMembers = insightsData.activityTimeline?.members || [];

  const processTimelineData = (members: any[], deadline: string | null) => {
    const uniqueDatesSet = new Set<string>();

    if (deadline) {
      uniqueDatesSet.add(deadline.split("T")[0]);
    }

    members.forEach((m) => {
      if (Array.isArray(m.timelinePoints)) {
        m.timelinePoints.forEach((p: any) => {
          if (p.completedAt) {
            uniqueDatesSet.add(p.completedAt.split("T")[0]);
          }
        });
      }
    });

    const sortedDates = Array.from(uniqueDatesSet).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    const memberCounts: Record<string, number> = {};
    members.forEach((m) => {
      memberCounts[m.name] = 0;
    });

    return sortedDates.map((dateStr) => {
      const formattedDate = formatDate(dateStr);
      const dataPoint: any = {
        date: formattedDate,
        rawDate: dateStr,
      };

      members.forEach((m) => {
        const pointsOnDate = Array.isArray(m.timelinePoints)
          ? m.timelinePoints.filter(
            (p: any) => p.completedAt && p.completedAt.split("T")[0] === dateStr
          )
          : [];

        if (pointsOnDate.length > 0) {
          memberCounts[m.name] += pointsOnDate.length;
          const task = pointsOnDate[0];
          dataPoint[`${m.name}_meta`] = {
            taskName: task.taskName,
            completedAt: task.completedAt,
            daysBeforeTaskDeadline: task.daysBeforeTaskDeadline,
            daysBeforeCourseworkDeadline: task.daysBeforeCourseworkDeadline,
            profilePicture: m.profilePicture,
            name: m.name,
          };
        }

        dataPoint[m.name] = memberCounts[m.name];
      });

      return dataPoint;
    });
  };

  const activityTimelineChartData = processTimelineData(activityMembers, courseworkDeadline);
  const formattedDeadline = courseworkDeadline ? formatDate(courseworkDeadline.split("T")[0]) : "";

  // Table pagination numbers
  const getPageNumbers = () => {
    const range: (number | string)[] = [];
    const maxVisiblePages = 5;
    if (tasksTotalPages <= maxVisiblePages) {
      for (let i = 1; i <= tasksTotalPages; i++) range.push(i);
    } else {
      if (tasksPage <= 3) {
        range.push(1, 2, 3, 4, "...", tasksTotalPages);
      } else if (tasksPage >= tasksTotalPages - 2) {
        range.push(1, "...", tasksTotalPages - 3, tasksTotalPages - 2, tasksTotalPages - 1, tasksTotalPages);
      } else {
        range.push(1, "...", tasksPage - 1, tasksPage, tasksPage + 1, "...", tasksTotalPages);
      }
    }
    return range;
  };

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
              className={`flex items-center gap-1.5 text-sm font-semibold pb-2 px-1 transition-all relative cursor-pointer whitespace-nowrap ${isSelected ? "text-[#2D7A78]" : "text-gray-400 hover:text-gray-600"
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
                  data={workDistributionChartData}
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
                    width={90}
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
                  data={tasksOverviewChartData}
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
                    width={95}
                  />
                  <Tooltip
                    content={<CustomTasksOverviewTooltip />}
                    cursor={{ fill: "#f9fafb" }}
                  />
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
                  data={tasksOverviewChartData}
                  layout="horizontal"
                  margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="0" horizontal={true} stroke="#f3f4f6" />
                  <XAxis dataKey="name" stroke="#374151" fontSize={12} fontWeight={600} tickLine={false} axisLine={false} />
                  <YAxis type="number" stroke="#9ca3af" fontSize={11} axisLine={false} tickLine={false} width={40} />
                  <Tooltip
                    content={<CustomTasksOverviewTooltip />}
                    cursor={{ fill: "#f9fafb" }}
                  />
                  <Bar dataKey="Done" fill="#10b981" radius={[3, 3, 0, 0]} barSize={14} />
                  <Bar dataKey="In Progress" fill="#8c80d9" radius={[3, 3, 0, 0]} barSize={14} />
                  <Bar dataKey="To Do" fill="#9ca3af" radius={[3, 3, 0, 0]} barSize={14} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 3: ACTIVITY TIMELINE */}
        {insightsTab === "Activity Timeline" && (
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">Work activity over time</h3>
            <p className="text-xs font-semibold text-gray-400 pb-6">
              Cumulative completed tasks per member · dashed line = project deadline
            </p>

            <div className="w-full h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={activityTimelineChartData}
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

                  <Tooltip
                    content={<CustomActivityTimelineTooltip />}
                  />

                  {formattedDeadline && (
                    <ReferenceLine
                      x={formattedDeadline}
                      stroke="#ef4444"
                      strokeDasharray="3 3"
                      label={{
                        value: `PROJECT DEADLINE (${formattedDeadline.toUpperCase()})`,
                        position: "top",
                        fill: "#b91c1c",
                        fontSize: 9,
                        fontWeight: 800,
                        offset: 10,
                      }}
                    />
                  )}

                  {activityMembers.map((member: any, index: number) => (
                    <Line
                      key={member.userId || member.name}
                      type="monotone"
                      dataKey={member.name}
                      stroke={colors[index % colors.length]}
                      strokeWidth={2.5}
                      dot={{ r: 4, strokeWidth: 1 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Dynamic Bottom Line Legend */}
            <div className="flex items-center gap-5 text-xs font-bold text-gray-800 pt-4 px-2 flex-wrap">
              {activityMembers.map((member: any, index: number) => (
                <div key={member.userId || member.name} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span>{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full Task List Component Layer */}
      {
        insightsTab === "Work Distribution" && (
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
                  placeholder="Search by task name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-[#2D7A78]/20 shadow-sm"
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
                    {tasksLoading ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin text-[#2D7A78]" />
                            <span className="text-gray-400 text-xs">Loading tasks...</span>
                          </div>
                        </td>
                      </tr>
                    ) : tasks.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-400 italic">
                          No tasks found.
                        </td>
                      </tr>
                    ) : (
                      tasks.map((task) => (
                        <tr key={task.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-4 px-4 sm:px-6 font-bold text-gray-900">{task.name}</td>
                          <td className="py-4 px-4 sm:px-6">
                            <div className="flex items-center gap-2">
                              {task.assignee.profilePicture ? (
                                <img
                                  src={task.assignee.profilePicture}
                                  alt={task.assignee.name}
                                  className="w-6 h-6 rounded-full object-cover border border-gray-200 shrink-0"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-slate-200 border border-gray-200 flex items-center justify-center font-bold text-[10px] text-gray-600 shrink-0">
                                  {task.assignee.avatar}
                                </div>
                              )}
                              <span className="text-gray-700 font-semibold text-[11px] whitespace-nowrap">
                                {task.assignee.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 sm:px-6">
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border whitespace-nowrap ${task.status === "Done"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200/50"
                                : task.status === "In Progress"
                                  ? "bg-amber-50 text-amber-600 border-amber-200/50"
                                  : "bg-gray-100 text-gray-500 border-gray-200/50"
                                }`}
                            >
                              {task.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 sm:px-6 font-semibold text-gray-500 whitespace-nowrap">
                            {task.deadline}
                          </td>
                          <td className="py-4 px-4 sm:px-6 max-w-[150px] truncate">
                            {task.deliverable ? (
                              <a
                                href={task.deliverable.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 font-bold hover:underline block truncate"
                              >
                                {task.deliverable.name}
                              </a>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                          <td className="py-4 px-4 sm:px-6 text-gray-500 whitespace-nowrap">
                            {task.completedAt || <span className="text-gray-300">—</span>}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table Pagination Utilities */}
            {!tasksLoading && tasksTotalPages > 1 && (
              <div className="p-4 border-t border-gray-100 flex items-center justify-center gap-1 sm:gap-1.5 text-xs flex-wrap">
                <button
                  onClick={() => setTasksPage((p) => Math.max(p - 1, 1))}
                  disabled={tasksPage === 1}
                  className="p-1 border border-gray-200 rounded text-gray-400 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {getPageNumbers().map((page, idx) => {
                  if (page === "...") {
                    return (
                      <span key={`dots-${idx}`} className="text-gray-400 px-1">
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setTasksPage(Number(page))}
                      className={`w-6 h-6 rounded font-semibold flex items-center justify-center cursor-pointer transition-colors ${tasksPage === page
                        ? "bg-[#2D7A78] text-white font-bold"
                        : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setTasksPage((p) => Math.min(p + 1, tasksTotalPages))}
                  disabled={tasksPage === tasksTotalPages}
                  className="p-1 border border-gray-200 rounded text-gray-600 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )
      }
    </div >
  );
}