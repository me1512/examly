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
