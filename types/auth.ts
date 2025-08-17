// types/auth.ts
// import { User } from "firebase/auth";

export type UserRole =
  | "guest"
  | "student"
  | "teacher"
  | "admin"
  | "super-admin";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  organizationId?: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    bio?: string;
  };
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}
