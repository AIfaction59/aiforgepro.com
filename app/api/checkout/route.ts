// app/api/checkout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ url: "https://example.com" });
}
