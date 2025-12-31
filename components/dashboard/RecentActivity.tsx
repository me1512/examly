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
