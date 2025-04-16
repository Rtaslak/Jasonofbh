// src/components/settings/user-management/UserForm.tsx
import { useState, useEffect } from "react";
import { UserRole, UserCreateInput, UserUpdateInput, User } from "@/types/users";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserInfoFields } from "./form/UserInfoFields";
import { RoleSelector } from "./form/RoleSelector";
import { PasswordFields } from "./form/PasswordFields";
import { toast } from "sonner";

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserCreateInput | UserUpdateInput) => void;
  user?: User;
  isLoading?: boolean;
}

const DEFAULT_USER: UserCreateInput = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "Operator",
  password: "",
  confirmPassword: "",
};

const ROLES: UserRole[] = ["Administrator", "Salesperson", "Operator"];

export function UserForm({ open, onClose, onSubmit, user, isLoading }: UserFormProps) {
  const [formData, setFormData] = useState<UserCreateInput | UserUpdateInput>(DEFAULT_USER);

  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      const [firstName = '', lastName = ''] = user.name?.split(' ') || [];
      setFormData({
        firstName,
        lastName,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        password: "",
        confirmPassword: ""
      });
    } else {
      setFormData(DEFAULT_USER);
    }
  }, [user]);

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleRoleChange = (value: UserRole) => {
    setFormData({ ...formData, role: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validate email domain
    if (!formData.email.endsWith("@jasonofbh.com")) {
      toast.error("Email must end with @jasonofbh.com");
      return;
    }

    const isNewUser = !isEditing;

    if (isNewUser) {
      const data = formData as UserCreateInput;
      if (!data.password) {
        toast.error("Password is required");
        return;
      }
      if (data.password !== data.confirmPassword) {
        toast.error("Passwords don't match");
        return;
      }
    } else {
      const updateData = formData as UserUpdateInput;
      if (updateData.password || (formData as any).confirmPassword) {
        if (updateData.password !== (formData as any).confirmPassword) {
          toast.error("Passwords don't match");
          return;
        }
      } else {
        delete updateData.password;
      }
    }

    const { id, confirmPassword, ...safeData } = formData as any;
    onSubmit(safeData);
  };

  const isNewUserForm = !isEditing;
  const formHasPasswordMismatch = isNewUserForm &&
    (formData as UserCreateInput).password !== (formData as UserCreateInput).confirmPassword &&
    (formData as UserCreateInput).confirmPassword !== "";

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!value) onClose();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit User" : "Create New User"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <UserInfoFields 
              firstName={formData.firstName || ""}
              lastName={formData.lastName || ""}
              email={formData.email || ""}
              phone={formData.phone || ""}
              onFirstNameChange={handleChange("firstName")}
              onLastNameChange={handleChange("lastName")}
              onEmailChange={handleChange("email")}
              onPhoneChange={handleChange("phone")}
            />

            <RoleSelector 
              value={formData.role || "Operator"}
              onChange={handleRoleChange}
              roles={ROLES}
            />

            {isNewUserForm ? (
              <PasswordFields 
                password={(formData as UserCreateInput).password || ""}
                confirmPassword={(formData as UserCreateInput).confirmPassword || ""}
                onPasswordChange={handleChange("password")}
                onConfirmPasswordChange={handleChange("confirmPassword")}
              />
            ) : (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Reset Password (optional)</p>
                <PasswordFields 
                  password={(formData as UserUpdateInput).password || ""}
                  confirmPassword={(formData as any).confirmPassword || ""}
                  onPasswordChange={handleChange("password")}
                  onConfirmPasswordChange={handleChange("confirmPassword")}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isLoading || formHasPasswordMismatch}
            >
              {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
