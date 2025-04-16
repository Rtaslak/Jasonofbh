
import React, { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { User, UserCreateInput, UserUpdateInput } from '@/types/users';
import { UserCardView } from './UserCardView';
import { UserTableView } from './UserTableView';
import { UserManagementHeader } from './UserManagementHeader';
import { UserManagementDialogs } from './UserManagementDialogs';
import { UserManagementError } from './UserManagementError';
import { UserEmptyState } from '../UserEmptyState';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { UserManagementProvider, useUserManagement } from './UserManagementContext';

interface UserManagementContainerProps {
  readOnly?: boolean;
}

// Internal component that uses the context
function UserManagementContent({ readOnly = false }: UserManagementContainerProps) {
  const { 
    viewMode,
    users,
    isLoading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    isFormOpen,
    isDeleteDialogOpen,
    selectedUserId,
    handleCreateClick,
    handleEditClick,
    handleDeleteClick,
    handleFormClose,
    handleDeleteDialogClose,
    handleDeleteConfirm,
    handleFormSubmit,
    handleUpdateUser,
    getSelectedUser,
    setViewMode
  } = useUserManagement();

  if (error) {
    return <UserManagementError error={error} />;
  }

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      {readOnly && (
        <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertTitle>Read-only mode</AlertTitle>
          <AlertDescription>
            You are viewing user management in read-only mode. Contact an administrator for changes.
          </AlertDescription>
        </Alert>
      )}
      
      <UserManagementHeader 
        onCreateClick={handleCreateClick} 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        isCreating={isCreating}
        readOnly={readOnly}
      />
      
      {users.length === 0 ? (
        <UserEmptyState onCreateClick={readOnly ? undefined : handleCreateClick} />
      ) : viewMode === 'table' ? (
        <UserTableView 
          users={users} 
          onEdit={handleEditClick} 
          onDelete={handleDeleteClick} 
          isDisabled={isDeleting || isUpdating}
          readOnly={readOnly}
        />
      ) : (
        <UserCardView 
          users={users} 
          onEdit={handleEditClick} 
          onDelete={handleDeleteClick} 
          isUpdating={isUpdating} 
          isDeleting={isDeleting} 
          handleUpdate={handleUpdateUser}
          readOnly={readOnly}
        />
      )}
      
      <UserManagementDialogs 
        isFormOpen={isFormOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        selectedUser={getSelectedUser()}
        onFormClose={handleFormClose}
        onDeleteDialogClose={handleDeleteDialogClose}
        onFormSubmit={handleFormSubmit}
        onDeleteConfirm={handleDeleteConfirm}
        isCreating={isCreating}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />
    </div>
  );
}

// Wrapper component that provides the context
export function UserManagementContainer(props: UserManagementContainerProps) {
  return (
    <UserManagementProvider readOnly={props.readOnly}>
      <UserManagementContent {...props} />
    </UserManagementProvider>
  );
}
