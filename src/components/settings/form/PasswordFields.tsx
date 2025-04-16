
import { useState, useEffect } from "react";
import { FormField } from "./FormField";
import { KeyRound } from "lucide-react";

interface PasswordFieldsProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PasswordFields({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange
}: PasswordFieldsProps) {
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    // Check if passwords match
    setPasswordsMatch(
      password === "" || 
      confirmPassword === "" || 
      password === confirmPassword
    );
  }, [password, confirmPassword]);

  return (
    <>
      <FormField
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={onPasswordChange}
        required
        icon={KeyRound}
      />
      
      <FormField
        id="confirmPassword"
        label="Confirm"
        type="password"
        value={confirmPassword}
        onChange={onConfirmPasswordChange}
        required
        error={!passwordsMatch ? "Passwords do not match" : undefined}
        icon={KeyRound}
      />
    </>
  );
}
