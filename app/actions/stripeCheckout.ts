"use server";

import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16",
});

export async function createCheckoutSession(part: {
  title: string;
  price: number;
  slug: string;
  imageUrl?: string;
}) {
  if (!part.price || part.price <= 0) {
    return { url: null, error: "Price is required for checkout." };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(part.price * 100),
          product_data: {
            name: part.title,
            images: part.imageUrl ? [part.imageUrl] : undefined,
          },
        },
      },
    ],
    success_url: `${baseUrl}/parts?success=true`,
    cancel_url: `${baseUrl}/parts/${part.slug}`,
  });

  return { url: session.url };
}

export async function createCartCheckoutSession(
  items: {
    title: string;
    price: number;
    slug: string;
    imageUrl?: string;
    quantity: number;
  }[]
) {
  if (!items.length) {
    return { url: null, error: "Cart is empty." };
  }

  const hasInvalidPrice = items.some((item) => !item.price || item.price <= 0);
  if (hasInvalidPrice) {
    return { url: null, error: "All items must have a price to checkout." };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(item.price * 100),
        product_data: {
          name: item.title,
          images: item.imageUrl ? [item.imageUrl] : undefined,
        },
      },
    })),
    success_url: `${baseUrl}/cart?success=true`,
    cancel_url: `${baseUrl}/cart`,
  });

  return { url: session.url };
}
