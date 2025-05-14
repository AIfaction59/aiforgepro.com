// app/api/images/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  // initialize Supabase in this Edge Route
  const supabase = createRouteHandlerClient({ cookies });

  const { data: images, error } = await supabase
    .from("images")
    .select("id, image_url, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading images:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ images });
}

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  // get the logged-in session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { imageUrl } = await req.json();
  const { error } = await supabase
    .from("images")
    .insert({
      user_id: session.user.id,
      image_url: imageUrl,
    });

  if (error) {
    console.error("Error saving image:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
