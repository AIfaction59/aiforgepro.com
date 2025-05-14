// app/api/credits/balance/route.ts
import { NextResponse } from "next/server";
// this path might need four “../” instead of three depending on where you put supabaseServer.ts:
import { supabaseServer } from "../../../../supabaseServer";

export async function GET() {
  const {
    data: { session },
  } = await supabaseServer.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profile, error } = await supabaseServer
    .from("profiles")
    .select("credits")
    .eq("id", session.user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ credits: profile.credits });
}
