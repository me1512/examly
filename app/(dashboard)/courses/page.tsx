// app/(dashboard)/courses/page.tsx
"use client";

import CourseCard from "@/components/courses/CourseCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/hooks/useAuth";
import { useCourses, useSearchCourses } from "@/hooks/useCourseQueries";
import { cn } from "@/lib/utils"; // Assuming cn is used for class name utility
import { useCourseActions, useCourseFilters } from "@/stores/courseStore";
import { CourseCategory, CourseLevel } from "@/types/course";
import { motion } from "framer-motion";
import { Grid, List, Plus, Search } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

const ITEMS_PER_PAGE = 12;

const CoursesPage = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "popular" | "rating"
  >("newest");

  const filters = useCourseFilters();
  const { setCourseFilters, clearCourseFilters } = useCourseActions();

  // Main courses query
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
  } = useCourses(filters, currentPage, ITEMS_PER_PAGE);

  // Search query
  const { data: searchResults, isLoading: searchLoading } =
    useSearchCourses(searchQuery);

  // Determine which data to show
  const isSearching = searchQuery.length >= 2;
  const courses = useMemo(() => {
    return isSearching ? searchResults || [] : coursesData?.data || [];
  }, [isSearching, searchResults, coursesData?.data]);

  const isLoading = isSearching ? searchLoading : coursesLoading;
  const totalPages = isSearching
    ? 1
    : Math.ceil((coursesData?.total || 0) / ITEMS_PER_PAGE);

  // Sort courses
  const sortedCourses = useMemo(() => {
    if (!courses) return [];

    const sorted = [...courses];
    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      case "popular":
        return sorted.sort((a, b) => b.enrollmentCount - a.enrollmentCount);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  }, [courses, sortBy]);

  const handleFilterChange = (key: string, value: any) => {
    setCourseFilters({ [key]: value });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    clearCourseFilters();
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const canCreateCourse =
    user?.role === "teacher" ||
    user?.role === "admin" ||
    user?.role === "super-admin";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {isSearching ? "Search Results" : "All Courses"}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {isSearching
                  ? `Found ${courses.length} course${courses.length !== 1 ? "s" : ""} for "${searchQuery}"`
                  : `Discover ${coursesData?.total || 0} courses to advance your skills`}
              </p>
            </div>

            {canCreateCourse && (
              <Link href="/courses/create">
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Course</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pr-4 pl-10"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="min-w-0 flex-shrink-0">
              <Select
                value={filters.category || ""}
                onValueChange={(value) =>
                  handleFilterChange("category", value || undefined)
                }
              >
                <option value="">All Categories</option>
                {Object.values(CourseCategory).map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </Select>
            </div>

            {/* Level Filter */}
            <div className="min-w-0 flex-shrink-0">
              <Select
                value={filters.level || ""}
                onValueChange={(value) =>
                  handleFilterChange("level", value || undefined)
                }
              >
                <option value="">All Levels</option>
                {Object.values(CourseLevel).map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </Select>
            </div>

            {/* Price Filter */}
            <div className="min-w-0 flex-shrink-0">
              <Select
                value={
                  filters.priceRange
                    ? `${filters.priceRange[0]}-${filters.priceRange[1]}`
                    : ""
                }
                onValueChange={(value) => {
                  if (value === "free") {
                    handleFilterChange("priceRange", [0, 0]);
                  } else if (value === "paid") {
                    handleFilterChange("priceRange", [1, 1000]);
                  } else {
                    handleFilterChange("priceRange", undefined);
                  }
                }}
              >
                <option value="">All Prices</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </Select>
            </div>

            {/* Sort By */}
            <div className="min-w-0 flex-shrink-0">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as any)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </Select>
            </div>

            <div className="ml-auto flex items-center space-x-2">
              {/* View Mode Toggle */}
              <div className="flex items-center rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "rounded-md p-2 transition-colors",
                    viewMode === "grid"
                      ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
                  )}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "rounded-md p-2 transition-colors",
                    viewMode === "list"
                      ? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Clear Filters */}
              {(Object.keys(filters).length > 0 || searchQuery) && (
                <Button
                  variant="secondary"
                  onClick={handleClearFilters}
                  className="text-sm"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Error State */}
        {coursesError && !isLoading && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
            <p className="text-red-600 dark:text-red-400">
              Failed to load courses. Please try again.
            </p>
            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && courses.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              {isSearching ? "No courses found" : "No courses available"}
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              {isSearching
                ? `Try adjusting your search terms or filters`
                : "Check back later for new courses"}
            </p>
            {isSearching && (
              <Button onClick={handleClearFilters}>
                Clear Search and Filters
              </Button>
            )}
          </div>
        )}

        {/* Courses Grid/List */}
        {!isLoading && courses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className={cn(
                "mb-8 grid gap-6",
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1",
              )}
            >
              {sortedCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <CourseCard
                    course={course}
                    variant={viewMode === "list" ? "compact" : "default"}
                  />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {!isSearching && totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 2,
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="text-gray-400">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "secondary"}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  ))}

                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
