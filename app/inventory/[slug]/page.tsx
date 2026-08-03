import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import { PortableText } from "next-sanity"; 
import type { PortableTextBlock } from "@portabletext/types";
import ImageGallery from "@/app/components/ImageGallery"; 
import ContactButtons from "@/app/components/ContactButtons";
import InventoryCard from "@/app/components/InventoryCard"; // Reuse the card!
import LoadableNutshellForm from "@/app/components/LoadableNutshellForm";
import { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE_NAME, buildAbsoluteUrl } from "@/app/lib/site";

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
    usage,
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
    usage,
    hoursOrMileage,
    status,
    category
  }
}`;

export const revalidate = 90;

const SALES_FORM_ID = process.env.NEXT_PUBLIC_NUTSHELL_SALES_FORM_ID;
const SALES_INSTANCE_ID = process.env.NEXT_PUBLIC_NUTSHELL_SALES_INSTANCE_ID;

type Props = {
  params: Promise<{ slug: string }>;
};

type Truck = {
  _id: string;
  title: string;
  images?: string[];
  price?: number;
  year?: number;
  make?: string;
  model?: string;
  usage?: { value: number; unit: "miles" | "hours" } | null;
  hoursOrMileage?: string;
  status?: string;
  description?: PortableTextBlock[];
  category?: string;
};

type SimilarTruck = {
  _id: string;
  title: string;
  slug: string;
  images?: string[];
  price?: number;
  year?: number;
  make?: string;
  model?: string;
  usage?: { value: number; unit: "miles" | "hours" } | null;
  hoursOrMileage?: string;
  status?: string;
  category?: string;
};

function formatUsage(truck: Pick<Truck, "usage" | "hoursOrMileage">): string {
  if (truck.usage && typeof truck.usage.value === "number") {
    const unitLabel = truck.usage.unit === "hours" ? "hours" : "miles";
    return `${truck.usage.value.toLocaleString()} ${unitLabel}`;
  }

  return truck.hoursOrMileage || "";
}

// SEO Generator (Same as before)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let data: { title?: string; image?: string; year?: number; make?: string; model?: string; category?: string } | null = null;

  try {
    data = await client.fetch(groq`*[_type == "inventory" && slug.current == $slug][0]{ title, "image": images[0].asset->url, year, make, model }`, { slug });
  } catch (error) {
    console.error("Sanity fetch failed for /inventory/[slug] metadata:", error);
  }
  
  if (!data) {
    return {
      title: "Truck Not Found | Penn Rock Industries",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const titleParts = [data.year, data.make, data.model].filter(Boolean).join(" ");
  const description = titleParts
    ? `${titleParts} for sale at Penn Rock Industries.`
    : "Heavy truck and equipment inventory at Penn Rock Industries.";

  return {
    title: `${data.title} | Penn Rock Industries`,
    description,
    alternates: {
      canonical: `/inventory/${slug}`,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: data.title,
      description,
      url: buildAbsoluteUrl(`/inventory/${slug}`),
      images: data.image ? [data.image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.title} | Penn Rock Industries`,
      description,
      images: data.image ? [data.image] : [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function TruckPage({ params }: Props) {
  const { slug } = await params;
  let data: { truck?: Truck; similar?: SimilarTruck[] } | null = null;

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
            {truck.year} {truck.make} {truck.model} • {formatUsage(truck)}
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
            {similar.map((simTruck) => (
              <InventoryCard key={simTruck._id} truck={simTruck} />
            ))}
          </div>
        </div>
      )}

      <section className="mt-16 border-t border-gray-200 pt-12">
        <LoadableNutshellForm
          title="Talk to Sales About This Truck"
          description="Send a quick note and our sales team will follow up with availability, pricing, and shipping details."
          buttonLabel="Load Sales Form"
          formId={SALES_FORM_ID}
          instanceId={SALES_INSTANCE_ID}
          targetId={`nutshell-sales-${truck._id}`}
        />
      </section>

    </main>
  );
}