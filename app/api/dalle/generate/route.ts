// app/api/dalle/generate/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY not defined");
    return NextResponse.json(
      { error: "Server misconfiguration: missing OPENAI_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
      }),
    });

    const payload = await res.json();
    if (!res.ok) {
      console.error("OpenAI error", payload);
      return NextResponse.json(
        { error: payload.error?.message || "OpenAI request failed" },
        { status: res.status }
      );
    }

    const imageUrl = payload.data?.[0]?.url;
    if (!imageUrl) {
      console.error("No URL returned from OpenAI", payload);
      return NextResponse.json(
        { error: "No image URL returned" },
        { status: 500 }
      );
    }

    return NextResponse.json({ imageUrl });
  } catch (err: any) {
    console.error("Unexpected error in DALL·E route", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
