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
