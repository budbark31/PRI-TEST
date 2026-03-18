"use client";

import { useState } from "react";
import { createCheckoutSession } from "@/app/actions/stripeCheckout";

type CheckoutPart = {
  title: string;
  price: number;
  slug: string;
  imageUrl?: string;
};

export default function CheckoutButton({
  part,
  disabled = false,
  disabledLabel = "Unavailable",
}: {
  part: CheckoutPart;
  disabled?: boolean;
  disabledLabel?: string;
}) {
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (disabled) return;
    setIsPending(true);
    setErrorMessage(null);
    try {
      const result = await createCheckoutSession(part);
      if (result?.url) {
        window.location.href = result.url;
        return;
      }
      if (result?.error) {
        setErrorMessage(result.error);
      }
    } catch (error) {
      console.error("Stripe checkout failed:", error);
      setErrorMessage("Checkout failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full md:w-auto">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isPending || disabled}
        className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white border-2 border-slate-900 font-bold uppercase tracking-widest text-sm py-3 px-8 rounded-none shadow-[4px_4px_0_#0f172a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Processing..." : disabled ? disabledLabel : "Buy Now"}
      </button>
      {errorMessage && (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
