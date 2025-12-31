// stores/courseStore.ts
import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  Course,
  CourseFilters,
  Enrollment,
  Progress,
  CourseModule,
  Lesson,
} from "@/types/course";

interface CourseState {
  // Course management
  courses: Course[];
  currentCourse: Course | null;
  courseFilters: CourseFilters;
  coursesLoading: boolean;
  coursesError: string | null;

  // Enrollment management
  enrollments: Enrollment[];
  currentEnrollment: Enrollment | null;
  enrollmentsLoading: boolean;
  enrollmentsError: string | null;

  // Progress tracking
  progress: Progress[];
  currentProgress: Progress | null;

  // Learning path
  currentModule: CourseModule | null;
  currentLesson: Lesson | null;

  // UI state
  sidebar: {
    isOpen: boolean;
    activeTab: "modules" | "progress" | "discussions" | "resources";
  };

  // Actions
  actions: {
    // Course actions
    setCourses: (courses: Course[]) => void;
    addCourse: (course: Course) => void;
    updateCourse: (courseId: string, updates: Partial<Course>) => void;
    deleteCourse: (courseId: string) => void;
    setCurrentCourse: (course: Course | null) => void;
    setCourseFilters: (filters: Partial<CourseFilters>) => void;
    clearCourseFilters: () => void;
    setCoursesLoading: (loading: boolean) => void;
    setCoursesError: (error: string | null) => void;

    // Enrollment actions
    setEnrollments: (enrollments: Enrollment[]) => void;
    addEnrollment: (enrollment: Enrollment) => void;
    updateEnrollment: (
      enrollmentId: string,
      updates: Partial<Enrollment>,
    ) => void;
    setCurrentEnrollment: (enrollment: Enrollment | null) => void;
    setEnrollmentsLoading: (loading: boolean) => void;
    setEnrollmentsError: (error: string | null) => void;

    // Progress actions
    setProgress: (progress: Progress[]) => void;
    updateProgress: (progressId: string, updates: Partial<Progress>) => void;
    setCurrentProgress: (progress: Progress | null) => void;
    markLessonComplete: (lessonId: string) => void;
    updateTimeSpent: (lessonId: string, timeSpent: number) => void;

    // Learning path actions
    setCurrentModule: (module: CourseModule | null) => void;
    setCurrentLesson: (lesson: Lesson | null) => void;
    navigateToNextLesson: () => void;
    navigateToPrevLesson: () => void;

    // UI actions
    toggleSidebar: () => void;
    setSidebarTab: (
      tab: "modules" | "progress" | "discussions" | "resources",
    ) => void;

    // Reset actions
    reset: () => void;
  };
}

const initialState = {
  courses: [],
  currentCourse: null,
  courseFilters: {},
  coursesLoading: false,
  coursesError: null,

  enrollments: [],
  currentEnrollment: null,
  enrollmentsLoading: false,
  enrollmentsError: null,

  progress: [],
  currentProgress: null,

  currentModule: null,
  currentLesson: null,

  sidebar: {
    isOpen: true,
    activeTab: "modules" as const,
  },
};

