
import { UserRole } from "@/types/users";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { UserCog } from "lucide-react";

interface RoleSelectorProps {
  value: UserRole;
  onChange: (value: UserRole) => void;
  roles: UserRole[];
}

export function RoleSelector({ value, onChange, roles }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="role" className="text-right">
        Role
      </Label>
      <div className="col-span-3 relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">
          <UserCog size={18} />
        </div>
        <Select
          value={value}
          onValueChange={(value) => onChange(value as UserRole)}
        >
          <SelectTrigger className="pl-10">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
