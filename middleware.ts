import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;
export default async function middleware(req: NextRequest) {
  const authorized = await getToken({ req, secret });

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
  matcher: ["/api/v1/:path*", "/feeds/:path*"],
};
