import {
  getAccessToken,
  getRefreshToken,
  refreshSession,
} from "@/utils/auth/session.actions";
import { NextRequest, NextResponse } from "next/server";

// Specify protected and public routes
const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/register", "/recipes"];
const authRoutes = ["/api/auth/refresh", "/api/auth/logout"];

export const middleware = async (req: NextRequest) => {
  // Check current route
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some((route) => path === route);
  const isAuthRoute = authRoutes.some((route) => path === route);

  // Allow auth routes to pass through
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // Check tokens
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();

  // If no tokens at all and trying to access protected route, redirect to login
  if (!accessToken && !refreshToken && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // If no access token but has refresh token, try to refresh
  if (!accessToken && refreshToken) {
    const refreshed = await refreshSession();

    // If refresh failed and trying to access protected route, redirect to login
    if (!refreshed && isProtectedRoute) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }

  // Redirect authenticated users away from login/register pages
  if (isPublicRoute && accessToken && !path.startsWith("/recipes")) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
