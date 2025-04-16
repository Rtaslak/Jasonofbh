
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useSignupForm } from "./useSignupForm";
import FormError from "./FormError";
import NameFields from "./NameFields";
import EmailField from "./EmailField";
import PasswordFields from "./PasswordFields";

interface SignupFormProps {
  onSuccess: () => void;
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const { form, isLoading, authError, onSubmit } = useSignupForm({ onSuccess });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        {authError && <FormError error={authError} />}
        
        <NameFields form={form} disabled={isLoading} />
        <EmailField form={form} disabled={isLoading} />
        <PasswordFields form={form} disabled={isLoading} />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
}
