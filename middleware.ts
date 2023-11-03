import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const authorized = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!authorized) {
    if (req.url.includes("/api")) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 404 }
      );
    }
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/v1/:users*",
    "/api/v1/:user*",
    "/api/v1/:notifications*",
    "/api/v1/:subscriptions*",
    "/api/v1/:templates*",
    "/myFeeds/:path*",
    "/feeds/:path*",
    "/search/:path*",
    "/channels/:path*",
    "/profile/:path*",
    "/subscriptions/:path*",
  ],
};
