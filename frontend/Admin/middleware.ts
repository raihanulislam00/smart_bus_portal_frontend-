import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('authToken');
  const pathname = request.nextUrl.pathname;

  console.log(`Middleware: ${pathname}, hasToken: ${!!authToken}`);

  // Protected routes that require authentication
  const protectedRoutes = ['/admin/dashboard', '/admin/profile', '/admin/buses'];
  
  // Auth routes that should redirect if already authenticated
  const authRoutes = ['/login', '/registration'];

  // Public routes that don't need authentication
  const publicRoutes = ['/', '/about', '/contact', '/buses'];

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if current path is an auth route
  const isAuthRoute = authRoutes.includes(pathname);
  
  // Check if current path is public
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/_next');

  // Allow public routes without authentication check
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !authToken) {
    console.log(`Redirecting to login: ${pathname} (no auth token)`);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Temporarily disable auth route redirects to prevent infinite loops
  // The client-side authentication will handle proper redirects
  // if (isAuthRoute && authToken) {
  //   console.log(`Redirecting to dashboard: ${pathname} (has auth token)`);
  //   return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  // }

  // For API routes, add CORS headers
  if (pathname.startsWith('/api/')) {
    const requestHeaders = new Headers(request.headers);
    
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Credentials', "true");
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
    response.headers.set(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files, API routes, and _next
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
