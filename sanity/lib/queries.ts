import { groq } from "next-sanity";

export const ALL_INVENTORY_QUERY = groq`{
  "trucks": *[_type == "inventory" && defined(slug.current)] | order(_updatedAt desc) {
    _id,
    _type,
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
