import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { buildAbsoluteUrl, SITE_URL } from "@/app/lib/site";
import { EXCLUDE_DEMO_INVENTORY } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const inventoryQuery = groq`*[_type == "inventory" && defined(slug.current) && ${EXCLUDE_DEMO_INVENTORY}] {
    "slug": slug.current,
    _updatedAt
  }`;

  type TruckEntry = {
    slug: string;
    _updatedAt: string;
  };

  // A Sanity outage shouldn't fail the whole deploy; fall back to static routes.
  let trucks: TruckEntry[] = [];
  try {
    trucks = await client.fetch<TruckEntry[]>(inventoryQuery);
  } catch (error) {
    console.error("Sitemap: failed to fetch inventory from Sanity.", error);
  }

  const truckUrls: MetadataRoute.Sitemap = trucks.map((truck) => ({
    url: buildAbsoluteUrl(`/inventory/${truck.slug}`),
    lastModified: new Date(truck._updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: buildAbsoluteUrl("/sell"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: buildAbsoluteUrl("/about"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  return [...staticRoutes, ...truckUrls];
}