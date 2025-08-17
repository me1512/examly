// app/(auth)/login/page.tsx
"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function Login() {
  const router = useRouter();
  const { user, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && user) {
      router.push("/profile");
    }
  }, [user, isInitialized, router]);

  if (!isInitialized || user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background Pattern */}
      <div className="bg-grid-slate-100 dark:bg-grid-slate-700/25 absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)] bg-[size:20px_20px]" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
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
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
              Sign in to continue to your account
            </p>
          </div>

          {/* Login Form Card */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-2 animate-pulse rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20 blur-lg" />

            {/* Main card */}
            <div className="relative rounded-3xl border border-white/50 bg-white/70 p-8 shadow-2xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/70">
              <LoginForm
                onToggleMode={() => {
                  router.push("/register");
                }}
                onForgotPassword={() => router.push("/forgot-password")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
