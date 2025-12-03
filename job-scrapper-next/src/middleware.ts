import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/user-info"];
const companyRoutes = ["/jobs/create", "/company/applications"];

export default async function middleware(req: NextRequest) {
  const session = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isCompanyRoute = companyRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtected && !session) {
    const redirectUrl = new URL("/auth/signin", req.url);
    redirectUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(redirectUrl);
  }

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
    "/user-info",
    "/user-info/:path*",
    "/jobs/create",
    "/jobs/create/:path*",
    "/company/applications",
    "/company/applications/:path*",
  ],
};

