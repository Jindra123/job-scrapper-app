import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/user-info", "/my-applications"];
const companyRoutes = ["/jobs/create", "/company/applications"];
const authRoutes = ["/auth/signin", "/auth/register", "/auth/company/register"];

export default async function middleware(req: NextRequest) {
  const session = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // If user is logged in, redirect away from auth pages
  if (session && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isCompanyRoute = companyRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Protect user-specific routes
  if (isProtectedRoute) {
    if (!session) {
      const redirectUrl = new URL("/auth/signin", req.url);
      redirectUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(redirectUrl);
    }
    if (session.type !== "user") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect company-specific routes
  if (isCompanyRoute) {
    if (!session) {
      const redirectUrl = new URL("/auth/signin", req.url);
      redirectUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(redirectUrl);
    }
    if (session.type !== "company") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user-info/:path*",
    "/my-applications/:path*",
    "/jobs/create/:path*",
    "/company/applications/:path*",
    "/auth/signin",
    "/auth/register",
    "/auth/company/register",
  ],
};

