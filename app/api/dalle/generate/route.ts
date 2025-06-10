// app/api/dalle/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Use Edge runtime
export const runtime = "edge";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { prompt, style, file } = await req.json();

    // 1) Build base prompt
    const baseTemplate = `Create a high-resolution, studio-quality product photo of a ${prompt}. Centered on a clean white background with soft, even lighting, realistic reflections, and subtle shadows. Highlight the product’s material, texture, and form. The image must follow professional e-commerce standards, ideal for Amazon/Shopify listings.`;

    // 2) Append style-specific instructions
    let styleAppend = "";
    switch (style) {
      case "studio":
        styleAppend = " Use a pure white studio background.";
        break;
      case "outdoor":
        styleAppend = " Place it outdoors with natural lighting and a softly blurred background.";
        break;
      case "lifestyle":
        styleAppend = " Place it in a lifestyle setting, such as a modern kitchen or living room, while keeping it the primary focus.";
        break;
      case "transparent background":
        styleAppend = " Render as a transparent PNG background for drag-and-drop placement.";
        break;
      case "floating product":
        styleAppend = " Show it floating with a subtle shadow underneath on a neutral background.";
        break;
      // add more cases for each dropdown value…
      case "kitchen counter":
        styleAppend = " Place it on a modern marble kitchen countertop with warm morning light.";
        break;
      case "garage":
        styleAppend = " Rest it on a wood workbench with softly blurred tools behind.";
        break;
      case "camping":
        styleAppend = " Set it on a forest floor near a pitched tent with sunrise light.";
        break;
      case "office desk":
        styleAppend = " Position it on a minimalist office desk with blurred computer equipment in the background.";
        break;
      case "fitness":
        styleAppend = " Show it in a modern fitness studio with gym equipment softly out of focus.";
        break;
      case "gray":
      case "black":
      case "white":
      case "blue":
      case "green":
      case "light gray":
        styleAppend = ` Use a ${style} background.`;
        break;
      case "multi-angle":
        styleAppend = " Provide a multi-angle layout (front, back, side) in one image with consistent lighting.";
        break;
      default:
        styleAppend = ` Apply a ${style} style background.`;
    }

    // 3) Combine into final prompt
    const fullPrompt = baseTemplate + styleAppend;

    let response;
    if (file) {
      // handle uploaded image variation
      const match = file.match(/^data:(.+);base64,(.+)$/);
      if (!match) throw new Error("Invalid file upload");
      const [, mimeType, b64] = match;
      const buffer = Buffer.from(b64, "base64");
      const upload = new File([buffer], "upload.png", { type: mimeType });

      response = await openai.images.createVariation({
        image: upload,
        n: 1,
        size: "1024x1024",
      });
    } else {
      // standard generate
      response = await openai.images.generate({
        prompt: fullPrompt,
        n: 1,
        size: "1024x1024",
      });
    }

    const imageUrl = response.data[0].url;
    return NextResponse.json({ imageUrl });
  } catch (err: any) {
    console.error("❌ DALL·E error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
