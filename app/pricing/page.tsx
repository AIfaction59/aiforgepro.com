// app/pricing/page.tsx
import { BuyCredits } from "@/components/BuyCredits";

export default function PricingPage() {
  // Replace with your actual Stripe Price ID for 100 credits at $14.99:
  const PRICE_ID_100 = "price_1RIxaHGWH995BHJPPef80lHI";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow space-y-6">
        <h1 className="text-2xl font-bold text-center">Buy Credits</h1>

        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <p className="text-lg font-medium">100 Credits</p>
            <p className="text-sm text-gray-600">One-time purchase</p>
          </div>
          <p className="text-xl font-semibold">$14.99</p>
        </div>

        <div className="text-center">
          <BuyCredits priceId={PRICE_ID_100} credits={100} />
        </div>
      </div>
    </div>
  );
}