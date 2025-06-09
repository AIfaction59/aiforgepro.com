// app/api/dalle/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: { sizeLimit: "10mb" }, // allow big uploads
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, file } = await req.json();

    let res;
    if (file) {
      const match = file.match(/^data:(.+);base64,(.+)$/);
      if (!match) throw new Error("Invalid file data");
      const buffer = Buffer.from(match[2], "base64");

      // Generate a variation of the uploaded image
      res = await openai.images.createVariation({
        image: buffer,
        n: 1,
        size: "1024x1024",
      });
    } else {
      // Text-only generation
      res = await openai.images.generate({
        prompt,
        n: 1,
        size: "1024x1024",
      });
    }

    const imageUrl = res.data[0].url;
    return NextResponse.json({ imageUrl });
  } catch (err: any) {
    console.error("DALL·E error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
