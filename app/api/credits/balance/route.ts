// app/api/credits/balance/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();

    const {
      data: { session },
      error: sessErr,
    } = await supabase.auth.getSession();
    if (sessErr || !session) throw new Error("Not authenticated");

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", session.user.id)
      .single();
    if (error) throw error;

    return NextResponse.json({ credits: profile.credits });
  } catch (err: any) {
    console.error("❌ /api/credits/balance error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
