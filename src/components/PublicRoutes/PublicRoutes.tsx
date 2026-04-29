import { Navigate, Outlet } from "react-router-dom";
import { useSessionStore } from "@/store/sessionStore";

export default function PublicRoute() {
  const token = useSessionStore((state) => state.token);
  const role = useSessionStore((state) => state.role);

  if (!token) {
    return <Outlet />;
  }

  if (role === "Student") {
    return <Navigate to="/student/dashboard" replace />;
  }

  if (role === "Instructor") {
    return <Navigate to="/instructor/dashboard" replace />;
  }

  // token exists but role not ready / invalid
  return <Outlet />;
}
