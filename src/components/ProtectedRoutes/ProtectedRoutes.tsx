import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSessionStore } from "@/store/sessionStore";

interface ProtectedRouteProps {
  allowedRole?: "Student" | "Instructor";
}

function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export default function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const location = useLocation();
  const token = useSessionStore((state) => state.token);
  const role = useSessionStore((state) => state.role);
  const clearSession = useSessionStore((state) => state.clearSession);

  if (!token || isTokenExpired(token)) {
    clearSession();
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