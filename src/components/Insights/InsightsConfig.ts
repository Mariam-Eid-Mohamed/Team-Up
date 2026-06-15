import { BarChart3, CheckSquare, type ChartConfig } from "lucide-react";

export const insightsSubTabs = [
  { id: "Work Distribution", icon: BarChart3 },
  { id: "Tasks Overview", icon: CheckSquare },
];

export const workDistributionConfig = {
  tasks: {
    label: "Tasks Assigned",
    color: "hsl(var(--primary))", // Fallbacks to your global shadcn primary theme color
  },
} satisfies ChartConfig;

export const tasksOverviewConfig = {
  Done: {
    label: "Done",
    color: "hsl(142.1 76.2% 36.3%)", // Semantic Emerald
  },
  "In Progress": {
    label: "In Progress",
    color: "hsl(250 84% 74%)", // Medium purple
  },
  "To Do": {
    label: "To Do",
    color: "hsl(215.4 16.3% 56.9%)", // Slate/Gray Muted
  },
} satisfies ChartConfig;