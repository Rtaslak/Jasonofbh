import { apiClient } from "@/utils/api";
import { toast } from "sonner";
import environmentUtils from "@/utils/environmentUtils";
import { LoginCredentials, AuthResponse } from "./types";
import { saveAuthSession, clearAuthSession } from "./sessionService";
import { attemptRealApiLogin } from "./utils/realApiAuth";

/**
 * Log in a user with email and password
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const isTestEnvironment = environmentUtils.isTestEnvironment();

    // Optional: In test environment, try real API first
    if (isTestEnvironment) {
      return await attemptRealApiLogin(credentials, isTestEnvironment);
    }

    // Real API login
    const response = await apiClient.post<AuthResponse>("auth/login", credentials, {
      requiresAuth: false,
    });

    if (response && response.token) {
      saveAuthSession(response.token, response.user);
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof Error) {
      toast.error(`Login failed: ${error.message}`);
    } else {
      toast.error("Login failed. Please try again.");
    }

    throw error;
  }
}

/**
 * Log out the current user
 */
export async function logout(): Promise<void> {
  // Always clear session locally
  clearAuthSession();

  // Skip API call in test/local/mock environments
  if (environmentUtils.isTestEnvironment()) {
    return;
  }

  // Try to notify backend, but don't block logout on failure
  try {
    await apiClient.post<void>("auth/logout", {});
  } catch (error) {
    console.warn("Logout API call failed (safe to ignore):", error);
  }
}
