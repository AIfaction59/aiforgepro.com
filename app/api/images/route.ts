// app/api/images/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  // 1) grab the user session server-side
  const {
    data: { session },
    error: sessionErr,
  } = await supabaseServer.auth.getSession();

  if (sessionErr || !session) {
    return NextResponse.json({ images: [] }); // not signed in → empty list
  }

  // 2) fetch only THIS user's images
  const { data: images, error } = await supabaseServer
    .from("images")
    .select("id, image_url, created_at")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading images:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 3) return them
  return NextResponse.json({ images });
}
