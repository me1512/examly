// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/settings",
    "/exams",
    "/students",
    "/analytics",
  ];

  // Admin-only routes
  const adminRoutes = ["/admin", "/users", "/system"];

  // Teacher-only routes
  const teacherRoutes = ["/students", "/analytics", "/create-exam"];

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  const isTeacherRoute = teacherRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Redirect to auth page for protected routes
  if (isProtectedRoute) {
    // This will be handled by AuthGuard on the client side
    // Middleware just ensures the route exists
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth page
  if (pathname.startsWith("/auth")) {
    // This will be handled by the auth page component
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

// next.config.js
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     appDir: true,
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'lh3.googleusercontent.com',
//         port: '',
//         pathname: '/a/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'firebasestorage.googleapis.com',
//         port: '',
//         pathname: '/**',
//       },
//     ],
//   },
//   webpack: (config) => {
//     config.resolve.fallback = {
//       ...config.resolve.fallback,
//       fs: false,
//     }
//     return config
//   },
// }

// module.exports = nextConfig

// /* package.json additions */
// {
//   "dependencies": {
//     "@hookform/resolvers": "^3.3.2",
//     "@tanstack/react-query": "^5.8.4",
//     "@tanstack/react-query-devtools": "^5.8.4",
//     "bcryptjs": "^2.4.3",
//     "clsx": "^2.0.0",
//     "firebase": "^10.7.1",
//     "firebase-admin": "^11.11.1",
//     "framer-motion": "^10.16.16",
//     "lucide-react": "^0.294.0",
//     "next": "14.0.4",
//     "react": "^18",
//     "react-dom": "^18",
//     "react-hook-form": "^7.48.2",
//     "react-hot-toast": "^2.4.1",
//     "react-icons": "^4.12.0",
//     "tailwind-merge": "^2.0.0",
//     "zod": "^3.22.4",
//     "zustand": "^4.4.7"
//   },
//   "devDependencies": {
//     "@types/bcryptjs": "^2.4.6",
//     "@types/node": "^20",
//     "@types/react": "^18",
//     "@types/react-dom": "^18",
//     "autoprefixer": "^10.0.1",
//     "eslint": "^8",
//     "eslint-config-next": "14.0.4",
//     "postcss": "^8",
//     "tailwindcss": "^3.3.0",
//     "typescript": "^5"
//   }
// }

// // tsconfig.json
// {
//   "compilerOptions": {
//     "target": "es5",
//     "lib": ["dom", "dom.iterable", "es6"],
//     "allowJs": true,
//     "skipLibCheck": true,
//     "strict": true,
//     "noEmit": true,
//     "esModuleInterop": true,
//     "module": "esnext",
//     "moduleResolution": "bundler",
//     "resolveJsonModule": true,
//     "isolatedModules": true,
//     "jsx": "preserve",
//     "incremental": true,
//     "plugins": [
//       {
//         "name": "next"
//       }
//     ],
//     "baseUrl": ".",
//     "paths": {
//       "@/*": ["./*"]
//     }
//   },
//   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
//   "exclude": ["node_modules"]
// }
