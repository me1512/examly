// components/courses/CourseCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  Users,
  Star,
  BookOpen,
  Play,
  Badge,
  DollarSign,
} from "lucide-react";
import { Course } from "@/types/course";
import { Button } from "@/components/ui/Button";
import {
  useEnrollmentStatus,
  useEnrollInCourse
} from "@/hooks/useCourseQueries";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CourseCardProps {
  course: Course;
  variant?: "default" | "enrolled" | "compact";
  showProgress?: boolean;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  variant = "default",
  showProgress = false,
  className,
}) => {
  const { user } = useAuth();
  const { isEnrolled, enrollment } = useEnrollmentStatus(course.id);
  const enrollMutation = useEnrollInCourse();

  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      // Redirect to login
      window.location.href = "/login";
      return;
    }
    enrollMutation.mutate(course.id);
  };

  const formatDuration = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}min`;
    return `${Math.round(hours)}h`;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `$${price}`;
  };

  const getLevelColor = (level: string) => {
    const colors = {
      beginner:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      intermediate:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      expert:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    };
    return colors[level as keyof typeof colors] || colors.beginner;
  };

  if (variant === "compact") {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className={cn(
          "overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800",
          className,
        )}
      >
        <Link href={`/courses/${course.id}`}>
          <div className="flex items-center space-x-4 p-4">
            <div className="flex-shrink-0">
              <Image
                src={course.thumbnail || "/placeholder-course.jpg"}
                alt={course.title}
                width={64}
                height={64}
                className="h-16 w-16 rounded-lg object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {course.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                by {course.instructorName}
              </p>

              <div className="mt-2 flex items-center space-x-3">
                <span className="flex items-center text-xs text-gray-500">
                  <Clock className="mr-1 h-3 w-3" />
                  {formatDuration(course.duration)}
                </span>
                <span className="flex items-center text-xs text-yellow-500">
                  <Star className="mr-1 h-3 w-3 fill-current" />
                  {course.rating.toFixed(1)}
                </span>
              </div>
            </div>

            {enrollment && showProgress && (
              <div className="flex-shrink-0">
                <div className="relative h-12 w-12">
                  <svg className="h-12 w-12 -rotate-90 transform">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-gray-300 dark:text-gray-600"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 20}`}
                      strokeDashoffset={`${2 * Math.PI * 20 * (1 - enrollment.progress / 100)}`}
                      className="text-blue-500"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                    {Math.round(enrollment.progress)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800",
        className,
      )}
    >
      <Link href={`/courses/${course.id}`}>
        <div className="relative">
          <Image
            src={course.thumbnail || "/placeholder-course.jpg"}
            alt={course.title}
            width={64}
            height={64}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Price badge */}
          <div className="absolute top-3 right-3">
            <span className="rounded-full bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white">
              {formatPrice(course.price)}
            </span>
          </div>

          {/* Level badge */}
          <div className="absolute top-3 left-3">
            <span
              className={cn(
                "rounded-full px-2 py-1 text-xs font-semibold",
                getLevelColor(course.level),
              )}
            >
              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
            </span>
          </div>

          {/* Play button overlay */}
          <div className="bg-opacity-0 group-hover:bg-opacity-20 absolute inset-0 flex items-center justify-center bg-black transition-all duration-300">
            <Play className="h-16 w-16 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-80" />
          </div>
        </div>
      </Link>

      <div className="p-6">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/courses/${course.id}`}>
              <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                {course.title}
              </h3>
            </Link>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              by {course.instructorName}
            </p>
          </div>
        </div>

        <p className="mb-4 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
          {course.description}
        </p>

        {/* Course stats */}
        <div className="mb-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              {formatDuration(course.duration)}
            </span>
            <span className="flex items-center">
              <BookOpen className="mr-1 h-4 w-4" />
              {course.modules.length} modules
            </span>
            <span className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              {course.enrollmentCount}
            </span>
          </div>

          <div className="flex items-center">
            <Star className="mr-1 h-4 w-4 fill-current text-yellow-500" />
            <span>{course.rating.toFixed(1)}</span>
            <span className="ml-1">({course.reviewCount})</span>
          </div>
        </div>

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {course.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
            {course.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{course.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action button */}
        <div className="flex items-center justify-between">
          {isEnrolled ? (
            <div className="flex w-full items-center space-x-3">
              <Link href={`/learn/${course.id}`} className="flex-1">
                <Button variant="default" className="w-full">
                  Continue Learning
                </Button>
              </Link>
              {enrollment && showProgress && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.round(enrollment.progress)}% complete
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={handleEnroll}
              disabled={enrollMutation.isPending}
              className="w-full"
              variant={course.price > 0 ? "default" : "secondary"}
            >
              {enrollMutation.isPending ? (
                "Enrolling..."
              ) : course.price > 0 ? (
                <>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Buy Now - {formatPrice(course.price)}
                </>
              ) : (
                "Enroll Free"
              )}
            </Button>
          )}
        </div>

        {/* Progress bar for enrolled courses */}
        {isEnrolled && enrollment && showProgress && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Progress</span>
              <span>{Math.round(enrollment.progress)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${enrollment.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CourseCard;
