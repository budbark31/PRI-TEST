import { client } from "@/sanity/lib/client";
import { PART_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PartPurchaseActions from "@/app/components/PartPurchaseActions";

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
  description: string;
  images: string[];
};

// Format category for display
function formatCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    "engine": "Engine",
    "transmission": "Transmission",
    "body-cab": "Body/Cab",
    "maintenance-filters": "Maintenance/Filters",
    "accessories": "Accessories",
    "other": "Other",
  };
  return categoryMap[category] || category;
}

// Format condition for display
function formatCondition(condition: string): string {
  const conditionMap: Record<string, string> = {
    "new": "New",
    "used": "Used",
    "rebuilt": "Rebuilt",
    "core": "Core",
  };
  return conditionMap[condition] || condition;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  let part: Part | null = null;

  try {
    part = await client.fetch(PART_BY_SLUG_QUERY, { slug });
  } catch (error) {
    console.error("Sanity fetch failed for /parts/[slug] metadata:", error);
  }
  
  if (!part) {
    return { title: "Part Not Found | Penn Rock Industries" };
  }
  
  return {
    title: `${part.title} | Penn Rock Industries`,
    description: part.description || `${formatCondition(part.condition)} ${formatCategory(part.category)} - ${part.title}`,
  };
}

export default async function PartPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let part: Part | null = null;

  try {
    part = await client.fetch(PART_BY_SLUG_QUERY, { slug });
  } catch (error) {
    console.error("Sanity fetch failed for /parts/[slug]:", error);
  }

  if (!part) {
    notFound();
  }

  const isSold = part.status === "sold";
  const isOutOfStock = part.status === "out-of-stock";
  const isAvailable = part.status === "available";
  const mainImage = part.images?.[0];

  return (
    <main className="min-h-screen bg-white pb-20 pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Back Link */}
        <Link 
          href="/parts" 
          className="inline-flex items-center text-slate-900 hover:text-slate-700 mb-8 font-bold uppercase tracking-widest text-xs"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Parts
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image */}
          <div className="relative">
            <div className="relative aspect-square bg-gray-100 rounded-sm overflow-hidden shadow-[6px_6px_0_#0f172a]">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={part.title}
                  fill
                  className={`object-cover ${isSold ? "grayscale" : ""}`}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* SOLD STAMP */}
              {isSold && (
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none bg-black/10">
                  <div className="border-4 border-red-600 text-red-600 font-black text-5xl px-8 py-3 -rotate-12 bg-white/90 shadow-xl tracking-widest uppercase">
                    SOLD
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {part.images && part.images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {part.images.map((img, idx) => (
                  <div 
                    key={idx}
                    className="relative w-20 h-20 flex-shrink-0 rounded-sm overflow-hidden border-2 border-gray-200"
                  >
                    <Image
                      src={img}
                      alt={`${part.title} - Image ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="flex flex-col">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-gray-100 border-2 border-slate-900 text-xs font-bold uppercase tracking-widest text-slate-900 px-3 py-1 rounded-none">
                {formatCategory(part.category)}
              </span>
              <span className="bg-gray-100 border-2 border-slate-900 text-xs font-bold uppercase tracking-widest text-slate-900 px-3 py-1 rounded-none">
                {formatCondition(part.condition)}
              </span>
            </div>

            {/* Title */}
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isSold ? "text-gray-500 line-through" : "text-gray-900"}`}>
              {part.title}
            </h1>

            {/* Price */}
            <div className="mb-6">
              <span className={`text-4xl font-bold ${isSold ? "text-gray-400" : "text-slate-900"}`}>
                {part.price ? `$${part.price.toLocaleString()}` : "Call for Price"}
              </span>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {isAvailable && (
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-slate-900 rounded-none"></span>
                  <span className="text-slate-900 font-bold uppercase tracking-widest text-xs">
                    In Stock
                    {part.inventoryCount > 0 && ` (${part.inventoryCount} available)`}
                  </span>
                </div>
              )}
              {isOutOfStock && (
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-slate-900 rounded-none"></span>
                  <span className="text-slate-900 font-bold uppercase tracking-widest text-xs">Out of Stock</span>
                </div>
              )}
              {isSold && (
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-600 rounded-none"></span>
                  <span className="text-red-700 font-bold uppercase tracking-widest text-xs">Sold</span>
                </div>
              )}
            </div>

            {/* Description */}
            {part.description && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {part.description}
                </p>
              </div>
            )}

            {/* CTA Actions */}
            <PartPurchaseActions
              part={{
                id: part._id,
                title: part.title,
                price: part.price,
                slug: part.slug,
                status: part.status,
                inventoryCount: part.inventoryCount,
                imageUrl: mainImage,
              }}
            />

            {/* Contact Info */}
            <p className="text-sm text-gray-500 mt-4 text-center">
              Questions? Call us at <span className="font-semibold">(555) 123-4567</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
