// app/api/credits/balance/route.ts
import { NextResponse } from "next/server";
// 4 levels up from app/api/credits/balance/route.ts → project root
import { supabaseServer } from "../../../../supabaseServer";

export async function GET() {
  const {
    data: { session },
  } = await supabaseServer.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Call the RPC function to sum credits
  const { data, error } = await supabaseServer.rpc("sum_credits", {
    uid: session.user.id,
  });

  if (error) {
    console.error("Error fetching balance:", error);
    return NextResponse.json({ error: "Failed to load balance" }, { status: 500 });
  }

  const balance: number = data || 0;
  return NextResponse.json({ balance });
}
