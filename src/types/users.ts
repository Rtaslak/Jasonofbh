
export type UserRole = 'Administrator' | 'Salesperson' | 'Operator';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  password?: string; // Password field is optional in the main type
}

export interface UserCreateInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  password: string;
  confirmPassword?: string;
}

export interface UserUpdateInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  password?: string;
  name?: string; // Added name field to allow updates
}
