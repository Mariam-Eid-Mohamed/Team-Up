import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserRole = "Student" | "Instructor" | null;

type SessionState = {
  token: string | null;
  userId: string | null;
  role: UserRole;

  setToken: (token: string) => void;
  removeToken: () => void;

  setUserId: (userId: string) => void;
  removeUserId: () => void;

  setRole: (role: UserRole) => void;

  clearSession: () => void;
  hasToken: () => boolean;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      token: null,
      userId: null,
      role: null,

      setToken: (token) => set({ token }),
      removeToken: () => set({ token: null }),

      setUserId: (userId) => set({ userId }),
      removeUserId: () => set({ userId: null }),

      setRole: (role) => set({ role }),

      clearSession: () => set({ token: null, userId: null, role: null }),

      hasToken: () => get().token !== null,
    }),
    {
      name: "teamup_session",
    },
  ),
);

export function clearLegacySession() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_id");
}
