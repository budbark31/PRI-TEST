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

const WHY_CHOOSE_US = [
  {
    title: "Maximum Exposure",
    body: "We actively market your equipment across industry-leading platforms, social media channels, search engines, email campaigns, and our extensive buyer network.",
  },
  {
    title: "Qualified Buyer Reach",
    body: "Our marketing targets serious buyers who are actively searching for trucks and equipment, helping reduce wasted time and unproductive inquiries.",
  },
  {
    title: "Industry Experience",
    body: "We understand the heavy truck and equipment market, allowing us to position your assets effectively and attract the right audience.",
  },
  {
    title: "Professional Representation",
    body: "Your equipment is presented with detailed descriptions, quality photography, and knowledgeable support for prospective buyers.",
  },
  {
    title: "Time Savings",
    body: "We handle inquiries, schedule showings, answer questions, and manage negotiations so you can stay focused on running your business.",
  },
  {
    title: "Transaction Support",
    body: "From initial inquiry through final payment and delivery coordination, we help guide the transaction to a successful close.",
  },
  {
    title: "Performance-Based Success",
    body: "Our success depends on yours. We are motivated to generate interest, create competition, and achieve the best possible outcome for every consignment.",
  },
];

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

      {/* What We Do */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <p className="text-sm font-bold uppercase tracking-widest text-orange-600 text-center">What We Do</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-black text-slate-900 tracking-tight text-center">
          Heavy Truck &amp; Equipment Consignment Specialists
        </h2>
        <div className="mt-8 space-y-5 text-lg text-gray-700 leading-relaxed">
          <p>
            We help owners maximize the value of their trucks, trailers, and equipment through professional consignment and targeted marketing solutions.
          </p>
          <p>
            Selling heavy equipment on your own can be time-consuming, frustrating, and costly. Our team handles the entire process—from professional listings and strategic advertising to buyer communication, equipment showings, negotiations, and transaction management.
          </p>
          <p>
            We invest heavily in marketing to ensure your equipment receives maximum exposure across multiple platforms, reaching qualified buyers throughout the United States and beyond. Our goal is simple: present your equipment professionally, attract serious buyers, and help you achieve the strongest possible market value.
          </p>
          <p>
            Whether you&apos;re selling a single truck or liquidating an entire fleet, we provide the experience, resources, and industry knowledge needed to make the process efficient and successful.
          </p>
          <p className="font-bold text-slate-900">
            We don&apos;t simply list equipment—we actively market, represent, and sell it.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <p className="text-sm font-bold uppercase tracking-widest text-orange-600 text-center">Why Choose Us</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-black text-slate-900 tracking-tight text-center">
          More Than a Listing — A Complete Sales Strategy
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_US.map((item) => (
            <div
              key={item.title}
              className="bg-white border-2 border-slate-900 rounded-none p-6 hover:shadow-[4px_4px_0_#0f172a] transition-shadow"
            >
              <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wide">{item.title}</h3>
              <p className="mt-3 text-gray-700 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-xl md:text-2xl font-bold text-slate-900 text-center max-w-4xl mx-auto">
          When You Consign With Us, You&apos;re Not Just Listing Equipment—You&apos;re Gaining a Dedicated Sales and Marketing Team Working to Get It Sold.
        </p>
      </section>

      {/* Ready To Sell CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="bg-slate-900 rounded-none p-8 md:p-16 text-center border-2 border-slate-900 shadow-[6px_6px_0_#0f172a] overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
          <h2 className="text-3xl font-bold text-white mb-4">Ready To Sell?</h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
            Whether you have one truck or an entire fleet, our experienced sales and marketing team is ready to help maximize your equipment&apos;s exposure and market value.
          </p>
          <p className="mt-4 mb-8 text-white font-bold max-w-2xl mx-auto text-lg leading-relaxed">
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
