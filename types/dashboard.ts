import { UserRole } from "./auth";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  lastLoginAt?: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  instructorId: string;
  instructorName: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // in minutes
  studentsCount: number;
  lessonsCount: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  price?: number;
  rating?: number;
  reviewsCount?: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  duration: number; // in minutes
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: "pdf" | "image" | "video" | "document";
  size: number;
}

export interface Assessment {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  description: string;
  type: "quiz" | "assignment" | "exam";
  questions: Question[];
  timeLimit?: number; // in minutes
  maxAttempts: number;
  passingScore: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  type: "multiple-choice" | "true-false" | "short-answer" | "essay";
  question: string;
  options?: string[]; // for multiple-choice
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  order: number;
}

export interface Enrollment extends Course {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completedAt?: Date;
  progress: number; // percentage 0-100
  lastAccessedAt?: Date;
  status: "active" | "completed" | "paused" | "dropped";
}

export interface StudentProgress {
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: Date;
  timeSpent: number; // in minutes
  score?: number;
}

export interface AssessmentSubmission {
  id: string;
  assessmentId: string;
  userId: string;
  answers: Record<string, unknown>;
  score: number;
  maxScore: number;
  submittedAt: Date;
  gradedAt?: Date;
  feedback?: string;
  attempt: number;
}

export interface Analytics {
  totalCourses: number;
  totalStudents: number;
  totalEnrollments: number;
  averageCompletionRate: number;
  totalRevenue?: number;
  monthlyActiveUsers: number;
  courseCompletions: number;
}

export interface RecentActivity {
  id: string;
  type: "course" | "assessment" | "student";
  title: string;
  description: string;
  time: string;
}

export interface DashboardData {
  user: User;
  analytics: Analytics;
  recentCourses: Course[];
  recentEnrollments?: Enrollment[];
  recentSubmissions?: AssessmentSubmission[];
  notifications: Notification[];
  recentActivity: RecentActivity[];
  stats: DashboardStats[];
  mockData: Record<string, unknown>;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavigationItem[];
  roles: UserRole[];
}

export interface DashboardStats {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  icon: string;
  color: string;
}
