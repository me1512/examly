// components/auth/AuthGuard.tsx
"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/auth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[]; // Updated to accept both single role and array of roles
  requireAuth?: boolean;
  redirectTo?: string;
}

export const AuthGuard = ({
  children,
  requiredRole,
  requireAuth = true,
  redirectTo = "/login",
}: AuthGuardProps) => {
  const { user, isLoading, isInitialized, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    if (requireAuth && !user) {
      router.push(redirectTo);
      return;
    }

    // Handle both single role and array of roles
    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const hasRequiredRole = roles.some((role) => hasRole(role));

      if (!hasRequiredRole) {
        router.push("/unauthorized");
        return;
      }
    }
  }, [
    user,
    isLoading,
    isInitialized,
    requiredRole,
    requireAuth,
    redirectTo,
    router,
    hasRole,
  ]);

  if (!isInitialized || isLoading) {
    return <LoadingSpinner />;
  }

  if (requireAuth && !user) {
    return null;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasRequiredRole = roles.some((role) => hasRole(role));

    if (!hasRequiredRole) {
      return null;
    }
  }

  return <>{children}</>;
};
