// components/auth/GoogleSignInButton.tsx
"use client";

import GoogleIcon from "@/components/ui/icons/GoogleIcon";
import { useAuthMutations } from "@/hooks/useAuthMutations";
import { Button } from "@/components/ui/Button";

export const GoogleSignInButton = () => {
  const { googleSignIn } = useAuthMutations();

  return (
    <Button
      type="button"
      onClick={() => googleSignIn.mutate()}
      disabled={googleSignIn.isPending}
      variant="outline"
      className="w-full border-gray-300 py-3 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      {googleSignIn.isPending ? (
        <div className="flex items-center justify-center">
          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-gray-600" />
          Signing in...
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <GoogleIcon />
          Continue with Google
        </div>
      )}
    </Button>
  );
};
