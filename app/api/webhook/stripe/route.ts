import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const body = await req.text();
  const sig = headers().get("stripe-signature");

  let event;

  try {
    if (!sig) throw new Error("Missing Stripe signature");
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session?.metadata?.user_id;
    const credits = session?.metadata?.credits || 0;

    if (userId) {
      const { data: profile, error: fetchErr } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", userId)
        .single();

      if (fetchErr) {
        return NextResponse.json({ error: fetchErr.message }, { status: 500 });
      }

      const newBalance = (profile?.credits || 0) + parseInt(credits, 10);

      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ credits: newBalance })
        .eq("id", userId);

      if (updateErr) {
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
