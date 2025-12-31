// app/(auth)/register/page.tsx
"use client";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const Registerpage = () => {
  const router = useRouter();
  const { user, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && user) {
      router.push("/profile");
    }
  }, [user, isInitialized, router]);

  // Shared layout classes
  const containerClasses =
    "min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-100 py-16 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900";
  const bgPatternClasses =
    "bg-grid-slate-100 dark:bg-grid-slate-700/25 absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)] bg-[size:20px_20px]";
  const contentClasses =
    "relative flex min-h-screen items-center justify-center px-4 py-12";

  if (!isInitialized || user) {
    return (
      <div className={containerClasses}>
        <div className={bgPatternClasses} />
        <div className={contentClasses}>
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {/* Background Pattern */}
      <div className={bgPatternClasses} />

      <div className={contentClasses}>
        <div className="w-full max-w-md space-y-8">
          {/* Logo/Brand Area */}
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
              Please Register to continue
            </p>
          </div>

          {/* Login Form Card */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-2 animate-pulse rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20 blur-lg" />

            {/* Main card */}
            <div className="relative rounded-3xl border border-white/50 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/70">
              <RegisterForm onToggleMode={() => router.push("/login")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registerpage;
