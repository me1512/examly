/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Course,
  Lesson,
  Assessment,
  Enrollment,
  User,
  StudentProgress,
  AssessmentSubmission,
  Analytics,
  Notification,
} from "@/types/dashboard";

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Generic API client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add authentication token if available
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || "An error occurred",
          response.status,
          errorData.code,
        );
      }

      // Handle empty responses
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        error instanceof Error ? error.message : "Network error",
        0,
      );
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params)}`
      : endpoint;
    return this.request<T>(url);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = localStorage.getItem("auth_token");
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || "Upload failed",
        response.status,
        errorData.code,
      );
    }

    return await response.json();
  }
}

const apiClient = new ApiClient(API_BASE_URL);

// Course Services
export const courseService = {
  // Get all courses with filters
  getCourses: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    difficulty?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{
    courses: Course[];
    total: number;
    page: number;
    limit: number;
  }> => apiClient.get("/courses", params),

  // Get courses by instructor
  getCoursesByInstructor: (instructorId: string): Promise<Course[]> =>
    apiClient.get(`/courses/instructor/${instructorId}`),

  // Get enrolled courses for a student
  getEnrolledCourses: (studentId: string): Promise<Course[]> =>
    apiClient.get(`/courses/enrolled/${studentId}`),

  // Get single course by ID
  getCourse: (id: string): Promise<Course> => apiClient.get(`/courses/${id}`),

  // Create new course
  createCourse: (
    courseData: Omit<Course, "id" | "createdAt" | "updatedAt">,
  ): Promise<Course> => apiClient.post("/courses", courseData),

  // Update course
  updateCourse: (id: string, updates: Partial<Course>): Promise<Course> =>
    apiClient.patch(`/courses/${id}`, updates),

  // Delete course
  deleteCourse: (id: string): Promise<void> =>
    apiClient.delete(`/courses/${id}`),

  // Publish/unpublish course
  togglePublishCourse: (id: string, isPublished: boolean): Promise<Course> =>
    apiClient.patch(`/courses/${id}/publish`, { isPublished }),

  // Duplicate course
  duplicateCourse: (id: string, title: string): Promise<Course> =>
    apiClient.post(`/courses/${id}/duplicate`, { title }),

  // Upload course thumbnail
  uploadThumbnail: (
    id: string,
    file: File,
  ): Promise<{ thumbnailUrl: string }> => {
    const formData = new FormData();
    formData.append("thumbnail", file);
    return apiClient.upload(`/courses/${id}/thumbnail`, formData);
  },
};

// Lesson Services
export const lessonService = {
  // Get lessons for a course
  getLessons: (courseId: string): Promise<Lesson[]> =>
    apiClient.get(`/courses/${courseId}/lessons`),

  // Get single lesson
  getLesson: (courseId: string, lessonId: string): Promise<Lesson> =>
    apiClient.get(`/courses/${courseId}/lessons/${lessonId}`),

  // Create lesson
  createLesson: (
    courseId: string,
    lessonData: Omit<Lesson, "id" | "createdAt" | "updatedAt">,
  ): Promise<Lesson> =>
    apiClient.post(`/courses/${courseId}/lessons`, lessonData),

  // Update lesson
  updateLesson: (
    courseId: string,
    lessonId: string,
    updates: Partial<Lesson>,
  ): Promise<Lesson> =>
    apiClient.patch(`/courses/${courseId}/lessons/${lessonId}`, updates),

  // Delete lesson
  deleteLesson: (courseId: string, lessonId: string): Promise<void> =>
    apiClient.delete(`/courses/${courseId}/lessons/${lessonId}`),

  // Reorder lessons
  reorderLessons: (courseId: string, lessonIds: string[]): Promise<Lesson[]> =>
    apiClient.put(`/courses/${courseId}/lessons/reorder`, { lessonIds }),

  // Upload lesson video
  uploadVideo: (
    courseId: string,
    lessonId: string,
    file: File,
  ): Promise<{ videoUrl: string }> => {
    const formData = new FormData();
    formData.append("video", file);
    return apiClient.upload(
      `/courses/${courseId}/lessons/${lessonId}/video`,
      formData,
    );
  },

  // Upload lesson attachments
  uploadAttachments: (
    courseId: string,
    lessonId: string,
    files: File[],
  ): Promise<{ attachments: any[] }> => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`attachment_${index}`, file);
    });
    return apiClient.upload(
      `/courses/${courseId}/lessons/${lessonId}/attachments`,
      formData,
    );
  },
};

// Assessment Services
export const assessmentService = {
  // Get assessments for a course
  getAssessments: (courseId: string): Promise<Assessment[]> =>
    apiClient.get(`/courses/${courseId}/assessments`),

  // Get single assessment
  getAssessment: (
    courseId: string,
    assessmentId: string,
  ): Promise<Assessment> =>
    apiClient.get(`/courses/${courseId}/assessments/${assessmentId}`),

  // Create assessment
  createAssessment: (
    courseId: string,
    assessmentData: Omit<Assessment, "id" | "createdAt" | "updatedAt">,
  ): Promise<Assessment> =>
    apiClient.post(`/courses/${courseId}/assessments`, assessmentData),

  // Update assessment
  updateAssessment: (
    courseId: string,
    assessmentId: string,
    updates: Partial<Assessment>,
  ): Promise<Assessment> =>
    apiClient.patch(
      `/courses/${courseId}/assessments/${assessmentId}`,
      updates,
    ),

  // Delete assessment
  deleteAssessment: (courseId: string, assessmentId: string): Promise<void> =>
    apiClient.delete(`/courses/${courseId}/assessments/${assessmentId}`),

  // Get assessment submissions
  getSubmissions: (assessmentId: string): Promise<AssessmentSubmission[]> =>
    apiClient.get(`/assessments/${assessmentId}/submissions`),

  // Submit assessment
  submitAssessment: (
    assessmentId: string,
    answers: Record<string, any>,
  ): Promise<AssessmentSubmission> =>
    apiClient.post(`/assessments/${assessmentId}/submit`, { answers }),

  // Grade submission
  gradeSubmission: (
    submissionId: string,
    score: number,
    feedback?: string,
  ): Promise<AssessmentSubmission> =>
    apiClient.patch(`/submissions/${submissionId}/grade`, { score, feedback }),
};

// Enrollment Services
export const enrollmentService = {
  // Get enrollments
  getEnrollments: (params?: {
    courseId?: string;
    userId?: string;
    status?: string;
  }): Promise<Enrollment[]> => apiClient.get("/enrollments", params),

  // Enroll student in course
  enrollStudent: (courseId: string, userId: string): Promise<Enrollment> =>
    apiClient.post("/enrollments", { courseId, userId }),

  // Update enrollment
  updateEnrollment: (
    id: string,
    updates: Partial<Enrollment>,
  ): Promise<Enrollment> => apiClient.patch(`/enrollments/${id}`, updates),

  // Unenroll student
  unenrollStudent: (id: string): Promise<void> =>
    apiClient.delete(`/enrollments/${id}`),

  // Bulk enroll students
  bulkEnrollStudents: (
    courseId: string,
    userIds: string[],
  ): Promise<Enrollment[]> =>
    apiClient.post("/enrollments/bulk", { courseId, userIds }),
};

// Progress Services
export const progressService = {
  // Get student progress for a course
  getStudentProgress: (
    userId: string,
    courseId: string,
  ): Promise<StudentProgress[]> =>
    apiClient.get(`/progress/${userId}/${courseId}`),

  // Update lesson progress
  updateLessonProgress: (
    userId: string,
    courseId: string,
    lessonId: string,
    progressData: {
      completed?: boolean;
      timeSpent?: number;
      score?: number;
    },
  ): Promise<StudentProgress> =>
    apiClient.patch(
      `/progress/${userId}/${courseId}/${lessonId}`,
      progressData,
    ),

  // Get course completion certificate
  getCertificate: (
    userId: string,
    courseId: string,
  ): Promise<{ certificateUrl: string }> =>
    apiClient.get(`/progress/${userId}/${courseId}/certificate`),
};

// User Services
export const userService = {
  // Get users with filters
  getUsers: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  }): Promise<{ users: User[]; total: number; page: number; limit: number }> =>
    apiClient.get("/users", params),

  // Get single user
  getUser: (id: string): Promise<User> => apiClient.get(`/users/${id}`),

  // Update user
  updateUser: (id: string, updates: Partial<User>): Promise<User> =>
    apiClient.patch(`/users/${id}`, updates),

  // Delete user
  deleteUser: (id: string): Promise<void> => apiClient.delete(`/users/${id}`),

  // Invite user
  inviteUser: (userData: {
    email: string;
    name: string;
    role: string;
  }): Promise<{ message: string }> => apiClient.post("/users/invite", userData),

  // Upload user avatar
  uploadAvatar: (id: string, file: File): Promise<{ avatar: string }> => {
    const formData = new FormData();
    formData.append("avatar", file);
    return apiClient.upload(`/users/${id}/avatar`, formData);
  },
};

// Analytics Services
export const analyticsService = {
  // Get dashboard analytics
  getDashboardAnalytics: (role: string): Promise<Analytics> =>
    apiClient.get("/analytics/dashboard", { role }),

  // Get course analytics
  getCourseAnalytics: (
    courseId: string,
    timeRange?: string,
  ): Promise<{
    enrollments: number;
    completions: number;
    averageProgress: number;
    averageScore: number;
    timeSpent: number;
    dropoutRate: number;
    engagementRate: number;
    dailyActivity: Array<{ date: string; value: number }>;
    lessonPerformance: Array<{
      lessonId: string;
      completionRate: number;
      averageScore: number;
    }>;
  }> => apiClient.get(`/analytics/courses/${courseId}`, { timeRange }),

  // Get student analytics
  getStudentAnalytics: (
    userId: string,
  ): Promise<{
    totalCourses: number;
    completedCourses: number;
    totalTimeSpent: number;
    averageScore: number;
    certificates: number;
    progressOverTime: Array<{ date: string; progress: number }>;
    courseProgress: Array<{
      courseId: string;
      progress: number;
      lastAccessed: Date;
    }>;
  }> => apiClient.get(`/analytics/students/${userId}`),

  // Get instructor analytics
  getInstructorAnalytics: (
    instructorId: string,
  ): Promise<{
    totalCourses: number;
    totalStudents: number;
    averageCourseRating: number;
    totalRevenue: number;
    monthlyEnrollments: Array<{ month: string; enrollments: number }>;
    topPerformingCourses: Array<{
      courseId: string;
      title: string;
      rating: number;
      enrollments: number;
    }>;
  }> => apiClient.get(`/analytics/instructors/${instructorId}`),
};

// Notification Services
export const notificationService = {
  // Get notifications for user
  getNotifications: (params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<{ notifications: Notification[]; unreadCount: number }> =>
    apiClient.get("/notifications", params),

  // Mark notification as read
  markAsRead: (id: string): Promise<void> =>
    apiClient.patch(`/notifications/${id}/read`),

  // Mark all notifications as read
  markAllAsRead: (): Promise<void> =>
    apiClient.patch("/notifications/read-all"),

  // Delete notification
  deleteNotification: (id: string): Promise<void> =>
    apiClient.delete(`/notifications/${id}`),

  // Get notification settings
  getSettings: (): Promise<{
    emailNotifications: boolean;
    pushNotifications: boolean;
    courseUpdates: boolean;
    assessmentReminders: boolean;
    newEnrollments: boolean;
  }> => apiClient.get("/notifications/settings"),

  // Update notification settings
  updateSettings: (settings: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    courseUpdates?: boolean;
    assessmentReminders?: boolean;
    newEnrollments?: boolean;
  }): Promise<void> => apiClient.patch("/notifications/settings", settings),
};

// Search Services
export const searchService = {
  // Global search
  globalSearch: (
    query: string,
    filters?: {
      type?: "courses" | "users" | "assessments";
      category?: string;
      difficulty?: string;
    },
  ): Promise<{
    courses: Course[];
    users: User[];
    assessments: Assessment[];
    total: number;
  }> => apiClient.get("/search", { query, ...filters }),

  // Search suggestions
  getSuggestions: (query: string): Promise<string[]> =>
    apiClient.get("/search/suggestions", { query }),

  // Popular searches
  getPopularSearches: (): Promise<string[]> => apiClient.get("/search/popular"),
};

// Export all services
export { ApiError, apiClient };