export const useCourseStore = create<CourseState>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,

        actions: {
          // Course actions
          setCourses: (courses) =>
            set((state) => {
              state.courses = courses;
              state.coursesLoading = false;
              state.coursesError = null;
            }),

          addCourse: (course) =>
            set((state) => {
              state.courses.unshift(course);
            }),

          updateCourse: (courseId, updates) =>
            set((state) => {
              const index = state.courses.findIndex(
                (c: { id: string }) => c.id === courseId,
              );
              if (index !== -1) {
                state.courses[index] = { ...state.courses[index], ...updates };
              }
              if (state.currentCourse?.id === courseId) {
                state.currentCourse = { ...state.currentCourse, ...updates };
              }
            }),

          deleteCourse: (courseId) =>
            set((state) => {
              state.courses = state.courses.filter(
                (c: { id: string }) => c.id !== courseId,
              );
              if (state.currentCourse?.id === courseId) {
                state.currentCourse = null;
              }
            }),

          setCurrentCourse: (course) =>
            set((state) => {
              state.currentCourse = course;
            }),

          setCourseFilters: (filters) =>
            set((state) => {
              state.courseFilters = { ...state.courseFilters, ...filters };
            }),

          clearCourseFilters: () =>
            set((state) => {
              state.courseFilters = {};
            }),

          setCoursesLoading: (loading) =>
            set((state) => {
              state.coursesLoading = loading;
            }),

          setCoursesError: (error) =>
            set((state) => {
              state.coursesError = error;
              state.coursesLoading = false;
            }),

          // Enrollment actions
          setEnrollments: (enrollments) =>
            set((state) => {
              state.enrollments = enrollments;
              state.enrollmentsLoading = false;
            }),

          addEnrollment: (enrollment) =>
            set((state) => {
              state.enrollments.unshift(enrollment);
            }),

          updateEnrollment: (enrollmentId, updates) =>
            set((state) => {
              const index = state.enrollments.findIndex(
                (e: { id: string }) => e.id === enrollmentId,
              );
              if (index !== -1) {
                state.enrollments[index] = {
                  ...state.enrollments[index],
                  ...updates,
                };
              }
              if (state.currentEnrollment?.id === enrollmentId) {
                state.currentEnrollment = {
                  ...state.currentEnrollment,
                  ...updates,
                };
              }
            }),

          setCurrentEnrollment: (enrollment) =>
            set((state) => {
              state.currentEnrollment = enrollment;
            }),

          setEnrollmentsLoading: (loading) =>
            set((state) => {
              state.enrollmentsLoading = loading;
            }),

          setEnrollmentsError: (error) =>
            set((state) => {
              state.enrollmentsError = error;
              state.enrollmentsLoading = false;
            }),

          // Progress actions
          setProgress: (progress) =>
            set((state) => {
              state.progress = progress;
            }),

          updateProgress: (progressId, updates) =>
            set((state) => {
              const index = state.progress.findIndex(
                (p: { id: string }) => p.id === progressId,
              );
              if (index !== -1) {
                state.progress[index] = {
                  ...state.progress[index],
                  ...updates,
                };
              }
              if (state.currentProgress?.id === progressId) {
                state.currentProgress = {
                  ...state.currentProgress,
                  ...updates,
                };
              }
            }),

          setCurrentProgress: (progress) =>
            set((state) => {
              state.currentProgress = progress;
            }),

          markLessonComplete: (lessonId) =>
            set((state) => {
              const progress = state.currentProgress;
              if (progress && progress.lessonId === lessonId) {
                progress.completed = true;
                progress.lastAccessed = new Date();
              }
            }),

          updateTimeSpent: (lessonId, timeSpent) =>
            set((state) => {
              const progress = state.currentProgress;
              if (progress && progress.lessonId === lessonId) {
                progress.timeSpent = timeSpent;
                progress.lastAccessed = new Date();
              }
            }),

          // Learning path actions
          setCurrentModule: (module) =>
            set((state) => {
              state.currentModule = module;
            }),

          setCurrentLesson: (lesson) =>
            set((state) => {
              state.currentLesson = lesson;
            }),

          navigateToNextLesson: () =>
            set((state) => {
              const { currentCourse, currentModule, currentLesson } = state;
              if (!currentCourse || !currentModule || !currentLesson) return;

              const currentModuleIndex = currentCourse.modules.findIndex(
                (m: { id: unknown }) => m.id === currentModule.id,
              );
              const currentLessonIndex = currentModule.lessons.findIndex(
                (l: { id: unknown }) => l.id === currentLesson.id,
              );

              // Try next lesson in current module
              if (currentLessonIndex < currentModule.lessons.length - 1) {
                state.currentLesson =
                  currentModule.lessons[currentLessonIndex + 1];
              }
              // Try first lesson of next module
              else if (currentModuleIndex < currentCourse.modules.length - 1) {
                const nextModule =
                  currentCourse.modules[currentModuleIndex + 1];
                if (nextModule.lessons.length > 0) {
                  state.currentModule = nextModule;
                  state.currentLesson = nextModule.lessons[0];
                }
              }
            }),

          navigateToPrevLesson: () =>
            set((state) => {
              const { currentCourse, currentModule, currentLesson } = state;
              if (!currentCourse || !currentModule || !currentLesson) return;

              const currentModuleIndex = currentCourse.modules.findIndex(
                (m: { id: unknown }) => m.id === currentModule.id,
              );
              const currentLessonIndex = currentModule.lessons.findIndex(
                (l: { id: unknown }) => l.id === currentLesson.id,
              );

              // Try previous lesson in current module
              if (currentLessonIndex > 0) {
                state.currentLesson =
                  currentModule.lessons[currentLessonIndex - 1];
              }
              // Try last lesson of previous module
              else if (currentModuleIndex > 0) {
                const prevModule =
                  currentCourse.modules[currentModuleIndex - 1];
                if (prevModule.lessons.length > 0) {
                  state.currentModule = prevModule;
                  state.currentLesson =
                    prevModule.lessons[prevModule.lessons.length - 1];
                }
              }
            }),

          // UI actions
          toggleSidebar: () =>
            set((state) => {
              state.sidebar.isOpen = !state.sidebar.isOpen;
            }),

          setSidebarTab: (tab) =>
            set((state) => {
              state.sidebar.activeTab = tab;
            }),

          // Reset actions
          reset: () => set(initialState),
        },
      })),
    ),
    {
      name: "course-store",
      partialize: (state: { courseFilters: unknown; sidebar: unknown }) => ({
        courseFilters: state.courseFilters,
        sidebar: state.sidebar,
      }),
    },
  ),
);

// Selectors
export const useCourseActions = () => useCourseStore((state) => state.actions);
export const useCurrentCourse = () =>
  useCourseStore((state) => state.currentCourse);
export const useCourses = () => useCourseStore((state) => state.courses);
export const useCoursesLoading = () =>
  useCourseStore((state) => state.coursesLoading);
export const useCourseFilters = () =>
  useCourseStore((state) => state.courseFilters);
export const useEnrollments = () =>
  useCourseStore((state) => state.enrollments);
export const useCurrentEnrollment = () =>
  useCourseStore((state) => state.currentEnrollment);
export const useProgress = () => useCourseStore((state) => state.progress);
export const useCurrentModule = () =>
  useCourseStore((state) => state.currentModule);
export const useCurrentLesson = () =>
  useCourseStore((state) => state.currentLesson);
export const useSidebar = () => useCourseStore((state) => state.sidebar);
