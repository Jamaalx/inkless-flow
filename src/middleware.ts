import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  
  const isTryingDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isAuthPage = 
    request.nextUrl.pathname.startsWith("/auth/login") || 
    request.nextUrl.pathname.startsWith("/auth/register");
  
  if (isTryingDashboard && !isAuthenticated) {
    // Redirect to login if trying to access dashboard without being authenticated
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  
  if (isAuthPage && isAuthenticated) {
    // Redirect to dashboard if already authenticated but trying to access auth pages
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login", "/auth/register"],
};