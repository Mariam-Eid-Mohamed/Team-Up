// Token utility functions for managing JWT tokens

const TOKEN_KEY = "auth_token";
const USER_ID_KEY = "user_id";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
};

export const hasToken = (): boolean => {
  return getToken() !== null;
};

// User ID utility functions
export const getUserId = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_ID_KEY);
};

export const setUserId = (userId: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_ID_KEY, userId);
};

export const removeUserId = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_ID_KEY);
};

