// hooks/useAuth.ts
import { useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { auth } from "@/lib/firebase/config";
import { AuthService } from "@/lib/firebase/auth";
import { useAuthStore } from "@/store/authStore";
import { AuthUser, UserRole } from "@/types/auth";

export const useAuth = () => {
  const {
    user,
    isLoading,
    isInitialized,
    error,
    setUser,
    setLoading,
    setInitialized,
    setError,
    clearError,
    reset,
  } = useAuthStore();

  const queryClient = useQueryClient();

  // Query for user data
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", user?.uid],
    queryFn: async (): Promise<AuthUser | null> => {
      if (!auth.currentUser) return null;
      return await AuthService.getUserData(auth.currentUser);
    },
    enabled: !!user?.uid,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Listen to auth state changes
  useEffect(() => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: User | null) => {
        try {
          if (firebaseUser) {
            const authUser = await AuthService.getUserData(firebaseUser);
            setUser(authUser);
            queryClient.setQueryData(["user", authUser.uid], authUser);
          } else {
            setUser(null);
            queryClient.clear();
          }
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          );
        } finally {
          setLoading(false);
          setInitialized(true);
        }
      },
      (error) => {
        setError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        );
        setLoading(false);
        setInitialized(true);
      },
    );

    return unsubscribe;
  }, [setUser, setLoading, setInitialized, setError, queryClient]);

  // Update user data when userData changes
  useEffect(() => {
    if (userData && user?.uid === userData.uid) {
      setUser(userData);
    }
  }, [userData, user?.uid, setUser]);

  const signOut = async () => {
    try {
      setLoading(true);
      await AuthService.signOut();
      reset();
      queryClient.clear();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    }
  };

  const refreshUser = () => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return {
    user: userData || user,
    isLoading: isLoading || isUserLoading,
    isInitialized,
    error,
    setError,
    clearError,
    signOut,
    refreshUser,
    // Role checking utilities
    isSuperAdmin: AuthService.isSuperAdmin(userData || user),
    isAdmin: AuthService.isAdmin(userData || user),
    isTeacher: AuthService.isTeacher(userData || user),
    isStudent: AuthService.isStudent(userData || user),
    hasRole: (role: string) =>
      AuthService.hasRole(userData || user, role as UserRole),
  };
};
