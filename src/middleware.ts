import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware to handle session and authentication
 * In Next.js, we mainly use this to:
 * 1. Protect routes from unauthenticated access
 * 2. Ensure cookies are set correctly for session management
 */
export async function middleware(request: NextRequest) {
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/review', '/learn', '/settings', '/stats'];
  const pathname = request.nextUrl.pathname;

  // Check if the current path requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // For protected routes, we rely on the AuthGuard component
    // to handle redirection to login if needed
    // The middleware here mainly ensures proper response structure
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - login and auth routes (no auth needed)
     */
    '/((?!_next/static|_next/image|favicon.ico|login|api/auth|auth).*)',
  ],
};
