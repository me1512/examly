<!-- path: provider/ThemeProvider.tsx -->
```typescript
"use client";

import { useEffect } from "react";
import { useThemeStore, hydrateThemeStore, Theme } from "@/stores/themeStore";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, hydrated } = useThemeStore();

  // Hydrate theme from localStorage on mount
  useEffect(() => {
    // Add class to disable transitions during initial load
    document.documentElement.classList.add("no-transition");

    hydrateThemeStore();

    // Re-enable transitions after a short delay
    setTimeout(() => {
      document.documentElement.classList.remove("no-transition");
    }, 50);
  }, []);

  // Apply theme when hydrated or theme changes
  useEffect(() => {
    if (!hydrated) return;

    const applyTheme = (theme: Theme) => {
      const isDark =
        theme === "dark" ||
        (theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    applyTheme(theme);

    // Listen for system theme changes
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme, hydrated]);

  return <>{children}</>;
}

```

<!-- path: provider/QueryClientProviderWrapper.tsx -->
```typescript
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const QueryClientProviderWrapper = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  // Create a client
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryClientProviderWrapper;

```

<!-- path: app/globals.css -->
```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:where(.dark, .dark *)); /* dark mode styles are applied when an element has the .dark class OR when it's a descendant of an element with .dark class */

/* Color scheme handled by CSS classes */
:root {
  color-scheme: light;
}

:root.dark {
  color-scheme: dark;
}

/* Smooth transitions for theme changes (not initial load) */
*,
*::before,
*::after {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Disable transitions on initial page load */
.no-transition * {
  transition: none !important;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --radius: 0.625rem;
  --background: #ffffff;
  --foreground: #1f1a3d;
  --card: #ffffff;
  --card-foreground: #1f1a3d;
  --popover: #ffffff;
  --popover-foreground: #1f1a3d;
  --primary: #2a1f4d;
  --primary-foreground: #f9f7ff;
  --secondary: #f5f4ff;
  --secondary-foreground: #2a1f4d;
  --muted: #f5f4ff;
  --muted-foreground: #7a7499;
  --accent: #f5f4ff;
  --accent-foreground: #2a1f4d;
  --destructive: #c44536;
  --border: #e8e6f2;
  --input: #e8e6f2;
  --ring: #b3a8e0;
  --chart-1: #a85a4a;
  --chart-2: #5aa8a0;
  --chart-3: #5a7aa8;
  --chart-4: #d4a85a;
  --chart-5: #d48a5a;
  --sidebar: #f9f7ff;
  --sidebar-foreground: #1f1a3d;
  --sidebar-primary: #2a1f4d;
  --sidebar-primary-foreground: #f9f7ff;
  --sidebar-accent: #f5f4ff;
  --sidebar-accent-foreground: #2a1f4d;
  --sidebar-border: #e8e6f2;
  --sidebar-ring: #b3a8e0;
}

.dark {
  --background: #1f1a3d;
  --foreground: #f9f7ff;
  --card: #2a1f4d;
  --card-foreground: #f9f7ff;
  --popover: #2a1f4d;
  --popover-foreground: #f9f7ff;
  --primary: #e8e6f2;
  --primary-foreground: #2a1f4d;
  --secondary: #3a2f6d;
  --secondary-foreground: #f9f7ff;
  --muted: #3a2f6d;
  --muted-foreground: #b3a8e0;
  --accent: #3a2f6d;
  --accent-foreground: #f9f7ff;
  --destructive: #d45a4a;
  --border: rgba(255, 255, 255, 0.1);
  --input: rgba(255, 255, 255, 0.15);
  --ring: #8a7fd0;
  --chart-1: #7a5ad4;
  --chart-2: #5ad4a8;
  --chart-3: #d48a5a;
  --chart-4: #a85ad4;
  --chart-5: #d45a7a;
  --sidebar: #2a1f4d;
  --sidebar-foreground: #f9f7ff;
  --sidebar-primary: #7a5ad4;
  --sidebar-primary-foreground: #f9f7ff;
  --sidebar-accent: #3a2f6d;
  --sidebar-accent-foreground: #f9f7ff;
  --sidebar-border: rgba(255, 255, 255, 0.1);
  --sidebar-ring: #8a7fd0;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* app/globals.css */
@import "tailwindcss";

@layer base {
  :root {
    /* Color definitions */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.75rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }

  /* Base styles */
  * {
    border-color: hsl(var(--border));
  }

  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
  }

  /* Border radius utilities */
  .rounded-lg {
    border-radius: var(--radius);
  }

  .rounded-md {
    border-radius: calc(var(--radius) - 2px);
  }

  .rounded-sm {
    border-radius: calc(var(--radius) - 4px);
  }

  /* Color utilities */
  .bg-background {
    background-color: hsl(var(--background));
  }
  .bg-foreground {
    background-color: hsl(var(--foreground));
  }
  .bg-card {
    background-color: hsl(var(--card));
  }
  .bg-card-foreground {
    background-color: hsl(var(--card-foreground));
  }
  .bg-popover {
    background-color: hsl(var(--popover));
  }
  .bg-popover-foreground {
    background-color: hsl(var(--popover-foreground));
  }
  .bg-primary {
    background-color: hsl(var(--primary));
  }
  .bg-primary-foreground {
    background-color: hsl(var(--primary-foreground));
  }
  .bg-secondary {
    background-color: hsl(var(--secondary));
  }
  .bg-secondary-foreground {
    background-color: hsl(var(--secondary-foreground));
  }
  .bg-muted {
    background-color: hsl(var(--muted));
  }
  .bg-muted-foreground {
    background-color: hsl(var(--muted-foreground));
  }
  .bg-accent {
    background-color: hsl(var(--accent));
  }
  .bg-accent-foreground {
    background-color: hsl(var(--accent-foreground));
  }
  .bg-destructive {
    background-color: hsl(var(--destructive));
  }
  .bg-destructive-foreground {
    background-color: hsl(var(--destructive-foreground));
  }
  .bg-border {
    background-color: hsl(var(--border));
  }
  .bg-input {
    background-color: hsl(var(--input));
  }
  .bg-ring {
    background-color: hsl(var(--ring));
  }

  .text-background {
    color: hsl(var(--background));
  }
  .text-foreground {
    color: hsl(var(--foreground));
  }
  .text-card {
    color: hsl(var(--card));
  }
  .text-card-foreground {
    color: hsl(var(--card-foreground));
  }
  .text-popover {
    color: hsl(var(--popover));
  }
  .text-popover-foreground {
    color: hsl(var(--popover-foreground));
  }
  .text-primary {
    color: hsl(var(--primary));
  }
  .text-primary-foreground {
    color: hsl(var(--primary-foreground));
  }
  .text-secondary {
    color: hsl(var(--secondary));
  }
  .text-secondary-foreground {
    color: hsl(var(--secondary-foreground));
  }
  .text-muted {
    color: hsl(var(--muted));
  }
  .text-muted-foreground {
    color: hsl(var(--muted-foreground));
  }
  .text-accent {
    color: hsl(var(--accent));
  }
  .text-accent-foreground {
    color: hsl(var(--accent-foreground));
  }
  .text-destructive {
    color: hsl(var(--destructive));
  }
  .text-destructive-foreground {
    color: hsl(var(--destructive-foreground));
  }
  .text-border {
    color: hsl(var(--border));
  }
  .text-input {
    color: hsl(var(--input));
  }
  .text-ring {
    color: hsl(var(--ring));
  }

  .border-border {
    border-color: hsl(var(--border));
  }
  .border-input {
    border-color: hsl(var(--input));
  }
  .border-ring {
    border-color: hsl(var(--ring));
  }
}

@layer utilities {
  /* Accordion animations */
  @keyframes accordion-down {
    from {
      height: 0;
    }
    to {
      height: var(--radix-accordion-content-height);
    }
  }

  @keyframes accordion-up {
    from {
      height: var(--radix-accordion-content-height);
    }
    to {
      height: 0;
    }
  }

  .animate-accordion-down {
    animation: accordion-down 0.2s ease-out;
  }

  .animate-accordion-up {
    animation: accordion-up 0.2s ease-out;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background-color: hsl(210 40% 96%);
  }

  .dark ::-webkit-scrollbar-track {
    background-color: hsl(217.2 32.6% 17.5%);
  }

  ::-webkit-scrollbar-thumb {
    background-color: hsl(215 20.2% 65.1%);
    border-radius: 9999px;
  }

  .dark ::-webkit-scrollbar-thumb {
    background-color: hsl(215.4 16.3% 46.9%);
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: hsl(215.4 16.3% 56.9%);
  }

  .dark ::-webkit-scrollbar-thumb:hover {
    background-color: hsl(215.4 16.3% 56.9%);
  }

  /* Loading animations */
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  /* Custom focus styles */
  .focus\:ring-2:focus {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
      var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
      calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow:
      var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
      var(--tw-shadow, 0 0 #0000);
  }
}

```

<!-- path: app/(auth)/forgot-password/page.tsx -->
```typescript
// app/(auth)/forgot-password/page.tsx
"use client";

import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const ForgotPasswordPage = () => {
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
              <ForgotPasswordForm onBack={() => router.push("/login")} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

```

<!-- path: app/(auth)/login/page.tsx -->
```typescript
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

```

<!-- path: app/(auth)/register/page.tsx -->
```typescript
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

  if (!isInitialized || user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-100 py-16 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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

```

<!-- path: app/(dashboard)/layout copy.tsx -->
```typescript
"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Menu, X, Bell, Search } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { getNavigationForRole, breadcrumbConfig } from "@/config/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { UserMenu } from "@/components/auth/UserMenu";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types/auth";
import NavItem from "@/components/navigation/NavItem";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    // The AuthGuard component expects 'requiredRole' not 'allowedRoles'
    <AuthGuard
      requiredRole={
        ["super-admin", "admin", "teacher", "student"] as UserRole[]
      }
    >
      <DashboardContent>{children}</DashboardContent>
    </AuthGuard>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading: loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  // Auto-expand active navigation items
  useEffect(() => {
    if (user) {
      const navigation = getNavigationForRole(user?.role);
      navigation.forEach((item) => {
        if (item.children && item.children.length > 0) {
          const hasActiveChild = item.children.some((child) =>
            pathname.startsWith(child.href),
          );
          if (hasActiveChild && !expandedItems.includes(item.id)) {
            setExpandedItems((prev) => [...prev, item.id]);
          }
        }
      });
    }
  }, [pathname, user, expandedItems]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) return null;

  const navigation = getNavigationForRole(user.role);

  // Generate breadcrumbs
  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs: { label: ReactNode; href: string; isLast: boolean }[] =
      [];
    let currentPath: string = "";

    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      const label =
        breadcrumbConfig[currentPath as keyof typeof breadcrumbConfig] ||
        path.charAt(0).toUpperCase() + path.slice(1);
      breadcrumbs.push({
        label,
        href: currentPath,
        isLast: index === paths.length - 1,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white transition-transform lg:static lg:inset-0 lg:translate-x-0 dark:border-gray-700 dark:bg-gray-800",
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0",
            )}
          >
            {/* Sidebar Header */}{" "}
            {/* This section is not part of the diff, but it's good to keep it in mind */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <span className="text-sm font-bold text-white">E</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Examly
                </span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    pathname={pathname}
                    expandedItems={expandedItems}
                    toggleExpanded={toggleExpanded}
                    onItemClick={() => setSidebarOpen(false)}
                  />
                ))}
              </ul>
            </nav>{" "}
            {/* End of Navigation */}
            {/* User Profile */}
            <div className="border-t border-gray-200 p-4 dark:border-gray-700">
              <UserMenu />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="bg-opacity-25 fixed inset-0 z-40 bg-black lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden"
              >
                {" "}
                {/* This section is not part of the diff, but it's good to keep it in mind */}
                <Menu className="h-5 w-5" />
              </Button>

              {/* Breadcrumbs */}
              <nav className="hidden md:flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  {breadcrumbs.map((breadcrumb, index) => (
                    <li key={breadcrumb.href} className="flex items-center">
                      {index > 0 && (
                        <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
                      )}
                      {breadcrumb.isLast ? (
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {breadcrumb.label}
                        </span>
                      ) : (
                        <Link
                          href={breadcrumb.href}
                          className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                          {breadcrumb.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  3
                </span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

```

