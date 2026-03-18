"use client";

import { useState } from "react";
import CheckoutButton from "@/app/components/CheckoutButton";
import ContactButtons from "@/app/components/ContactButtons";
import { useCart } from "@/app/components/CartProvider";

type PartPurchaseData = {
  id: string;
  title: string;
  price: number;
  slug: string;
  status: string;
  inventoryCount?: number | null;
  imageUrl?: string | null;
};

export default function PartPurchaseActions({ part }: { part: PartPurchaseData }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const isSold = part.status === "sold";
  const isOutOfStock = part.status === "out-of-stock";
  const isAvailable = part.status === "available";
  const hasPrice = typeof part.price === "number" && part.price > 0;
  const hasStock =
    part.inventoryCount === undefined || part.inventoryCount === null || part.inventoryCount > 0;
  const isPurchasable = isAvailable && hasPrice && hasStock;

  if (isSold) {
    return (
      <div className="w-full bg-slate-900 text-white text-sm font-bold uppercase tracking-widest py-4 px-8 rounded-none border-2 border-slate-900 text-center">
        This Item Has Been Sold
      </div>
    );
  }

  if (!isPurchasable) {
    return (
      <div className="space-y-4">
        <CheckoutButton
          part={{
            title: part.title,
            price: part.price,
            slug: part.slug,
            imageUrl: part.imageUrl || undefined,
          }}
          disabled
          disabledLabel={hasPrice ? "Out of Stock" : "Call for Price"}
        />
        <ContactButtons truckTitle={part.title} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <button
          type="button"
          onClick={() => {
            addItem({
              id: part.id,
              title: part.title,
              price: part.price,
              slug: part.slug,
              imageUrl: part.imageUrl || undefined,
            });
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
          className="w-full md:w-auto border-2 border-slate-900 bg-white text-slate-900 font-bold uppercase tracking-widest text-sm py-3 px-8 rounded-none transition-colors hover:bg-slate-900 hover:text-white"
        >
          {added ? "Added" : "Add to Cart"}
        </button>
        <CheckoutButton
          part={{
            title: part.title,
            price: part.price,
            slug: part.slug,
            imageUrl: part.imageUrl || undefined,
          }}
        />
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-900 text-center md:text-left">
        Shipping is quoted separately based on destination.
      </p>
    </div>
  );
}
