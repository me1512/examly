import { UserRole } from "@/types/auth";
import { Course } from "@/types/dashboard";
import Link from "next/link";
import { Button } from "../ui/Button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Recent Courses Component (for admin/teacher)
function RecentCourses({
  courses,
  userRole,
}: {
  courses: Course[];
  userRole: UserRole;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {userRole === "teacher" ? "My Courses" : "Recent Courses"}
        </h3>
        <Link href="/dashboard/courses">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.slice(0, 3).map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md dark:border-gray-700"
          >
            <div className="mb-2 flex items-center justify-between">
              <h4 className="truncate font-medium text-gray-900 dark:text-white">
                {course.title}
              </h4>
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-xs",
                  course.isPublished
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                )}
              >
                {course.isPublished ? "Published" : "Draft"}
              </span>
            </div>
            <p className="mb-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
              {course.description}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{course.studentsCount} students</span>
              <span>{course.lessonsCount} lessons</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default RecentCourses;