<!-- path: app/(dashboard)/courses/create/page.tsx -->
```typescript
// app/(dashboard)/courses/create/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Save,
  Eye,
  BookOpen,
  Clock,
  DollarSign,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useCreateCourse } from "@/hooks/useCourseQueries";
import { CourseCategory, CourseLevel } from "@/types/course";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "react-hot-toast";

const createCourseSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title too long"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  category: z.nativeEnum(CourseCategory),
  level: z.nativeEnum(CourseLevel),
  price: z.number().min(0, "Price cannot be negative"),
  duration: z.number().min(0.5, "Duration must be at least 30 minutes"),
  prerequisites: z.array(z.string()).optional(),
  learningOutcomes: z
    .array(z.string())
    .min(3, "At least 3 learning outcomes required"),
  tags: z.array(z.string()).optional(),
});

type CreateCourseFormData = z.infer<typeof createCourseSchema>;

const CreateCoursePage = () => {
  const router = useRouter();
  const createCourseMutation = useCreateCourse();

  const [currentStep, setCurrentStep] = useState(1);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    getValues,
    control,
    trigger,
  } = useForm<CreateCourseFormData>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      prerequisites: [],
      learningOutcomes: [""],
      tags: [],
      price: 0,
      duration: 1,
    },
    mode: "onChange",
  });

  const formValues = watch();

  const steps = [
    {
      id: 1,
      title: "Basic Information",
      description: "Course title, description, and category",
    },
    {
      id: 2,
      title: "Course Details",
      description: "Pricing, duration, and level",
    },
    {
      id: 3,
      title: "Learning Outcomes",
      description: "What students will learn",
    },
    {
      id: 4,
      title: "Prerequisites & Tags",
      description: "Requirements and keywords",
    },
    { id: 5, title: "Preview & Submit", description: "Review and publish" },
  ];

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addLearningOutcome = () => {
    const outcomes = getValues("learningOutcomes") || [];
    setValue("learningOutcomes", [...outcomes, ""]);
  };

  const removeLearningOutcome = (index: number) => {
    const outcomes = getValues("learningOutcomes") || [];
    if (outcomes.length > 1) {
      setValue(
        "learningOutcomes",
        outcomes.filter((_, i) => i !== index),
      );
    }
  };

  const addPrerequisite = () => {
    const prerequisites = getValues("prerequisites") || [];
    setValue("prerequisites", [...prerequisites, ""]);
  };

  const removePrerequisite = (index: number) => {
    const prerequisites = getValues("prerequisites") || [];
    setValue(
      "prerequisites",
      prerequisites.filter((_, i) => i !== index),
    );
  };

  const addTag = () => {
    const tags = getValues("tags") || [];
    setValue("tags", [...tags, ""]);
  };

  const removeTag = (index: number) => {
    const tags = getValues("tags") || [];
    setValue(
      "tags",
      tags.filter((_, i) => i !== index),
    );
  };

  const onSubmit = async (data: CreateCourseFormData) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("level", data.level);
      formData.append("price", data.price.toString());
      formData.append("duration", data.duration.toString());
      formData.append(
        "learningOutcomes",
        JSON.stringify(data.learningOutcomes),
      );

      if (data.prerequisites) {
        formData.append("prerequisites", JSON.stringify(data.prerequisites));
      }

      if (data.tags) {
        formData.append("tags", JSON.stringify(data.tags));
      }

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      const result = await createCourseMutation.mutateAsync(formData);

      if (result) {
        toast.success("Course created successfully!");
        router.push(`/courses/${result.id}`);
      }
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course. Please try again.");
    }
  };

  const canProceed = async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        await trigger(["title", "description", "category"]);
        return !errors.title && !errors.description && !errors.category;
      case 2:
        await trigger(["level", "price", "duration"]);
        return !errors.level && !errors.price && !errors.duration;
      case 3:
        await trigger("learningOutcomes");
        return !errors.learningOutcomes;
      default:
        return true;
    }
  };

  const handleNextStep = async () => {
    if (await canProceed(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="thumbnail">Course Thumbnail</Label>
              <div className="mt-2">
                {thumbnailPreview ? (
                  <div className="relative">
                    <img
                      src={thumbnailPreview}
                      alt="Course thumbnail"
                      className="h-48 w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnailFile(null);
                        setThumbnailPreview("");
                      }}
                      className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
                    <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <p className="mb-2 text-gray-600 dark:text-gray-400">
                      Upload course thumbnail
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                      id="thumbnail"
                    />
                    <Label htmlFor="thumbnail">
                      <Button
                        type="button"
                        variant="secondary"
                        className="cursor-pointer"
                      >
                        Choose File
                      </Button>
                    </Label>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter course title"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Course Description *</Label>
              <textarea
                id="description"
                {...register("description")}
                placeholder="Describe what this course is about..."
                rows={5}
                className={cn(
                  "w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600",
                  "bg-white text-gray-900 dark:bg-gray-700 dark:text-white",
                  "focus:ring-2 focus:ring-blue-500 focus:outline-none",
                  errors.description ? "border-red-500" : "",
                )}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Course Category *</Label>
              <Select
                id="category"
                value={formValues.category || ""}
                onValueChange={(value) =>
                  setValue("category", value as CourseCategory)
                }
                className={errors.category ? "border-red-500" : ""}
              >
                <option value="">Select a category</option>
                {Object.values(CourseCategory).map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </Select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="level">Difficulty Level *</Label>
              <Select
                id="level"
                value={formValues.level || ""}
                onValueChange={(value) =>
                  setValue("level", value as CourseLevel)
                }
                className={errors.level ? "border-red-500" : ""}
              >
                <option value="">Select difficulty level</option>
                {Object.values(CourseLevel).map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </Select>
              {errors.level && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.level.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="price">Course Price ($) *</Label>
              <div className="relative">
                <DollarSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                  className={cn("pl-10", errors.price ? "border-red-500" : "")}
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Set to $0 for a free course
              </p>
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="duration">Estimated Duration (hours) *</Label>
              <div className="relative">
                <Clock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  id="duration"
                  type="number"
                  min="0.5"
                  step="0.5"
                  {...register("duration", { valueAsNumber: true })}
                  placeholder="1.0"
                  className={cn(
                    "pl-10",
                    errors.duration ? "border-red-500" : "",
                  )}
                />
              </div>
              {errors.duration && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.duration.message}
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>Learning Outcomes *</Label>
              <p className="mb-4 text-sm text-gray-500">
                What will students be able to do after completing this course?
              </p>

              {(formValues.learningOutcomes || []).map((outcome, index) => (
                <div key={index} className="mb-3 flex items-center space-x-2">
                  <Input
                    value={outcome}
                    onChange={(e) => {
                      const outcomes = [...(formValues.learningOutcomes || [])];
                      outcomes[index] = e.target.value;
                      setValue("learningOutcomes", outcomes);
                    }}
                    placeholder={`Learning outcome ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => removeLearningOutcome(index)}
                    disabled={(formValues.learningOutcomes?.length || 0) <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="secondary"
                onClick={addLearningOutcome}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Learning Outcome</span>
              </Button>

              {errors.learningOutcomes && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.learningOutcomes.message}
                </p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label>Prerequisites (Optional)</Label>
              <p className="mb-4 text-sm text-gray-500">
                What should students know before taking this course?
              </p>

              {(formValues.prerequisites || []).map((prerequisite, index) => (
                <div key={index} className="mb-3 flex items-center space-x-2">
                  <Input
                    value={prerequisite}
                    onChange={(e) => {
                      const prerequisites = [
                        ...(formValues.prerequisites || []),
                      ];
                      prerequisites[index] = e.target.value;
                      setValue("prerequisites", prerequisites);
                    }}
                    placeholder={`Prerequisite ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => removePrerequisite(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="secondary"
                onClick={addPrerequisite}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Prerequisite</span>
              </Button>
            </div>

            <div>
              <Label>Tags (Optional)</Label>
              <p className="mb-4 text-sm text-gray-500">
                Add keywords to help students find your course
              </p>

              {(formValues.tags || []).map((tag, index) => (
                <div key={index} className="mb-3 flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Tag className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input
                      value={tag}
                      onChange={(e) => {
                        const tags = [...(formValues.tags || [])];
                        tags[index] = e.target.value;
                        setValue("tags", tags);
                      }}
                      placeholder={`Tag ${index + 1}`}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => removeTag(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="secondary"
                onClick={addTag}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Tag</span>
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Course Preview
              </h3>

              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700">
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="Course thumbnail"
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 w-full items-center justify-center bg-gray-200 dark:bg-gray-600">
                    <BookOpen className="h-16 w-16 text-gray-400" />
                  </div>
                )}

                <div className="p-6">
                  <div className="mb-3 flex items-start justify-between">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {formValues.title || "Course Title"}
                    </h4>
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {formValues.price === 0 ? "Free" : `$${formValues.price}`}
                    </span>
                  </div>

                  <p className="mb-4 text-gray-600 dark:text-gray-300">
                    {formValues.description ||
                      "Course description will appear here..."}
                  </p>

                  <div className="mb-4 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {formValues.duration || 0}h
                    </span>
                    <span className="capitalize">
                      {formValues.level || "Level"}
                    </span>
                    <span className="capitalize">
                      {formValues.category || "Category"}
                    </span>
                  </div>

                  {formValues.learningOutcomes &&
                    formValues.learningOutcomes.filter((lo) => lo.trim())
                      .length > 0 && (
                      <div className="mb-4">
                        <h5 className="mb-2 font-semibold text-gray-900 dark:text-white">
                          What you'll learn:
                        </h5>
                        <ul className="list-inside list-disc space-y-1">
                          {formValues.learningOutcomes
                            .filter((lo) => lo.trim())
                            .slice(0, 3)
                            .map((outcome, index) => (
                              <li
                                key={index}
                                className="text-sm text-gray-600 dark:text-gray-300"
                              >
                                {outcome}
                              </li>
                            ))}
                        </ul>
                        {formValues.learningOutcomes.filter((lo) => lo.trim())
                          .length > 3 && (
                          <p className="mt-1 text-sm text-gray-500">
                            +
                            {formValues.learningOutcomes.filter((lo) =>
                              lo.trim(),
                            ).length - 3}{" "}
                            more outcomes
                          </p>
                        )}
                      </div>
                    )}

                  {formValues.tags &&
                    formValues.tags.filter((t) => t.trim()).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formValues.tags
                          .filter((t) => t.trim())
                          .map((tag, index) => (
                            <span
                              key={index}
                              className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/courses"
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Courses
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create New Course
        </h1>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Steps Navigation */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold">Course Setup</h2>
            <nav className="space-y-4">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={cn(
                    "w-full rounded-md p-3 text-left transition-colors",
                    currentStep === step.id
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700",
                  )}
                >
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "mr-3 flex h-8 w-8 items-center justify-center rounded-full",
                        currentStep === step.id
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
                      )}
                    >
                      {step.id}
                    </div>
                    <div>
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Form */}
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
          >
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>

            <div className="mt-8 flex justify-between border-t pt-6">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handlePrevStep}
                  className="flex items-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
              ) : (
                <div></div>
              )}

              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="ml-auto"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={createCourseMutation.isLoading || !isValid}
                  className="ml-auto"
                >
                  {createCourseMutation.isLoading ? (
                    <LoadingSpinner className="mr-2" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Create Course
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;

```

<!-- path: app/(dashboard)/courses/[id]/page.tsx -->
```typescript
// app/(dashboard)/courses/[id]/page.tsx
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  Download,
  Share2,
  Heart,
  CheckCircle,
  Lock,
  ArrowLeft,
  DollarSign,
  Calendar,
  Award,
  Globe,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  useCourse,
  useEnrollmentStatus,
  useEnrollInCourse,
} from "@/hooks/useCourseQueries";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "react-hot-toast";

const CourseDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const courseId = params.id as string;

  const [activeTab, setActiveTab] = useState<
    "overview" | "curriculum" | "reviews"
  >("overview");
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const { data: course, isLoading, error } = useCourse(courseId);
  const { isEnrolled, enrollment } = useEnrollmentStatus(courseId);
  const enrollMutation = useEnrollInCourse();

  const handleEnroll = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    enrollMutation.mutate(courseId);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: course?.title,
        text: course?.description,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Course link copied to clipboard!");
    }
  };

  const formatDuration = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}min`;
    return `${Math.round(hours)}h`;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `$${price}`;
  };

  const getLevelColor = (level: string) => {
    const colors = {
      beginner:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      intermediate:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      expert:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    };
    return colors[level as keyof typeof colors] || colors.beginner;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Course not found
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/courses"
            className="mb-6 flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Course Info */}
            <div className="lg:col-span-2">
              {/* Course Header */}
              <div className="mb-6">
                <div className="mb-4 flex items-center space-x-3">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-sm font-semibold",
                      getLevelColor(course.level),
                    )}
                  >
                    {course.level.charAt(0).toUpperCase() +
                      course.level.slice(1)}
                  </span>
                  <span className="text-gray-600 capitalize dark:text-gray-400">
                    {course.category}
                  </span>
                </div>

                <h1 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl dark:text-white">
                  {course.title}
                </h1>

                <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    {course.enrollmentCount} students
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {formatDuration(course.duration)}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    {course.modules.length} modules
                  </div>
                  <div className="flex items-center">
                    <Star className="mr-2 h-4 w-4 fill-current text-yellow-500" />
                    {course.rating.toFixed(1)} ({course.reviewCount} reviews)
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Updated {new Date(course.updatedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Instructor */}
                <div className="mt-6 flex items-center rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">
                    {course.instructorName.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Course by
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {course.instructorName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "curriculum", label: "Curriculum" },
                    { id: "reviews", label: "Reviews" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "border-b-2 px-1 pb-4 text-sm font-medium transition-colors",
                        activeTab === tab.id
                          ? "border-blue-600 text-blue-600 dark:text-blue-400"
                          : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    {/* What You'll Learn */}
                    <div>
                      <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                        What you'll learn
                      </h3>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {course.learningOutcomes.map((outcome, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {outcome}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prerequisites */}
                    {course.prerequisites.length > 0 && (
                      <div>
                        <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                          Prerequisites
                        </h3>
                        <ul className="space-y-2">
                          {course.prerequisites.map((prerequisite, index) => (
                            <li key={index} className="flex items-start">
                              <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">
                                {prerequisite}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tags */}
                    {course.tags.length > 0 && (
                      <div>
                        <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {course.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "curriculum" && (
                  <div className="space-y-4">
                    <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                      Course Content
                    </h3>
                    <p className="mb-6 text-gray-600 dark:text-gray-400">
                      {course.modules.length} modules •{" "}
                      {course.modules.reduce(
                        (acc, module) => acc + module.lessons.length,
                        0,
                      )}{" "}
                      lessons • {formatDuration(course.duration)} total length
                    </p>

                    <div className="space-y-4">
                      {course.modules.map((module, moduleIndex) => (
                        <div
                          key={module.id}
                          className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          <button
                            onClick={() =>
                              setExpandedModule(
                                expandedModule === module.id ? null : module.id,
                              )
                            }
                            className="w-full bg-gray-50 px-6 py-4 text-left transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  Module {moduleIndex + 1}: {module.title}
                                </h4>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                  {module.lessons.length} lessons •{" "}
                                  {formatDuration(module.duration)}
                                </p>
                              </div>
                              <motion.div
                                animate={{
                                  rotate:
                                    expandedModule === module.id ? 180 : 0,
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                <svg
                                  className="h-5 w-5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </motion.div>
                            </div>
                          </button>

                          {expandedModule === module.id && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="bg-white px-6 py-4 dark:bg-gray-900">
                                <p className="mb-4 text-gray-600 dark:text-gray-400">
                                  {module.description}
                                </p>

                                <div className="space-y-3">
                                  {module.lessons.map((lesson, lessonIndex) => (
                                    <div
                                      key={lesson.id}
                                      className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
                                    >
                                      <div className="flex items-center">
                                        {isEnrolled ? (
                                          <Play className="mr-3 h-4 w-4 text-blue-600" />
                                        ) : (
                                          <Lock className="mr-3 h-4 w-4 text-gray-400" />
                                        )}
                                        <div>
                                          <p className="font-medium text-gray-900 dark:text-white">
                                            {lesson.title}
                                          </p>
                                          <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {lesson.type} •{" "}
                                            {formatDuration(lesson.duration)}
                                          </p>
                                        </div>
                                      </div>

                                      {isEnrolled && (
                                        <Link
                                          href={`/learn/${courseId}/${module.id}/${lesson.id}`}
                                        >
                                          <Button size="sm" variant="secondary">
                                            Start
                                          </Button>
                                        </Link>
                                      )}
                                    </div>
                                  ))}
                                </div>

                                {module.quiz && (
                                  <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <Award className="mr-3 h-4 w-4 text-blue-600" />
                                        <div>
                                          <p className="font-medium text-blue-900 dark:text-blue-300">
                                            Module Quiz: {module.quiz.title}
                                          </p>
                                          <p className="text-sm text-blue-700 dark:text-blue-400">
                                            {module.quiz.questions.length}{" "}
                                            questions • {module.quiz.timeLimit}{" "}
                                            minutes
                                          </p>
                                        </div>
                                      </div>

                                      {isEnrolled && (
                                        <Button
                                          size="sm"
                                          className="bg-blue-600 hover:bg-blue-700"
                                        >
                                          Take Quiz
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Student Reviews
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 fill-current text-yellow-500" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {course.rating.toFixed(1)}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          ({course.reviewCount} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Review placeholder */}
                    <div className="py-12 text-center">
                      <MessageCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Reviews will be displayed here
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Course Video/Image */}
                <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <div className="relative">
                    <img
                      src={course.thumbnail || "/placeholder-course.jpg"}
                      alt={course.title}
                      className="h-48 w-full object-cover"
                    />
                    <div className="bg-opacity-30 absolute inset-0 flex items-center justify-center bg-black">
                      <Play className="h-16 w-16 text-white" />
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Price */}
                    <div className="mb-6 text-center">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(course.price)}
                      </span>
                      {course.price > 0 && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          One-time payment
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {isEnrolled ? (
                        <>
                          <Link href={`/learn/${courseId}`} className="block">
                            <Button className="w-full" size="lg">
                              Continue Learning
                            </Button>
                          </Link>
                          {enrollment && (
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                              <div className="mb-2 flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Progress
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  {Math.round(enrollment.progress)}%
                                </span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-600">
                                <div
                                  className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                                  style={{ width: `${enrollment.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <Button
                          onClick={handleEnroll}
                          disabled={enrollMutation.isLoading}
                          className="w-full"
                          size="lg"
                        >
                          {enrollMutation.isLoading ? (
                            <>
                              <LoadingSpinner size="sm" className="mr-2" />
                              Enrolling...
                            </>
                          ) : course.price > 0 ? (
                            <>
                              <DollarSign className="mr-2 h-4 w-4" />
                              Buy Now
                            </>
                          ) : (
                            "Enroll Free"
                          )}
                        </Button>
                      )}

                      {/* Secondary Actions */}
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          onClick={handleShare}
                          className="flex flex-1 items-center justify-center"
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                        <Button
                          variant="secondary"
                          className="flex flex-1 items-center justify-center"
                        >
                          <Heart className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    </div>

                    {/* Course Includes */}
                    <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                      <h4 className="mb-4 font-semibold text-gray-900 dark:text-white">
                        This course includes:
                      </h4>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-center">
                          <Clock className="mr-3 h-4 w-4 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {formatDuration(course.duration)} on-demand video
                          </span>
                        </li>
                        <li className="flex items-center">
                          <BookOpen className="mr-3 h-4 w-4 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {course.modules.length} modules
                          </span>
                        </li>
                        <li className="flex items-center">
                          <Download className="mr-3 h-4 w-4 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Downloadable resources
                          </span>
                        </li>
                        <li className="flex items-center">
                          <Globe className="mr-3 h-4 w-4 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Full lifetime access
                          </span>
                        </li>
                        <li className="flex items-center">
                          <Award className="mr-3 h-4 w-4 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Certificate of completion
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Related Courses */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <h4 className="mb-4 font-semibold text-gray-900 dark:text-white">
                    More courses by {course.instructorName}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Related courses will be displayed here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;

```

<!-- path: app/(dashboard)/courses/page.tsx -->
```typescript
// app/(dashboard)/courses/page.tsx
"use client";

import CourseCard from "@/components/courses/CourseCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/hooks/useAuth";
import { useCourses, useSearchCourses } from "@/hooks/useCourseQueries";
import { cn } from "@/lib/utils"; // Assuming cn is used for class name utility
import { useCourseActions, useCourseFilters } from "@/stores/courseStore";
import { CourseCategory, CourseLevel } from "@/types/course";
import { motion } from "framer-motion";
import { Grid, List, Plus, Search } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

const ITEMS_PER_PAGE = 12;

const CoursesPage = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "popular" | "rating"
  >("newest");

  const filters = useCourseFilters();
  const { setCourseFilters, clearCourseFilters } = useCourseActions();

  // Main courses query
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
  } = useCourses(filters, currentPage, ITEMS_PER_PAGE);

  // Search query
  const { data: searchResults, isLoading: searchLoading } =
    useSearchCourses(searchQuery);

  // Determine which data to show
  const isSearching = searchQuery.length >= 2;
  const courses = useMemo(() => {
    return isSearching ? searchResults || [] : coursesData?.data || [];
  }, [isSearching, searchResults, coursesData?.data]);

  const isLoading = isSearching ? searchLoading : coursesLoading;
  const totalPages = isSearching
    ? 1
    : Math.ceil((coursesData?.total || 0) / ITEMS_PER_PAGE);

  // Sort courses
  const sortedCourses = useMemo(() => {
    if (!courses) return [];

    const sorted = [...courses];
    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      case "popular":
        return sorted.sort((a, b) => b.enrollmentCount - a.enrollmentCount);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  }, [courses, sortBy]);

  const handleFilterChange = (key: string, value: any) => {
    setCourseFilters({ [key]: value });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    clearCourseFilters();
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const canCreateCourse =
    user?.role === "teacher" ||
    user?.role === "admin" ||
    user?.role === "super-admin";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {isSearching ? "Search Results" : "All Courses"}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {isSearching
                  ? `Found ${courses.length} course${courses.length !== 1 ? "s" : ""} for "${searchQuery}"`
                  : `Discover ${coursesData?.total || 0} courses to advance your skills`}
              </p>
            </div>

            {canCreateCourse && (
              <Link href="/courses/create">
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Course</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pr-4 pl-10"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="min-w-0 flex-shrink-0">
              <Select
                value={filters.category || ""}
                onValueChange={(value) =>
                  handleFilterChange("category", value || undefined)
                }
              >
                <option value="">All Categories</option>
                {Object.values(CourseCategory).map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </Select>
            </div>

            {/* Level Filter */}
            <div className="min-w-0 flex-shrink-0">
              <Select
                value={filters.level || ""}
                onValueChange={(value) =>
                  handleFilterChange("level", value || undefined)
                }
              >
                <option value="">All Levels</option>
                {Object.values(CourseLevel).map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </Select>
            </div>

            {/* Price Filter */}
            <div className="min-w-0 flex-shrink-0">
              <Select
                value={
                  filters.priceRange
                    ? `${filters.priceRange[0]}-${filters.priceRange[1]}`
                    : ""
                }
                onValueChange={(value) => {
                  if (value === "free") {
                    handleFilterChange("priceRange", [0, 0]);
                  } else if (value === "paid") {
                    handleFilterChange("priceRange", [1, 1000]);
                  } else {
                    handleFilterChange("priceRange", undefined);
                  }
                }}
              >
                <option value="">All Prices</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </Select>
            </div>

            {/* Sort By */}
            <div className="min-w-0 flex-shrink-0">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as any)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </Select>
            </div>

            <div className="ml-auto flex items-center space-x-2">
              {/* View Mode Toggle */}
              <div className="flex items-center rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "rounded-md p-2 transition-colors",
                    viewMode === "grid"
                      ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
                  )}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "rounded-md p-2 transition-colors",
                    viewMode === "list"
                      ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Clear Filters */}
              {(Object.keys(filters).length > 0 || searchQuery) && (
                <Button
                  variant="secondary"
                  onClick={handleClearFilters}
                  className="text-sm"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Error State */}
        {coursesError && !isLoading && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
            <p className="text-red-600 dark:text-red-400">
              Failed to load courses. Please try again.
            </p>
            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && courses.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              {isSearching ? "No courses found" : "No courses available"}
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              {isSearching
                ? `Try adjusting your search terms or filters`
                : "Check back later for new courses"}
            </p>
            {isSearching && (
              <Button onClick={handleClearFilters}>
                Clear Search and Filters
              </Button>
            )}
          </div>
        )}

        {/* Courses Grid/List */}
        {!isLoading && courses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className={cn(
                "mb-8 grid gap-6",
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1",
              )}
            >
              {sortedCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <CourseCard
                    course={course}
                    variant={viewMode === "list" ? "compact" : "default"}
                  />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {!isSearching && totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 2,
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="text-gray-400">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "secondary"}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  ))}

                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;

```

<!-- path: app/(dashboard)/dashboard/page.tsx -->
```typescript
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  DashboardData,
  DashboardStats,
  Enrollment,
  User,
} from "@/types/dashboard";
import MyEnrollments from "@/components/dashboard/MyEnrollments";
import RecentCourses from "@/components/dashboard/RecentCourses";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import StatsCard from "@/components/dashboard/StatsCard";
import {
  generateMockDashboardData,
  getRoleBasedWelcomeMessage,
} from "@/components/dashboard/Helper";

export default function DashboardPage() {
  const { user, isLoading: loading } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      setIsLoading(true);

      // Mock data - replace with actual API calls
      setTimeout(() => {
        const mockData = {
          ...generateMockDashboardData(user?.role || "student"), // This already includes recentCourses, recentActivity, enrollments, and stats
          user: user as unknown as User, // Add the user object to the mock data
          analytics: {}, // Add dummy analytics data (ensure it matches Analytics interface)
          notifications: [], // Add dummy notifications array
          mockData: {}, // Add dummy mockData to satisfy the interface
        } as unknown as DashboardData;
        setDashboardData(mockData);
        setIsLoading(false);
      }, 1000);
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading || isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || !dashboardData) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        Failed to load dashboard data
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white"
      >
        <h1 className="mb-2 text-3xl font-bold">
          Welcome back, {user.displayName}!
        </h1>
        <p className="text-blue-100">{getRoleBasedWelcomeMessage(user.role)}</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {dashboardData.stats.map((stat: DashboardStats, index: number) => (
          <StatsCard key={stat.title} stat={stat} index={index} />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2" // This line is already present in the original code, no change needed.
        >
          <RecentActivity
            activities={dashboardData.recentActivity}
            userRole={user.role}
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <QuickActions userRole={user.role} />
        </motion.div>
      </div>

      {/* Role-specific content */}
      {user.role !== "student" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <RecentCourses
            courses={dashboardData.recentCourses}
            userRole={user.role}
          />
        </motion.div>
      )}

      {user.role === "student" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MyEnrollments
            enrollments={dashboardData.recentEnrollments as Enrollment[]}
          />
        </motion.div>
      )}
    </div>
  );
}

```

<!-- path: app/(dashboard)/layout.tsx -->
```typescript
// app/(dashboard)/layout.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  Plus,
  ChevronDown,
  User,
  LogOut,
  Moon,
  Sun,
  GraduationCap,
  Calendar,
  MessageSquare,
  Award,
  FileText,
  Shield,
  Database,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { UserMenu } from "@/components/auth/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  badge?: string;
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["student", "teacher", "admin", "super-admin"],
  },
  {
    name: "Courses",
    href: "/courses",
    icon: BookOpen,
    roles: ["student", "teacher", "admin", "super-admin"],
    children: [
      {
        name: "Browse Courses",
        href: "/courses",
        icon: Search,
        roles: ["student", "teacher", "admin", "super-admin"],
      },
      {
        name: "My Courses",
        href: "/courses/enrolled",
        icon: GraduationCap,
        roles: ["student", "teacher", "admin", "super-admin"],
      },
      {
        name: "Create Course",
        href: "/courses/create",
        icon: Plus,
        roles: ["teacher", "admin", "super-admin"],
      },
      {
        name: "Manage Courses",
        href: "/courses/manage",
        icon: Settings,
        roles: ["teacher", "admin", "super-admin"],
      },
    ],
  },
  {
    name: "Learning",
    href: "/learn",
    icon: GraduationCap,
    roles: ["student"],
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: Calendar,
    roles: ["student", "teacher", "admin", "super-admin"],
  },
  {
    name: "Messages",
    href: "/messages",
    icon: MessageSquare,
    roles: ["student", "teacher", "admin", "super-admin"],
    badge: "3",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    roles: ["teacher", "admin", "super-admin"],
    children: [
      {
        name: "Course Analytics",
        href: "/analytics/courses",
        icon: BookOpen,
        roles: ["teacher", "admin", "super-admin"],
      },
      {
        name: "Student Performance",
        href: "/analytics/students",
        icon: Users,
        roles: ["teacher", "admin", "super-admin"],
      },
      {
        name: "Revenue Reports",
        href: "/analytics/revenue",
        icon: BarChart3,
        roles: ["admin", "super-admin"],
      },
    ],
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
    roles: ["admin", "super-admin"],
    children: [
      {
        name: "All Users",
        href: "/users",
        icon: Users,
        roles: ["admin", "super-admin"],
      },
      {
        name: "Students",
        href: "/users/students",
        icon: GraduationCap,
        roles: ["admin", "super-admin"],
      },
      {
        name: "Teachers",
        href: "/users/teachers",
        icon: Award,
        roles: ["admin", "super-admin"],
      },
      {
        name: "Administrators",
        href: "/users/admins",
        icon: Shield,
        roles: ["super-admin"],
      },
    ],
  },
  {
    name: "Certificates",
    href: "/certificates",
    icon: Award,
    roles: ["student", "teacher", "admin", "super-admin"],
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
    roles: ["admin", "super-admin"],
  },
  {
    name: "System",
    href: "/system",
    icon: Database,
    roles: ["super-admin"],
    children: [
      {
        name: "Settings",
        href: "/system/settings",
        icon: Settings,
        roles: ["super-admin"],
      },
      {
        name: "Logs",
        href: "/system/logs",
        icon: FileText,
        roles: ["super-admin"],
      },
      {
        name: "Performance",
        href: "/system/performance",
        icon: Zap,
        roles: ["super-admin"],
      },
    ],
  },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(3);

  // Auto-expand navigation items based on current path
  useEffect(() => {
    const currentItem = navigation.find((item) =>
      item.children?.some((child) => pathname.startsWith(child.href)),
    );
    if (currentItem) {
      setExpandedItems((prev) =>
        prev.includes(currentItem.name) ? prev : [...prev, currentItem.name],
      );
    }
  }, [pathname]);

  const toggleExpand = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName],
    );
  };

  const filteredNavigation = navigation.filter(
    (item) => user?.role && item.roles.includes(user.role),
  );

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4 dark:border-gray-700">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
            <span className="text-sm font-bold text-white">E</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Examly
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
        {filteredNavigation.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedItems.includes(item.name);
          const isItemActive = isActive(item.href);
          const filteredChildren = item.children?.filter(
            (child) => user?.role && child.roles.includes(user.role),
          );

          return (
            <div key={item.name}>
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(item.name)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors",
                    isItemActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                    {item.badge && (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors",
                    isItemActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                  {item.badge && (
                    <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}

              {/* Submenu */}
              <AnimatePresence>
                {hasChildren && isExpanded && filteredChildren && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 ml-8 space-y-1 overflow-hidden"
                  >
                    {filteredChildren.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          isActive(child.href)
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700",
                        )}
                      >
                        <child.icon className="h-4 w-4" />
                        <span>{child.name}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <UserMenu />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-grow flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white lg:hidden dark:border-gray-700 dark:bg-gray-800"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:ml-64">
        {/* Top Navigation */}
        <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search Bar */}
            <div className="mx-4 max-w-2xl flex-1">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search courses, users, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-4 pl-10"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Quick Actions */}
              {(user?.role === "teacher" ||
                user?.role === "admin" ||
                user?.role === "super-admin") && (
                <Link href="/courses/create">
                  <Button size="sm" className="hidden sm:flex">
                    <Plus className="mr-2 h-4 w-4" />
                    Create
                  </Button>
                </Link>
              )}

              {/* Notifications */}
              <div className="relative">
                <button className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {notifications}
                    </span>
                  )}
                </button>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* User Profile - Mobile */}
              <div className="lg:hidden">
                <UserMenu />
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

```

<!-- path: app/profile/page.tsx -->
```typescript
// app/profile/page.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, Edit, Save, X } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { useAuthMutations } from "@/hooks/useAuthMutations";
import {
  updateProfileSchema,
  UpdateProfileFormData,
} from "@/lib/validations/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const { updateProfile } = useAuthMutations();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.profile?.firstName || "",
      lastName: user?.profile?.lastName || "",
      phone: user?.profile?.phone || "",
      bio: user?.profile?.bio || "",
    },
  });

  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      await updateProfile.mutateAsync({
        profile: {
          ...user?.profile,
          ...data,
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <AuthGuard>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Profile Settings
              </h1>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={!isDirty || updateProfile.isPending}
                    size="sm"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Profile Picture */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-4xl font-bold text-white">
                    {user?.displayName
                      ? user.displayName[0].toUpperCase()
                      : user?.email?.[0].toUpperCase()}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {user?.displayName || user?.email}
                  </h2>
                  <p className="text-sm text-gray-500 capitalize dark:text-gray-400">
                    {user?.role}
                  </p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="mt-2">
                        {isEditing ? (
                          <Input
                            id="firstName"
                            {...register("firstName")}
                            className={errors.firstName ? "border-red-500" : ""}
                          />
                        ) : (
                          <p className="py-2 text-gray-900 dark:text-white">
                            {user?.profile?.firstName || "Not provided"}
                          </p>
                        )}
                      </div>
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="mt-2">
                        {isEditing ? (
                          <Input
                            id="lastName"
                            {...register("lastName")}
                            className={errors.lastName ? "border-red-500" : ""}
                          />
                        ) : (
                          <p className="py-2 text-gray-900 dark:text-white">
                            {user?.profile?.lastName || "Not provided"}
                          </p>
                        )}
                      </div>
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="mt-2 flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <p className="text-gray-900 dark:text-white">
                        {user?.email}
                      </p>
                      {user?.emailVerified ? (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          Verified
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          Unverified
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="mt-2">
                      {isEditing ? (
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          {...register("phone")}
                          className={errors.phone ? "border-red-500" : ""}
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <p className="text-gray-900 dark:text-white">
                            {user?.profile?.phone || "Not provided"}
                          </p>
                        </div>
                      )}
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <div className="mt-2">
                      {isEditing ? (
                        <textarea
                          id="bio"
                          rows={4}
                          placeholder="Tell us about yourself..."
                          className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:ring-offset-gray-900 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
                          {...register("bio")}
                        />
                      ) : (
                        <p className="py-2 text-gray-900 dark:text-white">
                          {user?.profile?.bio || "No bio provided"}
                        </p>
                      )}
                    </div>
                    {errors.bio && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.bio.message}
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-6 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Account Information
            </h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label>Account Created</Label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
              <div>
                <Label>Last Updated</Label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {user?.updatedAt
                    ? new Date(user.updatedAt).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
              <div>
                <Label>Account ID</Label>
                <p className="mt-1 font-mono text-sm text-gray-900 dark:text-white">
                  {user?.uid}
                </p>
              </div>
              <div>
                <Label>Role</Label>
                <p className="mt-1 text-gray-900 capitalize dark:text-white">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

```

<!-- path: app/error.tsx -->
```typescript
"use client";

import Error from "@/components/Error";
import React from "react";

const ErrorPage = () => {
  return (
    <div>
      <Error />
    </div>
  );
};

export default ErrorPage;

```

<!-- path: app/page.tsx -->
```typescript
"use client";

import CTA from "@/components/home/CTA";
import Features from "@/components/home/Features";
import GettingStarted from "@/components/home/GettingStarted";
import Hero from "@/components/home/Hero";
import Pricing from "@/components/home/Pricing";

const ExamlyLanding = () => {
  return (
    <div className="min-h-screen overflow-hidden text-gray-900 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 dark:text-white">
      {/* Hero Section */}
      <Hero />
      {/* Features Section */}
      <Features />

      {/* Pricing Section */}
      <Pricing />

      {/* Getting Started Section */}
      <GettingStarted />

      {/* CTA Section */}
      <CTA />
    </div>
  );
};

export default ExamlyLanding;

```

<!-- path: app/layout.tsx -->
```typescript
import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/provider/ThemeProvider";
import Footer from "@/components/navigation/Footer";
import { fontSans } from "@/config/fonts";
import { fontMono } from "@/config/fonts";
import { cn } from "@/lib/utils";
import QueryClientProviderWrapper from "@/provider/QueryClientProviderWrapper";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Examly App",
  description:
    "Your personal exam coach—generating quizzes, analyzing mistakes, and optimizing study time for peak performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Minimal inline script to prevent flash - only sets classes */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem("theme-storage") || "system";
                const dark = theme === "dark" || (theme === "system" && matchMedia("(prefers-color-scheme:dark)").matches);
                if (dark) document.documentElement.classList.add("dark");
              } catch(e) {
                if (matchMedia("(prefers-color-scheme:dark)").matches) document.documentElement.classList.add("dark");
              }
            `,
          }}
        />
      </head>
      <body className={cn("antialiased", fontSans.variable, fontMono.variable)}>
        {/* No script - let React handle everything */}
        <ThemeProvider>
          <QueryClientProviderWrapper>
            <Navbar />
            {children}
            <Footer />
          </QueryClientProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}

```

<!-- path: app/not-found.tsx -->
```typescript
"use client";

import NotFound from "@/components/NotFound";
import React from "react";

const NotFoundPage = () => {
  return (
    <>
      <NotFound />
    </>
  );
};

export default NotFoundPage;

```

<!-- path: app/unauthorized/page.tsx -->
```typescript
// app/unauthorized/page.tsx
"use client";

import { motion } from "framer-motion";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20"
        >
          <Shield className="h-10 w-10 text-red-600 dark:text-red-400" />
        </motion.div>

        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
          Access Denied
        </h1>

        <p className="mb-8 text-gray-600 dark:text-gray-400">
          You don&apos;t have permission to access this page. Please contact
          your administrator if you believe this is an error.
        </p>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

```

<!-- path: config/fonts.ts -->
```typescript
import { Geist, Geist_Mono } from "next/font/google";

export const fontSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const fontMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

```

<!-- path: config/navigation.ts -->
```typescript
import { UserRole } from "@/types/auth";
import { NavigationItem } from "@/types/dashboard";

export const navigationConfig: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    roles: ["super-admin", "admin", "teacher", "student"],
  },
  {
    id: "courses",
    label: "Courses",
    href: "/dashboard/courses",
    icon: "BookOpen",
    roles: ["super-admin", "admin", "teacher", "student"],
    children: [
      {
        id: "my-courses",
        label: "My Courses",
        href: "/dashboard/courses/my-courses",
        icon: "Book",
        roles: ["teacher", "student"],
      },
      {
        id: "all-courses",
        label: "All Courses",
        href: "/dashboard/courses/all",
        icon: "Library",
        roles: ["super-admin", "admin"],
      },
      {
        id: "create-course",
        label: "Create Course",
        href: "/dashboard/courses/create",
        icon: "Plus",
        roles: ["super-admin", "admin", "teacher"],
      },
      {
        id: "browse-courses",
        label: "Browse Courses",
        href: "/dashboard/courses/browse",
        icon: "Search",
        roles: ["student"],
      },
    ],
  },
  {
    id: "assessments",
    label: "Assessments",
    href: "/dashboard/assessments",
    icon: "ClipboardCheck",
    roles: ["super-admin", "admin", "teacher", "student"],
    children: [
      {
        id: "my-assessments",
        label: "My Assessments",
        href: "/dashboard/assessments/my-assessments",
        icon: "FileCheck",
        roles: ["teacher", "student"],
      },
      {
        id: "create-assessment",
        label: "Create Assessment",
        href: "/dashboard/assessments/create",
        icon: "Plus",
        roles: ["super-admin", "admin", "teacher"],
      },
      {
        id: "grade-submissions",
        label: "Grade Submissions",
        href: "/dashboard/assessments/grading",
        icon: "GraduationCap",
        roles: ["super-admin", "admin", "teacher"],
      },
    ],
  },
  {
    id: "students",
    label: "Students",
    href: "/dashboard/students",
    icon: "Users",
    roles: ["super-admin", "admin", "teacher"],
    children: [
      {
        id: "all-students",
        label: "All Students",
        href: "/dashboard/students/all",
        icon: "UserCheck",
        roles: ["super-admin", "admin"],
      },
      {
        id: "my-students",
        label: "My Students",
        href: "/dashboard/students/my-students",
        icon: "UserCheck",
        roles: ["teacher"],
      },
      {
        id: "student-progress",
        label: "Progress Tracking",
        href: "/dashboard/students/progress",
        icon: "TrendingUp",
        roles: ["super-admin", "admin", "teacher"],
      },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: "BarChart3",
    roles: ["super-admin", "admin", "teacher"],
    children: [
      {
        id: "course-analytics",
        label: "Course Analytics",
        href: "/dashboard/analytics/courses",
        icon: "LineChart",
        roles: ["super-admin", "admin", "teacher"],
      },
      {
        id: "student-analytics",
        label: "Student Analytics",
        href: "/dashboard/analytics/students",
        icon: "Users",
        roles: ["super-admin", "admin", "teacher"],
      },
      {
        id: "performance-analytics",
        label: "Performance",
        href: "/dashboard/analytics/performance",
        icon: "Activity",
        roles: ["super-admin", "admin"],
      },
    ],
  },
  {
    id: "users",
    label: "User Management",
    href: "/dashboard/users",
    icon: "UserCog",
    roles: ["super-admin", "admin"],
    children: [
      {
        id: "all-users",
        label: "All Users",
        href: "/dashboard/users/all",
        icon: "Users",
        roles: ["super-admin", "admin"],
      },
      {
        id: "teachers",
        label: "Teachers",
        href: "/dashboard/users/teachers",
        icon: "GraduationCap",
        roles: ["super-admin", "admin"],
      },
      {
        id: "admins",
        label: "Administrators",
        href: "/dashboard/users/admins",
        icon: "Shield",
        roles: ["super-admin"],
      },
      {
        id: "invite-users",
        label: "Invite Users",
        href: "/dashboard/users/invite",
        icon: "UserPlus",
        roles: ["super-admin", "admin"],
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    href: "/dashboard/settings",
    icon: "Settings",
    roles: ["super-admin", "admin", "teacher", "student"],
    children: [
      {
        id: "profile-settings",
        label: "Profile",
        href: "/dashboard/settings/profile",
        icon: "User",
        roles: ["super-admin", "admin", "teacher", "student"],
      },
      {
        id: "notification-settings",
        label: "Notifications",
        href: "/dashboard/settings/notifications",
        icon: "Bell",
        roles: ["super-admin", "admin", "teacher", "student"],
      },
      {
        id: "system-settings",
        label: "System",
        href: "/dashboard/settings/system",
        icon: "Cog",
        roles: ["super-admin", "admin"],
      },
      {
        id: "security-settings",
        label: "Security",
        href: "/dashboard/settings/security",
        icon: "Lock",
        roles: ["super-admin", "admin"],
      },
    ],
  },
];

export const getNavigationForRole = (role: UserRole): NavigationItem[] => {
  return navigationConfig
    .filter((item) => item.roles.includes(role))
    .map((item) => ({
      ...item,
      children: item.children?.filter((child) => child.roles.includes(role)),
    }));
};

export const breadcrumbConfig = {
  "/dashboard": "Dashboard",
  "/dashboard/courses": "Courses",
  "/dashboard/courses/my-courses": "My Courses",
  "/dashboard/courses/all": "All Courses",
  "/dashboard/courses/create": "Create Course",
  "/dashboard/courses/browse": "Browse Courses",
  "/dashboard/assessments": "Assessments",
  "/dashboard/assessments/my-assessments": "My Assessments",
  "/dashboard/assessments/create": "Create Assessment",
  "/dashboard/assessments/grading": "Grade Submissions",
  "/dashboard/students": "Students",
  "/dashboard/students/all": "All Students",
  "/dashboard/students/my-students": "My Students",
  "/dashboard/students/progress": "Progress Tracking",
  "/dashboard/analytics": "Analytics",
  "/dashboard/analytics/courses": "Course Analytics",
  "/dashboard/analytics/students": "Student Analytics",
  "/dashboard/analytics/performance": "Performance Analytics",
  "/dashboard/users": "User Management",
  "/dashboard/users/all": "All Users",
  "/dashboard/users/teachers": "Teachers",
  "/dashboard/users/admins": "Administrators",
  "/dashboard/users/invite": "Invite Users",
  "/dashboard/settings": "Settings",
  "/dashboard/settings/profile": "Profile Settings",
  "/dashboard/settings/notifications": "Notification Settings",
  "/dashboard/settings/system": "System Settings",
  "/dashboard/settings/security": "Security Settings",
};

```

<!-- path: types/auth.ts -->
```typescript
// types/auth.ts
// import { User } from "firebase/auth";

export type UserRole = "student" | "teacher" | "admin" | "super-admin";

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

```

<!-- path: types/course.ts -->
```typescript
// types/course.ts
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  instructorId: string;
  instructorName: string;
  category: CourseCategory;
  level: CourseLevel;
  duration: number; // in hours
  price: number;
  status: CourseStatus;
  isPublished: boolean;
  enrollmentCount: number;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  modules: CourseModule[];
  prerequisites: string[];
  learningOutcomes: string[];
  tags: string[];
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  isRequired: boolean;
  lessons: Lesson[];
  quiz?: Quiz;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  type: LessonType;
  videoUrl?: string;
  attachments: Attachment[];
  order: number;
  duration: number;
  isCompleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  passingScore: number;
  maxAttempts: number;
  questions: Question[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  quizId: string;
  question: string;
  type: QuestionType;
  options: QuestionOption[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  order: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completedAt?: Date;
  progress: number;
  status: EnrollmentStatus;
  grade?: number;
  certificateUrl?: string;
}

export interface Progress {
  id: string;
  userId: string;
  courseId: string;
  moduleId?: string;
  lessonId?: string;
  completed: boolean;
  timeSpent: number;
  lastAccessed: Date;
  score?: number;
}

// Enums
export enum CourseCategory {
  TECHNOLOGY = "technology",
  BUSINESS = "business",
  DESIGN = "design",
  MARKETING = "marketing",
  HEALTH = "health",
  LANGUAGE = "language",
  SCIENCE = "science",
  ARTS = "arts",
}

export enum CourseLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  EXPERT = "expert",
}

export enum CourseStatus {
  DRAFT = "draft",
  REVIEW = "review",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export enum LessonType {
  VIDEO = "video",
  TEXT = "text",
  INTERACTIVE = "interactive",
  ASSIGNMENT = "assignment",
  DISCUSSION = "discussion",
}

export enum QuestionType {
  MULTIPLE_CHOICE = "multiple_choice",
  TRUE_FALSE = "true_false",
  SHORT_ANSWER = "short_answer",
  ESSAY = "essay",
  FILL_BLANK = "fill_blank",
}

export enum EnrollmentStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  DROPPED = "dropped",
  SUSPENDED = "suspended",
}

// API Request/Response types
export interface CreateCourseRequest {
  title: string;
  description: string;
  category: CourseCategory;
  level: CourseLevel;
  price: number;
  prerequisites?: string[];
  learningOutcomes: string[];
  tags?: string[];
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  id: string;
}

export interface CourseFilters {
  // Filter properties
  category?: CourseCategory;
  level?: CourseLevel;
  priceRange?: [number, number];
  rating?: number;
  search?: string;
  instructorId?: string;
  tags?: string[];
  
  // Pagination properties
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

```

<!-- path: types/dashboard.ts -->
```typescript
import { UserRole } from "./auth";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  lastLoginAt?: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  instructorId: string;
  instructorName: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // in minutes
  studentsCount: number;
  lessonsCount: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  price?: number;
  rating?: number;
  reviewsCount?: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  duration: number; // in minutes
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: "pdf" | "image" | "video" | "document";
  size: number;
}

export interface Assessment {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  description: string;
  type: "quiz" | "assignment" | "exam";
  questions: Question[];
  timeLimit?: number; // in minutes
  maxAttempts: number;
  passingScore: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  type: "multiple-choice" | "true-false" | "short-answer" | "essay";
  question: string;
  options?: string[]; // for multiple-choice
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  order: number;
}

export interface Enrollment extends Course {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completedAt?: Date;
  progress: number; // percentage 0-100
  lastAccessedAt?: Date;
  status: "active" | "completed" | "paused" | "dropped";
}

export interface StudentProgress {
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: Date;
  timeSpent: number; // in minutes
  score?: number;
}

export interface AssessmentSubmission {
  id: string;
  assessmentId: string;
  userId: string;
  answers: Record<string, unknown>;
  score: number;
  maxScore: number;
  submittedAt: Date;
  gradedAt?: Date;
  feedback?: string;
  attempt: number;
}

export interface Analytics {
  totalCourses: number;
  totalStudents: number;
  totalEnrollments: number;
  averageCompletionRate: number;
  totalRevenue?: number;
  monthlyActiveUsers: number;
  courseCompletions: number;
}

export interface RecentActivity {
  id: string;
  type: "course" | "assessment" | "student";
  title: string;
  description: string;
  time: string;
}

export interface DashboardData {
  user: User;
  analytics: Analytics;
  recentCourses: Course[];
  recentEnrollments?: Enrollment[];
  recentSubmissions?: AssessmentSubmission[];
  notifications: Notification[];
  recentActivity: RecentActivity[];
  stats: DashboardStats[];
  mockData: Record<string, unknown>;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavigationItem[];
  roles: UserRole[];
}

export interface DashboardStats {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon: string;
  color: string;
}

```

<!-- path: middleware.ts -->
```typescript
// // middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Protected routes that require authentication
//   const protectedRoutes = [
//     "/dashboard",
//     "/profile",
//     "/settings",
//     "/exams",
//     "/students",
//     "/analytics",
//   ];

//   // Admin-only routes
//   const adminRoutes = ["/admin", "/users", "/system"];

//   // Teacher-only routes
//   const teacherRoutes = ["/students", "/analytics", "/create-exam"];

//   // Check if the current path is protected
//   const isProtectedRoute = protectedRoutes.some((route) =>
//     pathname.startsWith(route),
//   );

//   const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

//   const isTeacherRoute = teacherRoutes.some((route) =>
//     pathname.startsWith(route),
//   );

//   // Redirect to auth page for protected routes
//   if (isProtectedRoute) {
//     // This will be handled by AuthGuard on the client side
//     // Middleware just ensures the route exists
//     return NextResponse.next();
//   }

//   // Redirect authenticated users away from auth page
//   if (pathname.startsWith("/auth")) {
//     // This will be handled by the auth page component
//     return NextResponse.next();
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };

// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

interface UserPayload {
  id: string;
  email: string;
  role: "student" | "teacher" | "admin" | "super-admin";
  name: string;
}

// Protected route patterns
const protectedRoutes = {
  // Authentication required for all dashboard routes
  dashboard: /^\/dashboard/,
  profile: /^\/profile/,

  // Course management routes
  courses: {
    create: /^\/courses\/create/,
    edit: /^\/courses\/[^\/]+\/edit/,
    manage: /^\/courses\/manage/,
  },

  // Learning routes
  learn: /^\/learn/,

  // Admin routes
  admin: /^\/admin/,

  // API routes
  api: {
    protected: /^\/api\/(?!auth\/)/,
    admin: /^\/api\/admin/,
    courses: /^\/api\/courses/,
  },
};

// Role-based permissions
const rolePermissions = {
  "super-admin": ["*"], // Full access
  admin: [
    "dashboard",
    "profile",
    "courses.view",
    "courses.create",
    "courses.edit",
    "courses.delete",
    "courses.manage",
    "learn",
    "admin.users",
    "admin.courses",
    "admin.analytics",
    "api.protected",
    "api.admin",
  ],
  teacher: [
    "dashboard",
    "profile",
    "courses.view",
    "courses.create",
    "courses.edit",
    "courses.manage",
    "learn",
    "api.protected",
    "api.courses",
  ],
  student: ["dashboard", "profile", "courses.view", "learn", "api.protected"],
};

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/unauthorized",
  "/courses", // Course browsing is public
  /^\/courses\/[^\/]+$/, // Individual course pages are public
  /^\/api\/auth\//,
  /^\/api\/courses\/[^\/]+$/, // Public course details API
];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => {
    if (typeof route === "string") {
      return pathname === route;
    }
    return route.test(pathname);
  });
}

function hasPermission(
  userRole: string,
  requiredPermissions: string[],
): boolean {
  const userPermissions =
    rolePermissions[userRole as keyof typeof rolePermissions] || [];

  // Super admin has access to everything
  if (userPermissions.includes("*")) {
    return true;
  }

  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission),
  );
}

function getRequiredPermissions(pathname: string): string[] {
  // Dashboard routes
  if (protectedRoutes.dashboard.test(pathname)) {
    return ["dashboard"];
  }

  // Profile routes
  if (protectedRoutes.profile.test(pathname)) {
    return ["profile"];
  }

  // Course creation/management routes
  if (protectedRoutes.courses.create.test(pathname)) {
    return ["courses.create"];
  }

  if (protectedRoutes.courses.edit.test(pathname)) {
    return ["courses.edit"];
  }

  if (protectedRoutes.courses.manage.test(pathname)) {
    return ["courses.manage"];
  }

  // Learning routes
  if (protectedRoutes.learn.test(pathname)) {
    return ["learn"];
  }

  // Admin routes
  if (protectedRoutes.admin.test(pathname)) {
    return ["admin.users", "admin.courses", "admin.analytics"];
  }

  // API routes
  if (protectedRoutes.api.admin.test(pathname)) {
    return ["api.admin"];
  }

  if (protectedRoutes.api.courses.test(pathname)) {
    return ["api.courses"];
  }

  if (protectedRoutes.api.protected.test(pathname)) {
    return ["api.protected"];
  }

  return [];
}

async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key",
    );
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as UserPayload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and internal Next.js routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth/callback") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Get token from cookies or authorization header
  const token =
    request.cookies.get("auth-token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    // Redirect to login for protected routes
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token
  const user = await verifyToken(token);
  if (!user) {
    // Invalid token - clear cookie and redirect
    const response = pathname.startsWith("/api/")
      ? NextResponse.json({ error: "Invalid token" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", request.url));

    response.cookies.delete("auth-token");
    return response;
  }

  // Check role-based permissions
  const requiredPermissions = getRequiredPermissions(pathname);

  if (
    requiredPermissions.length > 0 &&
    !hasPermission(user.role, requiredPermissions)
  ) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Add user information to request headers for downstream use
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", user.id);
  requestHeaders.set("x-user-email", user.email);
  requestHeaders.set("x-user-role", user.role);
  requestHeaders.set("x-user-name", user.name);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

```

<!-- path: components/Error.tsx -->
```typescript
// components/Error.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/Button";

interface ErrorProps {
  code?: number;
  message?: string;
}

const defaultMessages: Record<number, string> = {
  403: "You don't have permission to access this page.",
  404: "The page you're looking for might have been moved or doesn't exist.",
  500: "Something went wrong on our end. Please try again later.",
};

const Error: React.FC<ErrorProps> = ({ code, message }) => {
  const errorCode = code ?? 404;
  const errorMessage =
    message ?? defaultMessages[errorCode] ?? "An unexpected error occurred.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 px-4 py-12 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-2xl rounded-2xl border border-white/40 bg-white/30 p-8 text-center shadow-xl backdrop-blur-md sm:p-12 dark:border-white/10 dark:bg-white/5"
      >
        {/* Animated Error Code */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-[6rem] font-extrabold text-indigo-300 sm:text-[8rem] dark:text-indigo-900/30"
        >
          {errorCode}
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4 text-4xl font-bold text-gray-800 dark:text-white"
        >
          {errorCode === 404
            ? " Not Found"
            : errorCode === 403
              ? "Access Denied"
              : errorCode === 500
                ? "Internal Server Error"
                : "Oops!"}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-300"
        >
          {errorMessage}
        </motion.p>

        {/* Bouncing Dots */}
        <div className="mb-10 flex justify-center gap-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="h-3 w-3 rounded-full bg-indigo-500 dark:bg-indigo-400"
              initial={{ y: 0 }}
              animate={{ y: [0, -10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Link href="/">
            <Button className="px-6 py-3 text-lg shadow transition-all duration-300 hover:shadow-indigo-300/30 dark:hover:shadow-indigo-500/10">
              Go Home
            </Button>
          </Link>
          <Link href="/mock">
            <Button
              variant="outline"
              className="border-indigo-500 px-6 py-3 text-lg text-indigo-600 transition-all hover:bg-indigo-100 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
            >
              Practice Again
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Error;

```

<!-- path: components/navigation/Footer.tsx -->
```typescript
import Logo from "@/public/logo.png";
import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <>
      {" "}
      <footer className="border-t border-gray-200 bg-white px-4 py-12 sm:px-6 lg:px-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 flex items-center space-x-2 md:mb-0">
              <div className="flex h-8 w-32 items-center justify-center rounded-lg p-2 dark:bg-gray-600">
                <Image src={Logo} alt="Examly Logo" width={192} height={192} />
              </div>
            </div>

            <div className="flex space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300">
              <a
                href="privacy"
                className="transition-colors hover:text-blue-600 dark:hover:text-white"
              >
                Privacy Policy
              </a>
              <a
                href="terms"
                className="transition-colors hover:text-blue-600 dark:hover:text-white"
              >
                Terms of Service
              </a>
              <a
                href="contact"
                className="transition-colors hover:text-blue-600 dark:hover:text-white"
              >
                Contact
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <p className="font-medium">
              &copy; {new Date().getFullYear()} Examly. All rights reserved.
              Empowering education through technology.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

```

<!-- path: components/navigation/NavItem.tsx -->
```typescript
import {
  Activity,
  BarChart3,
  Bell,
  Book,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Cog,
  FileCheck,
  GraduationCap,
  LayoutDashboard,
  Library,
  LineChart,
  Plus,
  SearchIcon,
  SettingsIcon,
  Lock,
  Shield,
  TrendingUp,
  User,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";
import React from "react";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { NavigationItem } from "@/types/dashboard";

function NavItem({
  item,
  pathname,
  expandedItems,
  toggleExpanded,
  onItemClick,
}: {
  item: NavigationItem;
  pathname: string;
  expandedItems: string[];
  toggleExpanded: (id: string) => void;
  onItemClick: () => void;
}) {
  const isActive =
    pathname === item.href ||
    (item.href !== "/dashboard" && pathname.startsWith(item.href));
  const isExpanded = expandedItems.includes(item.id);
  const hasChildren = item.children && item.children.length > 0;

  const iconMap = {
    LayoutDashboard,
    BookOpen,
    ClipboardCheck,
    Users,
    BarChart3,
    UserCog,
    Settings: SettingsIcon,
    Book,
    Library,
    Plus,
    Search: SearchIcon,
    FileCheck,
    GraduationCap,
    UserCheck,
    TrendingUp,
    LineChart,
    Activity,
    Shield,
    UserPlus,
    Bell,
    Cog,
    Lock,
  };

  // Ensure item.icon is a string key present in iconMap
  const IconComponent =
    item.icon && iconMap[item.icon as keyof typeof iconMap]
      ? (iconMap[item.icon as keyof typeof iconMap] as React.ElementType)
      : User; // Fallback to a default icon if not found

  return (
    <li>
      <div className="flex items-center">
        {hasChildren ? (
          <>
            <Button
              variant="ghost"
              onClick={() => toggleExpanded(item.id)}
              className={cn(
                "flex-1 justify-start rounded-lg px-3 py-2 text-sm font-medium",
                isActive || isExpanded // Highlight parent if active or expanded
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
              )}
            >
              <IconComponent className="mr-3 h-5 w-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </>
        ) : (
          <Link href={item.href} className="flex-1" onClick={onItemClick}>
            <Button // This section is not part of the diff, but it's good to keep it in mind
              variant="ghost"
              className={cn(
                "w-full justify-start rounded-lg px-3 py-2 text-sm font-medium",
                isActive
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
              )}
            >
              <IconComponent className="mr-3 h-5 w-5" />
              {item.label}
              {item.badge && (
                <span className="ml-auto rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                  {item.badge}
                </span>
              )}
            </Button>
          </Link>
        )}
      </div>

      {/* Children */}
      {hasChildren && (
        <AnimatePresence>
          {isExpanded && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 ml-6 space-y-1 overflow-hidden border-l border-gray-200 pl-4 dark:border-gray-700"
            >
              {" "}
              {/* This section is not part of the diff, but it's good to keep it in mind */}
              {item &&
                item.children &&
                item.children.map((child: NavigationItem) => (
                  <NavItem
                    key={child.id}
                    item={child}
                    pathname={pathname}
                    expandedItems={expandedItems}
                    toggleExpanded={toggleExpanded}
                    onItemClick={onItemClick}
                  />
                ))}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </li>
  );
}

export default NavItem;

```

<!-- path: components/ui/Button.tsx -->
```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

```

<!-- path: components/ui/ThemeToggle.tsx -->
```typescript
"use client";

import { useThemeStore, Theme } from "@/stores/themeStore";
import { Sun, Moon, Monitor, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, hydrated } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const options = [
    { value: "light" as Theme, icon: <Sun size={16} />, label: "Light" },
    { value: "dark" as Theme, icon: <Moon size={16} />, label: "Dark" },
    { value: "system" as Theme, icon: <Monitor size={16} />, label: "System" },
  ];

  const currentOption = options.find((opt) => opt.value === theme);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  const handleOptionClick = (value: Theme) => {
    setTheme(value);
    setIsOpen(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Show loading state until hydrated
  if (!hydrated) {
    return (
      <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
    );
  }

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg bg-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        aria-expanded={isOpen}
      >
        {currentOption?.icon}
        <span className="text-sm">{currentOption?.label}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleOptionClick(opt.value)}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-gray-700 dark:text-white ${
                theme === opt.value
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

```

<!-- path: components/ui/Input.tsx -->
```typescript
// components/ui/Input.tsx
import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:ring-offset-gray-900 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };

```

<!-- path: components/ui/Checkbox.tsx -->
```typescript
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }

```

<!-- path: components/ui/Select.tsx -->
```typescript
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}

```

<!-- path: components/ui/Label.tsx -->
```typescript
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }

```

<!-- path: components/ui/icons/GoogleIcon.jsx -->
```javascript
// GoogleIcon.jsx
export default function GoogleIcon({ size = 24, color = "#4285F4" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path fill={color} d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.784-1.664-4.153-2.675-6.735-2.675-5.522 0-10 4.479-10 10s4.478 10 10 10c8.396 0 10-7.524 10-10 0-0.67-0.069-1.325-0.189-1.955h-9.811z"/>
    </svg>
  )
}

```

<!-- path: components/ui/LoadingSpinner.tsx -->
```typescript
// components/ui/LoadingSpinner.tsx
import { motion } from "framer-motion";

export const LoadingSpinner = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <motion.div
        className="flex flex-col items-center space-y-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
      </motion.div>
    </div>
  );
};

```

<!-- path: components/auth/RoleGuard.tsx -->
```typescript
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

```

<!-- path: components/auth/GoogleSignInButton.tsx -->
```typescript
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

```

<!-- path: components/auth/UserMenu.tsx -->
```typescript
// components/auth/UserMenu.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  HelpCircle,
  Shield,
  CreditCard,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface UserMenuProps {
  className?: string;
}

export const UserMenu = ({ className = "" }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<string>("system");
  const { user, signOut: logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Simple theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "system";
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (theme: string) => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // System theme
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    {
      label: "Profile",
      icon: User,
      href: "/profile",
      description: "Manage your account",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      description: "Preferences & configuration",
    },
    {
      label: "Notifications",
      icon: Bell,
      href: "/notifications",
      description: "Manage notifications",
      badge: 3, // Optional notification count
    },
    {
      label: "Billing",
      icon: CreditCard,
      href: "/billing",
      description: "Subscription & payments",
      requireRole: "teacher",
    },
    {
      label: "Security",
      icon: Shield,
      href: "/security",
      description: "Password & 2FA",
    },
    {
      label: "Help & Support",
      icon: HelpCircle,
      href: "/help",
      description: "Get assistance",
    },
  ];

  const themeOptions = [
    { label: "Light", icon: Sun, value: "light" },
    { label: "Dark", icon: Moon, value: "dark" },
    { label: "System", icon: Monitor, value: "system" },
  ];

  if (!user) return null;

  const userInitial =
    user.profile?.firstName?.charAt(0).toUpperCase() ||
    user.email?.charAt(0).toUpperCase();
  const userName = user.profile?.firstName || user.email;
  const userRole =
    user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "User";

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:hover:bg-gray-800 dark:focus:ring-offset-gray-900"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="relative">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={userName || "User profile"}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
              width={32}
              height={32}
              priority
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white ring-2 ring-white dark:ring-gray-800">
              {userInitial}
            </div>
          )}
          {/* Online status indicator */}
          <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800" />
        </div>

        {/* User info - hidden on mobile */}
        <div className="hidden min-w-0 flex-1 sm:block">
          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
            {userName}
          </p>
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
            {userRole}
          </p>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/10"
          >
            {/* User header */}
            <div className="border-b border-gray-100 px-3 py-3 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={userName || "User profile"}
                    className="h-12 w-12 rounded-full object-cover"
                    width={32}
                    height={32}
                    priority
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-lg font-semibold text-white">
                    {userInitial}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {userName}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                  <div className="mt-1">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {userRole}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-2">
              {menuItems.map((item) => {
                // Hide role-specific items
                if (item.requireRole && user.role !== item.requireRole) {
                  return null;
                }

                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    {item.badge && (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Theme selector */}
            <div className="border-t border-gray-100 py-2 dark:border-gray-700">
              <div className="px-3 py-2">
                <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Theme
                </p>
              </div>
              <div className="grid grid-cols-3 gap-1 px-2">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = currentTheme === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleThemeChange(option.value)}
                      className={`flex flex-col items-center space-y-1 rounded-lg p-2 text-xs transition-colors ${
                        isActive
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Logout */}
            <div className="border-t border-gray-100 pt-2 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="group flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-medium">Sign out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

```

<!-- path: components/auth/LoginForm.tsx -->
```typescript
// components/auth/LoginForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";
import { useAuthMutations } from "@/hooks/useAuthMutations";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

interface LoginFormProps {
  onToggleMode: () => void;
  onForgotPassword: () => void;
}

export const LoginForm = ({
  onToggleMode,
  onForgotPassword,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthMutations();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-md"
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
              Email Address
            </Label>
            <div className="relative mt-2">
              <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.email.message}
              </motion.p>
            )}
          </div>

          <div>
            <Label
              htmlFor="password"
              className="text-gray-700 dark:text-gray-300"
            >
              Password
            </Label>
            <div className="relative mt-2">
              <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                className={`pr-10 pl-10 ${errors.password ? "border-red-500" : ""}`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.password.message}
              </motion.p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="rememberMe" {...register("rememberMe")} />
              <Label
                htmlFor="rememberMe"
                className="cursor-pointer text-sm text-gray-600 dark:text-gray-400"
              >
                Remember me
              </Label>
            </div>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            disabled={!isValid}
            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {login.isPending ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                Signing in...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
              </div>
            )}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500 dark:bg-gray-900">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <GoogleSignInButton />
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <button
              onClick={onToggleMode}
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

```

<!-- path: components/auth/ForgotPasswordForm.tsx -->
```typescript
// components/auth/ForgotPasswordForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send } from "lucide-react";
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from "@/lib/validations/auth";
import { useAuthMutations } from "@/hooks/useAuthMutations";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const { resetPassword } = useAuthMutations();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword.mutate(data.email);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-md"
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-900">
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to sign in
        </button>

        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Reset Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
              Email Address
            </Label>
            <div className="relative mt-2">
              <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.email.message}
              </motion.p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!isValid || resetPassword.isPending}
            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resetPassword.isPending ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                Sending...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Send className="mr-2 h-5 w-5" />
                Send Reset Link
              </div>
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

```

<!-- path: components/auth/RegisterForm.tsx -->
```typescript
// components/auth/RegisterForm.tsx
"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from "lucide-react";
import { registerSchema, RegisterFormData } from "@/lib/validations/auth";
import { useAuthMutations } from "@/hooks/useAuthMutations";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

interface RegisterFormProps {
  onToggleMode: () => void;
}

export const RegisterForm = ({ onToggleMode }: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerMutation } = useAuthMutations();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "student",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-md"
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-900">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign up to get started with your learning journey
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="firstName"
                className="text-gray-700 dark:text-gray-300"
              >
                First Name
              </Label>
              <div className="relative mt-2">
                <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <Input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="First name"
                  className={`pl-10 ${errors.firstName ? "border-red-500" : ""}`}
                  {...register("firstName")}
                />
              </div>
              {errors.firstName && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.firstName.message}
                </motion.p>
              )}
            </div>

            <div>
              <Label
                htmlFor="lastName"
                className="text-gray-700 dark:text-gray-300"
              >
                Last Name
              </Label>
              <div className="relative mt-2">
                <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <Input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Last name"
                  className={`pl-10 ${errors.lastName ? "border-red-500" : ""}`}
                  {...register("lastName")}
                />
              </div>
              {errors.lastName && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.lastName.message}
                </motion.p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
              Email Address
            </Label>
            <div className="relative mt-2">
              <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.email.message}
              </motion.p>
            )}
          </div>

          <div>
            <Label htmlFor="role" className="text-gray-700 dark:text-gray-300">
              I am a
            </Label>
            <div className="mt-2">
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue="student"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {errors.role && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.role.message}
              </motion.p>
            )}
          </div>

          <div>
            <Label
              htmlFor="password"
              className="text-gray-700 dark:text-gray-300"
            >
              Password
            </Label>
            <div className="relative mt-2">
              <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a password"
                className={`pr-10 pl-10 ${errors.password ? "border-red-500" : ""}`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.password.message}
              </motion.p>
            )}
          </div>

          <div>
            <Label
              htmlFor="confirmPassword"
              className="text-gray-700 dark:text-gray-300"
            >
              Confirm Password
            </Label>
            <div className="relative mt-2">
              <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Confirm your password"
                className={`pr-10 pl-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-1 text-sm text-red-600"
              >
                {errors.confirmPassword.message}
              </motion.p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!isValid}
            className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {registerMutation.isPending ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                Creating account...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <UserPlus className="mr-2 h-5 w-5" />
                Create Account
              </div>
            )}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500 dark:bg-gray-900">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <GoogleSignInButton />
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <button
              onClick={onToggleMode}
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

```

<!-- path: components/auth/AuthWrapper.tsx -->
```typescript
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

```

<!-- path: components/auth/AuthGuard.tsx -->
```typescript
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

```

<!-- path: components/courses/CourseCard.tsx -->
```typescript
// components/courses/CourseCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  Users,
  Star,
  BookOpen,
  Play,
  Badge,
  DollarSign,
} from "lucide-react";
import { Course } from "@/types/course";
import { Button } from "@/components/ui/Button";
import {
  useEnrollmentStatus,
  useEnrollInCourse
} from "@/hooks/useCourseQueries";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CourseCardProps {
  course: Course;
  variant?: "default" | "enrolled" | "compact";
  showProgress?: boolean;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  variant = "default",
  showProgress = false,
  className,
}) => {
  const { user } = useAuth();
  const { isEnrolled, enrollment } = useEnrollmentStatus(course.id);
  const enrollMutation = useEnrollInCourse();

  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      // Redirect to login
      window.location.href = "/login";
      return;
    }
    enrollMutation.mutate(course.id);
  };

  const formatDuration = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}min`;
    return `${Math.round(hours)}h`;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `$${price}`;
  };

  const getLevelColor = (level: string) => {
    const colors = {
      beginner:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      intermediate:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      expert:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    };
    return colors[level as keyof typeof colors] || colors.beginner;
  };

  if (variant === "compact") {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className={cn(
          "overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800",
          className,
        )}
      >
        <Link href={`/courses/${course.id}`}>
          <div className="flex items-center space-x-4 p-4">
            <div className="flex-shrink-0">
              <Image
                src={course.thumbnail || "/placeholder-course.jpg"}
                alt={course.title}
                width={64}
                height={64}
                className="h-16 w-16 rounded-lg object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {course.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                by {course.instructorName}
              </p>

              <div className="mt-2 flex items-center space-x-3">
                <span className="flex items-center text-xs text-gray-500">
                  <Clock className="mr-1 h-3 w-3" />
                  {formatDuration(course.duration)}
                </span>
                <span className="flex items-center text-xs text-yellow-500">
                  <Star className="mr-1 h-3 w-3 fill-current" />
                  {course.rating.toFixed(1)}
                </span>
              </div>
            </div>

            {enrollment && showProgress && (
              <div className="flex-shrink-0">
                <div className="relative h-12 w-12">
                  <svg className="h-12 w-12 -rotate-90 transform">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-gray-300 dark:text-gray-600"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 20}`}
                      strokeDashoffset={`${2 * Math.PI * 20 * (1 - enrollment.progress / 100)}`}
                      className="text-blue-500"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                    {Math.round(enrollment.progress)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800",
        className,
      )}
    >
      <Link href={`/courses/${course.id}`}>
        <div className="relative">
          <Image
            src={course.thumbnail || "/placeholder-course.jpg"}
            alt={course.title}
            width={64}
            height={64}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Price badge */}
          <div className="absolute top-3 right-3">
            <span className="rounded-full bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white">
              {formatPrice(course.price)}
            </span>
          </div>

          {/* Level badge */}
          <div className="absolute top-3 left-3">
            <span
              className={cn(
                "rounded-full px-2 py-1 text-xs font-semibold",
                getLevelColor(course.level),
              )}
            >
              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
            </span>
          </div>

          {/* Play button overlay */}
          <div className="bg-opacity-0 group-hover:bg-opacity-20 absolute inset-0 flex items-center justify-center bg-black transition-all duration-300">
            <Play className="h-16 w-16 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-80" />
          </div>
        </div>
      </Link>

      <div className="p-6">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/courses/${course.id}`}>
              <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {course.title}
              </h3>
            </Link>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              by {course.instructorName}
            </p>
          </div>
        </div>

        <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
          {course.description}
        </p>

        {/* Course stats */}
        <div className="mb-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              {formatDuration(course.duration)}
            </span>
            <span className="flex items-center">
              <BookOpen className="mr-1 h-4 w-4" />
              {course.modules.length} modules
            </span>
            <span className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              {course.enrollmentCount}
            </span>
          </div>

          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 fill-current text-yellow-500" />
            <span>{course.rating.toFixed(1)}</span>
            <span className="ml-1">({course.reviewCount})</span>
          </div>
        </div>

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {course.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
            {course.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{course.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action button */}
        <div className="flex items-center justify-between">
          {isEnrolled ? (
            <div className="flex w-full items-center space-x-3">
              <Link href={`/learn/${course.id}`} className="flex-1">
                <Button variant="default" className="w-full">
                  Continue Learning
                </Button>
              </Link>
              {enrollment && showProgress && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.round(enrollment.progress)}% complete
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={handleEnroll}
              disabled={enrollMutation.isPending}
              className="w-full"
              variant={course.price > 0 ? "default" : "secondary"}
            >
              {enrollMutation.isPending ? (
                "Enrolling..."
              ) : course.price > 0 ? (
                <>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Buy Now - {formatPrice(course.price)}
                </>
              ) : (
                "Enroll Free"
              )}
            </Button>
          )}
        </div>

        {/* Progress bar for enrolled courses */}
        {isEnrolled && enrollment && showProgress && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Progress</span>
              <span>{Math.round(enrollment.progress)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${enrollment.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CourseCard;

```

<!-- path: components/home/Features.tsx -->
```typescript
import React from "react";
import { features } from "@/components/home/consts";

const Features = () => {
  return (
    <>
      {/* Features Section */}
      <section
        id="features"
        className="bg-white/70 px-4 py-20 backdrop-blur-sm sm:px-6 lg:px-8 dark:bg-gray-800/50"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
              Powerful Features for Modern Education
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300">
              Discover the tools that make Examly the preferred choice for
              educators worldwide
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;

```

<!-- path: components/home/GettingStarted.tsx -->
```typescript
import { ArrowRight } from "lucide-react";
import React from "react";
import { steps } from "@/components/home/consts";

const GettingStarted = () => {
  return (
    <>
      {/* Getting Started Section */}
      <section
        id="getting-started"
        className="bg-white/70 px-4 py-20 backdrop-blur-sm sm:px-6 lg:px-8 dark:bg-gray-800/50"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
              Get Started in Minutes
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300">
              Follow our simple 5-step process to transform your educational
              experience
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start space-x-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex-shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-lg font-bold text-white shadow-lg">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 text-blue-500 transition-transform hover:scale-110" />
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-12 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl">
              <span>Begin Your Journey</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default GettingStarted;

```

<!-- path: components/home/CTA.tsx -->
```typescript
import { ArrowRight, CheckCircle } from "lucide-react";
import React from "react";

const CTA = () => {
  return (
    <>
      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-20 sm:px-6 lg:px-8 dark:from-blue-600/20 dark:to-purple-600/20">
        <div className="mx-auto max-w-4xl text-center">
          <div>
            <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
              Ready to Transform Education?
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-700 dark:text-gray-300">
              Join thousands of educators who are already creating engaging,
              effective learning experiences with Examly.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="flex items-center space-x-2 rounded-xl bg-gray-900 px-10 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-800 hover:shadow-2xl dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
                <span>Start Free Trial</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CTA;

```

<!-- path: components/home/Hero.tsx -->
```typescript
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg- relative px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        {/* Background Blurr */}
        <div className="absolute inset-0 -z-[5] bg-black opacity-75"></div>
        {/* Background image */}
        <div className="absolute inset-0 -z-10">
          <Image src="/hero.webp" alt="Hero Image" fill priority />
        </div>
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-5xl font-extrabold text-transparent md:text-7xl">
                Transform Education
              </h1>
              <h2 className="mb-6 text-3xl font-bold text-blue-400 md:text-4xl dark:text-gray-50">
                with Intelligent Learning
              </h2>
            </div>

            <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-50 dark:text-gray-300">
              Empower educators and students with cutting-edge tools for
              interactive learning, comprehensive assessments, and real-time
              analytics that drive success.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl">
                <span>Start Free Trial</span>
                <ArrowRight className="h-5 w-5" />
              </button>

              <button className="flex items-center space-x-2 rounded-xl border-2 border-gray-300 bg-white px-8 py-4 text-lg font-bold text-gray-800 shadow-lg transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:bg-gray-50 hover:shadow-xl dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                <Play className="h-5 w-5" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="relative mt-20">
            <div className="absolute top-10 left-10 h-24 w-24 animate-pulse rounded-full bg-blue-400/30 blur-xl" />
            <div className="absolute top-20 right-20 h-32 w-32 animate-pulse rounded-full bg-purple-400/30 blur-xl" />
            <div className="absolute bottom-10 left-1/2 h-20 w-20 animate-pulse rounded-full bg-pink-400/30 blur-xl" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;

```

<!-- path: components/home/consts.ts -->
```typescript
import { BarChart3, BookOpen, Target, TrendingUp } from "lucide-react";

export const features = [
  {
    icon: BookOpen,
    title: "Interactive Learning Modules",
    description:
      "Engage students with dynamic, interactive content that makes learning memorable and effective.",
  },
  {
    icon: BarChart3,
    title: "Comprehensive Assessment Tools",
    description:
      "Create, distribute, and grade exams efficiently with our robust assessment platform.",
  },
  {
    icon: TrendingUp,
    title: "Real-time Analytics",
    description:
      "Track student progress instantly and identify improvement areas with powerful analytics.",
  },
  {
    icon: Target,
    title: "Customizable Learning Paths",
    description:
      "Create personalized learning journeys tailored to individual student needs and goals.",
  },
];

export const steps = [
  {
    number: "01",
    title: "Sign Up",
    description:
      "Create your account in minutes and join thousands of educators",
  },
  {
    number: "02",
    title: "Explore Dashboard",
    description:
      "Navigate our intuitive interface designed for seamless user experience",
  },
  {
    number: "03",
    title: "Create Content",
    description: "Design engaging courses with our powerful creation tools",
  },
  {
    number: "04",
    title: "Invite Students",
    description: "Share your courses and build your learning community",
  },
  {
    number: "05",
    title: "Track Progress",
    description: "Monitor success with comprehensive analytics and insights",
  },
];

```

<!-- path: components/home/Pricing.tsx -->
```typescript
import { CheckCircle, Star, Trophy } from "lucide-react";
import React from "react";

const Pricing = () => {
  return (
    <>
      {/* Pricing Section */}
      <section
        id="pricing"
        className="bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-20 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
              Choose Your Plan
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300">
              Flexible pricing options designed to grow with your educational
              needs
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {/* Basic Plan */}
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800">
              <div className="text-center">
                <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  Basic
                </h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    ₹149
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    /month
                  </span>
                </div>
                <p className="mb-8 text-gray-600 dark:text-gray-300">
                  Perfect for individual educators getting started
                </p>

                <ul className="mb-8 space-y-4 text-left">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Up to 10 students
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      5 interactive modules
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Basic analytics
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Email support
                    </span>
                  </li>
                </ul>

                <button className="w-full rounded-xl bg-gray-200 px-6 py-3 font-bold text-gray-800 transition-all duration-300 hover:scale-105 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                  Start Free Trial
                </button>
              </div>
            </div>

            {/* Professional Plan - Featured */}
            <div className="relative scale-105 rounded-2xl border-2 border-blue-500 bg-white p-8 shadow-2xl dark:bg-gray-800">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                <div className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 shadow-lg">
                  <Trophy className="h-4 w-4 text-white" />
                  <span className="text-sm font-bold text-white">
                    Most Popular
                  </span>
                </div>
              </div>

              <div className="text-center">
                <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  Professional
                </h3>
                <div className="mb-6">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent">
                    ₹349
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    /month
                  </span>
                </div>
                <p className="mb-8 text-gray-600 dark:text-gray-300">
                  Ideal for schools and growing institutions
                </p>

                <ul className="mb-8 space-y-4 text-left">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Up to 50 students
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Unlimited modules
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Advanced analytics
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Custom learning paths
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Priority support
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Star className="h-5 w-5 flex-shrink-0 text-yellow-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Assessment tools
                    </span>
                  </li>
                </ul>

                <button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700">
                  Start Free Trial
                </button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:border-gray-700 dark:bg-gray-800">
              <div className="text-center">
                <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                  Enterprise
                </h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    ₹1449
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    /month
                  </span>
                </div>
                <p className="mb-8 text-gray-600 dark:text-gray-300">
                  Complete solution for large organizations
                </p>

                <ul className="mb-8 space-y-4 text-left">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      500 students
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      All features included
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      White-label options
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      API access
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      24/7 dedicated support
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Star className="h-5 w-5 flex-shrink-0 text-yellow-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Custom integrations
                    </span>
                  </li>
                </ul>

                <button className="w-full rounded-xl bg-purple-600 px-6 py-3 font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="mb-8 text-gray-600 dark:text-gray-300">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 text-sm text-gray-600 sm:flex-row sm:space-y-0 sm:space-x-8 dark:text-gray-300">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">30-day money back guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">Free migration support</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;

```

<!-- path: components/dashboard/Helper.ts -->
```typescript
import { UserRole } from "@/types/auth";

// Helper functions
function getRoleBasedWelcomeMessage(role: UserRole): string {
  switch (role) {
    case "super-admin":
      return "Manage the entire platform and oversee all operations.";
    case "admin":
      return "Oversee courses, manage users, and analyze platform performance.";
    case "teacher":
      return "Create engaging courses and track your students' progress.";
    case "student":
      return "Continue your learning journey and explore new courses.";
    default:
      return "Welcome to your learning dashboard.";
  }
}

function generateMockDashboardData(role: UserRole) {
  const baseData = {
    recentActivity: [
      {
        id: "1",
        type: "course",
        title: "New course created",
        description: "Introduction to React Development",
        time: "2 hours ago",
      },
      {
        id: "2",
        type: "assessment",
        title: "Assessment submitted",
        description: "JavaScript Fundamentals Quiz",
        time: "5 hours ago",
      },
      {
        id: "3",
        type: "student",
        title: "Student enrolled",
        description: "John Doe joined Web Development Course",
        time: "1 day ago",
      },
    ],
    recentCourses: [
      {
        id: "1",
        title: "React Development",
        description: "Learn modern React development with hooks and context",
        studentsCount: 45,
        lessonsCount: 12,
        isPublished: true,
      },
      {
        id: "2",
        title: "JavaScript Fundamentals",
        description: "Master the fundamentals of JavaScript programming",
        studentsCount: 32,
        lessonsCount: 8,
        isPublished: false,
      },
      {
        id: "3",
        title: "CSS Mastery",
        description: "Advanced CSS techniques and modern layout systems",
        studentsCount: 28,
        lessonsCount: 10,
        isPublished: true,
      },
    ],
    enrollments: [
      {
        id: "1",
        courseTitle: "React Development",
        instructorName: "John Smith",
        progress: 75,
      },
      {
        id: "2",
        courseTitle: "JavaScript Fundamentals",
        instructorName: "Jane Doe",
        progress: 45,
      },
      {
        id: "3",
        courseTitle: "CSS Mastery",
        instructorName: "Mike Johnson",
        progress: 20,
      },
    ],
  };

  // Role-specific stats
  const statsMap = {
    "super-admin": [
      {
        title: "Total Courses",
        value: "124",
        change: { value: 12, type: "increase" },
        icon: "BookOpen",
        color: "blue",
      },
      {
        title: "Total Users",
        value: "2,845",
        change: { value: 8, type: "increase" },
        icon: "Users",
        color: "green",
      },
      {
        title: "Revenue",
        value: "$45,230",
        change: { value: 15, type: "increase" },
        icon: "TrendingUp",
        color: "purple",
      },
      {
        title: "Active Courses",
        value: "98",
        change: { value: 5, type: "increase" },
        icon: "CheckCircle",
        color: "orange",
      },
    ],
    admin: [
      {
        title: "Total Courses",
        value: "87",
        change: { value: 10, type: "increase" },
        icon: "BookOpen",
        color: "blue",
      },
      {
        title: "Total Students",
        value: "1,234",
        change: { value: 6, type: "increase" },
        icon: "Users",
        color: "green",
      },
      {
        title: "Assessments",
        value: "156",
        change: { value: 20, type: "increase" },
        icon: "Award",
        color: "purple",
      },
      {
        title: "Completion Rate",
        value: "78%",
        change: { value: 3, type: "increase" },
        icon: "CheckCircle",
        color: "orange",
      },
    ],
    teacher: [
      {
        title: "My Courses",
        value: "8",
        change: { value: 2, type: "increase" },
        icon: "BookOpen",
        color: "blue",
      },
      {
        title: "Students",
        value: "234",
        change: { value: 12, type: "increase" },
        icon: "Users",
        color: "green",
      },
      {
        title: "Assessments",
        value: "24",
        change: { value: 8, type: "increase" },
        icon: "Award",
        color: "purple",
      },
      {
        title: "Avg. Score",
        value: "85%",
        change: { value: 4, type: "increase" },
        icon: "TrendingUp",
        color: "orange",
      },
    ],
    student: [
      {
        title: "Enrolled Courses",
        value: "6",
        icon: "BookOpen",
        color: "blue",
      },
      { title: "Completed", value: "3", icon: "CheckCircle", color: "green" },
      { title: "In Progress", value: "3", icon: "Clock", color: "orange" },
      { title: "Certificates", value: "2", icon: "Award", color: "purple" },
    ],
  };

  return {
    ...baseData,
    stats: statsMap[role] || statsMap.student,
  };
}

export { getRoleBasedWelcomeMessage, generateMockDashboardData };

```

<!-- path: components/dashboard/RecentCourses.tsx -->
```typescript
import { UserRole } from "@/types/auth";
import { Course } from "@/types/dashboard";
import Link from "next/link";
import { Button } from "../ui/Button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Recent Courses Component (for admin/teacher)
function RecentCourses({
  courses,
  userRole,
}: {
  courses: Course[];
  userRole: UserRole;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {userRole === "teacher" ? "My Courses" : "Recent Courses"}
        </h3>
        <Link href="/dashboard/courses">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.slice(0, 3).map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md dark:border-gray-700"
          >
            <div className="mb-2 flex items-center justify-between">
              <h4 className="truncate font-medium text-gray-900 dark:text-white">
                {course.title}
              </h4>
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-xs",
                  course.isPublished
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                )}
              >
                {course.isPublished ? "Published" : "Draft"}
              </span>
            </div>
            <p className="mb-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
              {course.description}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{course.studentsCount} students</span>
              <span>{course.lessonsCount} lessons</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default RecentCourses;

```

<!-- path: components/dashboard/RecentActivity.tsx -->
```typescript
import { UserRole } from "@/types/auth";
import Link from "next/link";
import { Button } from "../ui/Button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Award, BookOpen, Users } from "lucide-react"; // Keep these imports
import type { RecentActivity as RecentActivityType } from "@/types/dashboard"; // Rename the type import

// Recent Activity Component
function RecentActivity({
  activities,
  userRole,
}: {
  // Use the renamed type here
  activities: RecentActivityType[];
  userRole: UserRole;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h3>
        <Link href="/dashboard/analytics">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="py-8 text-center text-gray-500 dark:text-gray-400">
            No recent activity
          </p>
        ) : (
          activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div
                className={cn(
                  "rounded-full p-2",
                  activity.type === "course" && "bg-blue-100 dark:bg-blue-900",
                  activity.type === "assessment" &&
                    "bg-green-100 dark:bg-green-900",
                  activity.type === "student" &&
                    "bg-purple-100 dark:bg-purple-900",
                )}
              >
                {activity.type === "course" && (
                  <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                )}
                {activity.type === "assessment" && (
                  <Award className="h-4 w-4 text-green-600 dark:text-green-400" />
                )}
                {activity.type === "student" && (
                  <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.time}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecentActivity;

```

<!-- path: components/dashboard/StatsCard.tsx -->
```typescript
import { cn } from "@/lib/utils";
import { DashboardStats } from "@/types/dashboard";
import {
  AlertCircle,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

// Stats Card Component
function StatsCard({ stat, index }: { stat: DashboardStats; index: number }) {
  const iconMap = {
    BookOpen,
    Users,
    Award,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
    BarChart3,
  };

  const IconComponent = iconMap[stat.icon as keyof typeof iconMap] || BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {stat.title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stat.value}
          </p>
          {stat.change && (
            <div className="mt-1 flex items-center">
              <TrendingUp
                className={cn(
                  "mr-1 h-4 w-4",
                  stat.change.type === "increase"
                    ? "text-green-500"
                    : "text-red-500",
                )}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  stat.change.type === "increase"
                    ? "text-green-600"
                    : "text-red-600",
                )}
              >
                {stat.change.value}%
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "rounded-full p-3",
            stat.color === "blue" && "bg-blue-100 dark:bg-blue-900",
            stat.color === "green" && "bg-green-100 dark:bg-green-900",
            stat.color === "purple" && "bg-purple-100 dark:bg-purple-900",
            stat.color === "orange" && "bg-orange-100 dark:bg-orange-900",
          )}
        >
          <IconComponent
            className={cn(
              "h-6 w-6",
              stat.color === "blue" && "text-blue-600 dark:text-blue-400",
              stat.color === "green" && "text-green-600 dark:text-green-400",
              stat.color === "purple" && "text-purple-600 dark:text-purple-400",
              stat.color === "orange" && "text-orange-600 dark:text-orange-400",
            )}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default StatsCard;

```

<!-- path: components/dashboard/MyEnrollments.tsx -->
```typescript
import Link from "next/link";
import { Button } from "../ui/Button";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Enrollment } from "@/types/dashboard";

// My Enrollments Component (for students)
function MyEnrollments({ enrollments }: { enrollments: Enrollment[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          My Courses
        </h3>
        <Link href="/dashboard/courses/my-courses">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {enrollments.slice(0, 5).map((enrollment, index) => (
          <motion.div
            key={enrollment.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {enrollment.title}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {enrollment.instructorName}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {enrollment.progress}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default MyEnrollments;

```

<!-- path: components/dashboard/QuickActions.tsx -->
```typescript
import { UserRole } from "@/types/auth";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../ui/Button";
import { PlusCircle } from "lucide-react";

// Quick Actions Component
function QuickActions({ userRole }: { userRole: UserRole }) {
  const getQuickActions = (role: UserRole) => {
    const commonActions = [
      { label: "View Profile", href: "/profile", icon: "User" },
      { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
    ];

    switch (role) {
      case "super-admin":
      case "admin":
        return [
          {
            label: "Create Course",
            href: "/dashboard/courses/create",
            icon: "PlusCircle",
          },
          { label: "Manage Users", href: "/dashboard/users", icon: "Users" },
          {
            label: "View Analytics",
            href: "/dashboard/analytics",
            icon: "BarChart3",
          },
          ...commonActions,
        ];
      case "teacher":
        return [
          {
            label: "Create Course",
            href: "/dashboard/courses/create",
            icon: "PlusCircle",
          },
          {
            label: "Create Assessment",
            href: "/dashboard/assessments/create",
            icon: "Award",
          },
          {
            label: "View Students",
            href: "/dashboard/students/my-students",
            icon: "Users",
          },
          ...commonActions,
        ];
      case "student":
        return [
          {
            label: "Browse Courses",
            href: "/dashboard/courses/browse",
            icon: "BookOpen",
          },
          {
            label: "My Assessments",
            href: "/dashboard/assessments/my-assessments",
            icon: "Award",
          },
          {
            label: "My Progress",
            href: "/dashboard/progress",
            icon: "TrendingUp",
          },
          ...commonActions,
        ];
      default:
        return commonActions;
    }
  };

  const actions = getQuickActions(userRole);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
        Quick Actions
      </h3>

      <div className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={action.href}>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
              >
                <PlusCircle className="mr-3 h-4 w-4" />
                {action.label}
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;

```

<!-- path: components/NotFound.tsx -->
```typescript
// components/NotFound.tsx
"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 dark:from-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl text-center"
      >
        {/* Animated 404 Text */}
        <div className="relative mb-12">
          <motion.span
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[10rem] font-bold text-indigo-200 sm:text-[12rem] md:text-[14rem] dark:text-indigo-900/30"
          >
            404
          </motion.span>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-4 text-4xl font-bold text-gray-800 sm:text-5xl md:text-6xl dark:text-white"
            >
              Page Not Found
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "80%" }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mx-auto h-1 rounded-full bg-indigo-500 dark:bg-indigo-400"
            />
          </div>
        </div>

        {/* Error Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mx-auto mb-12 max-w-2xl px-4 text-xl text-gray-600 dark:text-gray-300"
        >
          Oops! The page you&apos;re looking for might have been moved, removed,
          or doesn&apos;t exist. Let&apos;s get you back on track.
        </motion.p>

        {/* Animated Elements */}
        <div className="mb-12 flex justify-center gap-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 1 + i * 0.2,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="h-4 w-4 rounded-full bg-indigo-500 dark:bg-indigo-400"
            />
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className="flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Link href="/">
            <Button className="px-8 py-3 text-lg shadow-lg transition-shadow hover:shadow-indigo-200/50 dark:hover:shadow-indigo-500/10">
              Return Home
            </Button>
          </Link>
          <Link href="/mock">
            <Button
              variant="outline"
              className="border-indigo-500 px-8 py-3 text-lg text-indigo-500 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
            >
              Start Practicing
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;

```

<!-- path: components/layout/Navbar.tsx -->
```typescript
// components/layout/Navbar.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { UserMenu } from "@/components/auth/UserMenu";
import {
  Menu,
  X,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Home,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Exams", href: "/exams", icon: BookOpen },
    {
      name: "Courses",
      href: "/courses",
      icon: BookOpen,
      requireRole: "teacher",
    },
    { name: "Profile", href: "/profile", icon: Users },
    {
      name: "Students",
      href: "/students",
      icon: Users,
      requireRole: "teacher",
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      requireRole: "teacher",
    },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="rounded-2xl bg-gradient-to-br from-gray-100 to-gray-300 dark:from-blue-400 dark:to-blue-800"
            >
              <Image src="/logo.png" alt="Logo" width={100} height={40} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-1 md:flex">
            {user && (
              <>
                {navigation.map((item) => {
                  if (item.requireRole && user.role !== item.requireRole)
                    return null;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="group flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                    >
                      <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isLoading || !isInitialized ? (
              <div className="h-8 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
            ) : (
              <>
                {user ? (
                  <UserMenu />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      asChild
                      className="hidden sm:inline-flex"
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/register">Get Started</Link>
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-16 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-16 right-0 z-50 h-[calc(100vh-4rem)] w-72 bg-white/95 shadow-xl backdrop-blur-md md:hidden dark:bg-gray-900/95"
            >
              <div className="flex h-full flex-col p-6">
                {user && (
                  <div className="flex flex-col space-y-2">
                    <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Navigation
                    </h3>
                    {navigation.map((item) => {
                      if (item.requireRole && user.role !== item.requireRole)
                        return null;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.name}
                          onClick={() => handleNavClick(item.href)}
                          className="flex items-center space-x-3 rounded-lg px-3 py-3 text-left text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {!isLoading && !user && (
                  <div className="mt-6 flex flex-col space-y-3">
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavClick("/login")}
                    >
                      Sign In
                    </Button>
                    <Button
                      className="justify-start"
                      onClick={() => handleNavClick("/register")}
                    >
                      Get Started
                    </Button>
                  </div>
                )}

                {/* Mobile user info */}
                {user && (
                  <div className="mt-auto border-t border-gray-200 pt-6 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                        <span className="text-sm font-semibold text-white">
                          {user.profile?.firstName?.charAt(0).toUpperCase() ||
                            user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.profile?.firstName || user.email}
                        </p>
                        <p className="text-xs text-gray-500 capitalize dark:text-gray-400">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

```

<!-- path: hooks/useAuthMutations.ts -->
```typescript
// hooks/useAuthMutations.ts
import { AuthService } from "@/lib/firebase/auth";
import { useAuthStore } from "@/stores/authStore";
import { AuthUser, LoginCredentials, RegisterCredentials } from "@/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

```

<!-- path: hooks/useApiQueries.ts -->
```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  courseService,
  lessonService,
  assessmentService,
  enrollmentService,
  progressService,
  userService,
  analyticsService,
  notificationService,
  searchService,
} from "@/lib/api/services";
import { Course, Lesson, Assessment, User } from "@/types/dashboard";
import { UserRole } from "@/types/auth";

// Query Keys
export const queryKeys = {
  // Courses
  courses: ["courses"] as const,
  course: (id: string) => ["courses", id] as const,
  coursesByInstructor: (instructorId: string) =>
    ["courses", "instructor", instructorId] as const,
  enrolledCourses: (studentId: string) =>
    ["courses", "enrolled", studentId] as const,

  // Lessons
  lessons: (courseId: string) => ["lessons", courseId] as const,
  lesson: (courseId: string, lessonId: string) =>
    ["lessons", courseId, lessonId] as const,

  // Assessments
  assessments: (courseId: string) => ["assessments", courseId] as const,
  assessment: (courseId: string, assessmentId: string) =>
    ["assessments", courseId, assessmentId] as const,
  submissions: (assessmentId: string) => ["submissions", assessmentId] as const,

  // Enrollments
  enrollments: ["enrollments"] as const,

  // Progress
  progress: (userId: string, courseId: string) =>
    ["progress", userId, courseId] as const,

  // Users
  users: ["users"] as const,
  user: (id: string) => ["users", id] as const,

  // Analytics
  dashboardAnalytics: (role: UserRole) =>
    ["analytics", "dashboard", role] as const,
  courseAnalytics: (courseId: string, timeRange?: string) =>
    ["analytics", "course", courseId, timeRange] as const,
  studentAnalytics: (userId: string) =>
    ["analytics", "student", userId] as const,
  instructorAnalytics: (instructorId: string) =>
    ["analytics", "instructor", instructorId] as const,

  // Notifications
  notifications: ["notifications"] as const,
  notificationSettings: ["notifications", "settings"] as const,

  // Search
  search: (query: string, filters?: any) => ["search", query, filters] as const,
  suggestions: (query: string) => ["search", "suggestions", query] as const,
  popularSearches: ["search", "popular"] as const,
};

// Course Hooks
export const useCourses = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  difficulty?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}) => {
  return useQuery({
    queryKey: [...queryKeys.courses, params],
    queryFn: () => courseService.getCourses(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCourse = (id: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.course(id),
    queryFn: () => courseService.getCourse(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCoursesByInstructor = (instructorId: string) => {
  return useQuery({
    queryKey: queryKeys.coursesByInstructor(instructorId),
    queryFn: () => courseService.getCoursesByInstructor(instructorId),
    enabled: !!instructorId,
  });
};

export const useEnrolledCourses = (studentId: string) => {
  return useQuery({
    queryKey: queryKeys.enrolledCourses(studentId),
    queryFn: () => courseService.getEnrolledCourses(studentId),
    enabled: !!studentId,
  });
};

// Course Mutations
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: courseService.createCourse,
    onSuccess: (newCourse) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses });
      toast.success(`Course ${newCourse.title}} created successfully!`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create course");
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Course> }) =>
      courseService.updateCourse(id, updates),
    onSuccess: (updatedCourse) => {
      queryClient.setQueryData(
        queryKeys.course(updatedCourse.id),
        updatedCourse,
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.courses });
      toast.success("Course updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update course");
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: courseService.deleteCourse,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: queryKeys.course(deletedId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses });
      toast.success("Course deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete course");
    },
  });
};

export const useTogglePublishCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      courseService.togglePublishCourse(id, isPublished),
    onSuccess: (updatedCourse) => {
      queryClient.setQueryData(
        queryKeys.course(updatedCourse.id),
        updatedCourse,
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.courses });
      toast.success(
        updatedCourse.isPublished
          ? "Course published successfully!"
          : "Course unpublished successfully!",
      );
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update course status");
    },
  });
};

// Lesson Hooks
export const useLessons = (courseId: string) => {
  return useQuery({
    queryKey: queryKeys.lessons(courseId),
    queryFn: () => lessonService.getLessons(courseId),
    enabled: !!courseId,
  });
};

export const useLesson = (courseId: string, lessonId: string) => {
  return useQuery({
    queryKey: queryKeys.lesson(courseId, lessonId),
    queryFn: () => lessonService.getLesson(courseId, lessonId),
    enabled: !!(courseId && lessonId),
  });
};

// Lesson Mutations
export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      lessonData,
    }: {
      courseId: string;
      lessonData: Omit<Lesson, "id" | "createdAt" | "updatedAt">;
    }) => lessonService.createLesson(courseId, lessonData),
    onSuccess: (newLesson) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessons(newLesson.courseId),
      });
      toast.success("Lesson created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create lesson");
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      lessonId,
      updates,
    }: {
      courseId: string;
      lessonId: string;
      updates: Partial<Lesson>;
    }) => lessonService.updateLesson(courseId, lessonId, updates),
    onSuccess: (updatedLesson) => {
      queryClient.setQueryData(
        queryKeys.lesson(updatedLesson.courseId, updatedLesson.id),
        updatedLesson,
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessons(updatedLesson.courseId),
      });
      toast.success("Lesson updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update lesson");
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      lessonId,
    }: {
      courseId: string;
      lessonId: string;
    }) => lessonService.deleteLesson(courseId, lessonId),
    onSuccess: (_, { courseId, lessonId }) => {
      queryClient.removeQueries({
        queryKey: queryKeys.lesson(courseId, lessonId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.lessons(courseId) });
      toast.success("Lesson deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete lesson");
    },
  });
};

export const useReorderLessons = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      lessonIds,
    }: {
      courseId: string;
      lessonIds: string[];
    }) => lessonService.reorderLessons(courseId, lessonIds),
    onSuccess: (reorderedLessons, { courseId }) => {
      queryClient.setQueryData(queryKeys.lessons(courseId), reorderedLessons);
      toast.success("Lessons reordered successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reorder lessons");
    },
  });
};

// Assessment Hooks
export const useAssessments = (courseId: string) => {
  return useQuery({
    queryKey: queryKeys.assessments(courseId),
    queryFn: () => assessmentService.getAssessments(courseId),
    enabled: !!courseId,
  });
};

export const useAssessment = (courseId: string, assessmentId: string) => {
  return useQuery({
    queryKey: queryKeys.assessment(courseId, assessmentId),
    queryFn: () => assessmentService.getAssessment(courseId, assessmentId),
    enabled: !!(courseId && assessmentId),
  });
};

export const useSubmissions = (assessmentId: string) => {
  return useQuery({
    queryKey: queryKeys.submissions(assessmentId),
    queryFn: () => assessmentService.getSubmissions(assessmentId),
    enabled: !!assessmentId,
  });
};

// Assessment Mutations
export const useCreateAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      assessmentData,
    }: {
      courseId: string;
      assessmentData: Omit<Assessment, "id" | "createdAt" | "updatedAt">;
    }) => assessmentService.createAssessment(courseId, assessmentData),
    onSuccess: (newAssessment) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assessments(newAssessment.courseId),
      });
      toast.success("Assessment created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create assessment");
    },
  });
};

export const useSubmitAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assessmentId,
      answers,
    }: {
      assessmentId: string;
      answers: Record<string, any>;
    }) => assessmentService.submitAssessment(assessmentId, answers),
    onSuccess: (submission) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.submissions(submission.assessmentId),
      });
      toast.success("Assessment submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit assessment");
    },
  });
};

// Enrollment Hooks
export const useEnrollments = (params?: {
  courseId?: string;
  userId?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: [...queryKeys.enrollments, params],
    queryFn: () => enrollmentService.getEnrollments(params),
  });
};

export const useEnrollStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, userId }: { courseId: string; userId: string }) =>
      enrollmentService.enrollStudent(courseId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments });
      toast.success("Student enrolled successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to enroll student");
    },
  });
};

// Progress Hooks
export const useStudentProgress = (userId: string, courseId: string) => {
  return useQuery({
    queryKey: queryKeys.progress(userId, courseId),
    queryFn: () => progressService.getStudentProgress(userId, courseId),
    enabled: !!(userId && courseId),
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      courseId,
      lessonId,
      progressData,
    }: {
      userId: string;
      courseId: string;
      lessonId: string;
      progressData: { completed?: boolean; timeSpent?: number; score?: number };
    }) =>
      progressService.updateLessonProgress(
        userId,
        courseId,
        lessonId,
        progressData,
      ),
    onSuccess: (_, { userId, courseId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.progress(userId, courseId),
      });
    },
  });
};

// User Hooks
export const useUsers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}) => {
  return useQuery({
    queryKey: [...queryKeys.users, params],
    queryFn: () => userService.getUsers(params),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => userService.getUser(id),
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<User> }) =>
      userService.updateUser(id, updates),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKeys.user(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      toast.success("User updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update user");
    },
  });
};

// Analytics Hooks
export const useDashboardAnalytics = (role: UserRole) => {
  return useQuery({
    queryKey: queryKeys.dashboardAnalytics(role),
    queryFn: () => analyticsService.getDashboardAnalytics(role),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useCourseAnalytics = (courseId: string, timeRange?: string) => {
  return useQuery({
    queryKey: queryKeys.courseAnalytics(courseId, timeRange),
    queryFn: () => analyticsService.getCourseAnalytics(courseId, timeRange),
    enabled: !!courseId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Notification Hooks
export const useNotifications = (params?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}) => {
  return useQuery({
    queryKey: [...queryKeys.notifications, params],
    queryFn: () => notificationService.getNotifications(params),
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
};

// Search Hooks
export const useGlobalSearch = (
  query: string,
  filters?: any,
  enabled = true,
) => {
  return useQuery({
    queryKey: queryKeys.search(query, filters),
    queryFn: () => searchService.globalSearch(query, filters),
    enabled: enabled && query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSearchSuggestions = (query: string) => {
  return useQuery({
    queryKey: queryKeys.suggestions(query),
    queryFn: () => searchService.getSuggestions(query),
    enabled: query.length > 1,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Infinite Query Hooks
export const useInfiniteCourses = (params?: any) => {
  return useInfiniteQuery({
    queryKey: [...queryKeys.courses, "infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      courseService.getCourses({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, limit, total } = lastPage;
      return page * limit < total ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// Optimistic Update Hooks
export const useOptimisticCourseUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Course> }) =>
      courseService.updateCourse(id, updates),
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.course(id) });

      // Snapshot the previous value
      const previousCourse = queryClient.getQueryData(queryKeys.course(id));

      // Optimistically update
      queryClient.setQueryData(queryKeys.course(id), (old: Course) => ({
        ...old,
        ...updates,
      }));

      return { previousCourse };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousCourse) {
        queryClient.setQueryData(
          queryKeys.course(variables.id),
          context.previousCourse,
        );
      }
      toast.error("Failed to update course");
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: queryKeys.course(variables.id),
      });
    },
  });
};

// Custom hook for prefetching
export const usePrefetchCourse = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.course(id),
      queryFn: () => courseService.getCourse(id),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };
};

```

<!-- path: hooks/useCourseQueries.ts -->
```typescript
"use client"

// hooks/useCourseQueries.ts
import { useEffect } from "react";
import { useEnrollments } from "./useApiQueries";
import {
  courseServices,
  enrollmentServices,
  progressServices,
  quizServices,
} from "@/lib/api/courseServices";
import { useCourseActions } from "@/stores/courseStore";
import {
  CourseFilters,
  CreateCourseRequest,
  UpdateCourseRequest,
} from "@/types/course";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// Query Keys
export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (filters: CourseFilters) =>
    [...courseKeys.lists(), { filters }] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
  instructor: (instructorId: string) =>
    [...courseKeys.all, "instructor", instructorId] as const,
  search: (query: string) => [...courseKeys.all, "search", query] as const,
};

export const enrollmentKeys = {
  all: ["enrollments"] as const,
  user: (userId?: string) => [...enrollmentKeys.all, "user", userId] as const,
  course: (courseId: string) =>
    [...enrollmentKeys.all, "course", courseId] as const,
};

export const progressKeys = {
  all: ["progress"] as const,
  course: (courseId: string) =>
    [...progressKeys.all, "course", courseId] as const,
  completion: (courseId: string) =>
    [...progressKeys.all, "completion", courseId] as const,
  stats: () => [...progressKeys.all, "stats"] as const,
};

// Course Queries
export const useCourses = (
  filters: CourseFilters = {},
  page = 1,
  limit = 12,
) => {
  const { setCourses, setCoursesLoading, setCoursesError } = useCourseActions();

  const result = useQuery({
    queryKey: courseKeys.list({ ...filters, page, limit }),
    queryFn: () => courseServices.getCourses(filters, page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle side effects
  useEffect(() => {
    if (result.data) {
      setCourses(result.data.data);
    }
    if (result.error) {
      setCoursesError(result.error.message);
      toast.error("Failed to load courses");
    }
    setCoursesLoading(result.isLoading);
  }, [result.data, result.error, result.isLoading, setCourses, setCoursesError, setCoursesLoading]);

  return result;
};

export const useCourse = (id: string) => {
  const { setCurrentCourse } = useCourseActions();

  const result = useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => courseServices.getCourse(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    if (result.data) {
      setCurrentCourse(result.data);
    }
  }, [result.data, setCurrentCourse]);

  useEffect(() => {
    if (result.error) {
      toast.error("Failed to load course details");
    }
  }, [result.error]);

  return result;
};

export const useCourseProgress = (courseId: string) => {
  const { setProgress } = useCourseActions();

  const result = useQuery({
    queryKey: progressKeys.course(courseId),
    queryFn: () => progressServices.getCourseProgress(courseId),
    enabled: !!courseId,
  });

  useEffect(() => {
    if (result.data) {
      setProgress(result.data);
    }
  }, [result.data, setProgress]);

  useEffect(() => {
    if (result.error) {
      toast.error("Failed to load course progress");
    }
  }, [result.error]);

  return result;
};

export const useInstructorCourses = (instructorId: string) => {
  const result = useQuery({
    queryKey: courseKeys.instructor(instructorId),
    queryFn: () => courseServices.getCoursesByInstructor(instructorId),
    enabled: !!instructorId,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (result.error) {
      toast.error("Failed to load instructor courses");
    }
  }, [result.error]);

  return result;
};

export const useSearchCourses = (query: string) => {
  const result = useQuery({
    queryKey: courseKeys.search(query),
    queryFn: () => courseServices.searchCourses(query),
    enabled: query.length > 2,
  });

  useEffect(() => {
    if (result.error) {
      toast.error("Failed to search courses");
    }
  }, [result.error]);

  return result;
};

// Course Mutations
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const { addCourse } = useCourseActions();

  return useMutation({
    mutationFn: (data: CreateCourseRequest) =>
      courseServices.createCourse(data),
    onSuccess: (newCourse) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      addCourse(newCourse);
      toast.success("Course created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create course");
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  const { updateCourse } = useCourseActions();

  return useMutation({
    mutationFn: (data: UpdateCourseRequest) =>
      courseServices.updateCourse(data),
    onSuccess: (updatedCourse) => {
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(updatedCourse.id),
      });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      updateCourse(updatedCourse.id, updatedCourse);
      toast.success("Course updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update course");
    },
  });
};

// ...

// Progress Mutations
export const useMarkLessonComplete = (lessonId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      progressServices.markLessonComplete(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressKeys.all });
      toast.success("Lesson marked as complete!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to mark lesson as complete");
    },
  });
};

export const useUpdateLessonProgress = (lessonId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { completed: boolean }) =>
      progressServices.updateLessonProgress(lessonId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressKeys.all });
      toast.success("Lesson progress updated!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update lesson progress");
    },
  });
};

// ...

// Quiz Mutations
export const useSubmitQuizAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      answers,
    }: {
      quizId: string;
      answers: Record<string, string | string[]>;
    }) => quizServices.submitQuizAttempt(quizId, answers),
    onSuccess: (result, { quizId }) => {
      queryClient.invalidateQueries({ queryKey: ["quiz-attempts", quizId] });
      queryClient.invalidateQueries({ queryKey: progressKeys.all });
      toast.success(
        result.passed
          ? `Quiz passed! Score: ${result.percentage}%`
          : `Quiz completed. Score: ${result.percentage}%`,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit quiz");
    },
  });
};

// Enrollment Mutations
export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (courseId: string) => enrollmentServices.enrollInCourse(courseId),
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.user() });
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.course(courseId) });
      toast.success('Successfully enrolled in the course!');
    },
    onError: (error: Error) => {
      toast.error(`Enrollment failed: ${error.message}`);
    },
  });
};

// Custom hooks for common operations
import type { Enrollment as CourseEnrollment } from "@/types/course";
import type { Enrollment as DashboardEnrollment } from "@/types/dashboard";

type Enrollment = CourseEnrollment | DashboardEnrollment;

export const useEnrollmentStatus = (courseId: string) => {
  const { data: enrollments } = useEnrollments();
  const enrollment = Array.isArray(enrollments) 
    ? enrollments.find((e: Enrollment) => e.courseId === courseId) 
    : null;

  return {
    isEnrolled: !!enrollment,
    enrollment,
    status: enrollment?.status,
  };
};

export const useLessonCompletion = (courseId: string) => {
  const { data: progressData } = useCourseProgress(courseId);
  const { data: course } = useCourse(courseId);

  const totalLessons = course?.modules?.reduce(
    (total: number, module) => total + (module.lessons?.length || 0),
    0,
  ) || 0;

  const completedLessons = Array.isArray(progressData) 
    ? progressData.reduce((count: number, progress) => {
        return count + (progress.completed ? 1 : 0);
      }, 0)
    : 0;

  const completionPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return {
    totalLessons,
    completedLessons,
    completionPercentage,
    isComplete: completionPercentage === 100,
  };
};

```

<!-- path: hooks/useAuth.ts -->
```typescript
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

```

<!-- path: package.json -->
```json
{
  "name": "examly",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "check:deps": "depcheck",
    "gitpush": "git add . && git commit -m \"$(date +'%Y-%m-%d %H:%M:%S')\" && git push"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.2.1",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-slot": "^1.2.3",
    "@tanstack/react-query": "^5.85.3",
    "bcryptjs": "^3.0.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "firebase": "^12.1.0",
    "framer-motion": "^12.23.12",
    "immer": "^10.1.1",
    "jose": "^6.0.12",
    "lucide-react": "^0.539.0",
    "next": "15.4.10",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-hook-form": "^7.62.0",
    "react-hot-toast": "^2.6.0",
    "tailwind-merge": "^3.3.1",
    "zod": "^4.0.17",
    "zustand": "^5.0.7"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "depcheck": "^1.4.7",
    "eslint": "^9",
    "eslint-config-next": "15.4.6",
    "prettier-plugin-tailwindcss": "^0.6.14",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.3.6",
    "typescript": "^5"
  }
}

```

<!-- path: next.config.ts -->
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

```

<!-- path: eslint.config.mjs -->
```mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;

```

<!-- path: stores/themeStore.ts -->
```typescript
import { create } from "zustand";

export type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
}

export const useThemeStore = create<ThemeState>()((set, get) => ({
  // NEVER access localStorage in initial state - always use default
  theme: "system", // Default value, no localStorage access
  hydrated: false,

  setTheme: (newTheme: Theme) => {
    set({ theme: newTheme });
    // Only access localStorage in actions (client-side)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("theme-storage", newTheme);
      } catch (error) {
        console.warn("Failed to save theme:", error);
      }
    }
  },

  setHydrated: (hydrated: boolean) => set({ hydrated }),
}));

// Client-side hydration function
export const hydrateThemeStore = () => {
  if (typeof window === "undefined") return;

  try {
    const storedTheme = localStorage.getItem("theme-storage");
    if (storedTheme && ["light", "dark", "system"].includes(storedTheme)) {
      useThemeStore.setState({
        theme: storedTheme as Theme,
        hydrated: true,
      });
    } else {
      useThemeStore.setState({ hydrated: true });
    }
  } catch (error) {
    console.warn("Failed to load theme:", error);
    useThemeStore.setState({ hydrated: true });
  }
};

```

<!-- path: stores/authStore.ts -->
```typescript
// store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, AuthUser } from "@/types/auth";

interface AuthStore extends AuthState {
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isInitialized: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setUser: (user) => set({ user, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setInitialized: (isInitialized) => set({ isInitialized }),
      setError: (error) => set({ error, isLoading: false }),
      clearError: () => set({ error: null }),
      reset: () => set(initialState),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

```

<!-- path: stores/courseStore.ts -->
```typescript
// stores/courseStore.ts
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  Course,
  CourseFilters,
  Enrollment,
  Progress,
  CourseModule,
  Lesson,
} from "@/types/course";

interface CourseState {
  // Course management
  courses: Course[];
  currentCourse: Course | null;
  courseFilters: CourseFilters;
  coursesLoading: boolean;
  coursesError: string | null;

  // Enrollment management
  enrollments: Enrollment[];
  currentEnrollment: Enrollment | null;
  enrollmentsLoading: boolean;
  enrollmentsError: string | null;

  // Progress tracking
  progress: Progress[];
  currentProgress: Progress | null;

  // Learning path
  currentModule: CourseModule | null;
  currentLesson: Lesson | null;

  // UI state
  sidebar: {
    isOpen: boolean;
    activeTab: "modules" | "progress" | "discussions" | "resources";
  };

  // Actions
  actions: {
    // Course actions
    setCourses: (courses: Course[]) => void;
    addCourse: (course: Course) => void;
    updateCourse: (courseId: string, updates: Partial<Course>) => void;
    deleteCourse: (courseId: string) => void;
    setCurrentCourse: (course: Course | null) => void;
    setCourseFilters: (filters: Partial<CourseFilters>) => void;
    clearCourseFilters: () => void;
    setCoursesLoading: (loading: boolean) => void;
    setCoursesError: (error: string | null) => void;

    // Enrollment actions
    setEnrollments: (enrollments: Enrollment[]) => void;
    addEnrollment: (enrollment: Enrollment) => void;
    updateEnrollment: (
      enrollmentId: string,
      updates: Partial<Enrollment>,
    ) => void;
    setCurrentEnrollment: (enrollment: Enrollment | null) => void;
    setEnrollmentsLoading: (loading: boolean) => void;
    setEnrollmentsError: (error: string | null) => void;

    // Progress actions
    setProgress: (progress: Progress[]) => void;
    updateProgress: (progressId: string, updates: Partial<Progress>) => void;
    setCurrentProgress: (progress: Progress | null) => void;
    markLessonComplete: (lessonId: string) => void;
    updateTimeSpent: (lessonId: string, timeSpent: number) => void;

    // Learning path actions
    setCurrentModule: (module: CourseModule | null) => void;
    setCurrentLesson: (lesson: Lesson | null) => void;
    navigateToNextLesson: () => void;
    navigateToPrevLesson: () => void;

    // UI actions
    toggleSidebar: () => void;
    setSidebarTab: (
      tab: "modules" | "progress" | "discussions" | "resources",
    ) => void;

    // Reset actions
    reset: () => void;
  };
}

const initialState = {
  courses: [],
  currentCourse: null,
  courseFilters: {},
  coursesLoading: false,
  coursesError: null,

  enrollments: [],
  currentEnrollment: null,
  enrollmentsLoading: false,
  enrollmentsError: null,

  progress: [],
  currentProgress: null,

  currentModule: null,
  currentLesson: null,

  sidebar: {
    isOpen: true,
    activeTab: "modules" as const,
  },
};

export const useCourseStore = create<CourseState>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,

        actions: {
          // Course actions
          setCourses: (courses) =>
            set((state) => {
              state.courses = courses;
              state.coursesLoading = false;
              state.coursesError = null;
            }),

          addCourse: (course) =>
            set((state) => {
              state.courses.unshift(course);
            }),

          updateCourse: (courseId, updates) =>
            set((state) => {
              const index = state.courses.findIndex(
                (c: { id: string }) => c.id === courseId,
              );
              if (index !== -1) {
                state.courses[index] = { ...state.courses[index], ...updates };
              }
              if (state.currentCourse?.id === courseId) {
                state.currentCourse = { ...state.currentCourse, ...updates };
              }
            }),

          deleteCourse: (courseId) =>
            set((state) => {
              state.courses = state.courses.filter(
                (c: { id: string }) => c.id !== courseId,
              );
              if (state.currentCourse?.id === courseId) {
                state.currentCourse = null;
              }
            }),

          setCurrentCourse: (course) =>
            set((state) => {
              state.currentCourse = course;
            }),

          setCourseFilters: (filters) =>
            set((state) => {
              state.courseFilters = { ...state.courseFilters, ...filters };
            }),

          clearCourseFilters: () =>
            set((state) => {
              state.courseFilters = {};
            }),

          setCoursesLoading: (loading) =>
            set((state) => {
              state.coursesLoading = loading;
            }),

          setCoursesError: (error) =>
            set((state) => {
              state.coursesError = error;
              state.coursesLoading = false;
            }),

          // Enrollment actions
          setEnrollments: (enrollments) =>
            set((state) => {
              state.enrollments = enrollments;
              state.enrollmentsLoading = false;
            }),

          addEnrollment: (enrollment) =>
            set((state) => {
              state.enrollments.unshift(enrollment);
            }),

          updateEnrollment: (enrollmentId, updates) =>
            set((state) => {
              const index = state.enrollments.findIndex(
                (e: { id: string }) => e.id === enrollmentId,
              );
              if (index !== -1) {
                state.enrollments[index] = {
                  ...state.enrollments[index],
                  ...updates,
                };
              }
              if (state.currentEnrollment?.id === enrollmentId) {
                state.currentEnrollment = {
                  ...state.currentEnrollment,
                  ...updates,
                };
              }
            }),

          setCurrentEnrollment: (enrollment) =>
            set((state) => {
              state.currentEnrollment = enrollment;
            }),

          setEnrollmentsLoading: (loading) =>
            set((state) => {
              state.enrollmentsLoading = loading;
            }),

          setEnrollmentsError: (error) =>
            set((state) => {
              state.enrollmentsError = error;
              state.enrollmentsLoading = false;
            }),

          // Progress actions
          setProgress: (progress) =>
            set((state) => {
              state.progress = progress;
            }),

          updateProgress: (progressId, updates) =>
            set((state) => {
              const index = state.progress.findIndex(
                (p: { id: string }) => p.id === progressId,
              );
              if (index !== -1) {
                state.progress[index] = {
                  ...state.progress[index],
                  ...updates,
                };
              }
              if (state.currentProgress?.id === progressId) {
                state.currentProgress = {
                  ...state.currentProgress,
                  ...updates,
                };
              }
            }),

          setCurrentProgress: (progress) =>
            set((state) => {
              state.currentProgress = progress;
            }),

          markLessonComplete: (lessonId) =>
            set((state) => {
              const progress = state.currentProgress;
              if (progress && progress.lessonId === lessonId) {
                progress.completed = true;
                progress.lastAccessed = new Date();
              }
            }),

          updateTimeSpent: (lessonId, timeSpent) =>
            set((state) => {
              const progress = state.currentProgress;
              if (progress && progress.lessonId === lessonId) {
                progress.timeSpent = timeSpent;
                progress.lastAccessed = new Date();
              }
            }),

          // Learning path actions
          setCurrentModule: (module) =>
            set((state) => {
              state.currentModule = module;
            }),

          setCurrentLesson: (lesson) =>
            set((state) => {
              state.currentLesson = lesson;
            }),

          navigateToNextLesson: () =>
            set((state) => {
              const { currentCourse, currentModule, currentLesson } = state;
              if (!currentCourse || !currentModule || !currentLesson) return;

              const currentModuleIndex = currentCourse.modules.findIndex(
                (m: { id: unknown }) => m.id === currentModule.id,
              );
              const currentLessonIndex = currentModule.lessons.findIndex(
                (l: { id: unknown }) => l.id === currentLesson.id,
              );

              // Try next lesson in current module
              if (currentLessonIndex < currentModule.lessons.length - 1) {
                state.currentLesson =
                  currentModule.lessons[currentLessonIndex + 1];
              }
              // Try first lesson of next module
              else if (currentModuleIndex < currentCourse.modules.length - 1) {
                const nextModule =
                  currentCourse.modules[currentModuleIndex + 1];
                if (nextModule.lessons.length > 0) {
                  state.currentModule = nextModule;
                  state.currentLesson = nextModule.lessons[0];
                }
              }
            }),

          navigateToPrevLesson: () =>
            set((state) => {
              const { currentCourse, currentModule, currentLesson } = state;
              if (!currentCourse || !currentModule || !currentLesson) return;

              const currentModuleIndex = currentCourse.modules.findIndex(
                (m: { id: unknown }) => m.id === currentModule.id,
              );
              const currentLessonIndex = currentModule.lessons.findIndex(
                (l: { id: unknown }) => l.id === currentLesson.id,
              );

              // Try previous lesson in current module
              if (currentLessonIndex > 0) {
                state.currentLesson =
                  currentModule.lessons[currentLessonIndex - 1];
              }
              // Try last lesson of previous module
              else if (currentModuleIndex > 0) {
                const prevModule =
                  currentCourse.modules[currentModuleIndex - 1];
                if (prevModule.lessons.length > 0) {
                  state.currentModule = prevModule;
                  state.currentLesson =
                    prevModule.lessons[prevModule.lessons.length - 1];
                }
              }
            }),

          // UI actions
          toggleSidebar: () =>
            set((state) => {
              state.sidebar.isOpen = !state.sidebar.isOpen;
            }),

          setSidebarTab: (tab) =>
            set((state) => {
              state.sidebar.activeTab = tab;
            }),

          // Reset actions
          reset: () => set(initialState),
        },
      })),
    ),
    {
      name: "course-store",
      partialize: (state: { courseFilters: unknown; sidebar: unknown }) => ({
        courseFilters: state.courseFilters,
        sidebar: state.sidebar,
      }),
    },
  ),
);

// Selectors
export const useCourseActions = () => useCourseStore((state) => state.actions);
export const useCurrentCourse = () =>
  useCourseStore((state) => state.currentCourse);
export const useCourses = () => useCourseStore((state) => state.courses);
export const useCoursesLoading = () =>
  useCourseStore((state) => state.coursesLoading);
export const useCourseFilters = () =>
  useCourseStore((state) => state.courseFilters);
export const useEnrollments = () =>
  useCourseStore((state) => state.enrollments);
export const useCurrentEnrollment = () =>
  useCourseStore((state) => state.currentEnrollment);
export const useProgress = () => useCourseStore((state) => state.progress);
export const useCurrentModule = () =>
  useCourseStore((state) => state.currentModule);
export const useCurrentLesson = () =>
  useCourseStore((state) => state.currentLesson);
export const useSidebar = () => useCourseStore((state) => state.sidebar);

```

<!-- path: next-env.d.ts -->
```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

```

<!-- path: components.json -->
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

<!-- path: tsconfig.json -->
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

```

<!-- path: postcss.config.mjs -->
```mjs
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;

```

<!-- path: lib/utils.ts -->
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

```

<!-- path: lib/api/courseServices.ts -->
```typescript
// lib/api/courseServices.ts
import {
  Course,
  CourseFilters,
  CreateCourseRequest,
  UpdateCourseRequest,
  PaginatedResponse,
  Enrollment,
  Progress,
  Quiz,
  Question,
} from "@/types/course";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, "Network error or server unavailable");
  }
}

// Course Services
export const courseServices = {
  // Get all courses with optional filters
  async getCourses(
    filters: CourseFilters = {},
    page = 1,
    limit = 12,
  ): Promise<PaginatedResponse<Course>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.entries(filters).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = Array.isArray(value) ? value.join(",") : String(value);
          }
          return acc;
        },
        {} as Record<string, string>,
      ),
    });

    return apiRequest<PaginatedResponse<Course>>(`/courses?${params}`);
  },

  // Get course by ID
  async getCourse(id: string): Promise<Course> {
    return apiRequest<Course>(`/courses/${id}`);
  },

  // Create new course
  async createCourse(data: CreateCourseRequest): Promise<Course> {
    return apiRequest<Course>("/courses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update course
  async updateCourse(data: UpdateCourseRequest): Promise<Course> {
    return apiRequest<Course>(`/courses/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Delete course
  async deleteCourse(id: string): Promise<void> {
    return apiRequest<void>(`/courses/${id}`, {
      method: "DELETE",
    });
  },

  // Publish/unpublish course
  async toggleCoursePublication(id: string): Promise<Course> {
    return apiRequest<Course>(`/courses/${id}/toggle-publication`, {
      method: "PATCH",
    });
  },

  // Get courses by instructor
  async getCoursesByInstructor(instructorId: string): Promise<Course[]> {
    return apiRequest<Course[]>(`/courses/instructor/${instructorId}`);
  },

  // Search courses
  async searchCourses(query: string): Promise<Course[]> {
    return apiRequest<Course[]>(
      `/courses/search?q=${encodeURIComponent(query)}`,
    );
  },
};

// Enrollment Services
export const enrollmentServices = {
  // Enroll in course
  async enrollInCourse(courseId: string): Promise<Enrollment> {
    return apiRequest<Enrollment>("/enrollments", {
      method: "POST",
      body: JSON.stringify({ courseId }),
    });
  },

  // Get user enrollments
  async getUserEnrollments(userId?: string): Promise<Enrollment[]> {
    const endpoint = userId ? `/enrollments/user/${userId}` : "/enrollments/me";
    return apiRequest<Enrollment[]>(endpoint);
  },

  // Get course enrollments (for instructors)
  async getCourseEnrollments(courseId: string): Promise<Enrollment[]> {
    return apiRequest<Enrollment[]>(`/enrollments/course/${courseId}`);
  },

  // Update enrollment status
  async updateEnrollmentStatus(
    enrollmentId: string,
    status: string,
  ): Promise<Enrollment> {
    return apiRequest<Enrollment>(`/enrollments/${enrollmentId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  // Unenroll from course
  async unenrollFromCourse(enrollmentId: string): Promise<void> {
    return apiRequest<void>(`/enrollments/${enrollmentId}`, {
      method: "DELETE",
    });
  },
};

// Progress Services
export const progressServices = {
  // Get user progress for a course
  async getCourseProgress(courseId: string): Promise<Progress[]> {
    return apiRequest<Progress[]>(`/progress/course/${courseId}`);
  },

  // Update lesson progress
  async updateLessonProgress(
    lessonId: string,
    data: {
      completed?: boolean;
      timeSpent?: number;
      score?: number;
    },
  ): Promise<Progress> {
    return apiRequest<Progress>(`/progress/lesson/${lessonId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Mark lesson as complete
  async markLessonComplete(lessonId: string): Promise<Progress> {
    return apiRequest<Progress>(`/progress/lesson/${lessonId}/complete`, {
      method: "POST",
    });
  },

  // Get overall course completion
  async getCourseCompletion(courseId: string): Promise<{
    courseId: string;
    totalLessons: number;
    completedLessons: number;
    completionPercentage: number;
    timeSpent: number;
  }> {
    return apiRequest(`/progress/course/${courseId}/completion`);
  },

  // Get user's overall learning stats
  async getLearningStats(): Promise<{
    totalCoursesEnrolled: number;
    totalCoursesCompleted: number;
    totalTimeSpent: number;
    averageScore: number;
    achievements: string[];
  }> {
    return apiRequest("/progress/stats");
  },
};

// Quiz Services
export const quizServices = {
  // Get quiz by ID
  async getQuiz(quizId: string): Promise<Quiz> {
    return apiRequest<Quiz>(`/quizzes/${quizId}`);
  },

  // Submit quiz attempt
  async submitQuizAttempt(
    quizId: string,
    answers: Record<string, string | string[]>,
  ): Promise<{
    score: number;
    totalPoints: number;
    percentage: number;
    passed: boolean;
    answers: Array<{
      questionId: string;
      userAnswer: string | string[];
      correctAnswer: string | string[];
      isCorrect: boolean;
      points: number;
    }>;
  }> {
    return apiRequest(`/quizzes/${quizId}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    });
  },

  // Get quiz attempts
  async getQuizAttempts(quizId: string): Promise<
    Array<{
      id: string;
      userId: string;
      quizId: string;
      score: number;
      percentage: number;
      passed: boolean;
      attemptNumber: number;
      completedAt: Date;
    }>
  > {
    return apiRequest(`/quizzes/${quizId}/attempts`);
  },

  // Create quiz (for instructors)
  async createQuiz(
    moduleId: string,
    quizData: Omit<Quiz, "id" | "moduleId" | "createdAt" | "updatedAt">,
  ): Promise<Quiz> {
    return apiRequest("/quizzes", {
      method: "POST",
      body: JSON.stringify({ ...quizData, moduleId }),
    });
  },

  // Update quiz
  async updateQuiz(quizId: string, updates: Partial<Quiz>): Promise<Quiz> {
    return apiRequest(`/quizzes/${quizId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  // Delete quiz
  async deleteQuiz(quizId: string): Promise<void> {
    return apiRequest(`/quizzes/${quizId}`, {
      method: "DELETE",
    });
  },
};

// Analytics Services
export const analyticsServices = {
  // Get course analytics (for instructors)
  async getCourseAnalytics(courseId: string): Promise<{
    enrollmentStats: {
      total: number;
      active: number;
      completed: number;
      dropped: number;
    };
    progressStats: {
      averageCompletion: number;
      averageTimeSpent: number;
      mostPopularLessons: Array<{
        lessonId: string;
        lessonTitle: string;
        views: number;
      }>;
    };
    performanceStats: {
      averageQuizScore: number;
      passRate: number;
      commonMistakes: Array<{
        questionId: string;
        question: string;
        incorrectRate: number;
      }>;
    };
  }> {
    return apiRequest(`/analytics/course/${courseId}`);
  },

  // Get student analytics
  async getStudentAnalytics(
    userId: string,
    courseId?: string,
  ): Promise<{
    learningTime: Array<{
      date: string;
      minutes: number;
    }>;
    progressOverTime: Array<{
      date: string;
      completionPercentage: number;
    }>;
    performance: {
      averageScore: number;
      strongAreas: string[];
      improvementAreas: string[];
    };
  }> {
    const endpoint = courseId
      ? `/analytics/student/${userId}/course/${courseId}`
      : `/analytics/student/${userId}`;
    return apiRequest(endpoint);
  },

  // Get platform analytics (for admins)
  async getPlatformAnalytics(): Promise<{
    overview: {
      totalUsers: number;
      totalCourses: number;
      totalEnrollments: number;
      revenue: number;
    };
    trends: {
      userGrowth: Array<{ month: string; users: number }>;
      courseGrowth: Array<{ month: string; courses: number }>;
      revenueGrowth: Array<{ month: string; revenue: number }>;
    };
    topCourses: Array<{
      courseId: string;
      title: string;
      enrollments: number;
      rating: number;
      revenue: number;
    }>;
  }> {
    return apiRequest("/analytics/platform");
  },
};

// Export all services
export default {
  courses: courseServices,
  enrollments: enrollmentServices,
  progress: progressServices,
  quizzes: quizServices,
  analytics: analyticsServices,
};

```

<!-- path: lib/api/services.ts -->
```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Course,
  Lesson,
  Assessment,
  Enrollment,
  User,
  StudentProgress,
  AssessmentSubmission,
  Analytics,
  Notification,
} from "@/types/dashboard";

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Generic API client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add authentication token if available
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || "An error occurred",
          response.status,
          errorData.code,
        );
      }

      // Handle empty responses
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        error instanceof Error ? error.message : "Network error",
        0,
      );
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params)}`
      : endpoint;
    return this.request<T>(url);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = localStorage.getItem("auth_token");
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || "Upload failed",
        response.status,
        errorData.code,
      );
    }

    return await response.json();
  }
}

const apiClient = new ApiClient(API_BASE_URL);

// Course Services
export const courseService = {
  // Get all courses with filters
  getCourses: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    difficulty?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{
    courses: Course[];
    total: number;
    page: number;
    limit: number;
  }> => apiClient.get("/courses", params),

  // Get courses by instructor
  getCoursesByInstructor: (instructorId: string): Promise<Course[]> =>
    apiClient.get(`/courses/instructor/${instructorId}`),

  // Get enrolled courses for a student
  getEnrolledCourses: (studentId: string): Promise<Course[]> =>
    apiClient.get(`/courses/enrolled/${studentId}`),

  // Get single course by ID
  getCourse: (id: string): Promise<Course> => apiClient.get(`/courses/${id}`),

  // Create new course
  createCourse: (
    courseData: Omit<Course, "id" | "createdAt" | "updatedAt">,
  ): Promise<Course> => apiClient.post("/courses", courseData),

  // Update course
  updateCourse: (id: string, updates: Partial<Course>): Promise<Course> =>
    apiClient.patch(`/courses/${id}`, updates),

  // Delete course
  deleteCourse: (id: string): Promise<void> =>
    apiClient.delete(`/courses/${id}`),

  // Publish/unpublish course
  togglePublishCourse: (id: string, isPublished: boolean): Promise<Course> =>
    apiClient.patch(`/courses/${id}/publish`, { isPublished }),

  // Duplicate course
  duplicateCourse: (id: string, title: string): Promise<Course> =>
    apiClient.post(`/courses/${id}/duplicate`, { title }),

  // Upload course thumbnail
  uploadThumbnail: (
    id: string,
    file: File,
  ): Promise<{ thumbnailUrl: string }> => {
    const formData = new FormData();
    formData.append("thumbnail", file);
    return apiClient.upload(`/courses/${id}/thumbnail`, formData);
  },
};

// Lesson Services
export const lessonService = {
  // Get lessons for a course
  getLessons: (courseId: string): Promise<Lesson[]> =>
    apiClient.get(`/courses/${courseId}/lessons`),

  // Get single lesson
  getLesson: (courseId: string, lessonId: string): Promise<Lesson> =>
    apiClient.get(`/courses/${courseId}/lessons/${lessonId}`),

  // Create lesson
  createLesson: (
    courseId: string,
    lessonData: Omit<Lesson, "id" | "createdAt" | "updatedAt">,
  ): Promise<Lesson> =>
    apiClient.post(`/courses/${courseId}/lessons`, lessonData),

  // Update lesson
  updateLesson: (
    courseId: string,
    lessonId: string,
    updates: Partial<Lesson>,
  ): Promise<Lesson> =>
    apiClient.patch(`/courses/${courseId}/lessons/${lessonId}`, updates),

  // Delete lesson
  deleteLesson: (courseId: string, lessonId: string): Promise<void> =>
    apiClient.delete(`/courses/${courseId}/lessons/${lessonId}`),

  // Reorder lessons
  reorderLessons: (courseId: string, lessonIds: string[]): Promise<Lesson[]> =>
    apiClient.put(`/courses/${courseId}/lessons/reorder`, { lessonIds }),

  // Upload lesson video
  uploadVideo: (
    courseId: string,
    lessonId: string,
    file: File,
  ): Promise<{ videoUrl: string }> => {
    const formData = new FormData();
    formData.append("video", file);
    return apiClient.upload(
      `/courses/${courseId}/lessons/${lessonId}/video`,
      formData,
    );
  },

  // Upload lesson attachments
  uploadAttachments: (
    courseId: string,
    lessonId: string,
    files: File[],
  ): Promise<{ attachments: any[] }> => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`attachment_${index}`, file);
    });
    return apiClient.upload(
      `/courses/${courseId}/lessons/${lessonId}/attachments`,
      formData,
    );
  },
};

// Assessment Services
export const assessmentService = {
  // Get assessments for a course
  getAssessments: (courseId: string): Promise<Assessment[]> =>
    apiClient.get(`/courses/${courseId}/assessments`),

  // Get single assessment
  getAssessment: (
    courseId: string,
    assessmentId: string,
  ): Promise<Assessment> =>
    apiClient.get(`/courses/${courseId}/assessments/${assessmentId}`),

  // Create assessment
  createAssessment: (
    courseId: string,
    assessmentData: Omit<Assessment, "id" | "createdAt" | "updatedAt">,
  ): Promise<Assessment> =>
    apiClient.post(`/courses/${courseId}/assessments`, assessmentData),

  // Update assessment
  updateAssessment: (
    courseId: string,
    assessmentId: string,
    updates: Partial<Assessment>,
  ): Promise<Assessment> =>
    apiClient.patch(
      `/courses/${courseId}/assessments/${assessmentId}`,
      updates,
    ),

  // Delete assessment
  deleteAssessment: (courseId: string, assessmentId: string): Promise<void> =>
    apiClient.delete(`/courses/${courseId}/assessments/${assessmentId}`),

  // Get assessment submissions
  getSubmissions: (assessmentId: string): Promise<AssessmentSubmission[]> =>
    apiClient.get(`/assessments/${assessmentId}/submissions`),

  // Submit assessment
  submitAssessment: (
    assessmentId: string,
    answers: Record<string, any>,
  ): Promise<AssessmentSubmission> =>
    apiClient.post(`/assessments/${assessmentId}/submit`, { answers }),

  // Grade submission
  gradeSubmission: (
    submissionId: string,
    score: number,
    feedback?: string,
  ): Promise<AssessmentSubmission> =>
    apiClient.patch(`/submissions/${submissionId}/grade`, { score, feedback }),
};

// Enrollment Services
export const enrollmentService = {
  // Get enrollments
  getEnrollments: (params?: {
    courseId?: string;
    userId?: string;
    status?: string;
  }): Promise<Enrollment[]> => apiClient.get("/enrollments", params),

  // Enroll student in course
  enrollStudent: (courseId: string, userId: string): Promise<Enrollment> =>
    apiClient.post("/enrollments", { courseId, userId }),

  // Update enrollment
  updateEnrollment: (
    id: string,
    updates: Partial<Enrollment>,
  ): Promise<Enrollment> => apiClient.patch(`/enrollments/${id}`, updates),

  // Unenroll student
  unenrollStudent: (id: string): Promise<void> =>
    apiClient.delete(`/enrollments/${id}`),

  // Bulk enroll students
  bulkEnrollStudents: (
    courseId: string,
    userIds: string[],
  ): Promise<Enrollment[]> =>
    apiClient.post("/enrollments/bulk", { courseId, userIds }),
};

// Progress Services
export const progressService = {
  // Get student progress for a course
  getStudentProgress: (
    userId: string,
    courseId: string,
  ): Promise<StudentProgress[]> =>
    apiClient.get(`/progress/${userId}/${courseId}`),

  // Update lesson progress
  updateLessonProgress: (
    userId: string,
    courseId: string,
    lessonId: string,
    progressData: {
      completed?: boolean;
      timeSpent?: number;
      score?: number;
    },
  ): Promise<StudentProgress> =>
    apiClient.patch(
      `/progress/${userId}/${courseId}/${lessonId}`,
      progressData,
    ),

  // Get course completion certificate
  getCertificate: (
    userId: string,
    courseId: string,
  ): Promise<{ certificateUrl: string }> =>
    apiClient.get(`/progress/${userId}/${courseId}/certificate`),
};

// User Services
export const userService = {
  // Get users with filters
  getUsers: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<{ users: User[]; total: number; page: number; limit: number }> =>
    apiClient.get("/users", params),

  // Get single user
  getUser: (id: string): Promise<User> => apiClient.get(`/users/${id}`),

  // Update user
  updateUser: (id: string, updates: Partial<User>): Promise<User> =>
    apiClient.patch(`/users/${id}`, updates),

  // Delete user
  deleteUser: (id: string): Promise<void> => apiClient.delete(`/users/${id}`),

  // Invite user
  inviteUser: (userData: {
    email: string;
    name: string;
    role: string;
  }): Promise<{ message: string }> => apiClient.post("/users/invite", userData),

  // Upload user avatar
  uploadAvatar: (id: string, file: File): Promise<{ avatar: string }> => {
    const formData = new FormData();
    formData.append("avatar", file);
    return apiClient.upload(`/users/${id}/avatar`, formData);
  },
};

// Analytics Services
export const analyticsService = {
  // Get dashboard analytics
  getDashboardAnalytics: (role: string): Promise<Analytics> =>
    apiClient.get("/analytics/dashboard", { role }),

  // Get course analytics
  getCourseAnalytics: (
    courseId: string,
    timeRange?: string,
  ): Promise<{
    enrollments: number;
    completions: number;
    averageProgress: number;
    averageScore: number;
    timeSpent: number;
    dropoutRate: number;
    engagementRate: number;
    dailyActivity: Array<{ date: string; value: number }>;
    lessonPerformance: Array<{
      lessonId: string;
      completionRate: number;
      averageScore: number;
    }>;
  }> => apiClient.get(`/analytics/courses/${courseId}`, { timeRange }),

  // Get student analytics
  getStudentAnalytics: (
    userId: string,
  ): Promise<{
    totalCourses: number;
    completedCourses: number;
    totalTimeSpent: number;
    averageScore: number;
    certificates: number;
    progressOverTime: Array<{ date: string; progress: number }>;
    courseProgress: Array<{
      courseId: string;
      progress: number;
      lastAccessed: Date;
    }>;
  }> => apiClient.get(`/analytics/students/${userId}`),

  // Get instructor analytics
  getInstructorAnalytics: (
    instructorId: string,
  ): Promise<{
    totalCourses: number;
    totalStudents: number;
    averageCourseRating: number;
    totalRevenue: number;
    monthlyEnrollments: Array<{ month: string; enrollments: number }>;
    topPerformingCourses: Array<{
      courseId: string;
      title: string;
      rating: number;
      enrollments: number;
    }>;
  }> => apiClient.get(`/analytics/instructors/${instructorId}`),
};

// Notification Services
export const notificationService = {
  // Get notifications for user
  getNotifications: (params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<{ notifications: Notification[]; unreadCount: number }> =>
    apiClient.get("/notifications", params),

  // Mark notification as read
  markAsRead: (id: string): Promise<void> =>
    apiClient.patch(`/notifications/${id}/read`),

  // Mark all notifications as read
  markAllAsRead: (): Promise<void> =>
    apiClient.patch("/notifications/read-all"),

  // Delete notification
  deleteNotification: (id: string): Promise<void> =>
    apiClient.delete(`/notifications/${id}`),

  // Get notification settings
  getSettings: (): Promise<{
    emailNotifications: boolean;
    pushNotifications: boolean;
    courseUpdates: boolean;
    assessmentReminders: boolean;
    newEnrollments: boolean;
  }> => apiClient.get("/notifications/settings"),

  // Update notification settings
  updateSettings: (settings: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    courseUpdates?: boolean;
    assessmentReminders?: boolean;
    newEnrollments?: boolean;
  }): Promise<void> => apiClient.patch("/notifications/settings", settings),
};

// Search Services
export const searchService = {
  // Global search
  globalSearch: (
    query: string,
    filters?: {
      type?: "courses" | "users" | "assessments";
      category?: string;
      difficulty?: string;
    },
  ): Promise<{
    courses: Course[];
    users: User[];
    assessments: Assessment[];
    total: number;
  }> => apiClient.get("/search", { query, ...filters }),

  // Search suggestions
  getSuggestions: (query: string): Promise<string[]> =>
    apiClient.get("/search/suggestions", { query }),

  // Popular searches
  getPopularSearches: (): Promise<string[]> => apiClient.get("/search/popular"),
};

// Export all services
export { ApiError, apiClient };

```

<!-- path: lib/validations/auth.ts -->
```typescript
// lib/validations/auth.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["student", "teacher"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s-()]+$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

```

<!-- path: lib/firebase/config.ts -->
```typescript
// lib/firebase/config.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export { app };

```

<!-- path: lib/firebase/auth.ts -->
```typescript
// lib/firebase/auth.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  sendEmailVerification,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "./config";
import {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  UserRole,
} from "@/types/auth";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export class AuthService {
  // Sign in with email and password
  static async signInWithCredentials({
    email,
    password,
  }: LoginCredentials): Promise<AuthUser> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = await this.getUserData(userCredential.user);
      return user;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Sign in with Google
  static async signInWithGoogle(): Promise<AuthUser> {
    try {
      const userCredential: UserCredential = await signInWithPopup(
        auth,
        googleProvider,
      );
      const user = await this.getUserData(userCredential.user);

      // Check if this is a new user and create profile if needed
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await this.createUserProfile(userCredential.user, { role: "student" });
      }

      return user;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Register with email and password
  static async registerWithCredentials(
    credentials: RegisterCredentials,
  ): Promise<AuthUser> {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        role = "student",
      } = credentials;

      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password);

      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`,
      });

      // Create user document in Firestore
      await this.createUserProfile(userCredential.user, {
        role,
        firstName,
        lastName,
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);

      const user = await this.getUserData(userCredential.user);
      return user;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Create user profile in Firestore
  static async createUserProfile(
    firebaseUser: User,
    additionalData: {
      role: UserRole;
      firstName?: string;
      lastName?: string;
      organizationId?: string;
    },
  ): Promise<void> {
    const userRef = doc(db, "users", firebaseUser.uid);

    const userData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      emailVerified: firebaseUser.emailVerified,
      role: additionalData.role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      profile: {
        firstName: additionalData.firstName || "",
        lastName: additionalData.lastName || "",
      },
      organizationId: additionalData.organizationId || null,
    };

    await setDoc(userRef, userData);
  }

  // Get user data from Firestore
  static async getUserData(firebaseUser: User): Promise<AuthUser> {
    const userRef = doc(db, "users", firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified,
        role: userData.role || "student",
        createdAt: userData.createdAt?.toDate() || new Date(),
        updatedAt: userData.updatedAt?.toDate() || new Date(),
        organizationId: userData.organizationId,
        profile: userData.profile,
      };
    } else {
      // Create a basic user profile if it doesn't exist
      await this.createUserProfile(firebaseUser, { role: "student" });
      return this.getUserData(firebaseUser);
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Update password
  static async updateUserPassword(newPassword: string): Promise<void> {
    try {
      if (!auth.currentUser) throw new Error("No authenticated user");
      await updatePassword(auth.currentUser, newPassword);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Update user profile
  static async updateUserProfile(updates: Partial<AuthUser>): Promise<void> {
    try {
      if (!auth.currentUser) throw new Error("No authenticated user");

      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Send email verification
  static async sendVerificationEmail(): Promise<void> {
    try {
      if (!auth.currentUser) throw new Error("No authenticated user");
      await sendEmailVerification(auth.currentUser);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Role checking utilities
  static hasRole(user: AuthUser | null, requiredRole: UserRole): boolean {
    if (!user) return false;

    const roleHierarchy: Record<UserRole, number> = {
      student: 1,
      teacher: 2,
      admin: 3,
      "super-admin": 4,
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  }

  static isSuperAdmin(user: AuthUser | null): boolean {
    return user?.role === "super-admin";
  }

  static isAdmin(user: AuthUser | null): boolean {
    return this.hasRole(user, "admin");
  }

  static isTeacher(user: AuthUser | null): boolean {
    return this.hasRole(user, "teacher");
  }

  static isStudent(user: AuthUser | null): boolean {
    return this.hasRole(user, "student");
  }

  // Error handling
  private static handleAuthError(error: unknown) {
    console.error("Auth Error:", error);

    if (typeof error === "object" && error !== null && "code" in error) {
      const code = (error as { code: string }).code;
      switch (code) {
        case "auth/user-not-found":
          return new Error("No account found with this email address");
        case "auth/wrong-password":
          return new Error("Incorrect password");
        case "auth/email-already-in-use":
          return new Error("An account with this email already exists");
        case "auth/weak-password":
          return new Error("Password is too weak");
        case "auth/invalid-email":
          return new Error("Invalid email address");
        case "auth/user-disabled":
          return new Error("This account has been disabled");
        case "auth/too-many-requests":
          return new Error("Too many failed attempts. Please try again later");
        case "auth/popup-closed-by-user":
          return new Error("Sign-in cancelled");
        case "auth/popup-blocked":
          return new Error("Popup blocked by browser");
        default:
          return new Error(
            (error as { message?: string }).message ||
              "An unexpected error occurred",
          );
      }
    }
    return new Error("An unexpected error occurred");
  }
}

```

