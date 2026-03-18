import { Metadata } from "next";
import PromoVideo from "@/app/components/PromoVideo";

export const metadata: Metadata = {
  title: "About Us | Penn Rock Industries",
  description: "Meet the team behind Penn Rock Industries. Serving the Mid-Atlantic with honest deals on heavy equipment.",
};

// ===== TEAM DATA (Edit names and roles here) =====
const teamMembers = [
  { name: "Matt", role: "Sales / Acquisitions" },
  { name: "Bryan", role: "Sales / Acquisitions" },
  { name: "Bri", role: "Operations / Administration" },
  { name: "Tiff", role: "Operations / Administration" },
];

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen">
      
      {/* 1. HERO SECTION */}
      <div className="bg-slate-900 text-white py-20 px-4 text-center border-b border-slate-800">
        <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wide mb-4">
          About Penn Rock Industries
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto font-medium">
          Serving the Mid-Atlantic with honest deals on heavy equipment.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* 2. OUR STORY / MISSION SECTION */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wide mb-10 text-center">
            Our Story
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Promo Video */}
            <PromoVideo />
            
            {/* Text Content */}
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                {/* PLACEHOLDER: Replace with your company history */}
                Penn Rock Industries was founded with a simple mission: provide 
                quality heavy equipment to hardworking contractors across the 
                Mid-Atlantic region. What started as a small operation has grown 
                into a trusted name in the industry.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {/* PLACEHOLDER: Replace with your values/approach */}
                We believe in transparent pricing, honest assessments, and building 
                long-term relationships with our customers. Every piece of equipment 
                we sell is inspected and priced fairly. No games, no surprises.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {/* PLACEHOLDER: Replace with your commitment */}
                Whether you&apos;re looking to buy your next dump truck or sell your 
                existing fleet, Penn Rock is here to make the process simple and 
                straightforward.
              </p>
            </div>
          </div>
        </section>

        {/* 3. MEET THE TEAM SECTION */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wide mb-10 text-center">
            Meet the Team
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-white border-2 border-slate-900 rounded-none p-8 text-center hover:shadow-[4px_4px_0_#0f172a] transition-shadow"
              >
                {/* Headshot Placeholder */}
                <div className="w-32 h-32 mx-auto mb-6 rounded-none bg-gray-100 border-2 border-slate-900 flex items-center justify-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1} 
                    stroke="currentColor" 
                    className="w-12 h-12 text-gray-300"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" 
                    />
                  </svg>
                </div>
                
                {/* Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                
                {/* Role - Easy to find and edit */}
                <p className="text-slate-900 font-bold uppercase tracking-widest text-xs">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
