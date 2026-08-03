import { client } from "@/sanity/lib/client";
import { ALL_INVENTORY_QUERY } from "@/sanity/lib/queries";
import UnifiedInventoryGrid from "@/app/components/UnifiedInventoryGrid";
import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, buildAbsoluteUrl } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Heavy Trucks & Equipment Inventory",
  description: "Browse Penn Rock Industries' current inventory of heavy trucks, day cabs, trailers, and heavy equipment.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Heavy Trucks & Equipment Inventory",
    description: "Browse Penn Rock Industries' current inventory of heavy trucks, day cabs, trailers, and heavy equipment.",
    url: buildAbsoluteUrl("/"),
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Heavy Trucks & Equipment Inventory",
    description: "Browse Penn Rock Industries' current inventory of heavy trucks, day cabs, trailers, and heavy equipment.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export const revalidate = 90;

type Truck = {
  _id: string;
  title: string;
  slug: string;
  images: string[];
  price: number;
  year: number;
  make: string;
  model: string;
  usage?: { value: number; unit: "miles" | "hours" } | null;
  hoursOrMileage?: string;
  status: string;
  category: string;
};

type HomeData = { trucks: Truck[] };

export default async function Home() {
  let data: HomeData = { trucks: [] };

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
          <p className="mt-3 text-lg text-gray-300 max-w-3xl mx-auto">
            Turn Your Equipment Into Cash Without The Hassle. Our team specializes in the consignment and marketing of heavy trucks trailers and equipment. We handle the advertising buyer inquiries showings negotiations and transaction management so you can focus on your business while we focus on getting your equipment sold.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Unified Grid with Filters */}
        <UnifiedInventoryGrid trucks={data.trucks} />
      </div>
    </main>
  );
}