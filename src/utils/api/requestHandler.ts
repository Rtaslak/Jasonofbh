
import { API_BASE_URL, isMockMode, isTestEnvironment } from "./constants";
import { FetchOptions } from "./types";
import { handleApiError } from "./errorHandler";
import { toast } from "sonner";
import { authService } from "@/services/auth";

/**
 * Base function to make API requests with proper error handling
 */
export async function apiRequest<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requiresAuth = true, useMockOnFailure = true, ...fetchOptions } = options;

  // If we're in mock mode, return mock data immediately
  if (isMockMode && !isTestEnvironment) {
    console.log(`Mock mode: Simulating ${fetchOptions.method} request to ${endpoint}`);
    return null as T; // Services will handle providing mock data
  }

  // Setup headers
  const headers = new Headers(fetchOptions.headers);
  if (!headers.has("Content-Type") && !(fetchOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Add authentication token if required
  if (requiresAuth) {
    const token = authService.getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  // Prepare the request
  const url = `${API_BASE_URL}/${endpoint.startsWith("/") ? endpoint.slice(1) : endpoint}`;
  
  try {
    console.log(`Making ${fetchOptions.method} request to: ${url}`);
    
    // Create a new request without using the Request constructor
    // which can cause cloning issues
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      // Add timeout to prevent hanging requests
      signal: fetchOptions.signal || (AbortSignal.timeout ? AbortSignal.timeout(20000) : undefined),
    });

    // Handle different HTTP status codes
    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      
      // Handle unauthorized errors (401)
      if (response.status === 401 && requiresAuth) {
        console.error("Authentication token expired or invalid");
        
        // Clear auth session and reload to login
        authService.clearAuthSession();
        
        // Don't reload immediately if this is a login request
        if (!endpoint.includes("auth/login")) {
          toast.error("Session expired. Please login again.");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
        
        errorMessage = "Authentication failed. Please log in again.";
      } else {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If the response is not JSON, use the default error message
        }
      }

      console.error("API response error:", errorMessage);
      const error = new Error(errorMessage);
      throw error;
    }

    // Check if response has content
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const jsonData = await response.json();
      console.log("API response data:", jsonData);
      return jsonData as T;
    } else {
      // Return an empty object for 204 No Content or non-JSON responses
      console.log("API response: Empty or non-JSON response");
      return {} as T;
    }
  } catch (error) {
    console.error("API request error:", error);
    
    // Special handling for network/connectivity errors
    if (error instanceof TypeError && 
        (error.message.includes('Failed to fetch') || 
         error.message.includes('NetworkError') ||
         error.message.includes('Network request failed'))) {
      
      console.error("Network connectivity error detected");
      
      // For login endpoint specifically, create a special error
      if (endpoint.includes('auth/login')) {
        throw new Error("API_UNREACHABLE");
      }
      
      // For non-test environments, fall back to mock if configured
      if (useMockOnFailure && !isTestEnvironment) {
        console.log("Network error, using mock data instead");
        toast.warning("Could not connect to server. Using offline mode.");
        return null as T;
      }
    }
    
    return handleApiError(error, endpoint);
  }
}
