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
