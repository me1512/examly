// types/course.ts
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  instructorId: string;
  instructorName: string;
  category: CourseCategory;
  level: CourseLevel;
  duration: number; // in hours
  price: number;
  status: CourseStatus;
  isPublished: boolean;
  enrollmentCount: number;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
  modules: CourseModule[];
  prerequisites: string[];
  learningOutcomes: string[];
  tags: string[];
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  isRequired: boolean;
  lessons: Lesson[];
  quiz?: Quiz;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  type: LessonType;
  videoUrl?: string;
  attachments: Attachment[];
  order: number;
  duration: number;
  isCompleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  passingScore: number;
  maxAttempts: number;
  questions: Question[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  quizId: string;
  question: string;
  type: QuestionType;
  options: QuestionOption[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
  order: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completedAt?: Date;
  progress: number;
  status: EnrollmentStatus;
  grade?: number;
  certificateUrl?: string;
}

export interface Progress {
  id: string;
  userId: string;
  courseId: string;
  moduleId?: string;
  lessonId?: string;
  completed: boolean;
  timeSpent: number;
  lastAccessed: Date;
  score?: number;
}

// Enums
export enum CourseCategory {
  TECHNOLOGY = "technology",
  BUSINESS = "business",
  DESIGN = "design",
  MARKETING = "marketing",
  HEALTH = "health",
  LANGUAGE = "language",
  SCIENCE = "science",
  ARTS = "arts",
}

export enum CourseLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  EXPERT = "expert",
}

export enum CourseStatus {
  DRAFT = "draft",
  REVIEW = "review",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export enum LessonType {
  VIDEO = "video",
  TEXT = "text",
  INTERACTIVE = "interactive",
  ASSIGNMENT = "assignment",
  DISCUSSION = "discussion",
}

export enum QuestionType {
  MULTIPLE_CHOICE = "multiple_choice",
  TRUE_FALSE = "true_false",
  SHORT_ANSWER = "short_answer",
  ESSAY = "essay",
  FILL_BLANK = "fill_blank",
}

export enum EnrollmentStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  DROPPED = "dropped",
  SUSPENDED = "suspended",
}

// API Request/Response types
export interface CreateCourseRequest {
  title: string;
  description: string;
  category: CourseCategory;
  level: CourseLevel;
  price: number;
  prerequisites?: string[];
  learningOutcomes: string[];
  tags?: string[];
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  id: string;
}

export interface CourseFilters {
  // Filter properties
  category?: CourseCategory;
  level?: CourseLevel;
  priceRange?: [number, number];
  rating?: number;
  search?: string;
  instructorId?: string;
  tags?: string[];
  
  // Pagination properties
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
