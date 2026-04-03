import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware to handle session refresh for Supabase SSR.
 * This is required in production so that the auth token stored in cookies
 * is refreshed on every request, keeping the session alive.
 * Without this, the session cookie set at /auth/callback never propagates
 * to subsequent server-side requests.
 */
export async function middleware(request: NextRequest) {
  // Fail fast with a clear message if env vars are missing (e.g. not set on hosting platform)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error(
      '[middleware] Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your hosting platform environment settings.'
    );
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Apply cookies to both the request and response so they propagate correctly
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session — this is the key call that keeps cookies in sync
  // Do NOT use getSession() here; getUser() hits the Supabase Auth server to verify
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
