import { client } from "@/sanity/lib/client";
import { PARTS_QUERY } from "@/sanity/lib/queries";
import { Metadata } from "next";
import { Suspense } from "react";
import FilterBar from "@/app/components/FilterBar";
import PartsInfiniteGrid from "@/app/components/PartsInfiniteGrid";
import CheckoutNotice from "@/app/components/CheckoutNotice";

export const metadata: Metadata = {
  title: "Heavy Equipment Parts | Penn Rock Industries",
  description: "Quality tested parts for heavy equipment, ready to ship. Engines, transmissions, body parts, and more.",
};

export const revalidate = 60;

type Part = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  condition: string;
  status: string;
  price: number;
  inventoryCount: number;
  imageUrl: string | null;
};

export default async function PartsPage() {
  let parts: Part[] = [];

  try {
    parts = await client.fetch(PARTS_QUERY);
  } catch (error) {
    console.error("Sanity fetch failed for /parts:", error);
  }

  return (
    <main className="min-h-screen bg-white pb-20 pt-16 md:pt-20">
      <div className="bg-slate-900 py-10 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black uppercase tracking-widest text-white">Parts Inventory</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={null}>
          <CheckoutNotice />
        </Suspense>
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4 md:mb-0">Available Components And Assemblies</h2>
        </div>
        
        {/* Filter Bar */}
        <Suspense fallback={null}>
          <FilterBar />
        </Suspense>
        
        {/* Parts Grid */}
        <PartsInfiniteGrid parts={parts} />
      </div>
    </main>
  );
}
