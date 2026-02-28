import {
  LayoutDashboard,
  BookOpen,
  Bell,
  Users,
  UsersRound,
  Info,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import React from "react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
}

function SidebarItem({ icon, label, to }: SidebarItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`
        flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-md
        transition-colors cursor-pointer
        ${
          isActive
            ? "bg-[#83CDC4] text-white"
            : "text-gray-800 hover:bg-gray-100"
        }
      `}
    >
      {icon}
      <span className="hidden lg:inline text-sm font-medium">{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const location = useLocation();

  // ✅ ROLE DERIVED FROM PATH (TYPE-SAFE)
  const role: "admin" | "instructor" | "student" = location.pathname.startsWith(
    "/instructor",
  )
    ? "instructor"
    : location.pathname.startsWith("/student")
      ? "student"
      : "admin";

  return (
    <aside
      className="
        bg-gray-50 border-r flex flex-col justify-between
        fixed top-14 left-0
        w-16 lg:w-64
        h-[calc(100vh-3.5rem)]
        p-2
        transition-all duration-300 ease-in-out
      "
    >
      {/* Top menu */}
      <div className="space-y-2">
        {/* ✅ DASHBOARD HANDLED HERE ONLY */}
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          to={
            role === "student"
              ? "/student/dashboard"
              : role === "instructor"
                ? "/instructor/dashboard"
                : "/dashboard"
          }
        />

        <SidebarItem
          icon={<BookOpen size={20} />}
          label="My Classes"
          to="/classes"
        />
        <SidebarItem
          icon={<Bell size={20} />}
          label="Notifications"
          to="/notifications"
        />
        <SidebarItem
          icon={<Users size={20} />}
          label="Teams"
          to={role === "student" ? "/student/teams" : "/instructor/teams"}
        />

        {/* Instructor-only */}

        <SidebarItem
          icon={<UsersRound size={20} />}
          label="Students"
          to="/students"
        />
      </div>

      {/* Bottom menu */}
      <div className="space-y-2 border-t mt-2 pt-2">
        <SidebarItem icon={<Info size={20} />} label="About us" to="/about" />
        <SidebarItem
          icon={<Settings size={20} />}
          label="Settings"
          to="/settings"
        />
      </div>
    </aside>
  );
}
