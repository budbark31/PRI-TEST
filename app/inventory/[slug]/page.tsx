import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import { PortableText } from "next-sanity"; 
import ImageGallery from "@/app/components/ImageGallery"; 
import ContactButtons from "@/app/components/ContactButtons";
import InventoryCard from "@/app/components/InventoryCard"; // Reuse the card!
import { Metadata } from "next";

// 1. UPDATED QUERY: Fetch the truck + 3 similar ones in the same category
const TRUCK_QUERY = groq`{
  "truck": *[_type == "inventory" && slug.current == $slug][0]{
    _id,
    title,
    "images": images[].asset->url, 
    price,
    year,
    make,
    model,
    hoursOrMileage,
    status,
    description,
    category,
    stockDate,
    paperwork
  },
  "similar": *[_type == "inventory" && slug.current != $slug && category == ^.category && status != "sold"][0..2]{
    _id,
    title,
    "slug": slug.current,
    "images": images[0..4].asset->url,
    price,
    year,
    make,
    model,
    hoursOrMileage,
    status,
    category
  }
}`;

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

// SEO Generator (Same as before)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let data: { title?: string; image?: string } | null = null;

  try {
    data = await client.fetch(groq`*[_type == "inventory" && slug.current == $slug][0]{ title, "image": images[0].asset->url, year, make, model }`, { slug });
  } catch (error) {
    console.error("Sanity fetch failed for /inventory/[slug] metadata:", error);
  }
  
  if (!data) return { title: "Truck Not Found" };

  return {
    title: `${data.title} | Penn Rock`,
    openGraph: {
      title: data.title,
      images: data.image ? [data.image] : [],
    },
  };
}

export default async function TruckPage({ params }: Props) {
  const { slug } = await params;
  let data: { truck?: any; similar?: any[] } | null = null;

  try {
    data = await client.fetch(TRUCK_QUERY, { slug });
  } catch (error) {
    console.error("Sanity fetch failed for /inventory/[slug]:", error);
  }
  const { truck, similar } = data || {};

  if (!truck) {
    return <div className="text-center py-20">Truck Not Found</div>;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 bg-white min-h-screen">
      <Link href="/" className="text-slate-900 font-bold uppercase tracking-widest text-xs hover:underline mb-6 inline-block">
        &larr; Back to Inventory
      </Link>

      {/* MAIN TRUCK SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
        {/* Gallery */}
        <div>
          {truck.images && truck.images.length > 0 ? (
            <ImageGallery images={truck.images} title={truck.title} />
          ) : (
            <div className="bg-gray-100 h-64 flex items-center justify-center rounded-sm text-gray-400">
              No Images Available
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col h-full">
          {truck.category && (
            <span className="inline-block bg-gray-100 border-2 border-slate-900 text-xs px-2 py-1 rounded-none font-bold uppercase tracking-widest text-slate-900 mb-4 w-fit">
              {truck.category}
            </span>
          )}

          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight">{truck.title}</h1>
          <p className="text-gray-600 text-xl mb-6">
            {truck.year} {truck.make} {truck.model} • {truck.hoursOrMileage}
          </p>

          <div className="bg-white p-6 rounded-none mb-8 border-2 border-slate-900">
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {truck.price ? `$${truck.price.toLocaleString()}` : "Call for Price"}
            </p>
            <p className={`text-xs font-bold uppercase tracking-widest ${truck.status === 'sold' ? 'text-red-600' : 'text-slate-900'}`}>
              Status: {truck.status}
            </p>
          </div>

          <div className="prose max-w-none text-gray-800 mb-8">
            <h3 className="text-xl font-bold mb-2 text-gray-900">Description</h3>
            {truck.description && <PortableText value={truck.description} />}
          </div>

          <div className="mt-auto">
            <ContactButtons truckTitle={truck.title} />
          </div>
        </div>
      </div>

      {/* SIMILAR TRUCKS SECTION */}
      {similar && similar.length > 0 && (
        <div className="border-t border-gray-200 pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similar.map((simTruck: any) => (
              <InventoryCard key={simTruck._id} truck={simTruck} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}