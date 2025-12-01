import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;

  const url = req.nextUrl.pathname;

  const publicRoutes = ["/", "/pricing", "/faq", "/auth", "/forget-password", "/verify-email"];

  if (publicRoutes.includes(url) && !token) {
    return NextResponse.next();
  }

  if (publicRoutes.includes(url) && token && !url.startsWith("/auth")) {
    return NextResponse.next();
  }

  if (publicRoutes.includes(url) && token && url.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!token) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/payment/:path*", "/success/:path*", "/auth/:path*"],
};
