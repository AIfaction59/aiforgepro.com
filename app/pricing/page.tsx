// app/pricing/page.tsx
"use client";

import { BuyCredits } from "../../components/BuyCredits";

export default function PricingPage() {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl mb-4">Buy Credits</h1>
      <BuyCredits priceId="price_1RIxaHGWH995BHJPPef80lHI" credits={100} />
    </div>
  );
}
