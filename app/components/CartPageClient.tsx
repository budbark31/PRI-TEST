"use client";

import Image from "next/image";
import { useState } from "react";
import { createCartCheckoutSession } from "@/app/actions/stripeCheckout";
import { useCart } from "@/app/components/CartProvider";

export default function CartPageClient() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsPending(true);
    setErrorMessage(null);

    try {
      const result = await createCartCheckoutSession(
        items.map((item) => ({
          title: item.title,
          price: item.price,
          slug: item.slug,
          imageUrl: item.imageUrl,
          quantity: item.quantity,
        }))
      );

      if (result?.url) {
        window.location.href = result.url;
        return;
      }

      if (result?.error) {
        setErrorMessage(result.error);
      }
    } catch (error) {
      console.error("Cart checkout failed:", error);
      setErrorMessage("Checkout failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white border-2 border-slate-900 rounded-none p-10 text-center">
        <p className="text-lg font-semibold text-gray-700">Your cart is empty.</p>
        <p className="text-sm text-gray-500 mt-2">Add parts to start checkout.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 border-2 border-slate-900 rounded-none p-4 bg-white">
            <div className="relative w-24 h-24 bg-gray-100 rounded-none overflow-hidden border-2 border-slate-900">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                  No image
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{item.title}</p>
              <p className="text-sm text-gray-500">${item.price.toLocaleString()}</p>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  -
                </button>
                <span className="text-sm font-medium">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="ml-auto text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-2 border-slate-900 rounded-none p-6 h-fit bg-white">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Subtotal</span>
          <span>${totalPrice.toLocaleString()}</span>
        </div>
        <p className="text-xs text-gray-500 mb-4">Shipping is quoted separately based on destination.</p>
        <button
          type="button"
          onClick={handleCheckout}
          disabled={isPending}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white border-2 border-slate-900 font-bold uppercase tracking-widest text-sm py-3 px-6 rounded-none shadow-[4px_4px_0_#0f172a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Processing..." : "Checkout"}
        </button>
        {errorMessage && <p className="mt-3 text-sm text-red-600">{errorMessage}</p>}
        <button
          type="button"
          onClick={clearCart}
          className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700"
        >
          Clear cart
        </button>
      </div>
    </div>
  );
}
