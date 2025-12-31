/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  courseService,
  lessonService,
  assessmentService,
  enrollmentService,
  progressService,
  userService,
  analyticsService,
  notificationService,
  searchService,
} from "@/lib/api/services";
import { Course, Lesson, Assessment, User } from "@/types/dashboard";
import { UserRole } from "@/types/auth";

// Query Keys
export const queryKeys = {
  // Courses
  courses: ["courses"] as const,
  course: (id: string) => ["courses", id] as const,
  coursesByInstructor: (instructorId: string) =>
    ["courses", "instructor", instructorId] as const,
  enrolledCourses: (studentId: string) =>
    ["courses", "enrolled", studentId] as const,

  // Lessons
  lessons: (courseId: string) => ["lessons", courseId] as const,
  lesson: (courseId: string, lessonId: string) =>
    ["lessons", courseId, lessonId] as const,

  // Assessments
  assessments: (courseId: string) => ["assessments", courseId] as const,
  assessment: (courseId: string, assessmentId: string) =>
    ["assessments", courseId, assessmentId] as const,
  submissions: (assessmentId: string) => ["submissions", assessmentId] as const,

  // Enrollments
  enrollments: ["enrollments"] as const,

  // Progress
  progress: (userId: string, courseId: string) =>
    ["progress", userId, courseId] as const,

  // Users
  users: ["users"] as const,
  user: (id: string) => ["users", id] as const,

  // Analytics
  dashboardAnalytics: (role: UserRole) =>
    ["analytics", "dashboard", role] as const,
  courseAnalytics: (courseId: string, timeRange?: string) =>
    ["analytics", "course", courseId, timeRange] as const,
  studentAnalytics: (userId: string) =>
    ["analytics", "student", userId] as const,
  instructorAnalytics: (instructorId: string) =>
    ["analytics", "instructor", instructorId] as const,

  // Notifications
  notifications: ["notifications"] as const,
  notificationSettings: ["notifications", "settings"] as const,

  // Search
  search: (query: string, filters?: any) => ["search", query, filters] as const,
  suggestions: (query: string) => ["search", "suggestions", query] as const,
  popularSearches: ["search", "popular"] as const,
};

// Course Hooks
export const useCourses = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  difficulty?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}) => {
  return useQuery({
    queryKey: [...queryKeys.courses, params],
    queryFn: () => courseService.getCourses(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCourse = (id: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.course(id),
    queryFn: () => courseService.getCourse(id),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCoursesByInstructor = (instructorId: string) => {
  return useQuery({
    queryKey: queryKeys.coursesByInstructor(instructorId),
    queryFn: () => courseService.getCoursesByInstructor(instructorId),
    enabled: !!instructorId,
  });
};

export const useEnrolledCourses = (studentId: string) => {
  return useQuery({
    queryKey: queryKeys.enrolledCourses(studentId),
    queryFn: () => courseService.getEnrolledCourses(studentId),
    enabled: !!studentId,
  });
};

// Course Mutations
export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: courseService.createCourse,
    onSuccess: (newCourse) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses });
      toast.success(`Course ${newCourse.title}} created successfully!`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create course");
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Course> }) =>
      courseService.updateCourse(id, updates),
    onSuccess: (updatedCourse) => {
      queryClient.setQueryData(
        queryKeys.course(updatedCourse.id),
        updatedCourse,
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.courses });
      toast.success("Course updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update course");
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: courseService.deleteCourse,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: queryKeys.course(deletedId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.courses });
      toast.success("Course deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete course");
    },
  });
};

export const useTogglePublishCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      courseService.togglePublishCourse(id, isPublished),
    onSuccess: (updatedCourse) => {
      queryClient.setQueryData(
        queryKeys.course(updatedCourse.id),
        updatedCourse,
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.courses });
      toast.success(
        updatedCourse.isPublished
          ? "Course published successfully!"
          : "Course unpublished successfully!",
      );
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update course status");
    },
  });
};

// Lesson Hooks
export const useLessons = (courseId: string) => {
  return useQuery({
    queryKey: queryKeys.lessons(courseId),
    queryFn: () => lessonService.getLessons(courseId),
    enabled: !!courseId,
  });
};

export const useLesson = (courseId: string, lessonId: string) => {
  return useQuery({
    queryKey: queryKeys.lesson(courseId, lessonId),
    queryFn: () => lessonService.getLesson(courseId, lessonId),
    enabled: !!(courseId && lessonId),
  });
};

// Lesson Mutations
export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      lessonData,
    }: {
      courseId: string;
      lessonData: Omit<Lesson, "id" | "createdAt" | "updatedAt">;
    }) => lessonService.createLesson(courseId, lessonData),
    onSuccess: (newLesson) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessons(newLesson.courseId),
      });
      toast.success("Lesson created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create lesson");
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      lessonId,
      updates,
    }: {
      courseId: string;
      lessonId: string;
      updates: Partial<Lesson>;
    }) => lessonService.updateLesson(courseId, lessonId, updates),
    onSuccess: (updatedLesson) => {
      queryClient.setQueryData(
        queryKeys.lesson(updatedLesson.courseId, updatedLesson.id),
        updatedLesson,
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.lessons(updatedLesson.courseId),
      });
      toast.success("Lesson updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update lesson");
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      lessonId,
    }: {
      courseId: string;
      lessonId: string;
    }) => lessonService.deleteLesson(courseId, lessonId),
    onSuccess: (_, { courseId, lessonId }) => {
      queryClient.removeQueries({
        queryKey: queryKeys.lesson(courseId, lessonId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.lessons(courseId) });
      toast.success("Lesson deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete lesson");
    },
  });
};

