// app/pricing/page.tsx
"use client";

import { useState } from "react";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuy = async (priceId: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          credits: priceId === "price_100" ? 100 : 10, // or whatever your priceIds map to
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Error ${res.status}`);
      } else {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl mb-4">Buy Credits</h1>
      {error && <p className="mb-4 text-red-500">❌ {error}</p>}
      <div className="space-y-4">
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold">10 Credits</h2>
          <p className="mb-2">$5.00</p>
          <button
            disabled={loading}
            onClick={() => handleBuy("price_10")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Loading…" : "Buy 10 Credits"}
          </button>
        </div>
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold">100 Credits</h2>
          <p className="mb-2">$40.00</p>
          <button
            disabled={loading}
            onClick={() => handleBuy("price_100")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Loading…" : "Buy 100 Credits"}
          </button>
        </div>
      </div>
    </div>
  );
}
