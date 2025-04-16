import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { SocketProvider } from "./context/SocketContext";
import { AuthProvider } from "./context/AuthContext";
import rfidService from "./services/rfidService";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Check localStorage for authentication state on mount
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");

    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);

    // Initialize the RFID service
    rfidService.init();
  }, []);

  // Auto logout after 10 minutes of inactivity
  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
    };

    // Add event listeners for user activity
    window.addEventListener("mousedown", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("touchstart", handleActivity);
    
    // Check for inactivity every minute
    const interval = setInterval(() => {
      const inactiveTime = Date.now() - lastActivity;
      const tenMinutesInMs = 10 * 60 * 1000;
      
      if (isAuthenticated && inactiveTime > tenMinutesInMs) {
        handleLogout();
      }
    }, 60000); // Check every minute

    return () => {
      // Clean up event listeners and interval
      window.removeEventListener("mousedown", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      clearInterval(interval);
    };
  }, [lastActivity, isAuthenticated]);

  // Authentication handler functions
  const handleLogin = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
    setLastActivity(Date.now());
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  // Set the base URL for the application
  useEffect(() => {
    document.querySelector("base")?.setAttribute("href", window.location.origin);
  }, []);

  // Show loading while checking authentication status
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <NotificationProvider>
              <SocketProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter basename={process.env.NODE_ENV === 'production' ? '/' : ''}>
                  <AppRoutes 
                    isAuthenticated={isAuthenticated} 
                    onLogin={handleLogin} 
                    onLogout={handleLogout} 
                  />
                </BrowserRouter>
              </SocketProvider>
            </NotificationProvider>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
