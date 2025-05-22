// app/api/images/route.ts
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  // 1️⃣ Initialize Supabase on the Edge, using the request cookies
  const supabase = createRouteHandlerClient({ cookies });

  // 2️⃣ Ensure we have a logged-in session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 3️⃣ Fetch all images for this user
  const { data: images, error } = await supabase
    .from("images")
    .select("id, image_url, created_at")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading images:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 4️⃣ For each storage path, create a short-lived signed URL (private bucket)
  const signed = await Promise.all(
    images.map(async (img) => {
      const {
        data: { signedUrl },
        error: signErr,
      } = await supabase.storage
        .from("product-images")
        .createSignedUrl(img.image_url, 60); // valid for 60s
      if (signErr) console.error("⚠️ Signature error:", signErr);
      return { ...img, url: signedUrl };
    })
  );

  return NextResponse.json({ images: signed });
}
