
import { LoginCredentials, AuthResponse } from "../types";
import { apiClient } from "@/utils/api";
import { saveAuthSession } from "../sessionService";

/**
 * Attempt real API login for any environment
 */
export const attemptRealApiLogin = async (
  credentials: LoginCredentials, 
  isTestEnvironment = false
): Promise<AuthResponse> => {
  try {
    console.log("Attempting real API login");
    
    // Make a direct API call with a short timeout to detect API availability
    const response = await apiClient.post<AuthResponse>("auth/login", credentials, {
      requiresAuth: false,
      signal: AbortSignal.timeout ? AbortSignal.timeout(10000) : undefined
    });
    
    console.log("Real API login successful");
    
    // Store auth data
    if (response && response.token) {
      saveAuthSession(response.token, response.user);
    }
    
    return response;
  } catch (error) {
    console.error("Error during real API login:", error);
    
    // If in test environment, don't try fallbacks
    if (isTestEnvironment) {
      throw error;
    }
    
    // For non-test environments, rethrow the error to be handled by the login service
    throw error;
  }
};
