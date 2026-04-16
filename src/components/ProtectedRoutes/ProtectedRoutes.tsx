import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSessionStore } from "@/store/sessionStore";

interface ProtectedRouteProps {
  allowedRole?: "Student" | "Instructor";
}

export default function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const location = useLocation();
  const token = useSessionStore((state) => state.token);
  const role = useSessionStore((state) => state.role);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRole && role !== allowedRole) {
    if (role === "Student") {
      return <Navigate to="/student/dashboard" replace />;
    }

    if (role === "Instructor") {
      return <Navigate to="/instructor/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
