// src/services/getUserService.ts
import { apiClient } from "@/utils/api";
import { User } from "@/types/users";

export const getUserService = {
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await apiClient.get<User[]>("/users");
      return response;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await apiClient.get<User>(`/users/${id}`);
      return response;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }
};
