
import { User, UserCreateInput, UserUpdateInput } from "@/types/users";
import { UserForm } from "../UserForm";
import { DeleteUserDialog } from "../DeleteUserDialog";

interface UserManagementDialogsProps {
  isFormOpen: boolean;
  isDeleteDialogOpen: boolean;
  selectedUser: User | undefined;
  onFormClose: () => void;
  onDeleteDialogClose: () => void;
  onFormSubmit: (data: UserCreateInput | UserUpdateInput) => Promise<void>;
  onDeleteConfirm: () => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function UserManagementDialogs({
  isFormOpen,
  isDeleteDialogOpen,
  selectedUser,
  onFormClose,
  onDeleteDialogClose,
  onFormSubmit,
  onDeleteConfirm,
  isCreating,
  isUpdating,
  isDeleting
}: UserManagementDialogsProps) {
  return (
    <>
      {/* User creation/edit form */}
      {isFormOpen && (
        <UserForm
          open={isFormOpen}
          onClose={onFormClose}
          onSubmit={onFormSubmit}
          user={selectedUser}
          isLoading={isCreating || isUpdating}
        />
      )}

      {/* Delete confirmation dialog */}
      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onClose={onDeleteDialogClose}
        onConfirm={onDeleteConfirm}
        userName={selectedUser?.name}
      />
    </>
  );
}