export const useReorderLessons = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      lessonIds,
    }: {
      courseId: string;
      lessonIds: string[];
    }) => lessonService.reorderLessons(courseId, lessonIds),
    onSuccess: (reorderedLessons, { courseId }) => {
      queryClient.setQueryData(queryKeys.lessons(courseId), reorderedLessons);
      toast.success("Lessons reordered successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reorder lessons");
    },
  });
};

// Assessment Hooks
export const useAssessments = (courseId: string) => {
  return useQuery({
    queryKey: queryKeys.assessments(courseId),
    queryFn: () => assessmentService.getAssessments(courseId),
    enabled: !!courseId,
  });
};

export const useAssessment = (courseId: string, assessmentId: string) => {
  return useQuery({
    queryKey: queryKeys.assessment(courseId, assessmentId),
    queryFn: () => assessmentService.getAssessment(courseId, assessmentId),
    enabled: !!(courseId && assessmentId),
  });
};

export const useSubmissions = (assessmentId: string) => {
  return useQuery({
    queryKey: queryKeys.submissions(assessmentId),
    queryFn: () => assessmentService.getSubmissions(assessmentId),
    enabled: !!assessmentId,
  });
};

// Assessment Mutations
export const useCreateAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      assessmentData,
    }: {
      courseId: string;
      assessmentData: Omit<Assessment, "id" | "createdAt" | "updatedAt">;
    }) => assessmentService.createAssessment(courseId, assessmentData),
    onSuccess: (newAssessment) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.assessments(newAssessment.courseId),
      });
      toast.success("Assessment created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create assessment");
    },
  });
};

export const useSubmitAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assessmentId,
      answers,
    }: {
      assessmentId: string;
      answers: Record<string, any>;
    }) => assessmentService.submitAssessment(assessmentId, answers),
    onSuccess: (submission) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.submissions(submission.assessmentId),
      });
      toast.success("Assessment submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit assessment");
    },
  });
};

// Enrollment Hooks
export const useEnrollments = (params?: {
  courseId?: string;
  userId?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: [...queryKeys.enrollments, params],
    queryFn: () => enrollmentService.getEnrollments(params),
  });
};

export const useEnrollStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, userId }: { courseId: string; userId: string }) =>
      enrollmentService.enrollStudent(courseId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.enrollments });
      toast.success("Student enrolled successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to enroll student");
    },
  });
};

// Progress Hooks
export const useStudentProgress = (userId: string, courseId: string) => {
  return useQuery({
    queryKey: queryKeys.progress(userId, courseId),
    queryFn: () => progressService.getStudentProgress(userId, courseId),
    enabled: !!(userId && courseId),
  });
};

export const useUpdateProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      courseId,
      lessonId,
      progressData,
    }: {
      userId: string;
      courseId: string;
      lessonId: string;
      progressData: { completed?: boolean; timeSpent?: number; score?: number };
    }) =>
      progressService.updateLessonProgress(
        userId,
        courseId,
        lessonId,
        progressData,
      ),
    onSuccess: (_, { userId, courseId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.progress(userId, courseId),
      });
    },
  });
};

// User Hooks
export const useUsers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}) => {
  return useQuery({
    queryKey: [...queryKeys.users, params],
    queryFn: () => userService.getUsers(params),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => userService.getUser(id),
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<User> }) =>
      userService.updateUser(id, updates),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKeys.user(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      toast.success("User updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update user");
    },
  });
};

// Analytics Hooks
export const useDashboardAnalytics = (role: UserRole) => {
  return useQuery({
    queryKey: queryKeys.dashboardAnalytics(role),
    queryFn: () => analyticsService.getDashboardAnalytics(role),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useCourseAnalytics = (courseId: string, timeRange?: string) => {
  return useQuery({
    queryKey: queryKeys.courseAnalytics(courseId, timeRange),
    queryFn: () => analyticsService.getCourseAnalytics(courseId, timeRange),
    enabled: !!courseId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Notification Hooks
export const useNotifications = (params?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}) => {
  return useQuery({
    queryKey: [...queryKeys.notifications, params],
    queryFn: () => notificationService.getNotifications(params),
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
};

// Search Hooks
export const useGlobalSearch = (
  query: string,
  filters?: any,
  enabled = true,
) => {
  return useQuery({
    queryKey: queryKeys.search(query, filters),
    queryFn: () => searchService.globalSearch(query, filters),
    enabled: enabled && query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSearchSuggestions = (query: string) => {
  return useQuery({
    queryKey: queryKeys.suggestions(query),
    queryFn: () => searchService.getSuggestions(query),
    enabled: query.length > 1,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Infinite Query Hooks
export const useInfiniteCourses = (params?: any) => {
  return useInfiniteQuery({
    queryKey: [...queryKeys.courses, "infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      courseService.getCourses({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, limit, total } = lastPage;
      return page * limit < total ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

// Optimistic Update Hooks
export const useOptimisticCourseUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Course> }) =>
      courseService.updateCourse(id, updates),
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.course(id) });

      // Snapshot the previous value
      const previousCourse = queryClient.getQueryData(queryKeys.course(id));

      // Optimistically update
      queryClient.setQueryData(queryKeys.course(id), (old: Course) => ({
        ...old,
        ...updates,
      }));

      return { previousCourse };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousCourse) {
        queryClient.setQueryData(
          queryKeys.course(variables.id),
          context.previousCourse,
        );
      }
      toast.error("Failed to update course");
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: queryKeys.course(variables.id),
      });
    },
  });
};

// Custom hook for prefetching
export const usePrefetchCourse = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.course(id),
      queryFn: () => courseService.getCourse(id),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };
};
