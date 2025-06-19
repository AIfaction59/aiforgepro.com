// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET() {
  return NextResponse.json(
    { error: "This endpoint only supports POST to create a Checkout session." },
    { status: 405 }
  );
}

export async function POST(req: NextRequest) {
  try {
    const { priceId, credits } = await req.json();

    // 1) Make sure they're logged in
    const {
      data: { session },
    } = await supabaseServer.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2) Create the Stripe Checkout session
    const origin = req.headers.get("origin")!;
    const stripeSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: {
          userId: session.user.id,
          credits: credits.toString(),
        },
      },
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/dashboard?checkout=canceled`,
    });

    // 3) Return the **hosted Checkout URL** directly
    return NextResponse.json({ url: stripeSession.url });
  } catch (err: any) {
    console.error("❌ /api/checkout error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
