import Link from "next/link";
import { Button } from "../ui/Button";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Enrollment } from "@/types/dashboard";

// My Enrollments Component (for students)
function MyEnrollments({ enrollments }: { enrollments: Enrollment[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          My Courses
        </h3>
        <Link href="/dashboard/courses/my-courses">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {enrollments.slice(0, 5).map((enrollment, index) => (
          <motion.div
            key={enrollment.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {enrollment.title}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {enrollment.instructorName}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {enrollment.progress}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default MyEnrollments;
