// hooks/useAuthMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/lib/firebase/auth";
import { LoginCredentials, RegisterCredentials, AuthUser } from "@/types/auth";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-hot-toast";

export const useAuthMutations = () => {
  const queryClient = useQueryClient();
  const { setUser, setError } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      AuthService.signInWithCredentials(credentials),
    onSuccess: (user: AuthUser) => {
      setUser(user);
      queryClient.setQueryData(["user", user.uid], user);
      toast.success("Successfully signed in!");
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error(error.message);
    },
  });

  const googleSignInMutation = useMutation({
    mutationFn: () => AuthService.signInWithGoogle(),
    onSuccess: (user: AuthUser) => {
      setUser(user);
      queryClient.setQueryData(["user", user.uid], user);
      toast.success("Successfully signed in with Google!");
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error(error.message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      AuthService.registerWithCredentials(credentials),
    onSuccess: (user: AuthUser) => {
      setUser(user);
      queryClient.setQueryData(["user", user.uid], user);
      toast.success("Account created successfully! Please verify your email.");
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error(error.message);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (email: string) => AuthService.resetPassword(email),
    onSuccess: () => {
      toast.success("Password reset email sent!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updates: Partial<AuthUser>) =>
      AuthService.updateUserProfile(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const sendVerificationMutation = useMutation({
    mutationFn: () => AuthService.sendVerificationEmail(),
    onSuccess: () => {
      toast.success("Verification email sent!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    login: loginMutation,
    googleSignIn: googleSignInMutation,
    register: registerMutation,
    resetPassword: resetPasswordMutation,
    updateProfile: updateProfileMutation,
    sendVerification: sendVerificationMutation,
  };
};
