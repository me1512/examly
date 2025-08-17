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
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow-sm">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-xl font-bold text-transparent dark:from-white dark:to-gray-300">
                EduPlatform
              </span>
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
