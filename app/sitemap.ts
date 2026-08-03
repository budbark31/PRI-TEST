import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { buildAbsoluteUrl, SITE_URL } from "@/app/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const inventoryQuery = groq`*[_type == "inventory" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }`;

  type TruckEntry = {
    slug: string;
    _updatedAt: string;
  };

  const trucks = await client.fetch<TruckEntry[]>(inventoryQuery);

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