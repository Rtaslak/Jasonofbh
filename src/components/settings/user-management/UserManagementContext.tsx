// src/components/settings/user-management/UserManagementContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { User, UserCreateInput, UserUpdateInput } from '@/types/users';

interface UserManagementContextType {
  viewMode: 'table' | 'card';
  setViewMode: (mode: 'table' | 'card') => void;
  isFormOpen: boolean;
  isDeleteDialogOpen: boolean;
  selectedUserId: string | null;
  users: User[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: Error | null;
  handleCreateClick: () => void;
  handleEditClick: (id: string) => void;
  handleDeleteClick: (id: string) => void;
  handleFormClose: () => void;
  handleDeleteDialogClose: () => void;
  handleDeleteConfirm: () => Promise<void>;
  handleFormSubmit: (data: UserCreateInput | UserUpdateInput) => Promise<void>;
  handleUpdateUser: (id: string, data: UserUpdateInput) => void;
  getSelectedUser: () => User | undefined;
}

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

interface UserManagementProviderProps {
  children: React.ReactNode;
  readOnly?: boolean;
}

export function UserManagementProvider({ children, readOnly = false }: UserManagementProviderProps) {
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { 
    users,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createUser,
    updateUser,
    deleteUser
  } = useUsers();

  const handleCreateClick = () => {
    if (readOnly) return;
    setSelectedUserId(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (id: string) => {
    if (readOnly) return;
    setSelectedUserId(id);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (readOnly) return;
    setSelectedUserId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedUserId(null);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
    setSelectedUserId(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUserId) {
      await deleteUser(selectedUserId);
      setIsDeleteDialogOpen(false);
      setSelectedUserId(null);
    }
  };

  const handleFormSubmit = async (data: UserCreateInput | UserUpdateInput) => {
    if (selectedUserId) {
      await updateUser({ id: selectedUserId, userData: data as UserUpdateInput });
    } else {
      const { id, ...safeData } = data as any;
      await createUser(safeData);
    }
    setIsFormOpen(false);
  };

  const handleUpdateUser = (id: string, data: UserUpdateInput) => {
    updateUser({ id, userData: data });
  };

  const getSelectedUser = (): User | undefined => {
    if (!selectedUserId) return undefined;
    return users.find(user => user.id === selectedUserId);
  };

  const contextValue: UserManagementContextType = {
    viewMode,
    setViewMode,
    isFormOpen,
    isDeleteDialogOpen,
    selectedUserId,
    users,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    handleCreateClick,
    handleEditClick,
    handleDeleteClick,
    handleFormClose,
    handleDeleteDialogClose,
    handleDeleteConfirm,
    handleFormSubmit,
    handleUpdateUser,
    getSelectedUser
  };

  return (
    <UserManagementContext.Provider value={contextValue}>
      {children}
    </UserManagementContext.Provider>
  );
}

export function useUserManagement() {
  const context = useContext(UserManagementContext);
  if (context === undefined) {
    throw new Error('useUserManagement must be used within a UserManagementProvider');
  }
  return context;
}
