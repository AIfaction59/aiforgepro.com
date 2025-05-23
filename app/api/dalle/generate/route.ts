// app/api/dalle/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  // 1) Make sure they’re signed in
  const {
    data: { session },
  } = await supabaseServer.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  // 2) Check their credits
  const { data: profile, error: fetchErr } = await supabaseServer
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single();
  if (fetchErr) {
    return NextResponse.json({ error: "Could not fetch credits" }, { status: 500 });
  }
  if ((profile.credits || 0) < 1) {
    return NextResponse.json({ error: "No credits left" }, { status: 402 });
  }

  // 3) Generate the image
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const resp = await openai.images.generate({ prompt, n: 1, size: "1024x1024" });
  const imageUrl = resp.data[0].url!;

  // 4) Deduct one credit
  const newCredits = (profile.credits || 0) - 1;
  await supabaseServer
    .from("profiles")
    .update({ credits: newCredits })
    .eq("id", userId);

  return NextResponse.json({ imageUrl, credits: newCredits });
}
