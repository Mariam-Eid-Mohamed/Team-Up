import { create } from "zustand";
import { persist } from "zustand/middleware";

type SessionState = {
  token: string | null;
  userId: string | null;

  setToken: (token: string) => void;
  removeToken: () => void;

  setUserId: (userId: string) => void;
  removeUserId: () => void;

  hasToken: () => boolean;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      token: null,
      userId: null,

      setToken: (token) => set({ token }),
      removeToken: () => set({ token: null }),

      setUserId: (userId) => set({ userId }),
      removeUserId: () => set({ userId: null }),

      hasToken: () => get().token !== null,
    }),
    {
      name: "teamup_session", // Zustand will store everything in localStorage under this key
    },
  ),
);
