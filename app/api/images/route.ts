// app/api/images/route.ts
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // 1) get session
    const {
      data: { session },
      error: sessErr,
    } = await supabase.auth.getSession();
    if (sessErr || !session) throw new Error("Not authenticated");

    // 2) fetch this user’s images
    const { data: images, error } = await supabase
      .from("images")
      .select("id, image_url, created_at")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;

    // 3) sign each URL (private bucket)
    const signed = await Promise.all(
      images.map(async (img) => {
        const { data, error: signErr } = await supabase.storage
          .from("product-images")
          .createSignedUrl(img.image_url, 60);
        if (signErr) console.error("🚨", signErr);
        return { ...img, url: data.signedUrl };
      })
    );

    return NextResponse.json({ images: signed });
  } catch (err: any) {
    console.error("❌ /api/images error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
