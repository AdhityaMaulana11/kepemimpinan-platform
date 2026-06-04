import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for token in cookies (set by client after login via Zustand persist)
  const authStore = request.cookies.get('kp-auth-store');

  let isLoggedIn = false;
  let isAdmin = false;

  if (authStore) {
    try {
      const parsed = JSON.parse(decodeURIComponent(authStore.value));
      const state = parsed?.state;
      isLoggedIn = !!state?.isLoggedIn;
      isAdmin = state?.user?.role === 'admin';
    } catch {
      // Invalid cookie
    }
  }

  // Protect /admin routes — admin only
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn || !isAdmin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect /dashboard and /upload — auth required
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/upload')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect logged-in users away from login/register
  if ((pathname === '/login' || pathname === '/register') && isLoggedIn) {
    if (isAdmin) return NextResponse.redirect(new URL('/admin', request.url));
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/upload/:path*', '/login', '/register'],
};
