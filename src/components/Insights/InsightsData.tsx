import { MessageSquare, PieChart, History } from "lucide-react";

export interface Instructor {
  id: string | number;
  name: string;
  avatar?: string;
}

export interface TaskItem {
  id: string;
  name: string;
  assignee: {
    name: string;
    avatar?: string;
  };
  status: "DONE" | "TO DO" | "IN PROGRESS" | "OVERDUE";
  deadline: string;
  deliverable?: {
    name: string;
    url: string;
  };
  completedAt?: string;
}

export const tabs = ["Tasks", "Summary", "Members", "Insights"];

export const insightsSubTabs = [
  { id: "Work Distribution", icon: MessageSquare },
  { id: "Tasks Overview", icon: PieChart },
  { id: "Activity Timeline", icon: History },
];

export const workDistributionData = [
  { name: "Sarah Chen", tasks: 27, bio: "Frontend Developer", share: "30.6%" },
  { name: "Alex Rivard", tasks: 24, bio: "Backend Developer", share: "27.2%" },
  { name: "Mia Wong", tasks: 19, bio: "UI/UX Designer", share: "21.5%" },
  { name: "Jordan Smith", tasks: 16, bio: "QA Engineer", share: "18.1%" },
  { name: "Unassigned", tasks: 0, bio: "Unallocated Tasks", share: "2.6%" },
];

export const tasksOverviewData = [
  { name: "Alex Rivera", Done: 14, "In Progress": 10, "To Do": 6 },
  { name: "Jordan Smith", Done: 12, "In Progress": 12, "To Do": 8 },
  { name: "Casey Lin", Done: 11, "In Progress": 17, "To Do": 5 },
  { name: "Taylor Kim", Done: 22, "In Progress": 6, "To Do": 4 },
  { name: "Sam Avery", Done: 13, "In Progress": 11, "To Do": 7 },
  { name: "Unassigned", Done: 1, "In Progress": 3, "To Do": 12 },
];

export const fullTaskListData: TaskItem[] = [
  {
    id: "1",
    name: "API Auth Refactor",
    assignee: { name: "Sarah Chen", avatar: "S" },
    status: "DONE",
    deadline: "Oct 24, 2023",
    deliverable: { name: "auth_docs.pdf", url: "#" },
    completedAt: "Oct 23, 14:22",
  },
  {
    id: "2",
    name: "Stripe Webhook Error",
    assignee: { name: "Sarah Chen", avatar: "S" },
    status: "DONE",
    deadline: "Oct 25, 2023",
    deliverable: { name: "debug_log.txt", url: "#" },
    completedAt: "Oct 25, 09:10",
  },
  {
    id: "3",
    name: "UI Layout Fix",
    assignee: { name: "Sarah Chen", avatar: "S" },
    status: "TO DO",
    deadline: "Oct 26, 2023",
  },
  {
    id: "4",
    name: "Database Schema Update",
    assignee: { name: "Alex Rivera", avatar: "A" },
    status: "IN PROGRESS",
    deadline: "Oct 30, 2023",
  },
  {
    id: "5",
    name: "Mobile Responsive Fix",
    assignee: { name: "Jordan Yeoh", avatar: "J" },
    status: "OVERDUE",
    deadline: "Oct 26, 2023",
  },
];

// --- 1. CUSTOM TOOLTIP FOR WORK DISTRIBUTION ---
export const CustomWorkDistributionTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="relative bg-[#F4F9F9] border border-gray-100 rounded-xl p-4 shadow-xl max-w-[240px] text-left mb-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-[#2D7A78]/20">
          <div className="w-9 h-9 rounded-full bg-gray-300 border border-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center text-[10px] text-gray-600 font-bold">
            {data.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 leading-tight">{data.name}</h4>
            <p className="text-[10px] font-medium text-gray-500 mt-0.5">{data.bio || "Team Member"}</p>
          </div>
        </div>
        <div className="pt-2 space-y-1.5 text-xs text-[#1B4D49] font-medium">
          <div className="flex justify-between items-center gap-8">
            <span className="text-gray-600">Tasks completed</span>
            <span className="font-bold text-gray-900">{data.tasks}</span>
          </div>
          <div className="flex justify-between items-center gap-8">
            <span className="text-gray-600">Team share</span>
            <span className="font-bold text-[#2D7A78]">{data.share}</span>
          </div>
        </div>
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#F4F9F9] rotate-45 border-r border-b border-gray-100 shadow-sm" />
      </div>
    );
  }
  return null;
};

