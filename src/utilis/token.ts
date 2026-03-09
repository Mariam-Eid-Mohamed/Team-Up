// src/utils/token.ts
import { useSessionStore } from "../store/sessionStore";

/**
 * NOTE:
 * We are no longer reading/writing TOKEN_KEY and USER_ID_KEY directly.
 * Zustand persists under "teamup_session".
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
