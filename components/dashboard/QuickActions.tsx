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
