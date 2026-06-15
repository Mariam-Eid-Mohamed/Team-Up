import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Bell,
  Users,
  UsersRound,
  Info,
  Settings,
  LogOut,
  Bot,
  
} from "lucide-react";
import { logoutUser } from "@/Services/Helpers/Logout";
import { Link, useLocation } from "react-router-dom";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to?: string;
  onClick?: () => void;
}

function SidebarItem({ icon, label, to, onClick }: SidebarItemProps) {
  const location = useLocation();
  const isActive = to ? location.pathname === to : false;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="
          w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-md
          transition-colors cursor-pointer text-gray-800 hover:bg-gray-100
        "
      >
        {icon}
        <span className="hidden lg:inline text-sm font-medium">{label}</span>
      </button>
    );
  }

  return (
    <Link
      to={to || "#"}
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
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const role: "admin" | "instructor" | "student" = location.pathname.startsWith(
    "/instructor",
  )
    ? "instructor"
    : location.pathname.startsWith("/student")
      ? "student"
      : "admin";

  return (
    <aside
      className="z-50
        bg-gray-50 border-r flex flex-col justify-between
        fixed top-14 left-0
        w-16 lg:w-64
        h-[calc(100vh-3.5rem)]
        p-2
        transition-all duration-300 ease-in-out
      "
    >
      <div className="space-y-2">
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

        <SidebarItem
          icon={<UsersRound size={20} />}
          label="Students"
          to="/students"
        />

       {role === "student" && (
          <SidebarItem
            icon={<Bot size={20} />}
            label="AI Assistant"
            to="/student/AI-Chat"
          />
        )}
      </div>

      <div className="space-y-2 border-t mt-2 pt-2">
        <SidebarItem icon={<Info size={20} />} label="About us" to="/about" />
        <SidebarItem
          icon={<Settings size={20} />}
          label="Settings"
          to="/settings"
        />
        <SidebarItem
          icon={<LogOut size={20} />}
          label="Log Out"
          onClick={handleLogout}
        />
      </div>
    </aside>
  );
}
