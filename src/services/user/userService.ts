
import { apiClient } from "@/utils/api";
import { User, UserCreateInput, UserUpdateInput } from "@/types/users";
import { getUserService } from './getUserService';
import { createUserService } from './createUserService';
import { updateUserService } from './updateUserService';
import { deleteUserService } from './deleteUserService';

export const userService = {
  /**
   * Get all users
   */
  getUsers: getUserService.getUsers,
  
  /**
   * Get user by ID
   */
  getUserById: getUserService.getUserById,
  
  /**
   * Create a new user
   */
  createUser: createUserService.createUser,
  
  /**
   * Update an existing user
   */
  updateUser: updateUserService.updateUser,
  
  /**
   * Delete a user
   */
  deleteUser: deleteUserService.deleteUser
};
