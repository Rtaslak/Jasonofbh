
import { login, logout } from './loginService';
import { register } from './registerService';
import { getCurrentUser, isAuthenticated, saveAuthSession, clearAuthSession, getAuthToken } from './sessionService';
import { AuthUser, AuthResponse } from './types';

// Re-export the auth service as a unified API
export const authService = {
  login,
  logout,
  register,
  getCurrentUser,
  isAuthenticated,
  saveAuthSession,
  clearAuthSession,
  getAuthToken
};

// Re-export types
export type { AuthUser, AuthResponse };
