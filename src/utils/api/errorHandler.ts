
import { toast } from "sonner";
import { isTestEnvironment } from "./constants";

/**
 * Specialized error handling for API requests
 */
export const handleApiError = (error: unknown, endpoint: string): never => {
  // Check specifically for network/connectivity errors
  const isNetworkError = error instanceof TypeError && 
    (error.message.includes('Failed to fetch') || 
     error.message.includes('NetworkError') ||
     error.message.includes('Network request failed'));
     
  // Check for timeout
  const isTimeoutError = error instanceof DOMException && 
    error.name === 'TimeoutError';
  
  if (isNetworkError || isTimeoutError) {
    console.error("Network connectivity error:", error);
    
    // Special handling for test environment
    if (isTestEnvironment) {
      const errorMessage = isTimeoutError ? 
        "Connection timed out. Please check if the API server is running." :
        "Could not connect to API server. Please check your network connection.";
      
      toast.error(errorMessage);
      console.error(`Test environment network error: ${errorMessage}`);
      
      // For login screen, we'll handle this in the login service
      if (endpoint.includes('auth/login') || endpoint.includes('auth/register')) {
        throw new Error("API_UNREACHABLE");
      }
    }
  }

  // For test environment, ensure any API errors are clearly displayed
  if (isTestEnvironment) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    toast.error(`API Error: ${errorMessage}`);
    console.error(`Test environment API error: ${errorMessage}`);
  }

  // Show user-friendly error message
  if (error instanceof Error) {
    toast.error(`Request failed: ${error.message}`);
  } else {
    toast.error("An unknown error occurred");
  }

  throw error;
};
