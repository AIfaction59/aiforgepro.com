// app/api/dalle/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// run on the Edge runtime
export const runtime = "edge";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, file } = await req.json();

    let imageUrl: string;
    if (file) {
      // file is expected as a data URL: data:<mime>;base64,<data>
      const match = file.match(/^data:(.+);base64,(.+)$/);
      if (!match) throw new Error("Invalid file upload format");
      const [, mimeType, b64data] = match;

      const buffer = Buffer.from(b64data, "base64");
      // Create a File (FileLike) instead of Blob
      const upload = new File([buffer], "upload.png", { type: mimeType });

      const variation = await openai.images.createVariation({
        image: upload,
        n: 1,
        size: "1024x1024",
      });
      imageUrl = variation.data[0].url;
    } else {
      const generated = await openai.images.generate({
        prompt,
        n: 1,
        size: "1024x1024",
      });
      imageUrl = generated.data[0].url;
    }

    return NextResponse.json({ imageUrl });
  } catch (err: any) {
    console.error("DALL·E error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
