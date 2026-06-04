import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Decode JWT payload without verifying signature (safe for role-based routing only).
 *  Verification happens server-side in the NestJS API for all protected actions. */
function parseJwt(token: string): { sub?: string; role?: string; exp?: number } | null {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return null;
    // atob is available in Next.js middleware (Edge Runtime)
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read the JWT cookie set by lib/auth.ts on login
  const token = request.cookies.get('kp_auth_token')?.value ?? null;

  let isLoggedIn = false;
  let isAdmin = false;

  if (token) {
    const payload = parseJwt(token);
    if (payload) {
      // Check token hasn't expired
      const now = Math.floor(Date.now() / 1000);
      if (!payload.exp || payload.exp > now) {
        isLoggedIn = true;
        isAdmin = payload.role === 'admin';
      }
    }
  }

  // Protect /admin routes — admin only
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) return NextResponse.redirect(new URL('/login', request.url));
    if (!isAdmin) return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protect /dashboard and /upload — any authenticated user
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/upload')) {
    if (!isLoggedIn) return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect already-logged-in users away from login/register
  if ((pathname === '/login' || pathname === '/register') && isLoggedIn) {
    if (isAdmin) return NextResponse.redirect(new URL('/admin', request.url));
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/upload/:path*', '/login', '/register'],
};
