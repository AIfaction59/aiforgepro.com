import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const runtime = "edge"; // keep as-is for now

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { prompt, style, file } = await req.json();
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // ✅ 1. Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = session.user;

    // ✅ 2. Check user credits
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || profile.credits <= 0) {
      return NextResponse.json({ error: "You are out of credits" }, { status: 402 });
    }

    // ✅ 3. Build prompt
    let fullPrompt = prompt;
    if (style === "multi-view") {
      fullPrompt +=
        " — Display the product in a multi-angle layout: front, back, and side views, neatly arranged in a single image. Maintain consistent lighting and styling across each angle.";
    } else {
      fullPrompt += `, ${style}`;
    }

    console.log("Using DALL·E 3 with prompt:", fullPrompt);

    // ✅ 4. Generate or vary image
    let imageBuffer: Buffer;
    let imageUrl: string;

    if (file) {
      const match = file.match(/^data:(.+);base64,(.+)$/);
      if (!match) throw new Error("Invalid file format");

      const [, mimeType, b64data] = match;
      const blob = Buffer.from(b64data, "base64");
      const uploadFile = new File([blob], "upload.png", { type: mimeType });

      const variation = await openai.images.createVariation({
        image: uploadFile,
        n: 1,
        size: "1024x1024",
      });

      imageUrl = variation.data[0].url;
    } else {
      const generated = await openai.images.generate({
        model: "dall-e-3",
        prompt: fullPrompt,
        n: 1,
        size: "1024x1024",
      });

      imageUrl = generated.data[0].url;
    }

    // ✅ 5. Save metadata in DB
    const { error: insertError } = await supabase.from("images").insert([
      {
        user_id: user.id,
        prompt: fullPrompt,
        image_url: imageUrl,
      },
    ]);

    if (insertError) {
      console.error("Failed to save image metadata:", insertError);
      return NextResponse.json(
        { error: "Failed to save image to database" },
        { status: 500 }
      );
    }

    // ✅ 6. Decrement 1 credit
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ credits: profile.credits - 1 })
      .eq("id", user.id);

    if (updateError) {
      console.error("Failed to decrement credits:", updateError);
    }

    return NextResponse.json({ imageUrl });
  } catch (err: any) {
    console.error("❌ DALL·E generate error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
