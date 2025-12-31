"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { DashboardData, DashboardStats, Enrollment } from "@/types/dashboard";
import MyEnrollments from "@/components/dashboard/MyEnrollments";
import RecentCourses from "@/components/dashboard/RecentCourses";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import StatsCard from "@/components/dashboard/StatsCard";
import { getRoleBasedWelcomeMessage } from "@/components/dashboard/Helper";
import { useMockDashboardData } from "@/hooks/useApiQueries";

export default function DashboardPage() {
  const { user } = useAuth();

  // Use React Query for data fetching
  // This automatically handles loading states, caching, and deduping
  const { data: dashboardData, isLoading } = useMockDashboardData(
    user?.role || "student",
  );

  if (isLoading || !dashboardData) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Type assertion since the mock data generator returns a loose object
  // In a real app, the API response would match the interface
  const typedData = dashboardData as unknown as DashboardData;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg"
      >
        <h1 className="mb-2 text-3xl font-bold">
          Welcome back, {user?.displayName || "Student"}!
        </h1>
        <p className="text-blue-100">
          {getRoleBasedWelcomeMessage(user?.role || "student")}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {typedData.stats.map((stat: DashboardStats, index: number) => (
          <StatsCard key={stat.title} stat={stat} index={index} />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <RecentActivity
            activities={typedData.recentActivity}
            userRole={user?.role || "student"}
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <QuickActions userRole={user?.role || "student"} />
        </motion.div>
      </div>

      {/* Role-specific content */}
      {user?.role !== "student" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <RecentCourses
            courses={typedData.recentCourses}
            userRole={user?.role || "student"}
          />
        </motion.div>
      )}

      {user?.role === "student" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Note: The mock helper uses 'recentEnrollments' but interface might expect 'enrollments' */}
          <MyEnrollments
            enrollments={typedData.recentEnrollments as Enrollment[]}
          />
        </motion.div>
      )}
    </div>
  );
}
