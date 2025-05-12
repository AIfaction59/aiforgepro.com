// app/api/webhook/stripe/route.ts
import { NextResponse } from "next/server";
import { stripe } from "../../../../lib/stripe";
import { supabaseServer } from "../../../../supabaseServer";

export async function POST(req: Request) {
  const rawBody  = await req.text();
  const sig      = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Invalid signature:", err.message);
    return NextResponse.json({ received: false }, { status: 400 });
  }

  // A) After checkout, immediately award credits
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const userId  = session.metadata.userId;
    const credits = parseInt(session.metadata.credits, 10);

    const { error } = await supabaseServer
      .from("credits")
      .insert({ user_id: userId, amount: credits });
    if (error) console.error("❌ credits insert failed:", error);
  }

  // B) Also award on invoice.paid (for renewals and sometimes the first payment)
  if (event.type === "invoice.paid") {
    const invoice = event.data.object as any;
    // fetch the subscription to read its metadata
    const sub = await stripe.subscriptions.retrieve(
      invoice.subscription as string
    );
    const userId  = sub.metadata.userId;
    const credits = parseInt(sub.metadata.credits, 10);

    const { error } = await supabaseServer
      .from("credits")
      .insert({ user_id: userId, amount: credits });
    if (error) console.error("❌ credits insert failed on invoice.paid:", error);
  }

  return NextResponse.json({ received: true });
}
