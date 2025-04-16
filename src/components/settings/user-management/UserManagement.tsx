
import React from 'react';
import { UserManagementContainer } from './UserManagementContainer';

interface UserManagementProps {
  readOnly?: boolean;
}

export function UserManagement({ readOnly = false }: UserManagementProps) {
  return <UserManagementContainer readOnly={readOnly} />;
}