// --- 2. CUSTOM TOOLTIP FOR TASKS OVERVIEW ---
export const CustomTasksOverviewTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const activeSegment = payload.find((p: any) => p.value !== undefined) || payload[0];
    const memberName = activeSegment.payload.name;
    const statusName = activeSegment.name;
    const countValue = activeSegment.value;

    return (
      <div className="relative bg-[#F4F9F9] border border-gray-100 rounded-lg p-3 shadow-xl min-w-[210px] text-[11px] font-bold mb-3 text-left">
        <div className="space-y-1">
          <div className="flex justify-between items-center gap-4">
            <span className="text-gray-500 font-semibold">Member:</span>
            <span className="text-gray-800 font-bold">{memberName}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-gray-500 font-semibold">Status:</span>
            <span className="text-gray-800 font-bold">{statusName}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-gray-500 font-semibold">Count:</span>
            <span className="text-gray-800 font-bold">{countValue} tasks</span>
          </div>
        </div>
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#F4F9F9] rotate-45 border-r border-b border-gray-100 shadow-sm" />
      </div>
    );
  }
  return null;
};

// --- 3. EXACT METADATA TOOLTIP 
export const CustomActivityTimelineTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Grab the active hovered line data node
    const activeLine = payload.find((p: any) => p.value !== undefined) || payload[0];
    const name = activeLine.name;

    // Mapping contextual profiles to fit your design specs perfectly
    const profileMeta: Record<string, { role: string; task: string; completedOn: string; daysBefore: number }> = {
      "Sarah Chen": {
        role: "FRONTEND DEVELOPER",
        task: "Frontend Implementation",
        completedOn: "Oct 17, 2026",
        daysBefore: 20,
      },
      "Alex Rivera": {
        role: "BACKEND DEVELOPER",
        task: "Database Optimization Cluster",
        completedOn: "Oct 24, 2026",
        daysBefore: 12,
      },
      "Jordan Yeoh": {
        role: "QA ENGINEER",
        task: "Integration Automation Pipeline",
        completedOn: "Nov 02, 2026",
        daysBefore: 3,
      }
    };

    const userMeta = profileMeta[name] || {
      role: "CONTRIBUTOR",
      task: "Workspace Core Operations",
      completedOn: "Oct 15, 2026",
      daysBefore: 21
    };

    return (
      <div className="relative bg-[#f4f9f9]/95 backdrop-blur-sm border border-gray-100 rounded-xl p-4 shadow-xl w-[250px] text-left mb-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-150">
        
        {/* Profile Card Header Segment */}
        <div className="flex items-center gap-3 pb-2">
          {/* Empty gray placeholder circle instead of Unsplash image URL */}
          <div className="w-9 h-9 rounded-full bg-gray-300 border border-gray-200 shrink-0" />
          
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-gray-900 leading-tight truncate">{name}</h4>
            <p className="text-[9px] font-extrabold text-gray-400 tracking-wider mt-0.5 uppercase truncate">
              {userMeta.role}
            </p>
          </div>
        </div>

        {/* Horizontal Card Divider Line */}
        <div className="h-[1px] w-full bg-gray-300/60 my-1" />

        {/* Inner Card Meta Details */}
        <div className="pt-1.5 space-y-1 text-[11px] text-gray-700 font-medium">
          <div>
            <span className="text-gray-500 font-bold">Task: </span>
            <span className="text-gray-900 font-semibold">{userMeta.task}</span>
          </div>
          <div>
            <span className="text-gray-500 font-bold">Completed on: </span>
            <span className="text-gray-900 font-semibold">{userMeta.completedOn}</span>
          </div>
          <div>
            <span className="text-gray-500 font-bold">Days before deadline: </span>
            <span className="text-gray-900 font-extrabold">{userMeta.daysBefore}</span>
          </div>
        </div>

        {/* Downward pointing triangle tool anchor */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#f4f9f9] rotate-45 border-r border-b border-gray-100 shadow-md" />
      </div>
    );
  }
  return null;
};