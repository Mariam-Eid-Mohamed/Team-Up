// src/utils/token.ts
import { useSessionStore } from "../store/sessionStore";

// Keep your existing constants (optional, for clarity)
const TOKEN_KEY = "auth_token";
const USER_ID_KEY = "user_id";

/**
 * NOTE:
 * We are no longer reading/writing TOKEN_KEY and USER_ID_KEY directly.
 * Zustand persists under "teamup_session".
 *
 * If you need backward compatibility (existing users already have auth_token),
 * see the migration section below.
 */

export const getToken = (): string | null => {
  return useSessionStore.getState().token;
};

export const setToken = (token: string): void => {
  useSessionStore.getState().setToken(token);
};

export const removeToken = (): void => {
  useSessionStore.getState().removeToken();
};

export const hasToken = (): boolean => {
  return useSessionStore.getState().hasToken();
};

// User ID utility functions
export const getUserId = (): string | null => {
  return useSessionStore.getState().userId;
};

export const setUserId = (userId: string): void => {
  useSessionStore.getState().setUserId(userId);
};

export const removeUserId = (): void => {
  useSessionStore.getState().removeUserId();
};
