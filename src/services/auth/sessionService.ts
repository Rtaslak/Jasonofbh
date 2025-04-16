
import { apiClient } from "@/utils/api";
import { AuthUser } from "./types";
import environmentUtils from "@/utils/environmentUtils";

// JWT token storage keys
const TOKEN_KEY = "authToken";
const USER_KEY = "currentUser";
const AUTH_STATUS_KEY = "isAuthenticated";

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const isTestEnvironment = environmentUtils.isTestEnvironment();
  
  // Test environment should always try real API first
  if (isTestEnvironment) {
    try {
      console.log("Using real API to get current user");
      const response = await apiClient.get<AuthUser>("auth/me", {
        // Add a shorter timeout for auth check
        signal: AbortSignal.timeout ? AbortSignal.timeout(10000) : undefined
      });
      return response;
    } catch (error) {
      // Check specifically for connectivity issues
      const isConnectivityError = 
        error instanceof Error && 
        (error.message === "API_UNREACHABLE" || 
         error.message.includes('Failed to fetch') || 
         error.message.includes('NetworkError') ||
         error.message.includes('Network request failed') ||
         (error instanceof DOMException && error.name === 'TimeoutError'));

      if (isConnectivityError) {
        console.warn("API connectivity issue detected - checking for valid local session");
        
        // Check if we have a stored user and token that might be valid
        const userJson = localStorage.getItem(USER_KEY);
        const token = localStorage.getItem(TOKEN_KEY);
        
        if (userJson && token) {
          try {
            // Only allow admin to use stored credentials when API is down
            const userData = JSON.parse(userJson) as AuthUser;
            if (userData.email === "admin@jasonofbh.com") {
              console.log("API unreachable but allowing admin session in test environment");
              return userData;
            }
          } catch (e) {
            console.error("Error parsing stored user data:", e);
          }
        }
      }
      
      // If API call fails, return null to indicate not authenticated
      console.error("Error fetching current user from API:", error);
      return null;
    }
  }
  
  // Try real API for all environments now
  try {
    return await apiClient.get<AuthUser>("auth/me");
  } catch (error) {
    // If unauthorized or other error, try to get from localStorage
    console.error("Error fetching current user:", error);
    
    const userJson = localStorage.getItem(USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson) as AuthUser;
      } catch (e) {
        console.error("Error parsing stored user data:", e);
      }
    }
    
    return null;
  }
}

/**
 * Check if the user is authenticated
 */
export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_STATUS_KEY) === "true" && !!localStorage.getItem(TOKEN_KEY);
}

/**
 * Save authentication session data
 */
export function saveAuthSession(token: string, user: AuthUser): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(AUTH_STATUS_KEY, "true");
}

/**
 * Clear authentication data
 */
export function clearAuthSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(AUTH_STATUS_KEY);
}

/**
 * Get the stored JWT token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
