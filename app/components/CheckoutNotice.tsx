"use client";

import { useSearchParams } from "next/navigation";

export default function CheckoutNotice() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";

  if (!success) return null;

  return (
    <div className="mb-6 rounded-none border-2 border-slate-900 bg-white px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-900">
      Thanks for your purchase. Shipping will be quoted separately based on destination.
    </div>
  );
}
