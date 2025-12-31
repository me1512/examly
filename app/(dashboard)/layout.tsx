// app/(dashboard)/layout.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Added useRouter
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Menu,
  Bell,
  Search,
  Plus,
  ChevronDown,
  GraduationCap,
  Calendar,
  MessageSquare,
  Award,
  FileText,
  Shield,
  Database,
  Zap,
} from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { UserMenu } from "@/components/auth/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// ... (Interface NavigationItem and navigation array remain the same) ...
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
  const { user, isLoading, isInitialized } = useAuth();
  const router = useRouter(); // Added router
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications] = useState(3);

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

  // Protected Route Check: Redirect if initialized but no user
  useEffect(() => {
    if (isInitialized && !isLoading && !user) {
      router.push("/login");
    }
  }, [isInitialized, isLoading, user, router]);

  const toggleExpand = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName],
    );
  };

  // Show loading spinner while Auth is initializing or if we have no user (preventing flash)
  if (isLoading || !isInitialized || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // At this point, `user` is guaranteed to exist
  const filteredNavigation = navigation.filter(
    (item) => user.role && item.roles.includes(user.role),
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
            (child) => user.role && child.roles.includes(user.role),
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
              {(user.role === "teacher" ||
                user.role === "admin" ||
                user.role === "super-admin") && (
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
