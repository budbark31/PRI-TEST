import { Metadata } from "next";
import PromoVideo from "@/app/components/PromoVideo";
import TeamCard from "@/app/components/TeamCard";
import { DEFAULT_OG_IMAGE, SITE_NAME, buildAbsoluteUrl } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "About Us | Penn Rock Industries",
  description: "Meet the team behind Penn Rock Industries. Serving the Mid-Atlantic with honest deals on heavy equipment.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "About Us | Penn Rock Industries",
    description: "Meet the team behind Penn Rock Industries. Serving the Mid-Atlantic with honest deals on heavy equipment.",
    url: buildAbsoluteUrl("/about"),
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Penn Rock Industries",
    description: "Meet the team behind Penn Rock Industries. Serving the Mid-Atlantic with honest deals on heavy equipment.",
    images: [DEFAULT_OG_IMAGE],
  },
};

// ===== TEAM DATA (Edit names, roles, and bios here) =====
const teamMembers = [
  {
    name: "Austin",
    role: "Sales / Acquisitions",
    bio: `Austin Feather is an accomplished sales professional with a strong foundation in foreman leadership and precision mechanics. With a career built on hands-on expertise and operational insight, he brings a disciplined, results-driven approach to every endeavor. His ability to bridge technical knowledge with client-focused solutions allows him to consistently deliver high-quality outcomes and drive performance. Known for his professionalism, attention to detail, and commitment to excellence, Austin has earned a reputation for reliability and efficiency in fast-paced environments. His leadership background continues to influence his approach, emphasizing accountability, clear communication, and high standards.`,
  },
  {
    name: "Briana",
    role: "Operations / Administration",
    bio: `Briana "Bri" Lambert is a driven and versatile professional with over 7 years of experience in billing and customer relations, now specializing in sales, marketing, and administrative support. She is known for her strong communication skills, reliability, and ability to build lasting relationships with clients. Bri brings a bold, solutions-focused approach to her work, with a passion for helping businesses stay organized, grow, and operate efficiently. Outside of her professional life, she is a dedicated fiancée and mother of two. She enjoys cooking, crafting, traveling, and embracing a hands-on homesteading lifestyle raising chickens and ducks and creating a life rooted in balance and purpose.`,
  },
  {
    name: "Bryan",
    role: "Sales / Acquisitions",
    bio: `With over 35 years of hands-on experience in the truck and heavy equipment industry, Bryan Lambert has built a reputation for knowledge, integrity, and results. Specializing in all types of commercial trucks and construction equipment, Bryan has spent decades helping customers buy, sell, and source the equipment they need to keep their businesses moving forward. His experience spans dump trucks, sleepers, day cabs, vocational trucks, trailers, and a wide range of construction and heavy equipment. Known for his strong industry relationships and practical understanding of equipment values and market trends, Bryan takes pride in connecting buyers and sellers while creating smooth, honest transactions. Bryan’s passion for trucks and equipment started early and continues to drive his commitment to customer service today. Whether working with individual owner-operators, contractors, or large fleets, he brings professionalism, industry expertise, and a problem-solving mindset to every deal. Throughout his career, Bryan has earned the trust of customers by focusing on hard work, transparency, and long-term relationships principles that continue to define his approach today.`,
  },
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
                Penn Rock Industries was built around a straightforward idea: make
                it easier for contractors and operators to find dependable heavy
                equipment without wasting time.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We focus on transparent pricing, honest assessments, and
                straightforward communication from first call to final handoff.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Whether you&apos;re looking for a truck, a piece of heavy equipment,
                or help moving inventory quickly, Penn Rock is here to keep the
                process simple and practical.
              </p>
            </div>
          </div>
        </section>

        {/* 3. MEET THE TEAM SECTION */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wide mb-10 text-center">
            Meet the Team
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <TeamCard key={index} member={member} />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
