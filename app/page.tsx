import { client } from "@/sanity/lib/client";
import { ALL_INVENTORY_QUERY } from "@/sanity/lib/queries";
import UnifiedInventoryGrid from "@/app/components/UnifiedInventoryGrid";
import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, buildAbsoluteUrl } from "@/app/lib/site";
import Link from "next/link";

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
      {/* Hero */}
      <div className="bg-slate-900 pt-24 pb-14 md:pt-28 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
            Turn Your Equipment Into Cash Without The Hassle
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
            Our team specializes in the consignment and marketing of heavy trucks, trailers, and equipment. We handle the advertising, buyer inquiries, showings, negotiations, and transaction management so you can focus on your business while we focus on getting your equipment sold.
          </p>
          <p className="mt-4 text-lg font-bold text-white max-w-3xl mx-auto">
            We don&apos;t simply list equipment—we actively market, represent, and sell it.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:6105074832"
              className="bg-orange-500 hover:bg-orange-600 text-white border-2 border-white font-bold uppercase tracking-widest text-sm py-4 px-8 rounded-none transition-transform hover:-translate-y-1"
            >
              Sell With Us: 610-507-4832
            </a>
            <a
              href="#inventory"
              className="bg-white hover:bg-gray-100 text-slate-900 border-2 border-white font-bold uppercase tracking-widest text-sm py-4 px-8 rounded-none transition-transform hover:-translate-y-1"
            >
              Browse Inventory
            </a>
          </div>
        </div>
      </div>

      <div id="inventory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 scroll-mt-24">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase mb-8 text-center">
          Inventory
        </h2>
        {/* Unified Grid with Filters */}
        <UnifiedInventoryGrid trucks={data.trucks} />
      </div>

      {/* Link to the full consignment pitch on the Sell page */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <p className="text-center">
          <Link href="/sell" className="font-bold text-orange-600 hover:text-orange-700 underline underline-offset-4">
            See how consignment works
          </Link>
        </p>
      </section>

      {/* Ready To Sell CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-slate-900 rounded-none p-8 md:p-12 text-center border-2 border-slate-900 shadow-[6px_6px_0_#0f172a] overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
          <h2 className="text-3xl font-bold text-white mb-4">Ready To Sell?</h2>
          <p className="mb-8 text-white font-bold max-w-2xl mx-auto text-lg leading-relaxed">
            Contact us today to discuss your equipment and learn how our consignment program can work for you.
          </p>
          <a
            href="tel:6105074832"
            className="inline-flex bg-orange-500 hover:bg-orange-600 text-white border-2 border-slate-900 font-bold uppercase tracking-widest text-sm py-4 px-8 rounded-none transition-transform hover:-translate-y-1 shadow-[6px_6px_0_#0f172a] items-center justify-center"
          >
            Call 610-507-4832
          </a>
        </div>
      </section>
    </main>
  );
}
