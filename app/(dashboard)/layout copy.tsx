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
