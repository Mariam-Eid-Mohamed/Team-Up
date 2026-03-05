import { useSessionStore } from "./sessionStore";

const OLD_TOKEN_KEY = "auth_token";
const OLD_USER_ID_KEY = "user_id";

export function migrateOldSessionIfNeeded() {
  const state = useSessionStore.getState();

  // If Zustand store is empty, but old keys exist, import them once
  if (!state.token) {
    const oldToken = localStorage.getItem(OLD_TOKEN_KEY);
    if (oldToken) state.setToken(oldToken);
  }

  if (!state.userId) {
    const oldUserId = localStorage.getItem(OLD_USER_ID_KEY);
    if (oldUserId) state.setUserId(oldUserId);
  }
}
