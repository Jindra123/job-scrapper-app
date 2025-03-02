import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/user-info"];

export default async function middleware(req: NextRequest) {
  const session = await getToken({
    req,
    secret: process.env.AUTH_SECRET, // Ensure this matches your .env variable name
  });

  const { pathname } = req.nextUrl;
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  console.log("Middleware - Pathname:", pathname);
  console.log("Middleware - Session:", session);
  console.log("Middleware - Is Protected:", isProtected);

  if (isProtected && !session) {
    console.log("Middleware - Redirecting to signin");
    const redirectUrl = new URL("/auth/signin", req.url);
    redirectUrl.searchParams.set("callbackUrl", req.url); // Return to original URL after sign-in
    console.log("Middleware - Redirect URL:", redirectUrl.toString());
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user-info", "/user-info/:path*"],
};
