import { useSessionStore } from "@/store/sessionStore";

export function logoutUser() {
  const { clearSession } = useSessionStore.getState();

  clearSession();

  localStorage.removeItem("teamup_session");
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("token");
  localStorage.removeItem("profile");
}
