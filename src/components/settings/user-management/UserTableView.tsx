
import { User } from "@/types/users";
import { UserTable } from "../UserTable";

interface UserTableViewProps {
  users: User[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isDisabled: boolean;
  readOnly?: boolean;
}

export function UserTableView({ 
  users, 
  onEdit, 
  onDelete, 
  isDisabled,
  readOnly = false
}: UserTableViewProps) {
  return (
    <UserTable 
      users={users} 
      onEdit={onEdit} 
      onDelete={onDelete}
      isDisabled={isDisabled}
      readOnly={readOnly}
    />
  );
}
