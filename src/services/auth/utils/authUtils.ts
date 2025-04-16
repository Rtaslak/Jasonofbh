
import { AuthResponse, AuthUser } from "../types";
import { toast } from "sonner";

/**
 * Create a JWT token for mock purposes (only used in legacy code)
 */
export const createMockToken = (userId: string): string => {
  return `mock-jwt-token-${userId}-${Date.now()}`;
};

/**
 * Store authentication data in localStorage
 */
export const storeAuthData = (response: AuthResponse): void => {
  localStorage.setItem("authToken", response.token);
  localStorage.setItem("isAuthenticated", "true");
  localStorage.setItem("currentUser", JSON.stringify(response.user));
};

/**
 * Create an AuthUser from a mock user object
 */
export const createAuthUserFromMock = (user: any): AuthUser => {
  return {
    id: user.id,
    name: user.name || `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    role: user.role
  };
};

/**
 * Handle login errors with appropriate messages
 */
export const handleLoginError = (error: unknown): void => {
  if (error instanceof Error) {
    const errorMessage = error.message;
    
    if (errorMessage === "API_UNREACHABLE") {
      toast.error("Cannot connect to the server. Please try again later.");
    } else if (errorMessage.includes("User does not exist")) {
      toast.error("User not found. Please check your email.");
    } else if (errorMessage.includes("Incorrect password")) {
      toast.error("Incorrect password. Please try again.");
    } else {
      toast.error(`Login failed: ${errorMessage}`);
    }
  } else {
    toast.error("Login failed. Please try again.");
  }
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = (): void => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("currentUser");
};
