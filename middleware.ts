import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. API Route Protection
  // API routes expect the Authorization header.
  if (pathname.startsWith("/api/")) {
    // Skip protection for authentication endpoints or public callbacks if any
    if (pathname.startsWith("/api/auth") || pathname.startsWith("/api/public")) {
      return NextResponse.next();
    }

    // Note: We cannot verify the Firebase ID token signature securely in the Edge runtime
    // without fetching Google's public keys, which might cause latency.
    // For now, we allow the request to pass to the actual API route handler,
    // which should perform the rigorous verification using firebase-admin SDK.
    // This middleware just ensures we don't accidentally expose obvious unprotected routes if needed.
    
    return NextResponse.next();
  }

  // 2. Page Route Protection
  // Since authentication state is maintained in Firebase SDK (IndexedDB) on the client,
  // the Middleware cannot see the user's session.
  // We rely on the client-side <AuthGuard /> component to protect sensitive pages.
  // The middleware simply allows navigation to proceed.
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};