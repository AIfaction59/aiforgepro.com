// app/api/dalle/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Tell Next.js this handler runs on the Edge runtime
export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, file } = await req.json();

    let result;
    if (file) {
      // file should be a base64 data URL: data:<mime>;base64,<data>
      const match = file.match(/^data:(.+);base64,(.+)$/);
      if (!match) throw new Error("Invalid file upload");
      const [, mimeType, b64data] = match;
      const buffer = Buffer.from(b64data, "base64");
      const blob = new Blob([buffer], { type: mimeType });

      result = await openai.images.createVariation({
        image: blob,
        n: 1,
        size: "1024x1024",
      });
    } else {
      result = await openai.images.generate({
        prompt,
        n: 1,
        size: "1024x1024",
      });
    }

    return NextResponse.json({ imageUrl: result.data[0].url });
  } catch (e: any) {
    console.error("DALL·E Error:", e);
    return NextResponse.json(
      { error: e.message || "Server error" },
      { status: 500 }
    );
  }
}
