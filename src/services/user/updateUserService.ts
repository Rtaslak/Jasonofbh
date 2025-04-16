// src/services/updateUserService.ts
import { apiClient } from "@/utils/api";
import { User, UserUpdateInput } from "@/types/users";

export const updateUserService = {
  updateUser: async (id: string, userData: UserUpdateInput): Promise<User> => {
    try {
      const response = await apiClient.put<User>(`/users/${id}`, userData);
      return response;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
};
