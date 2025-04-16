import { apiClient } from "@/utils/api";
import { User, UserCreateInput } from "@/types/users";

export const createUserService = {
  /**
   * Create a new user using the real backend API
   */
  createUser: async (userData: UserCreateInput): Promise<User> => {
    try {
      const response = await apiClient.post<User>("/users", userData);
      return response;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
};
