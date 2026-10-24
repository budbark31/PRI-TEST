import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, buildAbsoluteUrl } from "@/app/lib/site";
import { WHY_CHOOSE_US } from "@/app/lib/consignment";

export const metadata: Metadata = {
  title: "Sell Equipment | Penn Rock Industries",
  description: "Consign your heavy trucks, trailers, and equipment with Penn Rock Industries. We market, represent, and sell it for you.",
  alternates: {
    canonical: "/sell",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Sell Equipment | Penn Rock Industries",
    description: "Consign your heavy trucks, trailers, and equipment with Penn Rock Industries. We market, represent, and sell it for you.",
    url: buildAbsoluteUrl("/sell"),
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sell Equipment | Penn Rock Industries",
    description: "Consign your heavy trucks, trailers, and equipment with Penn Rock Industries. We market, represent, and sell it for you.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function SellPage() {
  return (
    <main className="bg-white min-h-screen">
      
      {/* 1. HERO SECTION */}
      <div className="bg-slate-900 text-white py-20 px-4 text-center border-b border-slate-800">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-wide mb-4">
          Heavy Truck &amp; Equipment Consignment Specialists
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto font-medium">
          We help owners maximize the value of their trucks, trailers, and equipment through professional consignment and targeted marketing solutions.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* 2. WHAT WE BUY */}
        <div className="max-w-3xl mx-auto mb-16">
          
          {/* LEFT CARD: What We Buy */}
          <div className="bg-white border-2 border-slate-900 rounded-none p-8 md:p-12 hover:shadow-[4px_4px_0_#0f172a] transition-shadow flex flex-col h-full">
            <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
              <div className="bg-gray-100 text-slate-900 p-4 rounded-none border-2 border-slate-900">
                {/* Truck Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-3.375h-5.845a2.018 2.018 0 0 1-1.94-1.125l-2.738-4.509" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">What We Buy</h3>
            </div>
            
            <ul className="space-y-5 flex-grow">
              {[
                "Dump Trucks (Kenworth, Peterbilt, Mack)",
                "Day Cabs & Sleepers",
                "Excavators & Dozers",
                "Lowboy & Dump Trailers",
                "Fleet Liquidations (1 to 100 units)"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4">
                  <span className="flex-shrink-0 h-2 w-2 rounded-none bg-slate-900"></span>
                  <span className="text-lg text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* WHY CHOOSE US */}
        <section className="mb-16">
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto text-center mb-12">
            We invest heavily in marketing to ensure your equipment receives maximum exposure across multiple platforms, reaching qualified buyers throughout the United States and beyond. Our goal is simple: present your equipment professionally, attract serious buyers, and help you achieve the strongest possible market value.
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight text-center">
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

        {/* 3. CTA BOX */}
        <div className="bg-slate-900 rounded-none p-8 md:p-16 text-center border-2 border-slate-900 shadow-[6px_6px_0_#0f172a] overflow-hidden relative">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready To Sell?
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
            Whether you have one truck or an entire fleet, our experienced sales and marketing team is ready to help maximize your equipment&apos;s exposure and market value.
          </p>
          <p className="mt-4 mb-8 text-white font-bold max-w-2xl mx-auto text-lg leading-relaxed">
            Contact us today to discuss your equipment and learn how our consignment program can work for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:6105074832" 
              className="bg-orange-500 hover:bg-orange-600 text-white border-2 border-slate-900 font-bold uppercase tracking-widest text-sm py-4 px-8 rounded-none transition-transform hover:-translate-y-1 shadow-[6px_6px_0_#0f172a] flex items-center justify-center gap-2"
            >
            Call In: 610-507-4832
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}