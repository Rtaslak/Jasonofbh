
import { apiClient } from "@/utils/api";
import { toast } from "sonner";
import { validateEmail } from "@/utils/auth";
import { RegisterData, AuthResponse } from "./types";
import { saveAuthSession } from "./sessionService";

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    // Validate email format
    if (!validateEmail(data.email)) {
      throw new Error("Email must end with @jasonofbh.com");
    }
    
    // Real API call
    const response = await apiClient.post<AuthResponse>("auth/register", data, {
      requiresAuth: false,
    });
    
    // Store the auth token in localStorage
    if (response && response.token) {
      saveAuthSession(response.token, response.user);
    }
    
    return response;
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof Error) {
      // More specific error messages
      switch (error.message) {
        case "Email already registered":
          toast.error("Email is already in use. Please use a different email.");
          break;
        case "Email must end with @jasonofbh.com":
          toast.error("Please use an email ending with @jasonofbh.com");
          break;
        default:
          toast.error(`Registration failed: ${error.message}`);
      }
    } else {
      toast.error("Registration failed. Please try again.");
    }
    throw error;
  }
}
