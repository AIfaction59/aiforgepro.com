import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const userId = session.user.id;

    // Check if profile exists
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .maybeSingle();

    // If no profile, create it with 1 free credit
    if (!profile && !error) {
      await supabase.from("profiles").insert([
        {
          id: userId,
          credits: 1,
        },
      ]);
    }
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/generate", "/pricing", "/library", "/api/:path*"],
};
