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
