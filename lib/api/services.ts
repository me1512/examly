import { apiClient } from "./client";

// Import Course-related types from 'types/course' to match the Store
import {
  Course,
  CourseFilters,
  CreateCourseRequest,
  UpdateCourseRequest,
  PaginatedResponse,
  Lesson,
  Quiz,
  Enrollment,
} from "@/types/course";

// Import other types from 'types/dashboard' or 'types/auth'
import {
  User,
  StudentProgress,
  AssessmentSubmission,
  Analytics,
  Notification,
  Assessment, // Keeping generic Assessment from dashboard if not present in course
} from "@/types/dashboard";

import { UserRole } from "@/types/auth";

// Re-export ApiError for consumers
export { ApiError } from "./client";

// Types for payloads
type CreateLessonPayload = Omit<Lesson, "id" | "createdAt" | "updatedAt">;
type CreateAssessmentPayload = Omit<Assessment, "id" | "createdAt" | "updatedAt">;
type UpdateLessonPayload = Partial<Lesson>;
type UpdateAssessmentPayload = Partial<Assessment>;
type LessonProgressPayload = {
  completed?: boolean;
  timeSpent?: number;
  score?: number;
};
type InviteUserPayload = {
  email: string;
  name: string;
  role: UserRole;
};

// --- Course Services ---
export const courseService = {
  getCourses: (
    filters: CourseFilters = {},
    page = 1,
    limit = 12,
  ): Promise<PaginatedResponse<Course>> => {
    // Explicitly cast to Record<string, unknown> for the apiClient
    const params: Record<string, unknown> = {
      page,
      limit,
      ...filters,
    };
    return apiClient.get("/courses", params);
  },

  getCourse: (id: string) => apiClient.get<Course>(`/courses/${id}`),

  createCourse: (data: CreateCourseRequest | FormData) => {
    if (data instanceof FormData) {
      return apiClient.upload<Course>("/courses", data);
    }
    return apiClient.post<Course>("/courses", data);
  },

  updateCourse: (id: string, data: UpdateCourseRequest | Partial<Course>) =>
    apiClient.patch<Course>(`/courses/${id}`, data),

  deleteCourse: (id: string) => apiClient.delete<void>(`/courses/${id}`),

  togglePublishCourse: (id: string, isPublished: boolean) =>
    apiClient.patch<Course>(`/courses/${id}/publish`, { isPublished }),

  getCoursesByInstructor: (instructorId: string) =>
    apiClient.get<Course[]>(`/courses/instructor/${instructorId}`),

  getEnrolledCourses: (studentId: string) =>
    apiClient.get<Course[]>(`/courses/enrolled/${studentId}`),

  searchCourses: (query: string) =>
    apiClient.get<Course[]>("/courses/search", { q: query }),

  duplicateCourse: (id: string, title: string) =>
    apiClient.post<Course>(`/courses/${id}/duplicate`, { title }),

  uploadThumbnail: (id: string, file: File) => {
    const formData = new FormData();
    formData.append("thumbnail", file);
    return apiClient.upload<{ thumbnailUrl: string }>(
      `/courses/${id}/thumbnail`,
      formData,
    );
  },
};

// --- Lesson Services ---
export const lessonService = {
  getLessons: (courseId: string) =>
    apiClient.get<Lesson[]>(`/courses/${courseId}/lessons`),

  getLesson: (courseId: string, lessonId: string) =>
    apiClient.get<Lesson>(`/courses/${courseId}/lessons/${lessonId}`),

  createLesson: (courseId: string, data: CreateLessonPayload) =>
    apiClient.post<Lesson>(`/courses/${courseId}/lessons`, data),

  updateLesson: (courseId: string, lessonId: string, data: UpdateLessonPayload) =>
    apiClient.patch<Lesson>(`/courses/${courseId}/lessons/${lessonId}`, data),

  deleteLesson: (courseId: string, lessonId: string) =>
    apiClient.delete<void>(`/courses/${courseId}/lessons/${lessonId}`),

  reorderLessons: (courseId: string, lessonIds: string[]) =>
    apiClient.put<Lesson[]>(`/courses/${courseId}/lessons/reorder`, {
      lessonIds,
    }),

  uploadVideo: (courseId: string, lessonId: string, file: File) => {
    const formData = new FormData();
    formData.append("video", file);
    return apiClient.upload<{ videoUrl: string }>(
      `/courses/${courseId}/lessons/${lessonId}/video`,
      formData,
    );
  },

  uploadAttachments: (courseId: string, lessonId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`attachment_${index}`, file);
    });
    return apiClient.upload<{ attachments: { id: string; url: string; name: string }[] }>(
      `/courses/${courseId}/lessons/${lessonId}/attachments`,
      formData,
    );
  },
};

