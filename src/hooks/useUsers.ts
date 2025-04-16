
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user';
import { UserCreateInput, UserUpdateInput } from '@/types/users';
import { toast } from "sonner";

export const useUsers = () => {
  const queryClient = useQueryClient();
  
  // Get all users
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log("useUsers: Fetching all users");
      const users = await userService.getUsers();
      console.log("useUsers: Fetched users:", users);
      return users;
    },
    retry: 2,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
    // Add custom error handling
    meta: {
      onError: (error: Error) => {
        console.error("Error fetching users:", error);
        toast.error(`Failed to load users: ${error.message}`);
      }
    }
  });
  
  // Get user by ID
  const getUserById = (id: string) => {
    return useQuery({
      queryKey: ['users', id],
      queryFn: () => userService.getUserById(id),
      enabled: !!id,
    });
  };
  
  // Create user
  const createUserMutation = useMutation({
    mutationFn: (userData: UserCreateInput) => {
      console.log("useUsers: Creating user with data:", userData);
      // Create name field from firstName and lastName
      const userDataWithName = {
        ...userData,
        name: `${userData.firstName} ${userData.lastName}`.trim()
      };
      return userService.createUser(userDataWithName);
    },
    onSuccess: (data) => {
      console.log("useUsers: User created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (error: Error) => {
      console.error("Create user mutation error:", error);
      toast.error(`Failed to create user: ${error.message}`);
    },
  });
  
  // Update user
  const updateUserMutation = useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: UserUpdateInput }) => {
      console.log("useUsers: Updating user with ID:", id, "Data:", userData);
      // If firstName or lastName is updated, update name field too
      if (userData.firstName !== undefined || userData.lastName !== undefined) {
        const currentUser = usersQuery.data?.find(user => user.id === id);
        if (currentUser) {
          const firstName = userData.firstName !== undefined ? userData.firstName : currentUser.firstName || '';
          const lastName = userData.lastName !== undefined ? userData.lastName : currentUser.lastName || '';
          userData = {
            ...userData,
            name: `${firstName} ${lastName}`.trim()
          };
        }
      }
      return userService.updateUser(id, userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
    },
    onError: (error: Error) => {
      console.error("Update user mutation error:", error);
      toast.error(`Failed to update user: ${error.message}`);
    },
  });
  
  // Delete user
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => {
      console.log("useUsers: Deleting user with ID:", id);
      return userService.deleteUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: Error) => {
      console.error("Delete user mutation error:", error);
      toast.error(`Failed to delete user: ${error.message}`);
    },
  });

  return {
    users: Array.isArray(usersQuery.data) ? usersQuery.data : [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error,
    getUserById,
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  };
};
