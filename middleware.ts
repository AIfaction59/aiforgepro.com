import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

// Middleware to protect authenticated routes
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    const loginUrl = new URL("/auth/login", req.url);
    // Preserve full path (including query string and hash)
    loginUrl.searchParams.set("redirectedFrom", req.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

// Apply only to the dashboard and its subroutes
export const config = {
  matcher: ["/dashboard/:path*"],
};