// --- Assessment/Quiz Services ---
export const assessmentService = {
  getAssessments: (courseId: string) =>
    apiClient.get<Assessment[]>(`/courses/${courseId}/assessments`),

  getAssessment: (courseId: string, assessmentId: string) =>
    apiClient.get<Assessment>(`/courses/${courseId}/assessments/${assessmentId}`),

  createAssessment: (courseId: string, data: CreateAssessmentPayload) =>
    apiClient.post<Assessment>(`/courses/${courseId}/assessments`, data),

  updateAssessment: (courseId: string, assessmentId: string, data: UpdateAssessmentPayload) =>
    apiClient.patch<Assessment>(
      `/courses/${courseId}/assessments/${assessmentId}`,
      data,
    ),

  deleteAssessment: (courseId: string, assessmentId: string) =>
    apiClient.delete<void>(`/courses/${courseId}/assessments/${assessmentId}`),

  getSubmissions: (assessmentId: string) =>
    apiClient.get<AssessmentSubmission[]>(
      `/assessments/${assessmentId}/submissions`,
    ),

  submitAssessment: (assessmentId: string, answers: Record<string, unknown>) =>
    apiClient.post<AssessmentSubmission>(
      `/assessments/${assessmentId}/submit`,
      { answers },
    ),

  // Quiz specific aliases
  getQuiz: (quizId: string) => apiClient.get<Quiz>(`/quizzes/${quizId}`),

  submitQuizAttempt: (
    quizId: string,
    answers: Record<string, string | string[]>,
  ) =>
    apiClient.post<{
      score: number;
      percentage: number;
      passed: boolean;
      answers: Array<{
        questionId: string;
        userAnswer: string | string[];
        isCorrect: boolean;
        points: number;
      }>;
    }>(`/quizzes/${quizId}/submit`, { answers }),
};

// --- Enrollment Services ---
export const enrollmentService = {
  getEnrollments: (params?: {
    courseId?: string;
    userId?: string;
    status?: string;
  }) => apiClient.get<Enrollment[]>("/enrollments", params),

  enrollInCourse: (courseId: string) =>
    apiClient.post<Enrollment>("/enrollments", { courseId }),

  enrollStudent: (courseId: string, userId: string) =>
    apiClient.post<Enrollment>("/enrollments", { courseId, userId }),

  updateEnrollment: (id: string, updates: Partial<Enrollment>) =>
    apiClient.patch<Enrollment>(`/enrollments/${id}`, updates),

  unenrollStudent: (id: string) => apiClient.delete<void>(`/enrollments/${id}`),
};

// --- Progress Services ---
export const progressService = {
  getStudentProgress: (userId: string, courseId: string) =>
    apiClient.get<StudentProgress[]>(`/progress/${userId}/${courseId}`),

  updateLessonProgress: (
    userId: string,
    courseId: string,
    lessonId: string,
    data: LessonProgressPayload,
  ) =>
    apiClient.patch<StudentProgress>(
      `/progress/${userId}/${courseId}/${lessonId}`,
      data,
    ),

  getCourseProgress: (courseId: string) =>
    apiClient.get<StudentProgress[]>(`/progress/course/${courseId}`),

  markLessonComplete: (lessonId: string) =>
    apiClient.post<StudentProgress>(`/progress/lesson/${lessonId}/complete`, {}),
};

// --- User Services ---
export const userService = {
  getUsers: (params?: Record<string, string | number | boolean>) =>
    apiClient.get<{
      users: User[];
      total: number;
      page: number;
      limit: number;
    }>("/users", params),

  getUser: (id: string) => apiClient.get<User>(`/users/${id}`),

  updateUser: (id: string, updates: Partial<User>) =>
    apiClient.patch<User>(`/users/${id}`, updates),

  deleteUser: (id: string) => apiClient.delete<void>(`/users/${id}`),

  inviteUser: (userData: InviteUserPayload) =>
    apiClient.post<{ message: string }>("/users/invite", userData),
};

// --- Analytics Services ---
export const analyticsService = {
  getDashboardAnalytics: (role: UserRole) =>
    apiClient.get<Analytics>("/analytics/dashboard", { role }),

  getCourseAnalytics: (courseId: string, timeRange?: string) =>
    apiClient.get<unknown>(`/analytics/courses/${courseId}`, { timeRange }),

  getStudentAnalytics: (userId: string) =>
    apiClient.get<unknown>(`/analytics/students/${userId}`),
};

// --- Notification Services ---
export const notificationService = {
  getNotifications: (params?: { page?: number; limit?: number; unreadOnly?: boolean }) =>
    apiClient.get<{ notifications: Notification[]; unreadCount: number }>(
      "/notifications",
      params,
    ),

  markAsRead: (id: string) =>
    apiClient.patch<void>(`/notifications/${id}/read`, {}),

  markAllAsRead: () => apiClient.patch<void>("/notifications/read-all", {}),
};

// --- Search Services ---
export const searchService = {
  globalSearch: (query: string, filters?: Record<string, string>) =>
    apiClient.get<{
      courses: Course[];
      users: User[];
      assessments: Assessment[];
      total: number;
    }>("/search", { query, ...filters }),

  getSuggestions: (query: string) =>
    apiClient.get<string[]>("/search/suggestions", { query }),
};

// Assign to variable before default export
const apiServices = {
  courses: courseService,
  enrollments: enrollmentService,
  progress: progressService,
  quizzes: assessmentService,
  analytics: analyticsService,
  users: userService,
  lessons: lessonService,
};

export default apiServices;