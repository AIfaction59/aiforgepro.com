import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createRouteHandlerClient({ cookies });

export async function POST(req: NextRequest) {
  try {
    const { prompt, style } = await req.json();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Modify prompt based on style
    let fullPrompt = prompt;
    if (style === "multi-view") {
      fullPrompt +=
        " — Display front, side, and back views of the product with consistent lighting.";
    } else {
      fullPrompt += `, ${style}`;
    }

    console.log("🎨 Generating image for prompt:", fullPrompt);

    // Generate image from OpenAI
    const result = await openai.images.generate({
      model: "dall-e-3",
      prompt: fullPrompt,
      n: 1,
      size: "1024x1024",
    });

    const dalleUrl = result.data[0]?.url;
    if (!dalleUrl) throw new Error("No image URL returned from OpenAI");

    // Fetch the actual image binary from the OpenAI URL
    const imageRes = await fetch(dalleUrl);
    const imageBuffer = await imageRes.arrayBuffer();
    const imageData = new Uint8Array(imageBuffer);

    const fileName = `${userId}-${Date.now()}.png`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, imageData, {
        contentType: "image/png",
        upsert: false,
      });

    if (uploadError) {
      console.error("🛑 Upload error:", uploadError);
      throw new Error("Failed to upload image to storage.");
    }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${fileName}`;

    // Save metadata to database
    const { error: dbError } = await supabase.from("images").insert([
      {
        user_id: userId,
        image_url: publicUrl,
        prompt,
      },
    ]);

    if (dbError) {
      console.error("🛑 DB error:", dbError);
      throw new Error("Failed to save image to database.");
    }

    return NextResponse.json({ imageUrl: publicUrl });
  } catch (err: any) {
    console.error("🔥 DALL·E error:", err.message);
    return NextResponse.json(
      { error: err.message || "Image generation failed" },
      { status: 500 }
    );
  }
}
