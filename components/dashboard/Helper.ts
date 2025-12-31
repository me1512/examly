import { UserRole } from "@/types/auth";

// Helper functions
function getRoleBasedWelcomeMessage(role: UserRole): string {
  switch (role) {
    case "super-admin":
      return "Manage the entire platform and oversee all operations.";
    case "admin":
      return "Oversee courses, manage users, and analyze platform performance.";
    case "teacher":
      return "Create engaging courses and track your students' progress.";
    case "student":
      return "Continue your learning journey and explore new courses.";
    default:
      return "Welcome to your learning dashboard.";
  }
}

function generateMockDashboardData(role: UserRole) {
  // Basic mock enrollments with required fields
  const mockEnrollments = [
    {
      id: "1",
      title: "React Development",
      instructorName: "John Smith",
      progress: 75,
      // Required fields from Enrollment interface
      userId: "user1",
      courseId: "c1",
      enrolledAt: new Date(),
      status: "active",
      description: "Learn React from scratch",
      instructorId: "inst1",
      category: "Development",
      difficulty: "intermediate",
      duration: 120,
      studentsCount: 100,
      lessonsCount: 20,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ["react", "js"],
    },
    {
      id: "2",
      title: "JavaScript Fundamentals",
      instructorName: "Jane Doe",
      progress: 45,
      userId: "user1",
      courseId: "c2",
      enrolledAt: new Date(),
      status: "active",
      description: "JS Basics",
      instructorId: "inst2",
      category: "Development",
      difficulty: "beginner",
      duration: 60,
      studentsCount: 200,
      lessonsCount: 10,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ["javascript"],
    },
    {
      id: "3",
      title: "CSS Mastery",
      instructorName: "Mike Johnson",
      progress: 20,
      userId: "user1",
      courseId: "c3",
      enrolledAt: new Date(),
      status: "active",
      description: "Advanced CSS",
      instructorId: "inst3",
      category: "Design",
      difficulty: "advanced",
      duration: 90,
      studentsCount: 150,
      lessonsCount: 15,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ["css", "design"],
    },
  ];

  const baseData = {
    recentActivity: [
      {
        id: "1",
        type: "course",
        title: "New course created",
        description: "Introduction to React Development",
        time: "2 hours ago",
      },
      {
        id: "2",
        type: "assessment",
        title: "Assessment submitted",
        description: "JavaScript Fundamentals Quiz",
        time: "5 hours ago",
      },
      {
        id: "3",
        type: "student",
        title: "Student enrolled",
        description: "John Doe joined Web Development Course",
        time: "1 day ago",
      },
    ],
    recentCourses: [
      {
        id: "1",
        title: "React Development",
        description: "Learn modern React development with hooks and context",
        studentsCount: 45,
        lessonsCount: 12,
        isPublished: true,
      },
      {
        id: "2",
        title: "JavaScript Fundamentals",
        description: "Master the fundamentals of JavaScript programming",
        studentsCount: 32,
        lessonsCount: 8,
        isPublished: false,
      },
      {
        id: "3",
        title: "CSS Mastery",
        description: "Advanced CSS techniques and modern layout systems",
        studentsCount: 28,
        lessonsCount: 10,
        isPublished: true,
      },
    ],
    // Corrected key to match DashboardData interface
    recentEnrollments: mockEnrollments,
  };

  // Role-specific stats
  const statsMap = {
    "super-admin": [
      {
        title: "Total Courses",
        value: "124",
        change: { value: 12, type: "increase" },
        icon: "BookOpen",
        color: "blue",
      },
      {
        title: "Total Users",
        value: "2,845",
        change: { value: 8, type: "increase" },
        icon: "Users",
        color: "green",
      },
      {
        title: "Revenue",
        value: "$45,230",
        change: { value: 15, type: "increase" },
        icon: "TrendingUp",
        color: "purple",
      },
      {
        title: "Active Courses",
        value: "98",
        change: { value: 5, type: "increase" },
        icon: "CheckCircle",
        color: "orange",
      },
    ],
    admin: [
      {
        title: "Total Courses",
        value: "87",
        change: { value: 10, type: "increase" },
        icon: "BookOpen",
        color: "blue",
      },
      {
        title: "Total Students",
        value: "1,234",
        change: { value: 6, type: "increase" },
        icon: "Users",
        color: "green",
      },
      {
        title: "Assessments",
        value: "156",
        change: { value: 20, type: "increase" },
        icon: "Award",
        color: "purple",
      },
      {
        title: "Completion Rate",
        value: "78%",
        change: { value: 3, type: "increase" },
        icon: "CheckCircle",
        color: "orange",
      },
    ],
    teacher: [
      {
        title: "My Courses",
        value: "8",
        change: { value: 2, type: "increase" },
        icon: "BookOpen",
        color: "blue",
      },
      {
        title: "Students",
        value: "234",
        change: { value: 12, type: "increase" },
        icon: "Users",
        color: "green",
      },
      {
        title: "Assessments",
        value: "24",
        change: { value: 8, type: "increase" },
        icon: "Award",
        color: "purple",
      },
      {
        title: "Avg. Score",
        value: "85%",
        change: { value: 4, type: "increase" },
        icon: "TrendingUp",
        color: "orange",
      },
    ],
    student: [
      {
        title: "Enrolled Courses",
        value: "6",
        icon: "BookOpen",
        color: "blue",
      },
      { title: "Completed", value: "3", icon: "CheckCircle", color: "green" },
      { title: "In Progress", value: "3", icon: "Clock", color: "orange" },
      { title: "Certificates", value: "2", icon: "Award", color: "purple" },
    ],
  };

  return {
    ...baseData,
    stats: statsMap[role] || statsMap.student,
  };
}

export { getRoleBasedWelcomeMessage, generateMockDashboardData };