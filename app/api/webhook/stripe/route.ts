// app/api/webhook/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil", // make sure this matches your installed SDK version
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const buf = Buffer.from(await req.arrayBuffer());
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed.", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId!;
    const creditsToAdd = parseInt(session.metadata?.credits || "0", 10);

    if (userId && creditsToAdd > 0) {
      const { data: profile, error: fetchErr } = await supabaseServer
        .from("profiles")
        .select("credits")
        .eq("id", userId)
        .single();

      if (fetchErr) {
        console.error("❌ Error fetching profile:", fetchErr);
      } else {
        const newTotal = (profile.credits || 0) + creditsToAdd;
        const { error: updateErr } = await supabaseServer
          .from("profiles")
          .update({ credits: newTotal })
          .eq("id", userId);

        if (updateErr) console.error("❌ Error updating credits:", updateErr);
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
