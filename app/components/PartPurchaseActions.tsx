"use client";

import ContactButtons from "@/app/components/ContactButtons";

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
  const isSold = part.status === "sold";

  if (isSold) {
    return (
      <div className="w-full bg-slate-900 text-white text-sm font-bold uppercase tracking-widest py-4 px-8 rounded-none border-2 border-slate-900 text-center">
        This Item Has Been Sold
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="w-full border-2 border-slate-900 bg-white p-4 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-slate-900">
          Call, text, or email for pricing and availability
        </p>
      </div>
      <ContactButtons truckTitle={part.title} />
    </div>
  );
}
