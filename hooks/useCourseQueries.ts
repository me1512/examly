"use client"

// hooks/useCourseQueries.ts
import { useEffect } from "react";
import { useEnrollments } from "./useApiQueries";
import {
  courseServices,
  enrollmentServices,
  progressServices,
  quizServices,
} from "@/lib/api/courseServices";
import { useCourseActions } from "@/stores/courseStore";
import {
  CourseFilters,
  CreateCourseRequest,
  UpdateCourseRequest,
} from "@/types/course";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

// Query Keys
export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (filters: CourseFilters) =>
    [...courseKeys.lists(), { filters }] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
  instructor: (instructorId: string) =>
    [...courseKeys.all, "instructor", instructorId] as const,
  search: (query: string) => [...courseKeys.all, "search", query] as const,
};

export const enrollmentKeys = {
  all: ["enrollments"] as const,
  user: (userId?: string) => [...enrollmentKeys.all, "user", userId] as const,
  course: (courseId: string) =>
    [...enrollmentKeys.all, "course", courseId] as const,
};

export const progressKeys = {
  all: ["progress"] as const,
  course: (courseId: string) =>
    [...progressKeys.all, "course", courseId] as const,
  completion: (courseId: string) =>
    [...progressKeys.all, "completion", courseId] as const,
  stats: () => [...progressKeys.all, "stats"] as const,
};

// Course Queries
export const useCourses = (
  filters: CourseFilters = {},
  page = 1,
  limit = 12,
) => {
  const { setCourses, setCoursesLoading, setCoursesError } = useCourseActions();

  const result = useQuery({
    queryKey: courseKeys.list({ ...filters, page, limit }),
    queryFn: () => courseServices.getCourses(filters, page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle side effects
  useEffect(() => {
    if (result.data) {
      setCourses(result.data.data);
    }
    if (result.error) {
      setCoursesError(result.error.message);
      toast.error("Failed to load courses");
    }
    setCoursesLoading(result.isLoading);
  }, [result.data, result.error, result.isLoading, setCourses, setCoursesError, setCoursesLoading]);

  return result;
};

export const useCourse = (id: string) => {
  const { setCurrentCourse } = useCourseActions();

  const result = useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => courseServices.getCourse(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    if (result.data) {
      setCurrentCourse(result.data);
    }
  }, [result.data, setCurrentCourse]);

  useEffect(() => {
    if (result.error) {
      toast.error("Failed to load course details");
    }
  }, [result.error]);

  return result;
};

export const useCourseProgress = (courseId: string) => {
  const { setProgress } = useCourseActions();

  const result = useQuery({
    queryKey: progressKeys.course(courseId),
    queryFn: () => progressServices.getCourseProgress(courseId),
    enabled: !!courseId,
  });

  useEffect(() => {
    if (result.data) {
      setProgress(result.data);
    }
  }, [result.data, setProgress]);

  useEffect(() => {
    if (result.error) {
      toast.error("Failed to load course progress");
    }
  }, [result.error]);

  return result;
};

export const useInstructorCourses = (instructorId: string) => {
  const result = useQuery({
    queryKey: courseKeys.instructor(instructorId),
    queryFn: () => courseServices.getCoursesByInstructor(instructorId),
    enabled: !!instructorId,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (result.error) {
      toast.error("Failed to load instructor courses");
    }
  }, [result.error]);

  return result;
};

export const useSearchCourses = (query: string) => {
  const result = useQuery({
    queryKey: courseKeys.search(query),
    queryFn: () => courseServices.searchCourses(query),
    enabled: query.length > 2,
  });

  useEffect(() => {
    if (result.error) {
      toast.error("Failed to search courses");
    }
  }, [result.error]);

  return result;
};

// Course Mutations
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const { addCourse } = useCourseActions();

  return useMutation({
    mutationFn: (data: CreateCourseRequest) =>
      courseServices.createCourse(data),
    onSuccess: (newCourse) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      addCourse(newCourse);
      toast.success("Course created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create course");
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  const { updateCourse } = useCourseActions();

  return useMutation({
    mutationFn: (data: UpdateCourseRequest) =>
      courseServices.updateCourse(data),
    onSuccess: (updatedCourse) => {
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(updatedCourse.id),
      });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      updateCourse(updatedCourse.id, updatedCourse);
      toast.success("Course updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update course");
    },
  });
};

// ...

// Progress Mutations
export const useMarkLessonComplete = (lessonId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      progressServices.markLessonComplete(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressKeys.all });
      toast.success("Lesson marked as complete!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to mark lesson as complete");
    },
  });
};

export const useUpdateLessonProgress = (lessonId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { completed: boolean }) =>
      progressServices.updateLessonProgress(lessonId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressKeys.all });
      toast.success("Lesson progress updated!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update lesson progress");
    },
  });
};

// ...

// Quiz Mutations
export const useSubmitQuizAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      answers,
    }: {
      quizId: string;
      answers: Record<string, string | string[]>;
    }) => quizServices.submitQuizAttempt(quizId, answers),
    onSuccess: (result, { quizId }) => {
      queryClient.invalidateQueries({ queryKey: ["quiz-attempts", quizId] });
      queryClient.invalidateQueries({ queryKey: progressKeys.all });
      toast.success(
        result.passed
          ? `Quiz passed! Score: ${result.percentage}%`
          : `Quiz completed. Score: ${result.percentage}%`,
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit quiz");
    },
  });
};

// Enrollment Mutations
export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (courseId: string) => enrollmentServices.enrollInCourse(courseId),
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.user() });
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.course(courseId) });
      toast.success('Successfully enrolled in the course!');
    },
    onError: (error: Error) => {
      toast.error(`Enrollment failed: ${error.message}`);
    },
  });
};

// Custom hooks for common operations
import type { Enrollment as CourseEnrollment } from "@/types/course";
import type { Enrollment as DashboardEnrollment } from "@/types/dashboard";

type Enrollment = CourseEnrollment | DashboardEnrollment;

export const useEnrollmentStatus = (courseId: string) => {
  const { data: enrollments } = useEnrollments();
  const enrollment = Array.isArray(enrollments) 
    ? enrollments.find((e: Enrollment) => e.courseId === courseId) 
    : null;

  return {
    isEnrolled: !!enrollment,
    enrollment,
    status: enrollment?.status,
  };
};

export const useLessonCompletion = (courseId: string) => {
  const { data: progressData } = useCourseProgress(courseId);
  const { data: course } = useCourse(courseId);

  const totalLessons = course?.modules?.reduce(
    (total: number, module) => total + (module.lessons?.length || 0),
    0,
  ) || 0;

  const completedLessons = Array.isArray(progressData) 
    ? progressData.reduce((count: number, progress) => {
        return count + (progress.completed ? 1 : 0);
      }, 0)
    : 0;

  const completionPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return {
    totalLessons,
    completedLessons,
    completionPercentage,
    isComplete: completionPercentage === 100,
  };
};
