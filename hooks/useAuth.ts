// hooks/useAuth.ts
"use client";

import { AuthService } from "@/lib/firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useAuthStore } from "@/stores/authStore";
import { UserRole } from "@/types/auth";
import { useQueryClient } from "@tanstack/react-query";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
  const router = useRouter();

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: User | null) => {
        try {
          if (firebaseUser) {
            const authUser = await AuthService.getUserData(firebaseUser);
            setUser(authUser);
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
          setInitialized(true);
          setLoading(false);
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

  const signOut = async () => {
    try {
      setLoading(true);
      await AuthService.signOut();
      // refresh page
      router.refresh();
      reset();
      queryClient.clear();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
      setLoading(false); // Ensure loading is false on error
    }
  };

  const refreshUser = async () => {
    if (auth.currentUser) {
      setLoading(true);
      try {
        const freshUser = await AuthService.getUserData(auth.currentUser);
        setUser(freshUser);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to refresh user");
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    user,
    isLoading,
    isInitialized,
    error,
    setError,
    clearError,
    signOut,
    refreshUser,
    isSuperAdmin: AuthService.isSuperAdmin(user),
    isAdmin: AuthService.isAdmin(user),
    isTeacher: AuthService.isTeacher(user),
    isStudent: AuthService.isStudent(user),
    hasRole: (role: string) => AuthService.hasRole(user, role as UserRole),
  };
};
