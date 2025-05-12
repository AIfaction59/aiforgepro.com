// app/api/images/route.ts
import { NextRequest, NextResponse } from "next/server";
// 3 levels up from app/api/images/route.ts → project root
import { supabaseServer } from "../../../supabaseServer"; 

export async function POST(req: NextRequest) {
  const { imageUrl } = await req.json();

  // Grab the logged-in user session
  const { data: { session } } = await supabaseServer.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Insert the new image record
  const { error } = await supabaseServer
    .from("images")
    .insert({
      user_id: session.user.id,
      image_url: imageUrl,
    });

  if (error) {
    console.error("Error saving image:", error);
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
