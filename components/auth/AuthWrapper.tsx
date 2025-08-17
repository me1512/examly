// components/auth/AuthWrapper.tsx
"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

type AuthMode = "login" | "register" | "forgot-password";

export const AuthWrapper = () => {
  const [mode, setMode] = useState<AuthMode>("login");

  const handleToggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
  };

  const handleForgotPassword = () => {
    setMode("forgot-password");
  };

  const handleBackToLogin = () => {
    setMode("login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <AnimatePresence mode="wait">
        {mode === "login" && (
          <LoginForm
            key="login"
            onToggleMode={handleToggleMode}
            onForgotPassword={handleForgotPassword}
          />
        )}
        {mode === "register" && (
          <RegisterForm key="register" onToggleMode={handleToggleMode} />
        )}
        {mode === "forgot-password" && (
          <ForgotPasswordForm
            key="forgot-password"
            onBack={handleBackToLogin}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
