// lib/api/courseServices.ts
import {
  Course,
  CourseFilters,
  CreateCourseRequest,
  UpdateCourseRequest,
  PaginatedResponse,
  Enrollment,
  Progress,
  Quiz,
  Question,
} from "@/types/course";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem("authToken");
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
        response.status,
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(0, "Network error or server unavailable");
  }
}

// Course Services
export const courseServices = {
  // Get all courses with optional filters
  async getCourses(
    filters: CourseFilters = {},
    page = 1,
    limit = 12,
  ): Promise<PaginatedResponse<Course>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.entries(filters).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = Array.isArray(value) ? value.join(",") : String(value);
          }
          return acc;
        },
        {} as Record<string, string>,
      ),
    });

    return apiRequest<PaginatedResponse<Course>>(`/courses?${params}`);
  },

  // Get course by ID
  async getCourse(id: string): Promise<Course> {
    return apiRequest<Course>(`/courses/${id}`);
  },

  // Create new course
  async createCourse(data: CreateCourseRequest): Promise<Course> {
    return apiRequest<Course>("/courses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update course
  async updateCourse(data: UpdateCourseRequest): Promise<Course> {
    return apiRequest<Course>(`/courses/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Delete course
  async deleteCourse(id: string): Promise<void> {
    return apiRequest<void>(`/courses/${id}`, {
      method: "DELETE",
    });
  },

  // Publish/unpublish course
  async toggleCoursePublication(id: string): Promise<Course> {
    return apiRequest<Course>(`/courses/${id}/toggle-publication`, {
      method: "PATCH",
    });
  },

  // Get courses by instructor
  async getCoursesByInstructor(instructorId: string): Promise<Course[]> {
    return apiRequest<Course[]>(`/courses/instructor/${instructorId}`);
  },

  // Search courses
  async searchCourses(query: string): Promise<Course[]> {
    return apiRequest<Course[]>(
      `/courses/search?q=${encodeURIComponent(query)}`,
    );
  },
};

// Enrollment Services
export const enrollmentServices = {
  // Enroll in course
  async enrollInCourse(courseId: string): Promise<Enrollment> {
    return apiRequest<Enrollment>("/enrollments", {
      method: "POST",
      body: JSON.stringify({ courseId }),
    });
  },

  // Get user enrollments
  async getUserEnrollments(userId?: string): Promise<Enrollment[]> {
    const endpoint = userId ? `/enrollments/user/${userId}` : "/enrollments/me";
    return apiRequest<Enrollment[]>(endpoint);
  },

  // Get course enrollments (for instructors)
  async getCourseEnrollments(courseId: string): Promise<Enrollment[]> {
    return apiRequest<Enrollment[]>(`/enrollments/course/${courseId}`);
  },

  // Update enrollment status
  async updateEnrollmentStatus(
    enrollmentId: string,
    status: string,
  ): Promise<Enrollment> {
    return apiRequest<Enrollment>(`/enrollments/${enrollmentId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  // Unenroll from course
  async unenrollFromCourse(enrollmentId: string): Promise<void> {
    return apiRequest<void>(`/enrollments/${enrollmentId}`, {
      method: "DELETE",
    });
  },
};

// Progress Services
export const progressServices = {
  // Get user progress for a course
  async getCourseProgress(courseId: string): Promise<Progress[]> {
    return apiRequest<Progress[]>(`/progress/course/${courseId}`);
  },

  // Update lesson progress
  async updateLessonProgress(
    lessonId: string,
    data: {
      completed?: boolean;
      timeSpent?: number;
      score?: number;
    },
  ): Promise<Progress> {
    return apiRequest<Progress>(`/progress/lesson/${lessonId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Mark lesson as complete
  async markLessonComplete(lessonId: string): Promise<Progress> {
    return apiRequest<Progress>(`/progress/lesson/${lessonId}/complete`, {
      method: "POST",
    });
  },

  // Get overall course completion
  async getCourseCompletion(courseId: string): Promise<{
    courseId: string;
    totalLessons: number;
    completedLessons: number;
    completionPercentage: number;
    timeSpent: number;
  }> {
    return apiRequest(`/progress/course/${courseId}/completion`);
  },

  // Get user's overall learning stats
  async getLearningStats(): Promise<{
    totalCoursesEnrolled: number;
    totalCoursesCompleted: number;
    totalTimeSpent: number;
    averageScore: number;
    achievements: string[];
  }> {
    return apiRequest("/progress/stats");
  },
};

// Quiz Services
export const quizServices = {
  // Get quiz by ID
  async getQuiz(quizId: string): Promise<Quiz> {
    return apiRequest<Quiz>(`/quizzes/${quizId}`);
  },

  // Submit quiz attempt
  async submitQuizAttempt(
    quizId: string,
    answers: Record<string, string | string[]>,
  ): Promise<{
    score: number;
    totalPoints: number;
    percentage: number;
    passed: boolean;
    answers: Array<{
      questionId: string;
      userAnswer: string | string[];
      correctAnswer: string | string[];
      isCorrect: boolean;
      points: number;
    }>;
  }> {
    return apiRequest(`/quizzes/${quizId}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    });
  },

  // Get quiz attempts
  async getQuizAttempts(quizId: string): Promise<
    Array<{
      id: string;
      userId: string;
      quizId: string;
      score: number;
      percentage: number;
      passed: boolean;
      attemptNumber: number;
      completedAt: Date;
    }>
  > {
    return apiRequest(`/quizzes/${quizId}/attempts`);
  },

  // Create quiz (for instructors)
  async createQuiz(
    moduleId: string,
    quizData: Omit<Quiz, "id" | "moduleId" | "createdAt" | "updatedAt">,
  ): Promise<Quiz> {
    return apiRequest("/quizzes", {
      method: "POST",
      body: JSON.stringify({ ...quizData, moduleId }),
    });
  },

  // Update quiz
  async updateQuiz(quizId: string, updates: Partial<Quiz>): Promise<Quiz> {
    return apiRequest(`/quizzes/${quizId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  // Delete quiz
  async deleteQuiz(quizId: string): Promise<void> {
    return apiRequest(`/quizzes/${quizId}`, {
      method: "DELETE",
    });
  },
};

// Analytics Services
export const analyticsServices = {
  // Get course analytics (for instructors)
  async getCourseAnalytics(courseId: string): Promise<{
    enrollmentStats: {
      total: number;
      active: number;
      completed: number;
      dropped: number;
    };
    progressStats: {
      averageCompletion: number;
      averageTimeSpent: number;
      mostPopularLessons: Array<{
        lessonId: string;
        lessonTitle: string;
        views: number;
      }>;
    };
    performanceStats: {
      averageQuizScore: number;
      passRate: number;
      commonMistakes: Array<{
        questionId: string;
        question: string;
        incorrectRate: number;
      }>;
    };
  }> {
    return apiRequest(`/analytics/course/${courseId}`);
  },

  // Get student analytics
  async getStudentAnalytics(
    userId: string,
    courseId?: string,
  ): Promise<{
    learningTime: Array<{
      date: string;
      minutes: number;
    }>;
    progressOverTime: Array<{
      date: string;
      completionPercentage: number;
    }>;
    performance: {
      averageScore: number;
      strongAreas: string[];
      improvementAreas: string[];
    };
  }> {
    const endpoint = courseId
      ? `/analytics/student/${userId}/course/${courseId}`
      : `/analytics/student/${userId}`;
    return apiRequest(endpoint);
  },

  // Get platform analytics (for admins)
  async getPlatformAnalytics(): Promise<{
    overview: {
      totalUsers: number;
      totalCourses: number;
      totalEnrollments: number;
      revenue: number;
    };
    trends: {
      userGrowth: Array<{ month: string; users: number }>;
      courseGrowth: Array<{ month: string; courses: number }>;
      revenueGrowth: Array<{ month: string; revenue: number }>;
    };
    topCourses: Array<{
      courseId: string;
      title: string;
      enrollments: number;
      rating: number;
      revenue: number;
    }>;
  }> {
    return apiRequest("/analytics/platform");
  },
};

// Export all services
export default {
  courses: courseServices,
  enrollments: enrollmentServices,
  progress: progressServices,
  quizzes: quizServices,
  analytics: analyticsServices,
};
