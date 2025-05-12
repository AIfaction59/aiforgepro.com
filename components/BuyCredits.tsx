// components/BuyCredits.tsx
"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export function BuyCredits({ priceId, credits }: { priceId: string; credits: number }) {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    setLoading(true);

    // 1️⃣ Ask our API for a sessionId
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, credits }),
    });
    const { sessionId, error } = await res.json();

    if (!res.ok || error || !sessionId) {
      alert("Checkout error: " + (error || "No session returned"));
      setLoading(false);
      return;
    }

    // 2️⃣ Load Stripe.js and redirect
    const stripe = await stripePromise;
    const { error: stripeError } = await stripe!.redirectToCheckout({ sessionId });

    if (stripeError) {
      alert("Stripe.js error: " + stripeError.message);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      {loading ? "Redirecting…" : `Buy ${credits} Credits`}
    </button>
  );
}
