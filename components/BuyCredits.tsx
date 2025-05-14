"use client";

import React, { useState } from "react";

export function BuyCredits({
  priceId,
  credits,
}: {
  priceId: string;
  credits: number;
}) {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, credits }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      if (!data.url) {
        throw new Error("No checkout URL returned.");
      }

      // redirect user to Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      console.error("Checkout error:", err);
      alert("Checkout error: " + err.message);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      {loading ? "Redirecting…" : `Buy ${credits} credits`}
    </button>
  );
}
