// middleware.ts
import { withAuth } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    // you can extend this to check roles, etc.
  },
  {
    publicRoutes: ["/", "/auth/login", "/auth/signup"],
  }
);

export const config = { matcher: ["/dashboard/:path*"] };
