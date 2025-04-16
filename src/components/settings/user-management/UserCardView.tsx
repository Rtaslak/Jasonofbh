
import { User, UserUpdateInput } from "@/types/users";
import { UserCard } from "../UserCard";

interface UserCardViewProps {
  users: User[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  handleUpdate: (id: string, data: UserUpdateInput) => void;
  readOnly?: boolean;
}

export function UserCardView({ 
  users, 
  onEdit, 
  onDelete, 
  isUpdating, 
  isDeleting, 
  handleUpdate, // We'll keep this param even though we're not directly using it in the component
  readOnly = false
}: UserCardViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onEdit={readOnly ? undefined : onEdit}
          onDelete={readOnly ? undefined : onDelete}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
}
