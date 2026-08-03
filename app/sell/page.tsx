import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, buildAbsoluteUrl } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Sell Equipment | Penn Rock Industries",
  description: "Reach out to sell trucks or heavy equipment directly to Penn Rock Industries.",
  alternates: {
    canonical: "/sell",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Sell Equipment | Penn Rock Industries",
    description: "Reach out to sell trucks or heavy equipment directly to Penn Rock Industries.",
    url: buildAbsoluteUrl("/sell"),
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sell Equipment | Penn Rock Industries",
    description: "Reach out to sell trucks or heavy equipment directly to Penn Rock Industries.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function SellPage() {
  return (
    <main className="bg-white min-h-screen">
      
      {/* 1. HERO SECTION */}
      <div className="bg-slate-900 text-white py-20 px-4 text-center border-b border-slate-800">
        <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wide mb-4">
          Sell Trucks or Heavy Equipment
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto font-medium">
          If you have trucks or heavy equipment to move, call or text and we&apos;ll
          talk through the quickest way to handle it.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* 2. INFO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
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

          {/* RIGHT CARD: Why Sell With Us */}
            <div className="bg-white border-2 border-slate-900 rounded-none p-8 md:p-12 hover:shadow-[4px_4px_0_#0f172a] transition-shadow flex flex-col h-full">
             <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
              <div className="bg-gray-100 text-slate-900 p-4 rounded-none border-2 border-slate-900">
                {/* Star Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Why Sell With Us?</h3>
            </div>

            <ul className="space-y-5 flex-grow">
              <li className="flex items-center gap-4">
                <span className="flex-shrink-0 text-slate-900 text-xl">⚡</span>
                <span className="text-lg text-gray-700 font-medium">We give you a direct contact point without a long intake process.</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="flex-shrink-0 text-slate-900 text-xl">🤝</span>
                <span className="text-lg text-gray-700 font-medium">We focus on a simple conversation and a fast response.</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="flex-shrink-0 text-slate-900 text-xl">🧭</span>
                <span className="text-lg text-gray-700 font-medium">We keep the process focused on condition, location, and next steps.</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="flex-shrink-0 text-slate-900 text-xl">📸</span>
                <span className="text-lg text-gray-700 font-medium">Photos and details help move things faster, so send both if you have them.</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="flex-shrink-0 text-slate-900 text-xl">🏁</span>
                <span className="text-lg text-gray-700 font-medium">We&apos;ll tell you honestly whether it is a fit.</span>
              </li>
            </ul>
          </div>
        
        </div>

        {/* 3. CTA BOX */}
        <div className="bg-slate-900 rounded-none p-8 md:p-16 text-center border-2 border-slate-900 shadow-[6px_6px_0_#0f172a] overflow-hidden relative">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to talk?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
            Send the year, make, model, and a few photos if you have them. <br className="hidden md:block"/>
            We&apos;ll follow up with the next step as soon as we can.
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