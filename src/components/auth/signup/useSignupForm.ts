
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { signupFormSchema, SignupFormData } from "./schema";
import { authService } from "@/services/auth";

export interface UseSignupFormProps {
  onSuccess: () => void;
}

export function useSignupForm({ onSuccess }: UseSignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const { toast } = useToast();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setAuthError("");

    try {
      // Register the user with API
      console.log("Creating new user during signup");
      
      await authService.register({
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        password: data.password
      });
      
      console.log("User created successfully");
      
      toast({
        title: "Account created successfully",
        description: "You've been automatically signed in.",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Signup error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setAuthError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Account creation failed",
        description: errorMessage || "There was a problem with your request.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    authError,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
