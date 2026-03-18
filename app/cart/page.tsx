import CartPageClient from "@/app/components/CartPageClient";
import CheckoutNotice from "@/app/components/CheckoutNotice";
import { Suspense } from "react";

export const metadata = {
  title: "Your Cart | Penn Rock Industries",
};

export default function CartPage() {
  return (
    <main className="min-h-screen bg-white pb-20 pt-16 md:pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={null}>
          <CheckoutNotice />
        </Suspense>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
        <CartPageClient />
      </div>
    </main>
  );
}
