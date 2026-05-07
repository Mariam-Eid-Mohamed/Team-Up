import { useSessionStore } from "@/store/sessionStore";
import { useProfileStore } from "@/store/ProfileStore/userProfileStore";

export function logoutUser() {
  const { clearSession } = useSessionStore.getState();
  const { clearProfile } = useProfileStore.getState();

  clearSession();
  clearProfile();

  localStorage.removeItem("teamup_session");
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("token");
  localStorage.removeItem("profile");
}
