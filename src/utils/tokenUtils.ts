// src/utils/tokenUtils.ts

/**
 * Save JWT token to localStorage
 */
export const saveToken = (token: string): void => {
  localStorage.setItem("token", token);
};

/**
 * Get JWT token from localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * Remove JWT token from localStorage (logout helper)
 */
export const removeToken = (): void => {
  localStorage.removeItem("token");
};
