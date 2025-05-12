// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe";
import { supabaseServer } from "../../../supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const { priceId, credits } = await req.json();

    // 1️⃣ Ensure user is logged in
    const {
      data: { session },
    } = await supabaseServer.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2️⃣ Build a fully-qualified origin, even on Vercel
    const proto = req.headers.get("x-forwarded-proto") || "https";
    const host  = req.headers.get("host");
    const origin = `${proto}://${host}`;

    // 3️⃣ Create a Stripe Checkout Session in subscription mode
    const stripeSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: {
          userId:   session.user.id,
          credits:  credits.toString(),
        },
      },
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url:  `${origin}/dashboard?checkout=canceled`,
    });

    // 🔑 Return only the session ID
    return NextResponse.json({ sessionId: stripeSession.id });
  } catch (err: any) {
    console.error("❌ /api/checkout error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
