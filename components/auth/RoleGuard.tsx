// components/auth/RoleGuard.tsx
"use client";

import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/auth";

interface RoleGuardProps {
  children: ReactNode;
  requiredRole: UserRole;
  fallback?: ReactNode;
}

export const RoleGuard = ({
  children,
  requiredRole,
  fallback,
}: RoleGuardProps) => {
  const { hasRole } = useAuth();

  if (!hasRole(requiredRole)) {
    return fallback || null;
  }

  return <>{children}</>;
};
