import { client } from "@/sanity/lib/client";
import { ALL_INVENTORY_QUERY } from "@/sanity/lib/queries";
import UnifiedInventoryGrid from "@/app/components/UnifiedInventoryGrid";

export const revalidate = 60;

type HomeData = { trucks: any[]; parts: any[] };

export default async function Home() {
  let data: HomeData = { trucks: [], parts: [] };

  try {
    data = await client.fetch(ALL_INVENTORY_QUERY);
  } catch (error) {
    console.error("Sanity fetch failed for /:", error);
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Inventory Banner */}
      <div className="bg-slate-900 pt-24 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            INVENTORY
          </h1>
          <p className="mt-3 text-lg text-gray-300 max-w-2xl mx-auto">
            Browse our selection of heavy-duty trucks, equipment, and quality parts
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Unified Grid with Filters */}
        <UnifiedInventoryGrid trucks={data.trucks} parts={data.parts} />
      </div>
    </main>
  );
}