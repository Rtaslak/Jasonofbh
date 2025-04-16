
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { authService } from "@/services/auth";

interface AuthProps {
  onLogin: () => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if already authenticated on mount
  useEffect(() => {
    const isAuth = authService.isAuthenticated();
    if (isAuth) {
      onLogin();
      navigate("/dashboard");
    }
  }, [navigate, onLogin]);

  const handleAuthSuccess = () => {
    toast({
      title: isLogin ? "Welcome back!" : "Account created successfully!",
      description: isLogin ? "You've been logged in." : "You can now sign in with your credentials.",
    });
    
    if (isLogin) {
      // For login, invoke onLogin callback and navigate to dashboard
      onLogin();
      navigate("/dashboard");
    } else {
      // For signup, switch to login view after successful registration
      // If auto-login worked, the useEffect will handle the redirect
      setIsLogin(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">
            {isLogin ? "Sign In" : "Create an Account"}
          </h1>
        </CardHeader>
        <CardContent>
          {isLogin ? (
            <LoginForm onSuccess={handleAuthSuccess} />
          ) : (
            <SignupForm onSuccess={handleAuthSuccess} />
          )}
          
          <div className="mt-6 text-center text-sm">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <button
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  onClick={() => setIsLogin(false)}
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  onClick={() => setIsLogin(true)}
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
