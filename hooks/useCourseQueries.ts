"use client";

import { useEffect } from "react";
import { 
  courseService, 
  enrollmentService, 
  progressService, 
  assessmentService,
  lessonService 
} from "@/lib/api/services";
import { useCourseActions } from "@/stores/courseStore";
import {
  CourseFilters,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseModule,
  Progress,
  Lesson,
  Enrollment
} from "@/types/course";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useEnrollments } from "./useApiQueries";

// --- Types for Mutation Variables ---
interface CreateLessonVars {
  courseId: string;
  lessonData: Omit<Lesson, "id" | "createdAt" | "updatedAt">;
}

interface UpdateLessonVars {
  courseId: string;
  lessonId: string;
  updates: Partial<Lesson>;
}

interface DeleteLessonVars {
  courseId: string;
  lessonId: string;
}

interface ReorderLessonsVars {
  courseId: string;
  lessonIds: string[];
}

interface CreateAssessmentVars {
  courseId: string;
  assessmentData: Omit<import("@/types/dashboard").Assessment, "id" | "createdAt" | "updatedAt">;
}

// --- Query Keys ---
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

export const lessonKeys = {
  all: ["lessons"] as const,
  list: (courseId: string) => [...lessonKeys.all, courseId] as const,
};

// --- Course Queries ---
export const useCourses = (
  filters: CourseFilters = {},
  page = 1,
  limit = 12,
) => {
  const { setCourses, setCoursesLoading, setCoursesError } = useCourseActions();

  const result = useQuery({
    queryKey: courseKeys.list({ ...filters, page, limit }),
    queryFn: () => courseService.getCourses(filters, page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

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
    queryFn: () => courseService.getCourse(id),
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
    queryFn: () => progressService.getCourseProgress(courseId),
    enabled: !!courseId,
  });

  useEffect(() => {
    if (result.data) {
      // Cast the response to Progress[] to match the store
      setProgress(result.data as unknown as Progress[]);
    }
  }, [result.data, setProgress]);

  return result;
};

export const useInstructorCourses = (instructorId: string) => {
  return useQuery({
    queryKey: courseKeys.instructor(instructorId),
    queryFn: () => courseService.getCoursesByInstructor(instructorId),
    enabled: !!instructorId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchCourses = (query: string) => {
  return useQuery({
    queryKey: courseKeys.search(query),
    queryFn: () => courseService.searchCourses(query),
    enabled: query.length > 2,
  });
};

// --- Course Mutations ---
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const { addCourse } = useCourseActions();

  return useMutation({
    mutationFn: (data: CreateCourseRequest | FormData) =>
      courseService.createCourse(data),
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
      courseService.updateCourse(data.id, data),
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

// --- Progress Mutations ---
export const useMarkLessonComplete = (lessonId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      progressService.markLessonComplete(lessonId),
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
    mutationFn: (variables: { userId: string, courseId: string, data: { completed: boolean } }) =>
      progressService.updateLessonProgress(variables.userId, variables.courseId, lessonId, variables.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressKeys.all });
      toast.success("Lesson progress updated!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update lesson progress");
    },
  });
};

// --- Quiz Mutations ---
export const useSubmitQuizAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      answers,
    }: {
      quizId: string;
      answers: Record<string, string | string[]>;
    }) => assessmentService.submitQuizAttempt(quizId, answers),
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

// --- Enrollment Mutations ---
export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (courseId: string) => enrollmentService.enrollInCourse(courseId),
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

// --- Lesson Mutations ---
export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, lessonData }: CreateLessonVars) => 
      lessonService.createLesson(courseId, lessonData),
    onSuccess: (_, variables) => {
      // Use variables.courseId because the response 'Lesson' type might not contain courseId
      queryClient.invalidateQueries({
        queryKey: lessonKeys.list(variables.courseId),
      });
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(variables.courseId),
      });
      toast.success("Lesson created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create lesson");
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, lessonId, updates }: UpdateLessonVars) => 
      lessonService.updateLesson(courseId, lessonId, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: lessonKeys.list(variables.courseId),
      });
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(variables.courseId),
      });
      toast.success("Lesson updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update lesson");
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, lessonId }: DeleteLessonVars) => 
      lessonService.deleteLesson(courseId, lessonId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: lessonKeys.list(variables.courseId),
      });
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(variables.courseId),
      });
      toast.success("Lesson deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete lesson");
    },
  });
};

export const useReorderLessons = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, lessonIds }: ReorderLessonsVars) => 
      lessonService.reorderLessons(courseId, lessonIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: lessonKeys.list(variables.courseId),
      });
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(variables.courseId),
      });
      toast.success("Lessons reordered successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reorder lessons");
    },
  });
};

// --- Custom Hooks ---
export const useEnrollmentStatus = (courseId: string) => {
  const { data: enrollments } = useEnrollments();
  
  // Explicitly casting the array to Enrollment[] to ensure type safety 
  // with the find operation
  const enrollment = Array.isArray(enrollments) 
    ? (enrollments as unknown as Enrollment[]).find((e) => e.courseId === courseId) 
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
    (total: number, module: CourseModule) => total + (module.lessons?.length || 0),
    0,
  ) || 0;

  const completedLessons = Array.isArray(progressData) 
    ? (progressData as unknown as Progress[]).reduce((count: number, progress) => {
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