// hooks/useAuth.ts
"use client";

import { AuthService } from "@/lib/firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useAuthStore } from "@/stores/authStore";
import { UserRole } from "@/types/auth";
import { useQueryClient } from "@tanstack/react-query";
import { onAuthStateChanged, User, getRedirectResult } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

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
  } = useAuthStore();

  const queryClient = useQueryClient();
  const router = useRouter();

  // 1. Handle Redirect Result (Explicitly check for returning Google users)
  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          // If we have a user from redirect, ensure profile exists
          // The onAuthStateChanged will actually trigger the state update
          // but we can do a sanity check or specific logic here if needed.
          console.log("Redirect success:", result.user.email);
        }
      } catch (error) {
        console.error("Redirect login error:", error);
        const message = error instanceof Error ? error.message : "Login failed";
        setError(message);
        toast.error(message);
      }
    };

    handleRedirect();
  }, [setError]);

  // 2. Main Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: User | null) => {
        try {
          if (firebaseUser) {
            // Fetch/Create user profile in Firestore
            const authUser = await AuthService.getUserData(firebaseUser);
            setUser(authUser);
          } else {
            setUser(null);
            queryClient.clear();
          }
        } catch (error) {
          console.error("Auth state handling error:", error);
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
        console.error("Auth subscription error:", error);
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
      queryClient.clear();
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
      setLoading(false);
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