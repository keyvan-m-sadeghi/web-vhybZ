import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useAuthStore } from '../lib/stores/auth-store';
import { fetchCurrentUser, logoutUser, initiateGoogleLogin } from '../lib/api/auth';

export const useAuth = () => {
  const authStore = useAuthStore();
  const queryClient = useQueryClient();

  // Server state (user data)
  const userQuery = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry 401s (user not authenticated)
      if (error?.message?.includes('401')) return false;
      return failureCount < 3;
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear(); // Clear all cached data
      authStore.reset();
    },
    onError: (error: any) => {
      authStore.setError(error.message || 'Logout failed');
    },
  });

  // Derived state
  const isAuthenticated = !!userQuery.data && !userQuery.error;
  const isLoading = userQuery.isLoading || authStore.isLoading || logoutMutation.isPending;

  // Actions
  const login = useCallback(() => {
    authStore.setLoading(true);
    authStore.clearError();
    initiateGoogleLogin(); // Will redirect, so loading state will persist
  }, [authStore]);

  const logout = useCallback(async () => {
    authStore.setLoading(true);
    authStore.clearError();
    try {
      await logoutMutation.mutateAsync();
    } catch (error: any) {
      authStore.setError(error.message || 'Logout failed');
    }
  }, [logoutMutation, authStore]);

  const refetch = useCallback(() => {
    return userQuery.refetch();
  }, [userQuery]);

  // Handle authentication errors
  useEffect(() => {
    if (userQuery.error && !authStore.error) {
      const errorMessage = userQuery.error.message;
      if (!errorMessage.includes('401')) {
        authStore.setError(errorMessage || 'Authentication error');
      }
    }
  }, [userQuery.error, authStore]);

  return {
    // Data
    user: userQuery.data || null,
    isAuthenticated,
    isLoading,
    error: authStore.error,

    // Actions
    login,
    logout,
    refetch,
    clearError: authStore.clearError,
  };
};

// Convenience hooks
export const useUser = () => {
  const { data } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: fetchCurrentUser,
  });
  return data || null;
};

export const useIsAuthenticated = () => {
  const { data, error } = useQuery({
    queryKey: ['auth', 'user'], 
    queryFn: fetchCurrentUser,
  });
  return !!data && !error;
};

export const useAuthActions = () => {
  const { login, logout } = useAuth();
  return { login, logout };
};