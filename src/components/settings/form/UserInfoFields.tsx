
import { FormField } from "./FormField";
import { User, Mail, Phone } from "lucide-react";

interface UserInfoFieldsProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  onFirstNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLastNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UserInfoFields({
  firstName,
  lastName,
  email,
  phone,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneChange
}: UserInfoFieldsProps) {
  return (
    <>
      <FormField
        id="firstName"
        label="First Name"
        value={firstName}
        onChange={onFirstNameChange}
        required
        icon={User}
      />

      <FormField
        id="lastName"
        label="Last Name"
        value={lastName}
        onChange={onLastNameChange}
        required
        icon={User}
      />
      
      <FormField
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={onEmailChange}
        required
        icon={Mail}
      />

      <FormField
        id="phone"
        label="Phone"
        type="tel"
        value={phone || ""}
        onChange={onPhoneChange}
        icon={Phone}
      />
    </>
  );
}
