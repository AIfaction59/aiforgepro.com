/// lib/stripe.ts
import Stripe from "stripe";

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!,
  {
    // match the version your SDK’s types expect
    apiVersion: "2025-03-31.basil",
  }
);
