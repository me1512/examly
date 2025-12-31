// // middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Protected routes that require authentication
//   const protectedRoutes = [
//     "/dashboard",
//     "/profile",
//     "/settings",
//     "/exams",
//     "/students",
//     "/analytics",
//   ];

//   // Admin-only routes
//   const adminRoutes = ["/admin", "/users", "/system"];

//   // Teacher-only routes
//   const teacherRoutes = ["/students", "/analytics", "/create-exam"];

//   // Check if the current path is protected
//   const isProtectedRoute = protectedRoutes.some((route) =>
//     pathname.startsWith(route),
//   );

//   const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

//   const isTeacherRoute = teacherRoutes.some((route) =>
//     pathname.startsWith(route),
//   );

//   // Redirect to auth page for protected routes
//   if (isProtectedRoute) {
//     // This will be handled by AuthGuard on the client side
//     // Middleware just ensures the route exists
//     return NextResponse.next();
//   }

//   // Redirect authenticated users away from auth page
//   if (pathname.startsWith("/auth")) {
//     // This will be handled by the auth page component
//     return NextResponse.next();
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };

// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

interface UserPayload {
  id: string;
  email: string;
  role: "student" | "teacher" | "admin" | "super-admin";
  name: string;
}

// Protected route patterns
const protectedRoutes = {
  // Authentication required for all dashboard routes
  dashboard: /^\/dashboard/,
  profile: /^\/profile/,

  // Course management routes
  courses: {
    create: /^\/courses\/create/,
    edit: /^\/courses\/[^\/]+\/edit/,
    manage: /^\/courses\/manage/,
  },

  // Learning routes
  learn: /^\/learn/,

  // Admin routes
  admin: /^\/admin/,

  // API routes
  api: {
    protected: /^\/api\/(?!auth\/)/,
    admin: /^\/api\/admin/,
    courses: /^\/api\/courses/,
  },
};

// Role-based permissions
const rolePermissions = {
  "super-admin": ["*"], // Full access
  admin: [
    "dashboard",
    "profile",
    "courses.view",
    "courses.create",
    "courses.edit",
    "courses.delete",
    "courses.manage",
    "learn",
    "admin.users",
    "admin.courses",
    "admin.analytics",
    "api.protected",
    "api.admin",
  ],
  teacher: [
    "dashboard",
    "profile",
    "courses.view",
    "courses.create",
    "courses.edit",
    "courses.manage",
    "learn",
    "api.protected",
    "api.courses",
  ],
  student: ["dashboard", "profile", "courses.view", "learn", "api.protected"],
};

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/unauthorized",
  "/courses", // Course browsing is public
  /^\/courses\/[^\/]+$/, // Individual course pages are public
  /^\/api\/auth\//,
  /^\/api\/courses\/[^\/]+$/, // Public course details API
];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => {
    if (typeof route === "string") {
      return pathname === route;
    }
    return route.test(pathname);
  });
}

function hasPermission(
  userRole: string,
  requiredPermissions: string[],
): boolean {
  const userPermissions =
    rolePermissions[userRole as keyof typeof rolePermissions] || [];

  // Super admin has access to everything
  if (userPermissions.includes("*")) {
    return true;
  }

  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission),
  );
}

function getRequiredPermissions(pathname: string): string[] {
  // Dashboard routes
  if (protectedRoutes.dashboard.test(pathname)) {
    return ["dashboard"];
  }

  // Profile routes
  if (protectedRoutes.profile.test(pathname)) {
    return ["profile"];
  }

  // Course creation/management routes
  if (protectedRoutes.courses.create.test(pathname)) {
    return ["courses.create"];
  }

  if (protectedRoutes.courses.edit.test(pathname)) {
    return ["courses.edit"];
  }

  if (protectedRoutes.courses.manage.test(pathname)) {
    return ["courses.manage"];
  }

  // Learning routes
  if (protectedRoutes.learn.test(pathname)) {
    return ["learn"];
  }

  // Admin routes
  if (protectedRoutes.admin.test(pathname)) {
    return ["admin.users", "admin.courses", "admin.analytics"];
  }

  // API routes
  if (protectedRoutes.api.admin.test(pathname)) {
    return ["api.admin"];
  }

  if (protectedRoutes.api.courses.test(pathname)) {
    return ["api.courses"];
  }

  if (protectedRoutes.api.protected.test(pathname)) {
    return ["api.protected"];
  }

  return [];
}

async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key",
    );
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as UserPayload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and internal Next.js routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth/callback") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Get token from cookies or authorization header
  const token =
    request.cookies.get("auth-token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    // Redirect to login for protected routes
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token
  const user = await verifyToken(token);
  if (!user) {
    // Invalid token - clear cookie and redirect
    const response = pathname.startsWith("/api/")
      ? NextResponse.json({ error: "Invalid token" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", request.url));

    response.cookies.delete("auth-token");
    return response;
  }

  // Check role-based permissions
  const requiredPermissions = getRequiredPermissions(pathname);

  if (
    requiredPermissions.length > 0 &&
    !hasPermission(user.role, requiredPermissions)
  ) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Add user information to request headers for downstream use
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", user.id);
  requestHeaders.set("x-user-email", user.email);
  requestHeaders.set("x-user-role", user.role);
  requestHeaders.set("x-user-name", user.name);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
