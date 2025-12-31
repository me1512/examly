// app/(dashboard)/courses/[id]/page.tsx
"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  Download,
  Share2,
  Heart,
  CheckCircle,
  Lock,
  ArrowLeft,
  DollarSign,
  Calendar,
  Award,
  Globe,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  useCourse,
  useEnrollmentStatus,
  useEnrollInCourse,
} from "@/hooks/useCourseQueries";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "react-hot-toast";

const CourseDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const courseId = params.id as string;

  const [activeTab, setActiveTab] = useState<
    "overview" | "curriculum" | "reviews"
  >("overview");
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const { data: course, isLoading, error } = useCourse(courseId);
  const { isEnrolled, enrollment } = useEnrollmentStatus(courseId);
  const enrollMutation = useEnrollInCourse();

  const handleEnroll = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    enrollMutation.mutate(courseId);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: course?.title,
        text: course?.description,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Course link copied to clipboard!");
    }
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Course not found
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/courses"
            className="mb-6 flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Course Info */}
            <div className="lg:col-span-2">
              {/* Course Header */}
              <div className="mb-6">
                <div className="mb-4 flex items-center space-x-3">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-sm font-semibold",
                      getLevelColor(course.level),
                    )}
                  >
                    {course.level.charAt(0).toUpperCase() +
                      course.level.slice(1)}
                  </span>
                  <span className="text-gray-600 capitalize dark:text-gray-400">
                    {course.category}
                  </span>
                </div>

                <h1 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl dark:text-white">
                  {course.title}
                </h1>

                <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    {course.enrollmentCount} students
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {formatDuration(course.duration)}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    {course.modules.length} modules
                  </div>
                  <div className="flex items-center">
                    <Star className="mr-2 h-4 w-4 fill-current text-yellow-500" />
                    {course.rating.toFixed(1)} ({course.reviewCount} reviews)
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Updated {new Date(course.updatedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Instructor */}
                <div className="mt-6 flex items-center rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">
                    {course.instructorName.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Course by
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {course.instructorName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "curriculum", label: "Curriculum" },
                    { id: "reviews", label: "Reviews" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "border-b-2 px-1 pb-4 text-sm font-medium transition-colors",
                        activeTab === tab.id
                          ? "border-blue-600 text-blue-600 dark:text-blue-400"
                          : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    {/* What You'll Learn */}
                    <div>
                      <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                        What you'll learn
                      </h3>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {course.learningOutcomes.map((outcome, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-green-500" />
                            <span className="text-gray-700 dark:text-gray-300">
                              {outcome}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prerequisites */}
                    {course.prerequisites.length > 0 && (
                      <div>
                        <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                          Prerequisites
                        </h3>
                        <ul className="space-y-2">
                          {course.prerequisites.map((prerequisite, index) => (
                            <li key={index} className="flex items-start">
                              <div className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">
                                {prerequisite}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tags */}
                    {course.tags.length > 0 && (
                      <div>
                        <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                          Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {course.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "curriculum" && (
                  <div className="space-y-4">
                    <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                      Course Content
                    </h3>
                    <p className="mb-6 text-gray-600 dark:text-gray-400">
                      {course.modules.length} modules •{" "}
                      {course.modules.reduce(
                        (acc, module) => acc + module.lessons.length,
                        0,
                      )}{" "}
                      lessons • {formatDuration(course.duration)} total length
                    </p>

                    <div className="space-y-4">
                      {course.modules.map((module, moduleIndex) => (
                        <div
                          key={module.id}
                          className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          <button
                            onClick={() =>
                              setExpandedModule(
                                expandedModule === module.id ? null : module.id,
                              )
                            }
                            className="w-full bg-gray-50 px-6 py-4 text-left transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  Module {moduleIndex + 1}: {module.title}
                                </h4>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                  {module.lessons.length} lessons •{" "}
                                  {formatDuration(module.duration)}
                                </p>
                              </div>
                              <motion.div
                                animate={{
                                  rotate:
                                    expandedModule === module.id ? 180 : 0,
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                <svg
                                  className="h-5 w-5 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </motion.div>
                            </div>
                          </button>

                          {expandedModule === module.id && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="bg-white px-6 py-4 dark:bg-gray-900">
                                <p className="mb-4 text-gray-600 dark:text-gray-400">
                                  {module.description}
                                </p>

                                <div className="space-y-3">
                                  {module.lessons.map((lesson, lessonIndex) => (
                                    <div
                                      key={lesson.id}
                                      className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
                                    >
                                      <div className="flex items-center">
                                        {isEnrolled ? (
                                          <Play className="mr-3 h-4 w-4 text-blue-600" />
                                        ) : (
                                          <Lock className="mr-3 h-4 w-4 text-gray-400" />
                                        )}
                                        <div>
                                          <p className="font-medium text-gray-900 dark:text-white">
                                            {lesson.title}
                                          </p>
                                          <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {lesson.type} •{" "}
                                            {formatDuration(lesson.duration)}
                                          </p>
                                        </div>
                                      </div>

                                      {isEnrolled && (
                                        <Link
                                          href={`/learn/${courseId}/${module.id}/${lesson.id}`}
                                        >
                                          <Button size="sm" variant="secondary">
                                            Start
                                          </Button>
                                        </Link>
                                      )}
                                    </div>
                                  ))}
                                </div>

                                {module.quiz && (
                                  <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <Award className="mr-3 h-4 w-4 text-blue-600" />
                                        <div>
                                          <p className="font-medium text-blue-900 dark:text-blue-300">
                                            Module Quiz: {module.quiz.title}
                                          </p>
                                          <p className="text-sm text-blue-700 dark:text-blue-400">
                                            {module.quiz.questions.length}{" "}
                                            questions • {module.quiz.timeLimit}{" "}
                                            minutes
                                          </p>
                                        </div>
                                      </div>

                                      {isEnrolled && (
                                        <Button
                                          size="sm"
                                          className="bg-blue-600 hover:bg-blue-700"
                                        >
                                          Take Quiz
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Student Reviews
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 fill-current text-yellow-500" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {course.rating.toFixed(1)}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          ({course.reviewCount} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Review placeholder */}
                    <div className="py-12 text-center">
                      <MessageCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Reviews will be displayed here
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Course Video/Image */}
                <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <div className="relative">
                    <img
                      src={course.thumbnail || "/placeholder-course.jpg"}
                      alt={course.title}
                      className="h-48 w-full object-cover"
                    />
                    <div className="bg-opacity-30 absolute inset-0 flex items-center justify-center bg-black">
                      <Play className="h-16 w-16 text-white" />
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Price */}
                    <div className="mb-6 text-center">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(course.price)}
                      </span>
                      {course.price > 0 && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          One-time payment
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {isEnrolled ? (
                        <>
                          <Link href={`/learn/${courseId}`} className="block">
                            <Button className="w-full" size="lg">
                              Continue Learning
                            </Button>
                          </Link>
                          {enrollment && (
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                              <div className="mb-2 flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Progress
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  {Math.round(enrollment.progress)}%
                                </span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-600">
                                <div
                                  className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                                  style={{ width: `${enrollment.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <Button
                          onClick={handleEnroll}
                          disabled={enrollMutation.isLoading}
                          className="w-full"
                          size="lg"
                        >
                          {enrollMutation.isLoading ? (
                            <>
                              <LoadingSpinner size="sm" className="mr-2" />
                              Enrolling...
                            </>
                          ) : course.price > 0 ? (
                            <>
                              <DollarSign className="mr-2 h-4 w-4" />
                              Buy Now
                            </>
                          ) : (
                            "Enroll Free"
                          )}
                        </Button>
                      )}

                      {/* Secondary Actions */}
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          onClick={handleShare}
                          className="flex flex-1 items-center justify-center"
                        >
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                        <Button
                          variant="secondary"
                          className="flex flex-1 items-center justify-center"
                        >
                          <Heart className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    </div>

                    {/* Course Includes */}
                    <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                      <h4 className="mb-4 font-semibold text-gray-900 dark:text-white">
                        This course includes:
                      </h4>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-center">
                          <Clock className="mr-3 h-4 w-4 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {formatDuration(course.duration)} on-demand video
                          </span>
                        </li>
                        <li className="flex items-center">
                          <BookOpen className="mr-3 h-4 w-4 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {course.modules.length} modules
                          </span>
                        </li>
                        <li className="flex items-center">
                          <Download className="mr-3 h-4 w-4 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Downloadable resources
                          </span>
                        </li>
                        <li className="flex items-center">
                          <Globe className="mr-3 h-4 w-4 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Full lifetime access
                          </span>
                        </li>
                        <li className="flex items-center">
                          <Award className="mr-3 h-4 w-4 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Certificate of completion
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Related Courses */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <h4 className="mb-4 font-semibold text-gray-900 dark:text-white">
                    More courses by {course.instructorName}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Related courses will be displayed here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
