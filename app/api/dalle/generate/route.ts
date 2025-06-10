// app/api/dalle/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { prompt, style, file } = await req.json();

    // Special multi-view add-on
    let fullPrompt = prompt;
    if (style === "multi-view") {
      fullPrompt +=
        " — Display the product in a multi-angle layout: front, back, and side views, neatly arranged in a single image. Maintain consistent lighting and styling across each angle.";
    } else {
      fullPrompt += `, ${style}`;
    }

    // handle file vs. text as before...
    let result;
    if (file) {
      const match = file.match(/^data:(.+);base64,(.+)$/);
      if (!match) throw new Error("Invalid file upload format");
      const [, mimeType, b64data] = match;
      const buffer = Buffer.from(b64data, "base64");
      const upload = new File([buffer], "upload.png", { type: mimeType });
      result = await openai.images.createVariation({
        image: upload,
        n: 1,
        size: "1024x1024",
      });
    } else {
      result = await openai.images.generate({
        prompt: fullPrompt,
        n: 1,
        size: "1024x1024",
      });
    }

    return NextResponse.json({ imageUrl: result.data[0].url });
  } catch (err: any) {
    console.error("DALL·E error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
