// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export const runtime = "edge"; // optional but recommended for auth-related middleware

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("redirectedFrom", req.nextUrl.href); // preserve full path
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

// Only protect /dashboard and its children
export const config = {
  matcher: ["/dashboard/:path*"],
};
