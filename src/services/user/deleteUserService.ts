// src/services/deleteUserService.ts
import { apiClient } from "@/utils/api";

export const deleteUserService = {
  deleteUser: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/users/${id}`);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
};
